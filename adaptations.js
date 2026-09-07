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
 *
 * ── THE THIRD TRAP, MEASURED 7 SEPTEMBER 2026: THE COMPOSITOR TAKES THE PANEL APART ──────
 * map/reallayer_check.py failed 1 run in 5 on an unchanged tree, reporting one #rec-adapt
 * element whose whole innerHTML was `<div style="margin:.55em 0"> </div>` -- 35 bytes of
 * markup this builder cannot produce. It was recorded as UNEXPLAINED in map/gategap_check.py.
 * It is explained now, by instrumenting the page rather than reasoning about it:
 *
 *     473ms  n=1  shells_with_marker=1  paginated=true
 *            len=35  marked=false  parent=DIV.wrap#main
 *            html='<div style="margin:.55em 0"> </div>'
 *
 * codex-hall.js paginates this hall. Its atomise() OPENS any container three or fewer levels
 * down with three or more children -- which #rec-adapt is -- and place() moves the children
 * out into a SHALLOW CLONE of the container that deliberately carries no id. The `<h3>` and
 * the "A REAL-WORLD LAYER" paragraph went into that id-less `[data-cx-split]` shell (hence
 * shells_with_marker=1); the element still answering to `document.getElementById("rec-adapt")`
 * was the emptied husk left behind, holding one whitespace-only work div.
 *
 * SO THE MARKING WAS NEVER MISSING -- IT WAS DETACHED FROM THE ID, AND FROM THE ROWS. That is
 * a reader harm and not only a guard harm: a panel split across two leaves puts portrayals on
 * the second leaf with the marking left behind on the first.
 *
 * ── THE MARKING IS NOW STRUCTURAL, NOT TIMED ─────────────────────────────────────────────
 * Three things together, and each is an invariant rather than a hope:
 *
 *   1. #rec-adapt IS THE MARKING. It holds the heading and the real-world paragraph and
 *      NOTHING ELSE, and it carries `data-cx-atom` -- codex-hall.js's opt-in declaration
 *      that a container is one piece and may not be opened. It is short by construction, so
 *      declaring it indivisible costs no leaf. The portrayals live in a sibling
 *      #rec-adapt-rows which the compositor may split as freely as it likes.
 *   2. EVERY ROW CARRIES THE MARKING ITSELF and is ALSO a declared atom. A row is the
 *      smallest thing a leaf can hold, so no leaf anywhere in the book can show a portrayal
 *      without "REAL-WORLD LAYER" printed on it. Whole-panel `data-cx-atom` was rejected on
 *      a measurement, not a preference: gandalf.json has 40 portrayals and one undividable
 *      panel that tall overflows its leaf and CLIPS rows away from the reader.
 *   3. put() REFUSES TO INSERT AN UNMARKED PANEL. marked() re-reads the built nodes' own
 *      textContent -- the head, and every row -- and returns without inserting if the wording
 *      is absent anywhere. An unmarked panel is not merely unlikely; it cannot be attached.
 *
 * ── AND THE SAME FINDING WEARING A SECOND FACE: REMOVING A CONTAINER REMOVES NOTHING ─────
 * draw() used to clear the old panel by removing #rec-adapt by id. Once codex-hall.js has
 * moved the panel's children into leaves, that container is a husk and removing it removes
 * nothing a reader can see. It went unnoticed for as long as the guard only asked whether the
 * id existed; the first run that COUNTED ROWS said so in one line:
 *
 *     ARM B FAILED -- adalbert has NO shard and 1 adaptation row(s) rendered anyway
 *
 * That row was the PREVIOUS person's, surviving a hashchange -- the six subjects of
 * map/reallayer_check.py differ only by fragment, so they are one document, and so is a
 * reader clicking from one kinsman to the next. A stale portrayal under the wrong name is a
 * worse failure than an unmarked one.
 *
 * SO THE PANEL OWNS ITS NODES BY STAMP AND NEVER BY CONTAINER. Every node this file creates
 * carries data-adapt-of="<person>", and wipe() removes every one of them wherever in the
 * document they have ended up -- inside a leaf, inside a [data-cx-split] shell, anywhere. A
 * container can be emptied behind your back; an attribute travels with the node.
 */
(function () {
  var CACHE = {};
  /* THE ONE STRING. map/reallayer_check.py demands it in the DOM, the observer below heals on
     its absence, and marked() refuses an insert without it -- so it is written ONCE and every
     reader of it is this constant. A literal repeated in four places is a literal that goes
     stale in three of them. */
  var MARK = "REAL-WORLD LAYER";
  /* A REFUSAL IS FINAL FOR THAT PERSON, AND THIS LATCH IS WHY. Found by the break-test of the
     marking invariant below: with put() refusing, #rec-adapt never appears, the observer's
     "!e" arm fires on every mutation, draw() runs again, put() refuses again -- a redraw loop
     that is not infinite only because each turn does a little work. It starved site/tgclaims.js
     badly enough that #rec-tg failed to render at all on two of three subjects, so the refusal
     path was breaking a NEIGHBOURING panel while correctly refusing its own. That is the same
     shape as this file's first draft, which pinned the main thread outright. A refusal is a
     verdict about the DATA, and data does not change between two mutations of the DOM. */
  var REFUSED = {};
  function esc(x) {
    return String(x == null ? "" : x).replace(/[&<>"]/g, function (c) {
      return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c];
    });
  }
  function years(p) {
    if (!p.year) return "";
    return p.year_end && p.year_end !== p.year ? p.year + "–" + p.year_end : String(p.year);
  }
  /* THE HEAD IS THE MARKING AND CARRIES NOTHING ELSE. Two children, a few lines tall, and
     `data-cx-atom` so codex-hall.js may never open it. This is the node that answers to
     `#rec-adapt`, so the id and the wording can no longer be separated by anything. */
  function headNode(d) {
    var n = document.createElement("div");
    n.id = "rec-adapt";
    n.setAttribute("data-cx-atom", "");
    n.innerHTML = '<h3>Outside the legendarium \u2014 how adaptations have shown this person '
      + '<span class="cite" style="font-weight:normal">' + (d.portrayals || []).length
      + ' portrayal' + ((d.portrayals || []).length === 1 ? "" : "s") + '</span></h3>'
      + '<p class="cite" style="margin:.2em 0 .8em"><b>A ' + MARK + ', AND NOT THE '
      + 'ARCHIVE\u2019S CANON.</b> ' + esc(d.not_canon) + '</p>';
    return n;
  }
  /* ONE ROW, AND IT SAYS WHAT IT IS. `data-adapt-row` is what map/reallayer_check.py counts
     against the shard, and `data-cx-atom` makes the row the smallest piece the compositor can
     move -- so the marking on its cite line travels to whatever leaf the row lands on. The
     marking is set into the line that was already there rather than added as a new banner: a
     reader gets one more word, not twenty-five more repetitions of a paragraph. */
  function row(p) {
    var h = '<div class="adapt-row" data-adapt-row data-cx-atom '
      + 'style="margin:.3em 0 .3em .9em">';
    if (p.portrayed_by) h += 'played by <b>' + esc(p.portrayed_by) + '</b>';
    if (p.subheading) h += (p.portrayed_by ? ' \u00b7 ' : '') + esc(p.subheading);
    if (p.paraphrase) h += '<div>' + esc(p.paraphrase) + '</div>';
    h += '<div class="cite" style="font-size:10.5px"><b>' + MARK + '</b> \u00b7 '
      + esc(p.publication_layer || "") + ' \u00b7 hand: ' + esc(p.hand || "unstated")
      + ' \u00b7 licence: ' + esc(p.licence_as_stated || "unstated");
    if (p.source_url) h += ' \u00b7 <a href="' + esc(p.source_url) + '">source</a>';
    h += '</div></div>';
    return h;
  }
  /* THE ROWS, GROUPED BY WORK. This container is NOT a declared atom and is meant to be split:
     a 40-portrayal panel held together as one piece overflows its leaf and clips rows out of
     the reader’s sight, which is a worse harm than the one being fixed. */
  function rowsNode(d) {
    var byWork = {}, order = [], h = "";
    (d.portrayals || []).forEach(function (p) {
      var k = p.work || "(unnamed work)";
      if (!byWork[k]) { byWork[k] = []; order.push(k); }
      byWork[k].push(p);
    });
    order.forEach(function (w) {
      h += '<div class="adapt-work" style="margin:.55em 0"><b>' + esc(w) + '</b>';
      var y = years(byWork[w][0]);
      if (y) h += ' <span class="cite">' + esc(y) + '</span>';
      byWork[w].forEach(function (p) { h += row(p); });
      h += '</div>';
    });
    var n = document.createElement("div");
    n.id = "rec-adapt-rows";
    n.innerHTML = h;
    return n;
  }
  /* THE STAMP IS THE OWNERSHIP RECORD. It goes on the head, the rows block, every work group
     and every row, so no piece of this panel is identifiable only by the container it started
     in. The value is the person, so a stray from another person is recognisable as one. */
  function stamp(n, id) {
    n.setAttribute("data-adapt-of", id);
    var k = n.querySelectorAll("[data-adapt-row], .adapt-work"), i;
    for (i = 0; i < k.length; i++) k[i].setAttribute("data-adapt-of", id);
    return n;
  }
  /* AND THE SWEEP IS BY STAMP. Never by id, never by container: see the second finding in the
     header. Backwards, because the list is live-ish and removing a parent removes children. */
  function wipe() {
    var n = document.querySelectorAll("[data-adapt-of]"), i;
    for (i = n.length - 1; i >= 0; i--) if (n[i].parentNode) n[i].parentNode.removeChild(n[i]);
  }
  /* IS THERE ADAPTATION MATTER ON THE PAGE BELONGING TO SOMEBODY ELSE? Asked by attribute
     value rather than by a CSS selector built from a slug, which would need escaping. */
  function stray(id) {
    var n = document.querySelectorAll("[data-adapt-of]"), i;
    for (i = 0; i < n.length; i++) if (n[i].getAttribute("data-adapt-of") !== id) return true;
    return false;
  }
  /* THE INVARIANT, ASSERTED ON THE BUILT NODES AND NOT ON THE STRINGS THAT MADE THEM. It reads
     textContent -- the same property the guard and the reader read -- so an escaping change, a
     template slip or a future edit that drops the wording cannot get past it. */
  function marked(n) {
    if (!n || n.textContent.indexOf(MARK) === -1) return false;
    var r = n.querySelectorAll("[data-adapt-row]"), i;
    for (i = 0; i < r.length; i++) if (r[i].textContent.indexOf(MARK) === -1) return false;
    return true;
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
    var head = stamp(headNode(j), id), rows = stamp(rowsNode(j), id);
    // AN UNMARKED PANEL IS NOT INSERTED AT ALL. Saying nothing is an answer; saying a film's
    // casting without saying it is a film's casting is not.
    if (!marked(head) || !marked(rows)) {
      try {
        console.error("adaptations.js: REFUSED to insert an unmarked real-world panel for "
                      + id + " -- " + MARK + " absent from the head or from a row.");
      } catch (e) {}
      REFUSED[id] = true;
      return;
    }
    var a = anchor();
    if (a && a.parentNode) { a.parentNode.insertBefore(head, a); a.parentNode.insertBefore(rows, a); }
    else { m.appendChild(head); m.appendChild(rows); }
  }
  function draw() {
    var id = (location.hash || "#aragorn").slice(1);
    // BY STAMP, NOT BY CONTAINER. Removing #rec-adapt and #rec-adapt-rows by id left the
    // PREVIOUS person's rows on the page, because the compositor had already moved them out
    // of both. wipe() takes every stamped node wherever it now lives.
    wipe();
    if (!id || !document.getElementById("main")) return;
    if (CACHE[id] === false || REFUSED[id]) return;
    if (CACHE[id]) { put(id, CACHE[id]); return; }
    fetch("adapt/" + encodeURIComponent(id) + ".json").then(function (r) {
      if (!r.ok) throw new Error(r.status);
      return r.json();
    }).then(function (j) { CACHE[id] = j; put(id, j); },
            function () { CACHE[id] = false; });
  }
  // ── THE OBSERVER MUST DISCONNECT, AND MY FIRST WRITE DID NOT ────────────────────────────
  // That draft called draw() from the observer callback on every mutation. draw() REMOVES and
  // re-inserts #rec-adapt, which mutates the very subtree being observed, which fires the
  // callback again: an infinite loop that pinned the page's main thread. It did not merely
  // fail to render -- it would have HUNG character.html for a reader.
  //
  // It was caught by map/reallayer_check.py, which hung at `pg.evaluate` with the DOM present
  // and the page committed: evaluate cannot run while the main thread spins. A static check
  // could never have seen it, which is the whole argument for a guard that drives the page.
  //
  // The shape below is tgclaims.js's, copied deliberately rather than reinvented: arm() draws
  // ONLY when the anchor already exists and reports whether it did; the observer is installed
  // only if that first attempt failed, and DISCONNECTS ITSELF the moment it succeeds.
  var obs = null;
  function arm() {
    if (document.getElementById("bookspot") || (document.getElementById("main")
        && document.getElementById("main").querySelector(".orn"))) { draw(); return true; }
    return false;
  }
  // ── AND IT MUST SURVIVE BEING WIPED, WHICH DISCONNECTING DOES NOT ───────────────────────
  // Measured: with a disconnect-on-first-success observer, map/reallayer_check.py passed 2 of
  // 3 identical runs on an unchanged tree. The panel is not unreliable in itself -- driven
  // standalone it renders every time -- but character.html re-renders #main from inside its
  // own fetch, and when that lands AFTER our insert it takes the panel with it. A one-shot
  // observer has already disconnected by then and never puts it back.
  //
  // So the observer STAYS CONNECTED and the callback acts only when #rec-adapt is ABSENT and
  // the anchor is present. That cannot loop: inserting makes #rec-adapt exist, so the very
  // next callback does nothing. The earlier infinite loop came from redrawing unconditionally
  // -- remove-then-insert on every mutation, each of which is itself a mutation.
  //
  // A flaky guard is worse than no guard: it teaches a session to discount a red.
  function watch() {
    if (arm()) return;
    if (obs) return;
    // ── SELF-HEAL, BECAUSE THE FAULT IS A RACE AND NOT A BUILDER BUG ──────────────────────
    // MEASURED by instrumenting put(): on every run the panel is built at 823 bytes, innerHTML
    // holds 823 immediately after assignment, and 823 is still there at insertion -- yet seconds
    // later the DOM sometimes holds only 35 bytes. No add/remove of #rec-adapt accompanies that,
    // and merely installing a MutationObserver over the document made it render fully every
    // time: observing it changes it, which is the signature of a race and not of a builder that
    // produces bad markup.
    //
    // So the callback now also fires when the panel is PRESENT BUT HAS LOST ITS MARKER. That
    // terminates: after a redraw the marker is there, so the next callback does nothing. It does
    // NOT paper over the race -- map/reallayer_check.py still measures whether a reader gets the
    // marked panel, and it stays out of the gate until it is 4 of 4.
    obs = new MutationObserver(function () {
      var id = (location.hash || "#aragorn").slice(1);
      var e = document.getElementById("rec-adapt");
      // A STRAY IS A THIRD REASON TO REDRAW, and it terminates like the other two: draw()
      // wipes every stamped node first, so the next callback finds none belonging to anyone
      // else. Without this arm, matter left behind by a compositor move that happens AFTER
      // the hashchange would sit under the wrong person until the next navigation.
      if (stray(id) || !e || e.textContent.indexOf(MARK) === -1) arm();
    });
    obs.observe(document.documentElement, { childList: true, subtree: true });
  }
  addEventListener("hashchange", watch);
  if (document.readyState === "loading") addEventListener("DOMContentLoaded", watch);
  else watch();
})();
