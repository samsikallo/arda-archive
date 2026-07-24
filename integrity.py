# -*- coding: utf-8 -*-
"""
THE INTEGRITY CHECK — a standing guard over the archive's own consistency.

The audits in this project all asked "is this claim true?". Every one of them would
have passed while the search index quietly shed four hundred entries, and while a
correction sat in one file whose copy in another still held the error. Those are not
false claims; they are drift. This checks for drift.

Six guards, each earned by a real fault:

  1. SHRINKAGE     a dataset that loses entries without the baseline being updated.
                   (The search index fell 2,421 -> 2,024 across three regenerations
                   and nothing noticed.)
  2. TWINS         the same claim held in two files, which must agree.
                   (Framsburg's caveat went into arda_livingmap while
                   arda_timemap_jpeg kept the uncorrected pin. Twice: the
                   mithril-coat error was fixed in the artifacts and left in the
                   silences.)
  3. REFERENCES    every id pointed at must exist — aliases, art paths, search
                   targets, register keys.
                   (The character alias pharazon -> arpharazon survived the record
                   being deleted, and Ar-Pharazon's page lost its dates.)
  4. FIELD SHAPE   a caveat belongs in a citation field, never in a name.
                   (Framsburg's disclaimer went into the map label and would have
                   rendered as a paragraph where a place-name belongs.)
  5. DUPLICATES    two register entries pointing at one image, unless declared.
                   (Nimloth and the White Tree of Gondor shared a plate.)
  6. TIER          nothing may cite a tier-3 source as though it were canon.
                   (Beor's death followed Foster; Lothiriel's wedding followed Tyler.)

Run from site/:  python3 integrity.py            check
                 python3 integrity.py --accept "reason"   re-baseline deliberately
"""
import json,os,sys,re,glob

SITE=os.path.dirname(os.path.abspath(__file__))
BASELINE=os.path.join(SITE,".integrity_baseline.json")

# ---- what a dataset's "size" means, per file -------------------------------------
def count(path):
    d=json.load(open(path))
    if isinstance(d,list): return len(d)
    if isinstance(d,dict):
        # sum the lengths of the list-valued members; else count keys
        lists=[len(v) for v in d.values() if isinstance(v,list)]
        return sum(lists) if lists else len(d)
    return 0

# ---- 2. TWINS: claims duplicated across files, which must stay in step ------------
TWINS=[
 # (label, fileA, fileB, a probe that must be ABSENT from both, why)
 ("Brithombar citation","arda_livingmap.json","arda_timemap_jpeg.json","Silm 14/20",
  "the published Silmarillion carries no years; the date is from the Grey Annals"),
 ("Angband league citation","arda_livingmap.json","arda_timemap_jpeg.json","Silm 3/18",
  "the 150 leagues is Grey Annals, not the Silmarillion"),
 ("mithril-coat at the Havens","arda_artifacts.json","arda_silences.json",
  "Worn at the Havens-riding in 3021",
  "last attested wearing is the Scouring, 3 Nov 3019"),
 ("the beacons at Edoras","arda_livingmap.json","arda_timemap_jpeg.json","beacons burn",
  "the beacons are Gondor's, seen by Pippin on 8 March"),
]
# ---- 6. TIER: phrases that betray a tier-3 source being trusted as canon ----------
TIER_TRAPS=[
 ("Foster","a tier-3 concordance"),("Fonstad","a tier-3 reconstruction"),
 ("Tyler","a tier-3 companion"),
]
CANON_TAG=re.compile(r"\[C\]")

def fail(msgs,m): msgs.append(m)

def check():
    os.chdir(SITE)
    errs,warns,notes=[],[],[]
    base=json.load(open(BASELINE)) if os.path.exists(BASELINE) else {}
    counts={}

    # 1. SHRINKAGE
    for f in sorted(glob.glob("arda_*.json")):
        try: counts[f]=count(f)
        except Exception as e: fail(errs,"UNREADABLE %s (%s)"%(f,str(e)[:60])); continue
        was=base.get("counts",{}).get(f)
        if was is not None and counts[f]<was:
            fail(errs,"SHRANK   %-28s %d -> %d  (was %d at baseline)"%(f,was,counts[f],was))
        elif was is not None and counts[f]>was:
            notes.append("grew    %-28s %d -> %d"%(f,was,counts[f]))

    # 2. TWINS
    for label,fa,fb,probe,why in TWINS:
        for f in (fa,fb):
            if not os.path.exists(f): continue
            if probe.lower() in json.dumps(json.load(open(f)),ensure_ascii=False).lower():
                fail(errs,"TWIN     %s still present in %s — %s"%(label,f,why))

    # 3. REFERENCES
    #    a) the character-record alias map must point at records that exist
    if os.path.exists("character.html") and os.path.exists("arda_chronology.json"):
        ids={c["id"] for c in json.load(open("arda_chronology.json"))["chars"]}
        m=re.search(r"const ALIAS=\{([^}]*)\}",open("character.html").read())
        if m:
            for k,v in re.findall(r"(\w+)\s*:\s*[\"'](\w+)[\"']",m.group(1)):
                if v not in ids: fail(errs,"ALIAS    %s -> %s, which is not a record"%(k,v))
    #    b) every art path in the herbarium map must resolve, and its key must exist
    if os.path.exists("arda_herbarium.json"):
        hm=json.load(open("arda_herbarium.json"))
        reg=set()
        for f in ("arda_nature.json","arda_creatures.json"):
            if os.path.exists(f): reg|={x["id"] for x in json.load(open(f))}
        for k,v in hm.items():
            if not os.path.exists(v): fail(errs,"ART      %s -> missing file %s"%(k,v))
            if reg and k not in reg: fail(errs,"ART      %s is not an entry in any register"%k)
    #    c) gallery images
    if os.path.exists("arda_art.json"):
        for x in json.load(open("arda_art.json")):
            if x.get("img") and not os.path.exists(x["img"]):
                fail(errs,"ART      gallery %s -> missing %s"%(x["id"],x["img"]))
    #    d) search targets
    if os.path.exists("arda_search.json"):
        for r in json.load(open("arda_search.json")):
            l=(r[3] if isinstance(r,list) and len(r)>3 else r.get("l","")) or ""
            pg=l.split("#")[0]
            if pg and not os.path.exists(pg):
                fail(errs,"SEARCH   target page missing: %s"%pg); break

    # 4. FIELD SHAPE — a caveat marker inside a name/label field
    NAMEKEYS={"n","name","label","t","title"}
    def scan(o,f,path=""):
        if isinstance(o,dict):
            for k,v in o.items():
                if k in NAMEKEYS and isinstance(v,str) and (v.startswith("[") or "[I]" in v or len(v)>90):
                    if "[I]" in v or "[C]" in v or "[T3]" in v:
                        fail(errs,"SHAPE    %s: a caveat sits in the '%s' field: %r"%(f,k,v[:60]))
                else: scan(v,f,path+"/"+str(k))
        elif isinstance(o,list):
            for i,v in enumerate(o): scan(v,f,path+"/%d"%i)
    for f in ("arda_livingmap.json","arda_timemap_jpeg.json","arda_nature.json","arda_creatures.json"):
        if os.path.exists(f): scan(json.load(open(f)),f)

    # 5. DUPLICATE IMAGES — one plate on two entries, unless declared
    DECLARED={"art/bot_mallos.jpg","art/bot_pipeweed.jpg","art/bot_nisimaldar.jpg"}
    if os.path.exists("arda_herbarium.json"):
        rev={}
        for k,v in json.load(open("arda_herbarium.json")).items(): rev.setdefault(v,[]).append(k)
        for v,ks in rev.items():
            if len(ks)>1 and v not in DECLARED:
                fail(errs,"DUPART   %s is used by %s — declare it or give one its own plate"%(v,", ".join(ks)))

    # 7. MAPSYNC — the three map files carry the same realm descriptions by design.
    #    Roughly two hundred claims are duplicated across them, so a correction made
    #    to one and not the others is the Framsburg fault waiting to happen again.
    _mf=["arda_livingmap.json","arda_timemap.json","arda_timemap_jpeg.json"]
    _R={}
    for _f in _mf:
        if not os.path.exists(_f): continue
        _r=json.load(open(_f)).get("realms")
        if isinstance(_r,dict): _R[_f]={k:(v.get("d") or "") for k,v in _r.items()}
        elif isinstance(_r,list): _R[_f]={x.get("id",x.get("n")):(x.get("d") or "") for x in _r}
    if len(_R)>1:
        _keys=set().union(*[set(v) for v in _R.values()])
        for _k in sorted(_keys):
            _texts={_R[_f][_k] for _f in _R if _k in _R[_f] and _R[_f][_k]}
            if len(_texts)>1:
                fail(errs,"MAPSYNC  realm '%s' is described differently across the map files"%_k)

    # 6. TIER — a lower-tier source named beside a canon tag
    for f in sorted(glob.glob("arda_*.json")):
        try: blob=json.dumps(json.load(open(f)),ensure_ascii=False)
        except Exception: continue
        for name,what in TIER_TRAPS:
            for m in re.finditer(re.escape(name),blob):
                seg=blob[max(0,m.start()-160):m.start()+160]
                # naming a lower-tier source in order to REJECT it is a disclosure,
                # not a citation. Those read "previously followed Foster [t3]".
                disclosed=re.search(r"\[t3\]|previously|rather than|not Tolkien|is Fonstad|derives from",
                                    seg,re.I)
                if CANON_TAG.search(seg) and not disclosed:
                    warns.append("TIER     %s cites %s (%s) near a [C] canon tag"%(f,name,what)); break

    return counts,errs,warns,notes

def main():
    counts,errs,warns,notes=check()
    for n in notes: print("  ·",n)
    for w in warns: print("  ⚠", w)
    for e in errs:  print("  ✗", e)
    if "--accept" in sys.argv:
        why=sys.argv[sys.argv.index("--accept")+1] if len(sys.argv)>sys.argv.index("--accept")+1 else "(no reason given)"
        json.dump({"counts":counts,"accepted":why},open(BASELINE,"w"),indent=1)
        print("\nbaseline re-recorded: %s"%why); return 0
    print("\n%d datasets checked — %s"%(len(counts),"OK" if not errs else "FAIL (%d)"%len(errs)))
    return 1 if errs else 0

if __name__=="__main__":
    sys.exit(main())
