# -*- coding: utf-8 -*-
"""Chinify Admin Panel v2 — local server
Serves:
  /admin                -> admin UI (tools/admin/index.html)
  /admin/api/*          -> stats / health / tree / file read+save (with backup)
                           search / backups / restore / tasks (build, units)
  /app/...              -> static preview of UI-code (the app itself)
Everything stays local. No external dependency."""
import io, json, os, re, glob, shutil, subprocess, sys, threading, time
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import urlparse, parse_qs, unquote

ROOT = r"C:\Users\Amirsajjad\Documents\kanchinese"
UI = os.path.join(ROOT, "UI-code")
EX = os.path.join(ROOT, "extracted", "assets", "public")
ADMIN_DIR = os.path.join(ROOT, "tools", "admin")
DATA_DIR = os.path.join(ADMIN_DIR, "data")
os.makedirs(DATA_DIR, exist_ok=True)

def load_json_data(name, default):
    fp = os.path.join(DATA_DIR, name)
    if os.path.exists(fp):
        try:
            return json.loads(io.open(fp, encoding="utf-8").read())
        except Exception:
            pass
    return default

def save_json_data(name, data):
    fp = os.path.join(DATA_DIR, name)
    io.open(fp, "w", encoding="utf-8").write(json.dumps(data, ensure_ascii=False, indent=2))

BUILD_SCRIPT = os.path.join(ROOT, "tools", "final_identity_apk.py")
UNITS_SCRIPT = os.path.join(ROOT, "tools", "rebuild_units.py")
PORT = int(os.environ.get("PORT", 8080))
if len(sys.argv) > 1 and sys.argv[1].isdigit():
    PORT = int(sys.argv[1])

sys.stdout.reconfigure(encoding="utf-8", errors="replace")
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import unitslib  # UNITS object of js/unit-course.js — parse/emit/replace

# ---------- helpers ----------
def safe_path(rel):
    """resolve rel path under UI-code; forbid traversal"""
    rel = (rel or "").replace("/", os.sep).replace("\\", os.sep)
    while rel.startswith(os.sep):
        rel = rel[1:]
    p = os.path.normpath(os.path.join(UI, rel))
    if not p.startswith(UI):
        return None
    return p

def mapped(rel):
    """UI-code rel path <-> extracted assets/public rel path"""
    if rel.startswith("assets/public/"):
        return rel
    return "assets/public/" + rel

def backup(fp):
    b = fp + ".admin.bak"
    if os.path.exists(fp):
        shutil.copy2(fp, b)

def write_both(rel, data_bytes):
    """write a web asset to BOTH UI-code and extracted/assets/public"""
    ui_path = safe_path(rel)
    ex_rel = mapped(rel)
    ex_path = os.path.normpath(os.path.join(EX, ex_rel.replace("assets/public/", "").replace("/", os.sep)))
    if ex_rel == "assets/public/index.html":
        ex_path = os.path.join(EX, "index.html")
    if ui_path:
        os.makedirs(os.path.dirname(ui_path), exist_ok=True)
        backup(ui_path)
        open(ui_path, "wb").write(data_bytes)
    try:
        if os.path.commonpath([os.path.abspath(ex_path), os.path.abspath(EX)]) == os.path.abspath(EX):
            os.makedirs(os.path.dirname(ex_path), exist_ok=True)
            open(ex_path, "wb").write(data_bytes)
    except ValueError:
        pass
    return ui_path, ex_path

def read_json_file(fp):
    return json.loads(io.open(fp, encoding="utf-8", errors="replace").read())

# ---------- stats ----------
def sw_cache_name():
    try:
        t = io.open(os.path.join(UI, "service-worker.js"), encoding="utf-8", errors="replace").read()
        m = re.search(r"CACHE[^=]*=\s*['\"]([^'\"]+)", t)
        return m.group(1) if m else ""
    except Exception:
        return ""

def count_fa():
    try:
        fa = read_json_file(os.path.join(UI, "content", "i18n", "fa.json"))
        return {k: len(v) for k, v in fa.items() if isinstance(v, dict)}
    except Exception:
        return {}

def count_exercises():
    try:
        t = io.open(os.path.join(UI, "js", "unit-course.js"), encoding="utf-8", errors="replace").read()
        units = sorted(set(re.findall(r'"id":\s*"(hsk1:\d+)"', t)), key=lambda s: int(s.split(":")[1]))
        return {"units": len(units), "questions": t.count('"q":'), "tonePicks": t.count('"tone_pick"'),
                "orders": t.count('"order"'), "writes": t.count('"write"'), "matches": t.count('"match"')}
    except Exception:
        return {"units": 0, "questions": 0}

def stats():
    s = {"courses": [], "stories": 0, "pods": 0, "episodes": 0, "clips": 0,
         "library": 0, "dictShards": 0, "wordlists": 0, "grammarFiles": 0,
         "faKeys": {}, "swCache": sw_cache_name(), "ex": count_exercises()}
    # courses
    for f in sorted(os.listdir(os.path.join(UI, "content", "lessons"))):
        if not f.endswith(".json"):
            continue
        try:
            d = read_json_file(os.path.join(UI, "content", "lessons", f))
            s["courses"].append({"id": f[:-5], "name": d.get("name", f), "lessons": len(d.get("lessons", []))})
        except Exception:
            pass
    # stories
    try:
        s["stories"] = len(read_json_file(os.path.join(UI, "content", "stories.json")).get("stories", []))
    except Exception:
        pass
    # pods bodies
    try:
        pods_dir = os.path.join(UI, "content", "pods")
        s["pods"] = len([f for f in os.listdir(pods_dir) if f.endswith(".json")])
    except Exception:
        pass
    # podcast episodes
    try:
        s["episodes"] = len(read_json_file(os.path.join(UI, "content", "podcast.json")).get("episodes", []))
    except Exception:
        pass
    # clips
    try:
        s["clips"] = len(read_json_file(os.path.join(UI, "content", "feed.json")).get("items", []))
    except Exception:
        pass
    # library
    try:
        lib = read_json_file(os.path.join(UI, "content", "library", "library.json"))
        s["library"] = len(lib.get("words", []))
    except Exception:
        pass
    # dict shards
    try:
        ddir = os.path.join(UI, "content", "dict")
        s["dictShards"] = len([f for f in os.listdir(ddir) if f.endswith(".json") and f != "index.json"])
    except Exception:
        pass
    # wordlists / grammar
    for key, sub in (("wordlists", "wordlists"), ("grammarFiles", "grammar")):
        try:
            s[key] = len([f for f in os.listdir(os.path.join(UI, "content", sub)) if f.endswith(".json")])
        except Exception:
            pass
    s["faKeys"] = count_fa()
    try:
        users = load_json_data("users.json", [])
        s["users"] = len(users)
        s["vipUsers"] = len([u for u in users if u.get("status") == "vip"])
        s["activeToday"] = len([u for u in users if "امروز" in u.get("lastActive", "") or "آنلاین" in u.get("lastActive", "")])
    except Exception:
        s["users"] = 0
    try:
        s["feedback"] = len(load_json_data("feedback.json", []))
    except Exception:
        s["feedback"] = 0
    try:
        s["drills"] = len([f for f in os.listdir(os.path.join(UI, "content", "drills")) if f.endswith(".json")])
    except Exception:
        s["drills"] = 0
    try:
        pr = read_json_file(os.path.join(UI, "content", "pay-reviews.json"))
        s["reviews"] = pr.get("count", len(pr.get("reviews", [])))
    except Exception:
        s["reviews"] = 0
    # backups count
    try:
        s["backups"] = len(glob.glob(os.path.join(UI, "**", "*.admin.bak*"), recursive=True))
    except Exception:
        pass
    return s

# ---------- health ----------
HEALTH_CACHE = {"t": 0, "data": None}
HEALTH_TTL = 60.0  # seconds — health walk scans ~1100 files

def health():
    if HEALTH_CACHE["data"] is not None and (time.time() - HEALTH_CACHE["t"]) < HEALTH_TTL:
        return HEALTH_CACHE["data"]
    out = {"jsonErrors": [], "checked": 0, "strokeMissing": [], "clipsMissing": [], "ok": True}
    cd = os.path.join(UI, "content")
    SKIP = {"strokes", "syllables", "speech", "subtitles"}
    for root, dirs, files in os.walk(cd):
        dirs[:] = [x for x in dirs if x not in SKIP]
        for f in files:
            if not f.endswith(".json"):
                continue
            fp = os.path.join(root, f)
            out["checked"] += 1
            try:
                json.loads(io.open(fp, encoding="utf-8", errors="replace").read())
            except Exception as e:
                out["jsonErrors"].append({"file": os.path.relpath(fp, UI).replace("\\", "/"), "error": str(e)[:140]})
    # stroke coverage for single-char lesson words
    stroke_dir = os.path.join(UI, "content", "strokes")
    have = set(os.listdir(stroke_dir)) if os.path.isdir(stroke_dir) else set()
    for cf in sorted(glob.glob(os.path.join(UI, "content", "lessons", "*.json"))):
        cid = os.path.basename(cf)[:-5]
        try:
            d = read_json_file(cf)
        except Exception:
            continue
        missing = set()
        for les in d.get("lessons", []):
            for w in les.get("words", []):
                ch = w.get("ch", "")
                if len(ch) == 1 and (ch + ".json") not in have:
                    missing.add(ch)
        for ch in sorted(missing):
            out["strokeMissing"].append({"course": cid, "ch": ch})
    # clips local media
    try:
        fd = read_json_file(os.path.join(UI, "content", "feed.json"))
        for it in fd.get("items", []):
            for k in ("videoUrl", "poster"):
                u = it.get(k, "")
                if u and not u.startswith("http") and not u.startswith("data:"):
                    p = os.path.join(UI, u.replace("/", os.sep))
                    if not os.path.isfile(p):
                        out["clipsMissing"].append({"id": it.get("id"), "field": k, "url": u})
    except Exception:
        pass
    out["ok"] = not (out["jsonErrors"] or out["strokeMissing"] or out["clipsMissing"])
    HEALTH_CACHE["t"] = time.time()
    HEALTH_CACHE["data"] = out
    return out

# ---------- tree ----------
def list_tree():
    groups = [
        ("هویت و پیکربندی", ["js/config.js", "js/tokens.js", "index.html", "manifest.webmanifest", "service-worker.js"]),
        ("اسکریپت‌های اپ", ["js/app.js", "js/i18n-fa.js", "js/unit-course.js", "js/podcast.js", "js/data.js",
                            "js/pinyin-course.js", "js/stroke-data.js", "js/screens-library.js"]),
        ("محتوای متفرقه", ["content/feed.json", "content/stories.json", "content/podcast.json", "content/videos.json",
                           "content/trad.json", "content/pinyin-voice.json", "content/library/library.json"]),
    ]
    tree = []
    for name, files in groups:
        items = []
        for f in files:
            p = os.path.join(UI, f.replace("/", os.sep))
            items.append({"path": f, "size": os.path.getsize(p) if os.path.exists(p) else 0,
                          "label": f.split("/")[-1]})
        tree.append({"group": name, "files": items})
    return tree

def tree_full():
    items = []
    for root, dirs, files in os.walk(os.path.join(UI, "content")):
        dirs[:] = [x for x in dirs if x not in {"strokes", "syllables", "speech", "subtitles"}]
        for f in files:
            if f.endswith(".json"):
                rel = os.path.relpath(os.path.join(root, f), UI).replace("\\", "/")
                items.append(rel)
    return sorted(items)

def search_all(q):
    q = q.strip()
    if len(q) < 1:
        return []
    results = []
    targets = []
    cd = os.path.join(UI, "content")
    SKIP = {"strokes", "syllables", "speech", "subtitles"}
    for root, dirs, files in os.walk(cd):
        dirs[:] = [x for x in dirs if x not in SKIP]
        for f in files:
            if f.endswith(".json"):
                targets.append(os.path.join(root, f))
    targets.append(os.path.join(UI, "js", "i18n-fa.js"))
    for fp in targets:
        try:
            t = io.open(fp, encoding="utf-8", errors="ignore").read()
        except Exception:
            continue
        if q.lower() not in t.lower():
            continue
        rel = os.path.relpath(fp, UI).replace("\\", "/")
        hits = []
        low = t.lower()
        start = 0
        while len(hits) < 6:
            ix = low.find(q.lower(), start)
            if ix < 0:
                break
            frag = t[max(0, ix - 60):ix + 90].replace("\n", " ")
            hits.append(frag)
            start = ix + len(q)
        results.append({"file": rel, "hits": hits})
        if len(results) >= 30:
            break
    return results

# ---------- tasks (build APK / rebuild units) ----------
TASKS = {"build": {"running": False, "log": [], "done": False, "ok": None, "started": 0},
         "units": {"running": False, "log": [], "done": False, "ok": None, "started": 0}}

def run_task(name):
    st = TASKS[name]
    if st["running"]:
        return
    script = BUILD_SCRIPT if name == "build" else UNITS_SCRIPT
    if not os.path.isfile(script):
        st.update(running=False, done=True, ok=False, log=["script not found: %s" % script])
        return
    st.update(running=True, log=[], done=False, ok=None, started=time.time())

    def work():
        try:
            p = subprocess.Popen([sys.executable, "-X", "utf8", script],
                                 cwd=ROOT, stdout=subprocess.PIPE, stderr=subprocess.STDOUT,
                                 text=True, encoding="utf-8", errors="replace")
            for line in p.stdout:
                st["log"].append(line.rstrip())
            p.wait()
            st["ok"] = (p.returncode == 0)
            st["log"].append("EXIT=%d" % p.returncode)
        except Exception as ex:
            st["ok"] = False
            st["log"].append("ERROR: %s" % ex)
        st["done"] = True
        st["running"] = False
    threading.Thread(target=work, daemon=True).start()

# ---------- backups ----------
def backups_for(rel):
    p = safe_path(rel)
    if not p:
        return []
    out = []
    for b in sorted(glob.glob(p + ".admin.bak*"), reverse=True):
        out.append({"name": os.path.basename(b), "size": os.path.getsize(b),
                    "mtime": int(os.path.getmtime(b) * 1000)})
    return out

# ---------- HTTP handler ----------
class Handler(BaseHTTPRequestHandler):
    def log_message(self, *a):
        pass

    def _send(self, code, body, ctype="application/json; charset=utf-8"):
        self.send_response(code)
        self.send_header("Content-Type", ctype)
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(body)

    def _json(self, obj, code=200):
        self._send(code, json.dumps(obj, ensure_ascii=False).encode("utf-8"))

    def do_GET(self):
        u = urlparse(self.path)
        path = unquote(u.path)
        qs = parse_qs(u.query)
        if path.startswith("/admin/api/"):
            cmd = path[len("/admin/api/"):]
            if cmd == "stats":
                return self._json(stats())
            if cmd == "health":
                return self._json(health())
            if cmd == "tree":
                return self._json({"tree": list_tree()})
            if cmd == "tree_full":
                return self._json({"files": tree_full()})
            if cmd == "file":
                rel = qs.get("path", [""])[0]
                p = safe_path(rel)
                if not p or not os.path.isfile(p):
                    return self._json({"error": "not found"}, 404)
                raw = io.open(p, encoding="utf-8", errors="replace").read()
                parsed = None
                if rel.endswith(".json"):
                    try:
                        parsed = json.loads(raw)
                    except Exception:
                        parsed = None
                return self._json({"path": rel, "size": os.path.getsize(p), "raw": raw, "parsed": parsed})
            if cmd == "units":
                try:
                    t = io.open(unitslib.UC_PATHS[0], encoding="utf-8").read()
                    units = unitslib.parse_units(t)
                    return self._json({"path": "js/unit-course.js", "size": len(t), "units": units})
                except Exception as e:
                    return self._json({"error": str(e)}, 500)
            if cmd == "users":
                return self._json({"users": load_json_data("users.json", [])})
            if cmd == "user_stats":
                users = load_json_data("users.json", [])
                st_data = {
                    "totalUsers": len(users),
                    "vipUsers": len([u for u in users if u.get("status") == "vip"]),
                    "activeToday": len([u for u in users if "امروز" in u.get("lastActive", "") or "آنلاین" in u.get("lastActive", "")]),
                    "avgStreak": round(sum(u.get("streak", 0) for u in users) / max(len(users), 1), 1),
                    "avgWords": round(sum(u.get("wordsLearned", 0) for u in users) / max(len(users), 1), 1),
                    "totalXP": sum(u.get("xp", 0) for u in users),
                    "levelDist": {
                        "HSK 1": len([u for u in users if u.get("level") == "HSK 1"]),
                        "HSK 2": len([u for u in users if u.get("level") == "HSK 2"]),
                        "HSK 3": len([u for u in users if u.get("level") == "HSK 3"]),
                        "HSK 4": len([u for u in users if u.get("level") == "HSK 4"]),
                        "HSK 5": len([u for u in users if u.get("level") == "HSK 5"]),
                        "HSK 6": len([u for u in users if u.get("level") == "HSK 6"])
                    }
                }
                return self._json(st_data)
            if cmd == "feedback":
                return self._json({"feedback": load_json_data("feedback.json", [])})
            if cmd == "appsettings":
                return self._json({"settings": load_json_data("settings.json", {})})
            if cmd == "drills":
                drills_dir = os.path.join(UI, "content", "drills")
                files = [f for f in os.listdir(drills_dir) if f.endswith(".json")]
                return self._json({"drills": files})
            if cmd == "reviews":
                fp = os.path.join(UI, "content", "pay-reviews.json")
                return self._json(read_json_file(fp) if os.path.exists(fp) else {})
            if cmd == "search":
                return self._json({"results": search_all(qs.get("q", [""])[0])})
            if cmd == "backups":
                return self._json({"backups": backups_for(qs.get("path", [""])[0])})
            if cmd in ("build_status", "task_status"):
                name = "build" if cmd == "build_status" else qs.get("task", ["build"])[0]
                st = dict(TASKS.get(name, TASKS["build"]))
                st["log_tail"] = st["log"][-30:]
                st["elapsed"] = int((time.time() - st["started"]) * 1000) if st["started"] else 0
                return self._json(st)
            return self._json({"error": "unknown cmd"}, 404)
        if path in ("/api/app-version", "/api/version", "/version.json"):
            v_fp = os.path.join(ROOT, "website", "version.json")
            if os.path.isfile(v_fp):
                return self._send(200, open(v_fp, "rb").read(), "application/json; charset=utf-8")
            return self._json({"latest": 240, "min": 200, "version": "2.4.0", "url": "/Chinifa.apk"})
        if path in ("/", "/website", "/website/"):
            wp = os.path.join(ROOT, "website", "index.html")
            if os.path.isfile(wp):
                return self._send(200, open(wp, "rb").read(), "text/html; charset=utf-8")
        if path in ("/admin", "/admin/", "/tools/admin", "/tools/admin/"):
            body = io.open(os.path.join(ADMIN_DIR, "index.html"), "rb").read()
            return self._send(200, body, "text/html; charset=utf-8")
        if path == "/admin/fonts/vazir.woff2":
            fp = os.path.join(UI, "css", "fonts", "Vazirmatn-Variable.woff2")
            if os.path.exists(fp):
                return self._send(200, open(fp, "rb").read(), "font/woff2")
        if path.startswith("/app/"):
            rel = unquote(path[len("/app/"):])
            p = safe_path(rel)
            if p and os.path.isfile(p):
                ext = os.path.splitext(p)[1].lower()
                ct = {".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8",
                      ".css": "text/css; charset=utf-8", ".json": "application/json; charset=utf-8",
                      ".woff2": "font/woff2", ".png": "image/png", ".webp": "image/webp",
                      ".webm": "video/webm", ".mp3": "audio/mpeg", ".mp4": "video/mp4",
                      ".svg": "image/svg+xml"}.get(ext, "application/octet-stream")
                return self._send(200, open(p, "rb").read(), ct)
        rel_root = path.lstrip("/").replace("/", os.sep)
        p_root = os.path.normpath(os.path.join(ROOT, rel_root))
        if p_root.startswith(ROOT):
            if os.path.isdir(p_root):
                for idx_name in ("index.html", "index.htm"):
                    ip = os.path.join(p_root, idx_name)
                    if os.path.isfile(ip):
                        return self._send(200, open(ip, "rb").read(), "text/html; charset=utf-8")
            elif os.path.isfile(p_root):
                ext = os.path.splitext(p_root)[1].lower()
                ct = {".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8",
                      ".css": "text/css; charset=utf-8", ".json": "application/json; charset=utf-8",
                      ".woff2": "font/woff2", ".png": "image/png", ".webp": "image/webp",
                      ".webm": "video/webm", ".mp3": "audio/mpeg", ".mp4": "video/mp4",
                      ".svg": "image/svg+xml", ".apk": "application/vnd.android.package-archive"}.get(ext, "application/octet-stream")
                return self._send(200, open(p_root, "rb").read(), ct)
        return self._send(404, b"not found", "text/plain")

    def do_PUT(self):
        u = urlparse(self.path)
        path = unquote(u.path)
        if path == "/admin/api/file":
            ln = int(self.headers.get("Content-Length", 0))
            body = json.loads(self.rfile.read(ln).decode("utf-8"))
            rel, raw = body.get("path", ""), body.get("raw", "")
            p = safe_path(rel)
            if not p:
                return self._json({"error": "bad path"}, 400)
            if rel.endswith(".json"):
                try:
                    json.loads(raw)
                except Exception as e:
                    return self._json({"error": "JSON نامعتبر: %s" % e}, 400)
            ui_p, ex_p = write_both(rel, raw.encode("utf-8"))
            return self._json({"ok": True, "written": [ui_p, ex_p]})
        if path == "/admin/api/units":
            ln = int(self.headers.get("Content-Length", 0))
            body = json.loads(self.rfile.read(ln).decode("utf-8"))
            units = body.get("units")
            try:
                unitslib.validate_units(units)
            except ValueError as e:
                return self._json({"error": str(e)}, 400)
            try:
                written = unitslib.save_units(units)
            except Exception as e:
                return self._json({"error": str(e)}, 500)
            return self._json({"ok": True, "written": written})
        if path == "/admin/api/users":
            ln = int(self.headers.get("Content-Length", 0))
            body = json.loads(self.rfile.read(ln).decode("utf-8"))
            if "users" in body:
                save_json_data("users.json", body["users"])
            elif "user" in body:
                u = body["user"]
                users = load_json_data("users.json", [])
                idx = next((i for i, x in enumerate(users) if x.get("id") == u.get("id")), -1)
                if idx >= 0:
                    users[idx] = u
                else:
                    users.append(u)
                save_json_data("users.json", users)
            return self._json({"ok": True})
        if path == "/admin/api/feedback":
            ln = int(self.headers.get("Content-Length", 0))
            body = json.loads(self.rfile.read(ln).decode("utf-8"))
            if "feedback" in body:
                save_json_data("feedback.json", body["feedback"])
            elif "item" in body:
                item = body["item"]
                fb = load_json_data("feedback.json", [])
                idx = next((i for i, x in enumerate(fb) if x.get("id") == item.get("id")), -1)
                if idx >= 0:
                    fb[idx] = item
                else:
                    fb.append(item)
                save_json_data("feedback.json", fb)
            return self._json({"ok": True})
        if path == "/admin/api/appsettings":
            ln = int(self.headers.get("Content-Length", 0))
            body = json.loads(self.rfile.read(ln).decode("utf-8"))
            settings = body.get("settings", body)
            save_json_data("settings.json", settings)
            return self._json({"ok": True})
        if path == "/admin/api/restore":
            ln = int(self.headers.get("Content-Length", 0))
            body = json.loads(self.rfile.read(ln).decode("utf-8"))
            rel, name = body.get("path", ""), body.get("name", "")
            p = safe_path(rel)
            if not p or not name or os.path.basename(name) != name:
                return self._json({"error": "bad request"}, 400)
            matches = [m for m in glob.glob(p + ".admin.bak*") if os.path.basename(m) == name]
            if not matches:
                return self._json({"error": "backup not found"}, 404)
            backup(p)  # snapshot current before restore
            shutil.copy2(matches[0], p)
            raw = io.open(p, "rb").read()
            write_both(rel, raw)
            return self._json({"ok": True})
        return self._json({"error": "unknown"}, 404)

    def do_POST(self):
        u = urlparse(self.path)
        if u.path == "/admin/api/build":
            run_task("build")
            return self._json({"ok": True, "started": True})
        if u.path == "/admin/api/run":
            ln = int(self.headers.get("Content-Length", 0))
            body = json.loads(self.rfile.read(ln).decode("utf-8")) if ln else {}
            task = body.get("task", "")
            if task not in TASKS:
                return self._json({"error": "unknown task"}, 404)
            run_task(task)
            return self._json({"ok": True, "started": True})
        return self._json({"error": "unknown"}, 404)

    def do_DELETE(self):
        u = urlparse(self.path)
        qs = parse_qs(u.query)
        if u.path == "/admin/api/users":
            uid = qs.get("id", [""])[0]
            if uid:
                users = load_json_data("users.json", [])
                users = [x for x in users if x.get("id") != uid]
                save_json_data("users.json", users)
                return self._json({"ok": True, "deleted": uid})
            return self._json({"error": "missing id"}, 400)
        return self._json({"error": "unknown"}, 404)

if __name__ == "__main__":
    os.makedirs(ADMIN_DIR, exist_ok=True)
    srv = ThreadingHTTPServer(("127.0.0.1", PORT), Handler)
    print("Admin panel:  http://127.0.0.1:%d/admin" % PORT, flush=True)
    print("App preview:  http://127.0.0.1:%d/app/index.html" % PORT, flush=True)
    srv.serve_forever()
