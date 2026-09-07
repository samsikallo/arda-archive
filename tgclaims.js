/* THE TOLKIEN GATEWAY LAYER ON THE RECORD — his ruling C831, delivered 6 September 2026.
 *
 * WHAT THIS IS AGAINST. research/extracted/claims_tg_publishable_2026-09-02.jsonl held 13,641
 * claims already adjudicated publishable under C831 — for each one Tolkien Gateway cites a
 * Tolkien text and the citation carried is THAT one — and not one of them reached a reader.
 * map/gen_person_tg_claims.py routes 4,141 of them onto 781 published person routes and writes
 * one shard per person. This file is the only thing that puts them in front of anybody.
 *
 * IT IS A SEPARATE PANEL AND IT SAYS SO IN ITS OWN HEADING. His §I.8 keeps Tolkien-authored,
 * editorial, adaptation and fan material separately queryable, and C884 says a wiki is t4 —
 * no independent authority, usable only where it happens to restate something Tolkien wrote.
 * So the hand, the licence and the tier are printed at the head of the panel where a reader
 * cannot miss them, not folded into a field, and every claim shows the TOLKIEN citation Tolkien
 * Gateway gave for it beside the [EXT] marker. The wording is Tolkien Gateway's own and is set
 * as prose, never as a quotation from the cited work.
 *
 * IT FETCHES ONE SHARD, ON DEMAND, AND ONLY WHEN A PERSON IS SHOWN. site/arda_person_tg_claims.
 * json is 3.9 MB whole; a shard is 3.6 KB at the median. The person LEAF could not have carried
 * this at all — measured 6 September 2026, a person recto has 0px free of 917px and
 * map/codexfit_check.py already exits 1 on person/sauron.html for a 1.2 KB spliced region.
 */
(function () {
  var CACHE = {}, LBL = null;
  /* ── THE SUBJECT IS DECLARED WHERE THERE IS NO FRAGMENT TO READ ────────────────────────────
     character.html shows one person per hash, so `location.hash` IS its subject. A person route
     -- site/person/<slug>.html, 960 of them, and 781 hold a shard -- IS the person and carries no
     hash at all. Reading the hash there would make every one of the 960 render Aragorn, which is
     the default this file falls back to. So the page declares who it is about, in the spliced
     ARDA:RECLAYER region, and this reads the declaration when there is one. */
  function subj() {
    return window.ARDA_SUBJECT || (location.hash || "#aragorn").slice(1);
  }
  /* AND THE DATA PATH IS RELATIVE TO THE PAGE, NOT TO THIS SCRIPT. character.html sits at the
     site root and fetches "tg/x.json"; person/<slug>.html is one level down and must fetch
     "../tg/x.json". The page already declares its own depth as `window.ARDA_BASE`, for exactly
     the reason gen_stubs.py's own comment gives about nav.js: the depth differs between GitHub
     Pages, a local server and file://, and the PAGE is the only thing that knows it. Deriving it
     from location.pathname would be a guess with three possible answers. */
  function dbase() { return window.ARDA_BASE || ""; }
  function esc(x) {
    return String(x == null ? "" : x).replace(/[&<>"]/g, function (c) {
      return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c];
    });
  }
  function panel(d, id) {
    var by = {}, order = [];
    (d.claims || []).forEach(function (c) {
      if (!by[c.feature]) { by[c.feature] = []; order.push(c.feature); }
      by[c.feature].push(c);
    });
    LBL = d.feature_labels || {};
    var h = '<h3>What Tolkien Gateway records, and what it cites for it '
      + '<span class="cite" style="font-weight:normal">' + (d.claims || []).length
      + ' claim' + ((d.claims || []).length === 1 ? "" : "s") + '</span></h3>'
      + '<p class="cite" style="margin:.2em 0 .8em">A SEPARATE LAYER, AND NOT THE ARCHIVE’S OWN '
      + 'ATTESTATION. Hand: <b>' + esc(d.hand) + '</b>. Licence: <b>' + esc(d.licence)
      + '</b>. Tier <b>t' + esc(d.content_tier) + '</b> — a wiki has no independent authority '
      + 'and is usable only where it happens to restate something Tolkien wrote (his ruling C884). '
      + 'Under his ruling C831 a Tolkien Gateway datum reaches you only where Tolkien Gateway '
      + 'itself cites a Tolkien text, and what is printed beside each line below is <i>that</i> '
      + 'citation — Tolkien’s, not the wiki’s. <b>The wording is Tolkien Gateway’s '
      + 'own</b> and is never to be read as a quotation from the cited work. Nothing here is in the '
      + 'archive’s canonical record; for what this archive’s own corpus attests, with the '
      + 'line it stands at, see the record above and the person’s folio.</p>';
    order.sort();
    order.forEach(function (f) {
      h += '<div class="sub">' + esc(LBL[f] || f.replace(/_/g, " ")) + '</div>';
      by[f].forEach(function (c) {
        /* EVERY CLAIM ROW IS STAMPED, and map/personlayer_check.py counts the stamps against
           the shard's own claim count. A panel that renders its heading and loses its rows is
           a panel that passed getElementById and served no reader -- exactly the failure
           map/reallayer_check.py had to add a row count to arm A to catch. `data-tg-of` carries
           the PERSON, so a row left behind from another subject is recognisable as one. */
        h += '<div data-tg-claim data-tg-of="' + esc(id) + '" '
          + 'style="background:#fdfaf2;border:1px solid #b0a58e;border-radius:8px;'
          + 'padding:7px 10px;margin:0 0 7px">'
          + '<div>' + esc(c.text).replace(/\n/g, "<br>") + '</div>'
          + '<div class="cite" style="margin-top:.35em">' + esc(c.cite)
          + ' <span class="mark">' + esc(c.conf) + '</span></div>'
          + '<div class="cite" style="font-size:10.5px">found through '
          + esc(c.finding_aid) + ' · ' + esc(c.section) + '</div>'
          + '</div>';
      });
    });
    return h;
  }
  function draw() {
    var id = subj();
    var old = document.getElementById("rec-tg");
    if (old) old.remove();
    if (!id || !document.getElementById("main")) return;
    if (CACHE[id] === false) return;
    if (CACHE[id]) { put(id, CACHE[id]); return; }
    // A 404 IS AN ANSWER AND NOT A FAULT: 179 of the 960 published persons have no cleared
    // Tolkien Gateway claim at all, and the archive says nothing rather than saying nothing found.
    fetch(dbase() + "tg/" + encodeURIComponent(id) + ".json").then(function (r) {
      if (!r.ok) throw new Error(r.status);
      return r.json();
    }).then(function (j) {
      CACHE[id] = j;
      put(id, j);
    }, function () { CACHE[id] = false; });
  }
  // ── THE ANCHOR IS RESOLVED AT INSERT TIME AND NEVER HELD ACROSS A FETCH ──────────────────
  // THIS COST TWO FAILED RENDERS AND THE PROBE IS THE ONLY REASON IT IS KNOWN. The first two
  // writes captured `#bookspot` before the fetch and inserted against it afterwards -- and
  // character.html's own `addBooks` does `spot.outerHTML = html`, which REPLACES that element
  // with an unidentified `div.card`. The node this file was holding was detached from the
  // document by the time the shard arrived, so `parentNode` was null and the insert threw
  // inside a promise, silently. A DOM reference held across an await is a reference to a node
  // somebody else is allowed to destroy.
  function anchor() {
    var m = document.getElementById("main");
    if (!m) return null;
    // `#recspot` IS THE PERSON ROUTE'S DECLARED SLOT, and it is first because it is the only one
    // of the three that is in the STATIC html. character.html has neither, so this is inert
    // there. It sits above the route's colophon so the panel lands inside the record card rather
    // than after the line that closes it.
    return document.getElementById("recspot") || document.getElementById("bookspot")
        || m.querySelector(".orn") || null;
  }
  function put(id, j) {
    if (subj() !== id) return;
    if (!j || !(j.claims || []).length || document.getElementById("rec-tg")) return;
    var m = document.getElementById("main");
    if (!m) return;
    var d = document.createElement("div");
    d.id = "rec-tg";
    d.setAttribute("data-tg-of", id);
    d.innerHTML = panel(j, id);
    var a = anchor();
    if (a && a.parentNode) a.parentNode.insertBefore(d, a);
    else m.appendChild(d);
  }
  // ── WAIT FOR THE ANCHOR, DO NOT GUESS WHEN IT ARRIVES ───────────────────────────────────
  // THE FIRST WRITE OF THIS USED A 400ms TIMER AND RENDERED NOTHING, and the render probe is the
  // only reason that is known: `#bookspot` is created by character.html's own render(), which
  // runs inside the .then() of the genealogy fetch, so on a cold cache it does not exist when
  // this file loads OR 400ms later. A timer is a GUESS about somebody else's fetch. This waits
  // for the element instead, and gives up out loud rather than polling for ever.
  // A MUTATION OBSERVER AND NOT A TIMER. Two earlier writes of this rendered NOTHING and the
  // render probe is the only reason that is known -- a DOM dump with `rec-epi` present and
  // `rec-tg` absent. `#bookspot` is created by character.html's own render(), inside the .then()
  // of the genealogy fetch, so it does not exist when this file loads; and a `setTimeout` chain
  // waiting for it never produced the panel either. Waiting for the ELEMENT rather than for a
  // number of milliseconds is both correct and observable: it fires the instant the anchor
  // exists, and it disconnects itself the first time it succeeds.
  var obs = null;
  function arm() {
    if (document.getElementById("recspot") || document.getElementById("bookspot")
        || (document.getElementById("main")
        && document.getElementById("main").querySelector(".orn"))) { draw(); return true; }
    return false;
  }
  function watch() {
    if (arm()) return;
    if (obs) return;
    obs = new MutationObserver(function () { if (arm()) { obs.disconnect(); obs = null; } });
    obs.observe(document.documentElement, { childList: true, subtree: true });
  }
  addEventListener("hashchange", watch);
  if (document.readyState === "loading") addEventListener("DOMContentLoaded", watch);
  else watch();
})();
