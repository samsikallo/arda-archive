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
  function esc(x) {
    return String(x == null ? "" : x).replace(/[&<>"]/g, function (c) {
      return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c];
    });
  }
  function panel(d) {
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
        h += '<div style="background:#fdfaf2;border:1px solid #b0a58e;border-radius:8px;'
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
    var id = (location.hash || "#aragorn").slice(1);
    var old = document.getElementById("rec-tg");
    if (old) old.remove();
    var spot = document.getElementById("bookspot");
    if (!spot || !id) return;
    if (CACHE[id] === false) return;
    if (CACHE[id]) { put(spot, CACHE[id]); return; }
    // A 404 IS AN ANSWER AND NOT A FAULT: 179 of the 960 published persons have no cleared
    // Tolkien Gateway claim at all, and the archive says nothing rather than saying nothing found.
    fetch("tg/" + encodeURIComponent(id) + ".json").then(function (r) {
      if (!r.ok) throw new Error(r.status);
      return r.json();
    }).then(function (j) {
      CACHE[id] = j;
      if ((location.hash || "#aragorn").slice(1) === id) put(spot, j);
    }, function () { CACHE[id] = false; });
  }
  function put(spot, j) {
    if (!j || !(j.claims || []).length || document.getElementById("rec-tg")) return;
    var d = document.createElement("div");
    d.id = "rec-tg";
    d.innerHTML = panel(j);
    spot.parentNode.insertBefore(d, spot);
  }
  addEventListener("hashchange", draw);
  if (document.readyState === "loading") addEventListener("DOMContentLoaded", draw);
  else draw();
  // The record is drawn by character.html's own render(), which runs after this file loads on a
  // cold cache; a second pass a beat later costs nothing and catches that ordering.
  setTimeout(draw, 400);
})();
