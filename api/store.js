// Chinifa User Learning Progress & State Synchronization API
const { pool, initDb, getAuthUser, getUserStatus, cors, parseBody } = require("./db");

function compactUnitProgsForDb(up) {
  if (!up || typeof up !== "object") return undefined;
  const out = {};
  for (const [k, v] of Object.entries(up)) {
    if (!v || typeof v !== "object") continue;
    const done = Boolean(v.d || v.done);
    const secIdx = Math.max(0, Number(v.s !== undefined ? v.s : v.currentSectionIdx) || 0);
    const cs = Array.isArray(v.cs) ? v.cs : (Array.isArray(v.completedSections) ? v.completedSections : []);
    const mp = (v.mp && typeof v.mp === "object") ? v.mp : ((v.miniProgress && typeof v.miniProgress === "object") ? v.miniProgress : {});
    const g = (v.g && typeof v.g === "object") ? v.g : ((v.unlockedGifts && typeof v.unlockedGifts === "object") ? v.unlockedGifts : {});
    const si = (v.si && typeof v.si === "object") ? v.si : ((v.seenIntro && typeof v.seenIntro === "object") ? v.seenIntro : {});
    const mpMax = Object.values(mp).reduce((m, x) => Math.max(m, Number(x) || 0), 0);
    if (!done && !secIdx && !cs.length && !mpMax && !Object.keys(g).length) continue;
    const item = { d: done ? 1 : 0, s: secIdx, cs, mp };
    if (Object.keys(g).length) item.g = g;
    if (Object.keys(si).length) item.si = si;
    out[k] = item;
  }
  return Object.keys(out).length ? out : undefined;
}

function sanitizeSnapshotForDb(raw) {
  if (!raw || typeof raw !== "object") return {};
  const snap = { ...raw };
  // Never persist bulky deck word lists or unbounded search lookups in Postgres
  if (Array.isArray(snap.decks)) {
    snap.decks = snap.decks.map((d) => {
      if (!d || !d.list) return d;
      const copy = { ...d };
      delete copy.list;
      return copy;
    });
  }
  if (Array.isArray(snap.lookups) && snap.lookups.length > 80) {
    snap.lookups = snap.lookups.slice(-80);
  }
  if (snap.unitProgs) {
    const compacted = compactUnitProgsForDb(snap.unitProgs);
    if (compacted) snap.unitProgs = compacted;
    else delete snap.unitProgs;
  }
  delete snap.secsHeld;
  return snap;
}

function deriveLevelFromSnapshot(snapshot) {
  if (snapshot.level) return String(snapshot.level).slice(0, 32);
  const deck = String(snapshot.studyingDeck || "").toLowerCase();
  const m = /^hsk(\d)$/.exec(deck);
  if (m) return "HSK " + m[1];
  return "HSK 1";
}

// Fields the admin sets from the panel must survive app pushes, otherwise the
// next sync silently reverts them ("admin edited XP but it changed back").
//   - xp / xpBonus: admin-owned, always keep the stored value.
//   - streak: keep the stored value while it is higher than what the app sends
//     (an admin raise sticks; the app's own growth still flows through).
//   - level / name / courseProgress: stick for 10 minutes after an admin edit
//     (curVal.adminAt), long enough for the app to pull them; afterwards the
//     app owns them again so resets like startOver keep working.
function applyAdminProtectedFields(prev, snap) {
  if (!prev || typeof prev !== "object") return snap;
  if (prev.xpBonus != null) snap.xpBonus = Math.max(0, Number(prev.xpBonus) || 0);
  if (prev.xp != null) snap.xp = Math.max(0, Number(prev.xp) || 0);
  if ((Number(prev.streak) || 0) > (Number(snap.streak) || 0)) {
    snap.streak = Number(prev.streak) || 0;
    // Keep the most recent activity day so the app's streak merge honors the raised value.
    const ls = [snap.lastStudy, prev.lastStudy]
      .filter((x) => typeof x === "string" && /^\d{4}-\d{2}-\d{2}$/.test(x))
      .sort()
      .pop();
    if (ls) snap.lastStudy = ls;
  }
  const adminAt = Number(prev.adminAt) || 0;
  if (adminAt && Date.now() - adminAt < 10 * 60 * 1000) {
    if (prev.level) snap.level = String(prev.level).slice(0, 32);
    if (prev.name) snap.name = String(prev.name).slice(0, 80);
    if (prev.courseProgress && typeof prev.courseProgress === "object") {
      const cp = snap.courseProgress && typeof snap.courseProgress === "object" ? snap.courseProgress : {};
      Object.keys(prev.courseProgress).forEach((k) => {
        cp[k] = Math.max(Number(cp[k]) || 0, Number(prev.courseProgress[k]) || 0);
      });
      snap.courseProgress = cp;
    }
  }
  return snap;
}

module.exports = async (req, res) => {
  cors(req, res);
  if (req.method === "OPTIONS") return res.status(204).end();

  try {
    const user = await getAuthUser(req);
    if (!user) return res.status(401).json({ error: "no-session" });

    await initDb();
    if (pool) {
      const status = await getUserStatus(user);
      if (status === "suspended" || status === "missing") {
        // Blocked accounts (and rows the admin deleted) can neither read nor write.
        return res.status(403).json({ error: "account-suspended" });
      }
    }
    const key = String((req.query && req.query.key) || "cheh-chin-state").slice(0, 64);

    // GET: Retrieve user's stored progress snapshot
    if (req.method === "GET") {
      if (!pool) return res.status(200).json({ value: null, db: false });

      const r = await pool.query(
        `SELECT value FROM public.chinifa_kv_store WHERE user_id = $1 OR ($2 <> '' AND email = $2) ORDER BY updated_at DESC LIMIT 1`,
        [user.id, user.email || ""]
      );

      if (r.rows.length > 0 && r.rows[0].value) {
        return res.status(200).json({ value: r.rows[0].value });
      }
      return res.status(200).json({ value: null });
    }

    // POST: Save progress snapshot
    if (req.method === "POST") {
      const body = parseBody(req);
      const snapshot = sanitizeSnapshotForDb(body.value || {});
      const serialized0 = JSON.stringify(snapshot);
      if (serialized0.length > 524288) {
        return res.status(413).json({ error: "payload-too-large", message: "حجم داده‌های همگام‌سازی بیش از حد مجاز است." });
      }

      if (!pool) return res.status(200).json({ ok: true, db: false });

      // Re-apply admin-set fields before overwriting the row (see applyAdminProtectedFields)
      const prevRes = await pool.query(
        `SELECT value FROM public.chinifa_kv_store WHERE user_id = $1 OR ($2 <> '' AND email = $2) ORDER BY updated_at DESC LIMIT 1`,
        [user.id, user.email || ""]
      ).catch((e) => {
        console.error("[api/store prev read]", e.message);
        return { rows: [] };
      });
      applyAdminProtectedFields(prevRes.rows[0] && prevRes.rows[0].value, snapshot);
      const serialized = JSON.stringify(snapshot);

      await pool.query(
        `INSERT INTO public.chinifa_kv_store (user_id, email, store_key, value, updated_at)
         VALUES ($1, $2, $3, $4, now())
         ON CONFLICT (user_id) DO UPDATE SET
           email = COALESCE(NULLIF(EXCLUDED.email, ''), public.chinifa_kv_store.email),
           store_key = EXCLUDED.store_key,
           value = EXCLUDED.value,
           updated_at = now()`,
        [user.id, user.email || "", key, serialized]
      );

      // Keep chinifa_users HSK level & name updated. The row itself must already
      // exist (created at registration); a missing row means the account was
      // deleted/blocked, so never recreate it here.
      const level = deriveLevelFromSnapshot(snapshot);
      const name = String(snapshot.name || user.fullName || (user.email ? user.email.split("@")[0] : "")).slice(0, 80);
      if (user.email) {
        await pool.query(
          `UPDATE public.chinifa_users
           SET hsk_level = $3,
               full_name = COALESCE(NULLIF($4, ''), public.chinifa_users.full_name),
               updated_at = now()
           WHERE id = $1 OR ($2 <> '' AND email = $2)`,
          [user.id, user.email, level, name]
        ).catch((e) => console.error("[api/store user update]", e.message));
      }

      return res.status(200).json({ ok: true });
    }

    return res.status(405).json({ error: "method-not-allowed" });
  } catch (err) {
    console.error("[api/store] error:", err);
    return res.status(500).json({ error: String(err.message || err) });
  }
};
