# -*- coding: utf-8 -*-
"""rebuild_units.py — admin-panel wrapper for the unit-course pipeline.

Runs the existing, proven steps in order:
  1. gen_units.py    -> validates lesson data (gen_data_a/b/c) and writes tools/units_out.js
  2. splice_units.py -> replaces the hsk1:1..14 block inside UI-code/js/unit-course.js
                        (has internal asserts that abort on unexpected file shape)
  3. copies unit-course.js to extracted/assets/public/js/ (build copy)
No exercise logic is changed here — only orchestration."""
import io, os, runpy, shutil, sys

sys.stdout.reconfigure(encoding="utf-8", errors="replace")
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = r"C:\Users\Amirsajjad\Documents\kanchinese"
UC_UI = os.path.join(ROOT, "UI-code", "js", "unit-course.js")
UC_EX = os.path.join(ROOT, "extracted", "assets", "public", "js", "unit-course.js")

print("== step 1/3: gen_units.py (validate + emit units_out.js) ==", flush=True)
runpy.run_path(os.path.join(HERE, "gen_units.py"), run_name="__main__")

print("== step 2/3: splice_units.py (inject into unit-course.js) ==", flush=True)
runpy.run_path(os.path.join(HERE, "splice_units.py"), run_name="__main__")

print("== step 3/3: copy to extracted build copy ==", flush=True)
if os.path.isfile(UC_UI):
    os.makedirs(os.path.dirname(UC_EX), exist_ok=True)
    shutil.copy2(UC_UI, UC_EX)
    print("copied -> %s (%d bytes)" % (UC_EX, os.path.getsize(UC_EX)), flush=True)

print("rebuild_units: DONE", flush=True)
