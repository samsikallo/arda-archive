#!/usr/bin/env python3
# Archive QA gate — run before any deploy: python3 qa_check.py
# (Same checks as map/qa_workflow.yml.example; installing that as a GitHub Action
#  requires re-running `gh auth login` with the `workflow` scope.)
import json,glob,sys,os
bad=0
for f in glob.glob("*.json"):
    try: json.load(open(f))
    except Exception as e: print("INVALID JSON:",f,e); bad+=1
pages=[p for p in glob.glob("*.html") if p!="404.html"]
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
    pages_set={p for p in glob.glob("*.html")}
    for e in json.load(open("arda_search.json")):
        tgt=e[3].split("#")[0]
        if tgt and not tgt.startswith("http") and tgt not in pages_set and not os.path.exists(tgt):
            print("REF: search target missing:",tgt); bad+=1; break
    print("referential integrity checked (realms links, search targets)")
except Exception as ex:
    print("REF-CHECK ERROR:",ex); bad+=1

print("checked",len(pages),"pages,",len(glob.glob('*.json')),"datasets —","FAIL" if bad else "OK")
sys.exit(1 if bad else 0)
