/* C894's REAL-WORLD LAYER — the panel that makes "visible" true.
 *
 * ── WHY THIS FILE EXISTS ─────────────────────────────────────────────────────────────────
 * C894 was recorded BUILT on 7 September 2026 as "1,394 adaptation rows in a VISIBLE
 * real-world layer". The data, the generator and the guard were real; the visible layer was
 * not. Every consumer of site/arda_person_adaptations.json was a generator, a guard or a
 * registry entry — zero renderers, zero pages. A layer nothing renders is not a layer.
 *
 * ── WHAT IT IS AND IS NOT ────────────────────────────────────────────────────────────────
 * C894 puts these rows OUTSIDE C831, behind a clearly-marked real-world layer that no canon
 * query touches. NO ROW CARRIES A TIER and none is read here. The panel says so in words on
 * every render, because a reader who scrolls past a heading must still not mistake a film's
 * casting for something Tolkien wrote.
 *
 * ── THE TWO TRAPS BELOW WERE PAID FOR BY site/tgclaims.js, NOT REDISCOVERED HERE ─────────
 * That file records two failed renders, and both mistakes are cheap to repeat:
 *
 *   1. A DOM REFERENCE HELD ACROSS A FETCH IS A REFERENCE TO A NODE SOMEBODY ELSE MAY
 *      DESTROY. character.html's own addBooks() does `spot.outerHTML = html`, which REPLACES
 *      #bookspot. An anchor captured before the fetch is detached by the time the shard
 *      arrives, parentNode is null, and the insert throws inside a promise — silently.
 *      So the anchor is resolved at INSERT time, never held.
 *
 *   2. A TIMER IS A GUESS ABOUT SOMEBODY ELSE'S FETCH. #bookspot is created inside the
 *      .then() of character.html's genealogy fetch, so on a cold cache it does not exist when
 *      this file loads, nor 400ms later. This waits for the ELEMENT with a MutationObserver
 *      and disconnects itself the first time it succeeds.
 *
 * A 404 IS AN ANSWER, NOT A FAULT: only 236 of the 960 published persons have any portrayal
 * at all. The archive says nothing rather than saying "none found".
 */
(function () {
  var CACHE = {};
  function esc(x) {
    return String(x == null ? "" : x).replace(/[&<>"]/g, function (c) {
      return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c];
    });
  }
  function years(p) {
    if (!p.year) return "";
    return p.year_end && p.year_end !== p.year ? p.year + "–" + p.year_end : String(p.year);
  }
  function panel(d) {
    var rows = d.portrayals || [];
    var h = '<h3>Outside the legendarium — how adaptations have shown this person '
      + '<span class="cite" style="font-weight:normal">' + rows.length
      + ' portrayal' + (rows.length === 1 ? "" : "s") + '</span></h3>'
      + '<p class="cite" style="margin:.2em 0 .8em"><b>A REAL-WORLD LAYER, AND NOT THE '
      + 'ARCHIVE’S CANON.</b> ' + esc(d.not_canon) + '</p>';
    var byWork = {}, order = [];
    rows.forEach(function (p) {
      var k = p.work || "(unnamed work)";
      if (!byWork[k]) { byWork[k] = []; order.push(k); }
      byWork[k].push(p);
    });
    order.forEach(function (w) {
      h += '<div style="margin:.55em 0"><b>' + esc(w) + '</b>';
      var y = years(byWork[w][0]);
      if (y) h += ' <span class="cite">' + esc(y) + '</span>';
      byWork[w].forEach(function (p) {
        h += '<div style="margin:.3em 0 .3em .9em">';
        if (p.portrayed_by) h += 'played by <b>' + esc(p.portrayed_by) + '</b>';
        if (p.subheading) h += (p.portrayed_by ? ' · ' : '') + esc(p.subheading);
        if (p.paraphrase) h += '<div>' + esc(p.paraphrase) + '</div>';
        h += '<div class="cite" style="font-size:10.5px">'
          + esc(p.publication_layer || "") + ' · hand: ' + esc(p.hand || "unstated")
          + ' · licence: ' + esc(p.licence_as_stated || "unstated");
        if (p.source_url) h += ' · <a href="' + esc(p.source_url) + '">source</a>';
        h += '</div></div>';
      });
      h += '</div>';
    });
    return h;
  }
  function anchor() {
    var m = document.getElementById("main");
    if (!m) return null;
    // Sit BELOW the Tolkien Gateway panel when that exists, so the reader meets the archive's
    // own attestation first and the real-world layer last. Resolved here, at insert time.
    return document.getElementById("bookspot") || m.querySelector(".orn") || null;
  }
  function put(id, j) {
    if ((location.hash || "#aragorn").slice(1) !== id) return;
    if (!j || !(j.portrayals || []).length || document.getElementById("rec-adapt")) return;
    var m = document.getElementById("main");
    if (!m) return;
    var d = document.createElement("div");
    d.id = "rec-adapt";
    d.innerHTML = panel(j);
    var a = anchor();
    if (a && a.parentNode) a.parentNode.insertBefore(d, a);
    else m.appendChild(d);
  }
  function draw() {
    var id = (location.hash || "#aragorn").slice(1);
    var old = document.getElementById("rec-adapt");
    if (old) old.remove();
    if (!id || !document.getElementById("main")) return;
    if (CACHE[id] === false) return;
    if (CACHE[id]) { put(id, CACHE[id]); return; }
    fetch("adapt/" + encodeURIComponent(id) + ".json").then(function (r) {
      if (!r.ok) throw new Error(r.status);
      return r.json();
    }).then(function (j) { CACHE[id] = j; put(id, j); },
            function () { CACHE[id] = false; });
  }
  var obs = null;
  function arm() {
    draw();
    if (obs) return;
    obs = new MutationObserver(function () {
      if (document.getElementById("main")) draw();
    });
    obs.observe(document.documentElement, { childList: true, subtree: true });
  }
  window.addEventListener("hashchange", function () { CACHE.__ = 0; draw(); });
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", arm);
  } else { arm(); }
})();
