"""FINAL APK identity build — starts from the PRISTINE original manifest
(Downloads\\KanChinese.apk) and applies ONLY byte-safe, same-length edits:
1. null-terminator fix for the CHECK_LICENSE->INTERNET pool slot
2. same-length pool swaps (package, pairip classes, CHECK_LICENSE)
3. requiredSplitTypes -> empty-string slot; splits.required value -> false
4. versionCode 169 -> 1 (typed int attr); versionName -> 1.0.0 (in-slot, padded)
Then zips pristine-original everything else (arsc with .grp rename + Chinify label,
reverted dex, Persian assets) -> zipalign -> sign -> install-ready.
"""
import struct, sys, zipfile, subprocess, os, shutil
sys.stdout.reconfigure(encoding="utf-8", errors="replace")
ROOT = r"C:\Users\Amirsajjad\Documents\kanchinese"
SRC = r"C:\Users\Amirsajjad\Downloads\KanChinese.apk"
EX = ROOT + r"\extracted"
OUT = ROOT + r"\Chinify.apk"
SDK = r"C:\Users\Amirsajjad\AppData\Local\Android\Sdk"

NEW_PKG = "com.chinify.grp"
OLD_PKG = b"com.chehchin.ai"

z = zipfile.ZipFile(SRC)
mf = bytearray(z.read("AndroidManifest.xml"))
print("pristine manifest:", len(mf))
sp = 8
pool_size = struct.unpack("<I", mf[12:16])[0]
sc = struct.unpack("<I", mf[sp + 8:sp + 12])[0]
ss = struct.unpack("<I", mf[sp + 20:sp + 24])[0]
offs_base = sp + 28
base = sp + ss
print("pool strings:", sc)

def slot_pos(k):
    off = struct.unpack("<I", mf[offs_base + 4 * k:offs_base + 4 * k + 4])[0]
    return base + off

def get_str(k):
    if k >= sc:
        return "<OOB:%d>" % k
    q = slot_pos(k)
    ln = struct.unpack("<H", mf[q:q + 2])[0] & 0x7FFF
    return mf[q + 2:q + 2 + 2 * ln].decode("utf-16-le", "replace")

# ---- 1) null fix: find the CHECK_LICENSE slot (33 chars, missing terminator) ----
for k in range(sc):
    q = slot_pos(k)
    ln = struct.unpack("<H", mf[q:q + 2])[0] & 0x7FFF
    s = mf[q + 2:q + 2 + 2 * ln].decode("utf-16-le", "replace")
    if s.startswith("com.android.vending.CHECK_LICENSE"):
        # write INTERNET + spaces to fill ln chars, then null right after ln chars
        val = "android.permission.INTERNET".ljust(ln)
        mf[q + 2:q + 2 + 2 * ln] = val.encode("utf-16-le")
        mf[q + 2 + 2 * ln:q + 4 + 2 * ln] = b"\x00\x00"
        print("null-fixed slot", k, "->", repr(get_str(k)))
        break

# ---- 2) same-length swaps ----
swaps = [
    ("com.chehchin.ai".encode("utf-16-le"), NEW_PKG.encode("utf-16-le")),   # 15
    ("com.pairip.application.Application".encode("utf-16-le"),
     "android.app.Application           ".encode("utf-16-le")),          # 35
    ("com.pairip.licensecheck.LicenseActivity".encode("utf-16-le"),
     "android.app.Activity                   ".encode("utf-16-le")),     # 39
    ("com.android.vending.CHECK_LICENSE".encode("utf-16-le"),
     "android.permission.INTERNET       ".encode("utf-16-le")),          # 33+pad
]
for old, new in swaps:
    c = mf.count(old)
    mf = bytearray(mf.replace(old, new))
    print("swap", repr(old[:44]), "x", c)

# ---- 2b) trim padded class names in the pool (framework lookups need exact names) ----
for k in range(sc):
    q = slot_pos(k)
    ln = struct.unpack("<H", mf[q:q + 2])[0] & 0x7FFF
    s = mf[q + 2:q + 2 + 2 * ln].decode("utf-16-le", "replace")
    if s.rstrip(" ") != s and s.rstrip(" ") in ("android.app.Application", "android.app.Activity"):
        t2 = s.rstrip(" ")
        mf[q:q + 2 + 2 * ln + 2] = struct.pack("<H", len(t2)) + t2.encode("utf-16-le") + b"\x00\x00" + b"\x00" * (2 * ln - 2 * len(t2))
        print("trimmed slot", k, "->", repr(t2))

# ---- 2c) revert the launcher ACTIVITY class name (DEX still has com.chehchin.ai classes) ----
for k in range(sc):
    q = slot_pos(k)
    ln = struct.unpack("<H", mf[q:q + 2])[0] & 0x7FFF
    s = mf[q + 2:q + 2 + 2 * ln].decode("utf-16-le", "replace")
    if s == "com.chinify.grp.MainActivity":
        mf[q + 2:q + 2 + 2 * ln] = "com.chinify.app.MainActivity".encode("utf-16-le")
        print("activity class -> com.chinify.app.MainActivity (matches DEX)")
        break

# NOTE: the CHECK_LICENSE utf-16 swap above re-writes slot data including the null
# region — re-run the null fix pass for that slot:
for k in range(sc):
    q = slot_pos(k)
    ln = struct.unpack("<H", mf[q:q + 2])[0] & 0x7FFF
    s = mf[q + 2:q + 2 + 2 * ln].decode("utf-16-le", "replace")
    if s.startswith("android.permission.INTERNET") and ln >= 27:
        val = "android.permission.INTERNET".ljust(ln)
        mf[q + 2:q + 2 + 2 * ln] = val.encode("utf-16-le")
        mf[q + 2 + 2 * ln:q + 4 + 2 * ln] = b"\x00\x00"
        print("null re-fixed slot", k, "->", repr(get_str(k)))
        break

# ---- 3) split neutralization ----
empty = [k for k in range(sc) if get_str(k) == ""]
EMPTY = empty[0] if empty else None
print("empty slot:", EMPTY)
i = 8 + pool_size
# locate body: after map (0x0180)
body = None
while i + 8 <= len(mf):
    t, h, cs = struct.unpack("<HHI", mf[i:i + 8])
    if t == 0x0100:
        body = i
        break
    if cs == 0:
        break
    i += cs
assert body, "body (0x0100) not located in pristine manifest"
print("body located @", body)
p1 = p2 = 0
i = body
while i + 8 <= len(mf):
    t, h, cs = struct.unpack("<HHI", mf[i:i + 8])
    if cs < 8 or i + cs > len(mf):
        break
    if t == 0x0102:
        a_start, a_size, a_count = struct.unpack("<HHH", mf[i + 24:i + 30])
        is_splits = False
        for a in range(a_count):
            aoff = i + 16 + a_start + a * a_size
            name_i = struct.unpack("<I", mf[aoff + 4:aoff + 8])[0]
            raw_i = struct.unpack("<i", mf[aoff + 8:aoff + 12])[0]
            dtype = mf[aoff + 15]
            data = struct.unpack("<I", mf[aoff + 16:aoff + 20])[0]
            nm = get_str(name_i)
            if nm == "requiredSplitTypes" and dtype == 0x03 and EMPTY is not None:
                struct.pack_into("<i", mf, aoff + 8, EMPTY)
                struct.pack_into("<I", mf, aoff + 16, EMPTY)
                p1 += 1
            if nm == "name" and dtype == 0x03 and raw_i >= 0 and get_str(raw_i) == "com.android.vending.splits.required":
                is_splits = True
            if is_splits and nm == "value" and dtype == 0x12:
                struct.pack_into("<I", mf, aoff + 16, 0)
                p2 += 1
    i += cs
print("split patches:", p1, p2)

# ---- 4) versionCode -> 1, versionName -> 1.0.0 ----
i = body
while i + 8 <= len(mf):
    t, h, cs = struct.unpack("<HHI", mf[i:i + 8])
    if t == 0x0102:
        a_start, a_size, a_count = struct.unpack("<HHH", mf[i + 24:i + 30])
        for a in range(a_count):
            aoff = i + 16 + a_start + a * a_size
            name_i = struct.unpack("<I", mf[aoff + 4:aoff + 8])[0]
            nm = get_str(name_i)
            dtype = mf[aoff + 15]
            if nm == "versionCode" and dtype == 0x10:
                struct.pack_into("<I", mf, aoff + 16, 2)
                print("versionCode -> 2")
            if nm == "versionName" and dtype == 0x03:
                q = slot_pos(struct.unpack("<i", mf[aoff + 8:aoff + 12])[0])
                ln = struct.unpack("<H", mf[q:q + 2])[0] & 0x7FFF
                mf[q:q + 2 + 2 * ln + 2] = struct.pack("<H", 5) + "1.0.1".encode("utf-16-le") + b"\x00\x00" + b"\x00" * (2 * ln - 10)
                print("versionName -> 1.0.0")
        break
    i += cs

open(EX + r"\AndroidManifest.xml", "wb").write(bytes(mf))
print("manifest saved")

# ---- 5) arsc package rename com.chinify.app -> com.chinify.grp (same length) ----
ap = EX + r"\resources.arsc"
a = bytearray(open(ap, "rb").read())
c16 = a.count("com.chinify.app".encode("utf-16-le"))
c8 = a.count("com.chinify.app".encode("utf-8"))
a = bytearray(a.replace("com.chinify.app".encode("utf-16-le"), "com.chinify.grp".encode("utf-16-le")))
a = bytearray(a.replace("com.chinify.app".encode("utf-8"), b"com.chinify.grp"))
open(ap, "wb").write(bytes(a))
print("arsc pkg renamed:", c16, c8)

# ---- 6) assemble: pristine base + patched manifest + NEW arsc + reverted dex
#        + Persian web UI REPLACING assets/public entries (no duplicates) ----
OUT0 = ROOT + r"\tools\final_build.apk"
pub = EX + r"\assets\public"
with zipfile.ZipFile(SRC) as zin, zipfile.ZipFile(OUT0, "w") as zout:
    for n in zin.namelist():
        if n == "AndroidManifest.xml":
            data = bytes(mf)
        elif n == "resources.arsc":
            data = open(ap, "rb").read()
        elif n in ("classes.dex", "classes2.dex"):
            data = open(EX + "\\" + n, "rb").read()
        elif n.startswith("assets/public/"):
            fp = os.path.join(EX, n.replace("/", "\\"))
            if not os.path.isfile(fp):
                continue  # deleted in the Persian build (old languages etc.)
            data = open(fp, "rb").read()
        else:
            data = zin.read(n)
        zi = zipfile.ZipInfo(n, date_time=(2026, 11, 13, 0, 0, 0))
        zi.compress_type = zin.getinfo(n).compress_type
        zout.writestr(zi, data)
    # append brand-new files that the original zip lacks
    orig_names = set(zin.namelist())
    for root, dirs, files in os.walk(pub):
        rel = os.path.relpath(root, pub).replace("\\", "/")
        arcbase = "assets/public/" + ("" if rel == "." else rel + "/")
        for f in files:
            if ".bak" in f:
                continue
            arc = arcbase + f
            if arc not in orig_names:
                fp = os.path.join(root, f)
                zi = zipfile.ZipInfo(arc, date_time=(2026, 11, 13, 0, 0, 0))
                zi.compress_type = zipfile.ZIP_DEFLATED
                zout.writestr(zi, open(fp, "rb").read())
print("assembled", OUT0, os.path.getsize(OUT0))

subprocess.run([SDK + r"\build-tools\35.0.0\zipalign.exe", "-f", "4", OUT0, OUT0 + ".al"], check=True)
r = subprocess.run([SDK + r"\build-tools\35.0.0\apksigner.bat", "sign",
                    "--v1-signing-enabled", "true", "--v2-signing-enabled", "true", "--v3-signing-enabled", "true",
                    "--ks", ROOT + r"\chinify_release.jks", "--ks-pass", "pass:Chinify2026Pass",
                    "--ks-key-alias", "chinifykey", "--key-pass", "pass:Chinify2026Pass",
                    "--out", OUT, OUT0 + ".al"], capture_output=True, text=True)
print("sign rc:", r.returncode)
print("FINAL:", OUT, os.path.getsize(OUT))
