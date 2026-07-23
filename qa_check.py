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
print("checked",len(pages),"pages,",len(glob.glob('*.json')),"datasets —","FAIL" if bad else "OK")
sys.exit(1 if bad else 0)
