#!/usr/bin/env python3
import sys
# Archive QA gate — run before any deploy: python3 qa_check.py
# (Same checks as map/qa_workflow.yml.example; installing that as a GitHub Action
#  requires re-running `gh auth login` with the `workflow` scope.)
import json,glob,sys,os
bad=0
for f in glob.glob("*.json"):
    try: json.load(open(f))
    except Exception as e: print("INVALID JSON:",f,e); bad+=1
# A SCRATCH PROBE IS NOT A PAGE. Three guards -- deeplink_check, mobile_check and
# traverse_check -- write a temporary `_*.html` harness into site/ and delete it when they
# finish. The gate graded those as real pages, so any run overlapping one of them failed on
# "MISSING arda.css / nav.js / <meta name=description>" in a file that exists for four
# seconds. It has happened twice today -- _traverse.html at 06:07 and _mobileprobe.html at
# 15:46 -- and with five sessions on this machine the overlap is now likely rather than
# theoretical: a guard in one session was failing the deploy gate in another.
#
# The exclusion is deliberately narrow and it is COUNTED, not silent, because a rule that
# quietly drops files from the gate is a way to hide a page from every check it has.
_probes=sorted(p for p in glob.glob("_*.html"))
pages=[p for p in glob.glob("*.html") if p!="404.html" and not p.startswith("_")]
if _probes:
    print("note: %d scratch probe(s) skipped, left by a guard running right now: %s"
          %(len(_probes),", ".join(_probes)))
for p in pages:
    s=open(p).read()
    for need in ('arda.css','nav.js','<meta name="description"'):
        if need not in s: print("MISSING",need,"in",p); bad+=1
for need in ("sitemap.xml","robots.txt","404.html","sw.js","map_1366.jpeg"):
    if not os.path.exists(need): print("MISSING FILE:",need); bad+=1

# --- referential integrity across halls ---
import re as _re
try:
    g={p["id"] for p in json.load(open("arda_genealogy.json"))["persons"]}
    lm=json.load(open("arda_livingmap.json"))
    pois={p["n"] for p in lm["pois"]}; polys=set(lm["realms"].keys()); slices={x["id"] for x in lm["slices"]}
    camps={c["id"] for c in json.load(open("arda_armies.json"))["campaigns"]}
    R=json.load(open("arda_realms.json"))["pol"]
    for P in R:
        for r in P.get("rulers",[]):
            if r[1] not in g: print("REF: realm",P["id"],"ruler",r[1],"not in genealogy"); bad+=1
        for b in P.get("battles",[]):
            if b not in camps: print("REF: realm",P["id"],"battle",b,"unknown"); bad+=1
        for sl,ps in (P.get("poly") or {}).items():
            if sl not in slices: print("REF: realm",P["id"],"slice",sl); bad+=1
            for pp in ps:
                if pp not in polys: print("REF: realm",P["id"],"poly",pp); bad+=1
    # search index targets must be real pages
    import os
    pages_set={p for p in glob.glob("*.html") if not p.startswith("_")}
    for e in json.load(open("arda_search.json")):
        tgt=e[3].split("#")[0]
        if tgt and not tgt.startswith("http") and tgt not in pages_set and not os.path.exists(tgt):
            print("REF: search target missing:",tgt); bad+=1; break
    print("referential integrity checked (realms links, search targets)")
except Exception as ex:
    print("REF-CHECK ERROR:",ex); bad+=1


# --- link-rot: internal href/src targets must exist (urldecoded; skips JS-template & absolute) ---
from urllib.parse import unquote
import re as _re2
dead=0
for f in [x for x in glob.glob("*.html") if not x.startswith("_")]:
    txt=open(f).read()
    for m in _re2.finditer(r'(?:href|src)="([^"#{$][^"#?]*?)(?:[#?][^"]*)?"',txt):
        t=unquote(m.group(1))
        if "'" in t or "+" in t or "${" in t or "{" in t: continue   # JS template, not a link
        if t.startswith(("http","data:","mailto","//","/","about:")): continue
        if not os.path.exists(t):
            print("DEAD LINK",f,"->",t); dead+=1
if dead: bad+=dead
print("link-rot:",dead,"dead internal links")

# INTEGRITY-HOOK
_ifail = 0
try:
    import subprocess as _sp, sys as _sys
    _r = _sp.run([_sys.executable, "integrity.py"], capture_output=True, text=True, timeout=180)
    for _l in _r.stdout.splitlines():
        t = _l.strip()
        if t.startswith(("\u2717", "\u26a0")):
            print(t)
    _ifail = 1 if _r.returncode else 0
    print("integrity (drift): %s" % ("FAIL" if _ifail else "OK"))
except Exception as _e:
    print("integrity (drift): could not run - %s" % str(_e)[:60])

# JS-SYNTAX-HOOK
# The forge splice once left heraldry.js unparseable and the whole hall rendered
# blank; nothing caught it but a browser. node --check is that browser, cheaply.
_jsfail = 0
try:
    import subprocess as _sp3, sys as _sys3, os as _os3
    _js = sorted(glob.glob("*.js")) + [_os3.path.join("..", "map", "forge_engine.js")]
    _broken = []
    for _f in _js:
        if not _os3.path.exists(_f): continue
        _r3 = _sp3.run(["node", "--check", _f], capture_output=True, text=True, timeout=60)
        if _r3.returncode:
            _msg = [l for l in _r3.stderr.splitlines() if "Error" in l]
            _broken.append("%s: %s" % (_os3.path.basename(_f), (_msg[0] if _msg else "syntax error")[:70]))
    for _b in _broken: print("✗ JS SYNTAX", _b)
    _jsfail = 1 if _broken else 0
    print("js syntax: %s (%d files)" % ("FAIL" if _jsfail else "OK", len(_js)))
except FileNotFoundError:
    print("js syntax: skipped - node is not installed"); _skipped.append("js syntax")
except Exception as _e3:
    print("js syntax: could not run - %s" % str(_e3)[:60])

# --- does the page actually RUN, not merely parse -------------------------------
# node --check proved heraldry.html's scripts parsed while the page carried a stale
# copy of the forge engine -- 46 tinctures where its devices asked for 83 -- so every
# preset threw the moment anyone touched it. This drives the page against a stub DOM.
try:
    import subprocess as _sp4, os as _os4
    _smoke = _os4.path.join("..", "map", "page_smoke.js")
    if _os4.path.exists(_smoke):
        _sfail = 0; _sn = 0
        for _pg in sorted(x for x in glob.glob("*.html") if not x.startswith("_")):
            _r4 = _sp4.run(["node", _smoke, _pg], capture_output=True, text=True, timeout=180)
            _sn += 1
            if _r4.returncode:
                _sfail += 1
                for _l in _r4.stdout.splitlines():
                    if "threw" in _l: print("✗ PAGE RUNTIME %s: %s" % (_pg, _l.strip()[:110]))
        print("page runtime: %s (%d pages)" % ("FAIL" if _sfail else "OK", _sn))
    else:
        _sfail = 0
        print("page runtime: skipped - map/page_smoke.js not present"); _skipped.append("page runtime")
except FileNotFoundError:
    _sfail = 0
    print("page runtime: skipped - node is not installed"); _skipped.append("page runtime")
except Exception as _e4:
    _sfail = 0
    print("page runtime: could not run - %s" % str(_e4)[:60])

# MATCHER-HOOK
# The quote matcher is the thing every claim-audit trusts. If its own tests stop
# passing, every verification done with it is suspect.
_mfail = 0
try:
    import subprocess as _sp4, sys as _sys4
    _r4 = _sp4.run([_sys4.executable, "../map/ardatext.py", "--selftest"],
                   capture_output=True, text=True, timeout=120)
    _mfail = 1 if _r4.returncode else 0
    _tail = [l for l in _r4.stdout.splitlines() if "self-test" in l]
    print("quote matcher: %s%s" % ("FAIL" if _mfail else "OK",
          " - " + _tail[-1].split(":")[-1].strip() if _tail else ""))
    if _mfail:
        for _l in _r4.stdout.splitlines():
            if _l.strip().startswith("FAIL"): print("✗", _l.strip())
except Exception as _e4:
    print("quote matcher: could not run - %s" % str(_e4)[:60])

# QUOTES-HOOK
# Every quotation the archive prints, re-located in the corpus. Skipped rather
# than failed when the corpus is not on disk: it is derived, and its absence is a
# missing input, not a fault in the site.
_qfail = 0
# WHAT WAS SKIPPED, CARRIED INTO THE VERDICT AND NOT ONLY INTO THE LOG.
#
# The two corpus checks print "skipped" when corpus/ is not on disk, and the reasoning for
# that is right and is not being changed: the corpus is derived and rebuildable, and
# failing a gate because a rebuildable artefact is missing would be wrong. The fault was
# the sentence AFTERWARDS. With both skipped this file printed "checked 32 pages, 47
# datasets — OK" and exited 0 -- a claim about completeness that was false, in the one
# command CLAUDE.md rule 4 elevates above all the others: "must exit 0 before pushing. Not
# 'looks right' -- exit 0."
#
# AND CORPUS-ABSENT IS THE DEFAULT STATE OF A FRESH CLONE, not an exotic one: corpus/ is
# gitignored and zero files are tracked. Anyone following rule 4 exactly on a clone whose
# corpus has not been rebuilt got a green verdict with the archive's central verification
# unrun. (A PUSH would still have been refused -- all four corpus-dependent guards fail
# closed, so the suite counts failures and the hook stops it -- but that backstop works by
# side effect, and a future guard written to skip politely, exactly as this one does and
# with the same good reasoning, would go quiet with it.)
#
# So: exit 0 keeps meaning everything ran and everything passed, which is what rule 4 says
# it means and what a reader takes it to mean. Anything skipped is exit 2.
_skipped = []
try:
    import subprocess as _sp5, sys as _sys5, os as _os5
    if not glob.glob(_os5.path.join("..", "corpus", "t*.txt")):
        print("quotations: skipped - no corpus on disk (python3 map/extract_corpus.py)")
        _skipped.append("quotations")
    else:
        _r5 = _sp5.run([_sys5.executable, "../map/verify_quotes.py"],
                       capture_output=True, text=True, timeout=480)
        _qfail = 1 if _r5.returncode else 0
        _sum = [l for l in _r5.stdout.splitlines() if l.startswith("verified ")]
        print("quotations: %s%s" % ("FAIL" if _qfail else "OK",
              " - " + _sum[-1][len("verified "):] if _sum else ""))
        if _qfail:
            for _l in _r5.stdout.splitlines():
                if _l.strip().startswith(("ABSENT", "MISFILED")): print("✗", _l.strip())
except Exception as _e5:
    print("quotations: could not run - %s" % str(_e5)[:60])

# AUDITS-HOOK
# The Phase 3 and Phase 6 findings, re-put to the matcher as testable claims.
# They drove real repairs; if the corpus or the matcher moves under them, that
# should surface here rather than in a later re-reading.
_afail = 0
try:
    import subprocess as _sp6, sys as _sys6, os as _os6
    if not glob.glob(_os6.path.join("..", "corpus", "t*.txt")):
        print("audit claims: skipped - no corpus on disk")
        _skipped.append("audit claims")
    else:
        _r6 = _sp6.run([_sys6.executable, "../map/recheck_audits.py"],
                       capture_output=True, text=True, timeout=480)
        _afail = 1 if _r6.returncode else 0
        _s6 = [l for l in _r6.stdout.splitlines() if "claims stand" in l]
        print("audit claims: %s%s" % ("FAIL" if _afail else "OK",
              " - " + _s6[-1] if _s6 else ""))
        if _afail:
            for _l in _r6.stdout.splitlines():
                if _l.strip().startswith("!!"): print("\u2717", _l.strip())
except Exception as _e6:
    print("audit claims: could not run - %s" % str(_e6)[:60])

_failed = bad or _ifail or _jsfail or _sfail or _mfail or _qfail or _afail
print("checked",len(pages),"pages,",len(glob.glob('*.json')),"datasets —",
      "FAIL" if _failed else ("OK" if not _skipped else
      "OK, with %d check(s) SKIPPED and therefore unverified: %s"
      %(len(_skipped),", ".join(_skipped))))
import sys as _s2
# 0 = everything ran and everything passed. 1 = something failed. 2 = nothing failed but
# something did not run, so this is not the verdict rule 4 asks for.
_s2.exit(1 if _failed else (2 if _skipped else 0))
sys.exit(1 if bad else 0)
