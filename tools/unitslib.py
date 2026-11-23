# -*- coding: utf-8 -*-
"""unitslib.py — parse / emit the UNITS object of UI-code/js/unit-course.js.

The UNITS object mixes styles: hsk1:0 is hand-authored JS (unquoted keys, //
comments) while hsk1:1..14 come from gen_units.py as strict JSON. This module
tolerantly parses the whole object literal (comments, unquoted keys, trailing
commas) into plain Python data, and re-emits it as valid strict JSON that is
dropped back into the same byte position — everything around UNITS stays
byte-identical."""
import io, json, os, re, shutil

ROOT = r"C:\Users\Amirsajjad\Documents\kanchinese"
UC_PATHS = [os.path.join(ROOT, "UI-code", "js", "unit-course.js"),
            os.path.join(ROOT, "extracted", "assets", "public", "js", "unit-course.js")]

# ---------- tolerant JS-object-literal parser ----------
class _P:
    def __init__(self, s):
        self.s = s
        self.i = 0
        self.n = len(s)

    def err(self, msg):
        line = self.s.count("\n", 0, self.i) + 1
        raise ValueError("units parse error line %d: %s" % (line, msg))

    def ws(self):
        while self.i < self.n:
            c = self.s[self.i]
            if c in " \t\r\n":
                self.i += 1
            elif c == "/" and self.i + 1 < self.n and self.s[self.i + 1] == "/":
                j = self.s.find("\n", self.i)
                self.i = self.n if j < 0 else j + 1
            elif c == "/" and self.i + 1 < self.n and self.s[self.i + 1] == "*":
                j = self.s.find("*/", self.i + 2)
                self.i = self.n if j < 0 else j + 2
            else:
                break

    def string(self):
        self.i += 1  # skip opening quote
        out = []
        i = self.i
        while i < self.n:
            c = self.s[i]
            if c == "\\":
                nxt = self.s[i + 1] if i + 1 < self.n else ""
                mapping = {"n": "\n", "t": "\t", "r": "\r", "b": "\b", "f": "\f", '"': '"', "\\": "\\", "/": "/"}
                if nxt == "u":
                    out.append(chr(int(self.s[i + 2:i + 6], 16)))
                    i += 6
                    continue
                out.append(mapping.get(nxt, nxt))
                i += 2
                continue
            if c == '"':
                self.i = i + 1
                return "".join(out)
            out.append(c)
            i += 1
        self.err("unterminated string")

    def bare(self):
        j = self.i
        while j < self.n and self.s[j] not in ",}]:\n":
            j += 1
        tok = self.s[self.i:j].strip()
        self.i = j
        if tok in ("true", "True"):
            return True
        if tok in ("false", "False"):
            return False
        if tok in ("null", "None", "undefined"):
            return None
        try:
            return int(tok)
        except ValueError:
            pass
        try:
            return float(tok)
        except ValueError:
            return tok

    def value(self):
        self.ws()
        if self.i >= self.n:
            self.err("unexpected end")
        c = self.s[self.i]
        if c == "{":
            return self.obj()
        if c == "[":
            return self.arr()
        if c == '"':
            return self.string()
        return self.bare()

    def key(self):
        self.ws()
        c = self.s[self.i]
        if c == '"':
            return self.string()
        j = self.i
        while j < self.n and (self.s[j].isalnum() or self.s[j] in "_$"):
            j += 1
        k = self.s[self.i:j]
        self.i = j
        return k

    def obj(self):
        self.i += 1  # {
        d = {}
        while True:
            self.ws()
            if self.i >= self.n:
                self.err("unterminated object")
            if self.s[self.i] == "}":
                self.i += 1
                return d
            k = self.key()
            self.ws()
            if self.i >= self.n or self.s[self.i] != ":":
                self.err("expected ':' after key %r" % k)
            self.i += 1
            d[k] = self.value()
            self.ws()
            if self.i < self.n and self.s[self.i] == ",":
                self.i += 1
            elif self.i < self.n and self.s[self.i] == "}":
                self.i += 1
                return d
            else:
                self.err("expected ',' or '}' in object")

    def arr(self):
        self.i += 1  # [
        a = []
        while True:
            self.ws()
            if self.i >= self.n:
                self.err("unterminated array")
            if self.s[self.i] == "]":
                self.i += 1
                return a
            a.append(self.value())
            self.ws()
            if self.i < self.n and self.s[self.i] == ",":
                self.i += 1
            elif self.i < self.n and self.s[self.i] == "]":
                self.i += 1
                return a
            else:
                self.err("expected ',' or ']' in array")

def find_units_span(text):
    """return (brace_start, brace_end) of the UNITS object literal"""
    m = re.search(r"\bUNITS\s*:\s*\{", text)
    if not m:
        raise ValueError("UNITS object not found in unit-course.js")
    start = m.end() - 1  # position of '{'
    p = _P(text[start:])
    # walk only to the matching close: reuse parser by parsing the object
    depth = 0
    i = start
    instr = False
    esc = False
    while i < len(text):
        c = text[i]
        if instr:
            if esc:
                esc = False
            elif c == "\\":
                esc = True
            elif c == '"':
                instr = False
        else:
            if c == '"':
                instr = True
            elif c == "{":
                depth += 1
            elif c == "}":
                depth -= 1
                if depth == 0:
                    return start, i
        i += 1
    raise ValueError("UNITS object not terminated")

def parse_units(text=None):
    """parse UNITS object -> dict of units (hsk1:0..14)"""
    if text is None:
        text = io.open(UC_PATHS[0], encoding="utf-8").read()
    s, e = find_units_span(text)
    p = _P(text[s:e + 1])
    return p.obj()

def emit_units(units):
    """strict JSON for the UNITS object (valid JS object literal)"""
    return json.dumps(units, ensure_ascii=False, indent=2)

def replace_units(text, units):
    s, e = find_units_span(text)
    return text[:s] + emit_units(units) + text[e + 1:]

def save_units(units):
    """write units into BOTH copies (with .admin.bak of UI-code copy)"""
    out = []
    for i, fp in enumerate(UC_PATHS):
        if not os.path.isfile(fp):
            continue
        t = io.open(fp, encoding="utf-8").read()
        new = replace_units(t, units)
        if i == 0:
            bak = fp + ".admin.bak"
            shutil.copy2(fp, bak)
        io.open(fp, "w", encoding="utf-8", newline="\n").write(new)
        out.append(fp)
    return out

def validate_units(units):
    if not isinstance(units, dict) or not units:
        raise ValueError("units must be a non-empty object")
    for k, u in units.items():
        if not isinstance(u, dict):
            raise ValueError("%s: not an object" % k)
        if u.get("id") != k:
            raise ValueError("%s: id mismatch (%r)" % (k, u.get("id")))
        if not isinstance(u.get("sections"), list):
            raise ValueError("%s: sections missing" % k)
        for sec in u["sections"]:
            if not isinstance(sec, dict) or "id" not in sec:
                raise ValueError("%s: bad section" % k)
            for ml in sec.get("miniLessons", []) or []:
                if not isinstance(ml.get("exercises", []), list):
                    raise ValueError("%s/%s: exercises missing" % (k, ml.get("id")))

if __name__ == "__main__":
    import sys
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    t = io.open(UC_PATHS[0], encoding="utf-8").read()
    s, e = find_units_span(t)
    print("UNITS span: %d..%d (%d bytes of %d)" % (s, e, e - s, len(t)))
    units = parse_units(t)
    print("units:", sorted(units.keys(), key=lambda x: int(x.split(":")[1])))
    # round-trip check: re-parse emitted JSON
    back = json.loads(emit_units(units))
    print("round-trip equal:", back == units)
    for k, u in sorted(units.items(), key=lambda kv: int(kv[0].split(":")[1])):
        ex_total = sum(len(ml.get("exercises", [])) for sec in u.get("sections", []) for ml in sec.get("miniLessons", []))
        print("  %s (%s): %d sections, %d exercises" % (k, u.get("title"), len(u.get("sections", [])), ex_total))
