/* codex-search.js — THE ONE MATCHER OVER arda_search.json.
 *
 * WHY IT IS A FILE AND NOT A SECOND COPY. The front-door box in index.html carries this logic
 * inline. Ruling C1035 (his, 20 August 2026) adds a full results page, and a page that searched
 * the same index by slightly different rules would be the fault CLAUDE.md §5 names about quote
 * matching -- "map/ardatext.py is the ONE quote matcher; do not write a second" -- applied to
 * search. So the rules live here once, and `index.html`'s inline copy is DECLARED, not ignored:
 * map/searchdrift_check.py fails if the two stop agreeing. A duplicate somebody has measured is a
 * decision; a duplicate nobody has measured is how two answers to one question get shipped.
 *
 * THE SEMANTICS ARE index.html's, UNCHANGED, so a later migration of the front door is a no-op:
 *   nrm      NFD, strip combining marks, lowercase. The corpus is MIXED-NORMALISATION -- a raw
 *            comparison of an accented name returns zero against the NFD half of it.
 *   score    0 title starts with the query · 1 title contains it · 2 subtitle contains it
 *   order    score ascending, then SHORTER TITLE FIRST (an exact short name beats a long one
 *            that merely contains it)
 *
 * AND IT DOES NOT CAP. That is the whole of C1035: he declined capping results at one leaf
 * because "a common name would silently lose most matches". The front-door dropdown slices 40
 * because a dropdown must; THIS returns everything and the page pages it.
 */
(function (root) {
  "use strict";

  var COMBINING = /[̀-ͯ]/g;

  function nrm(s) {
    return String(s == null ? "" : s).normalize("NFD").replace(COMBINING, "").toLowerCase();
  }

  /* One record -> [kind, title, subtitle, href, nrmTitle, nrmSubtitle].
     arda_search.json is a list of 4-tuples; the two normalised fields are computed ONCE at load
     rather than per keystroke, which is why prepare() exists at all. */
  function prepare(rows) {
    if (!Array.isArray(rows)) return [];
    return rows.map(function (e) { return [e[0], e[1], e[2], e[3], nrm(e[1]), nrm(e[2])]; });
  }

  function score(entry, q) {
    if (entry[4].startsWith(q)) return 0;
    if (entry[4].includes(q)) return 1;
    if (entry[5].includes(q)) return 2;
    return -1;
  }

  /* EVERY match, scored and ordered. No slice, no ceiling, no "and N more". */
  function search(prepared, query) {
    var q = nrm(String(query == null ? "" : query).trim());
    if (q.length < 2) return [];
    var hits = [];
    for (var i = 0; i < prepared.length; i++) {
      var sc = score(prepared[i], q);
      if (sc >= 0) hits.push([sc, prepared[i]]);
    }
    hits.sort(function (a, b) { return a[0] - b[0] || a[1][1].length - b[1][1].length; });
    return hits.map(function (h) { return h[1]; });
  }

  /* The archive's own sentence for a search that could not run, taken from canon.html and NOT
     reworded -- index.html's comment says exactly why: it "is the archive's own answer to exactly
     this case and should not be reworded into a second one". A failure to ask is not an answer
     about Arda, and the two must never read alike. */
  var FAILED_TO_ASK =
    "The search index could not be loaded, so nothing was searched. " +
    "<b>This is not an answer about Arda</b> — it is a failure to ask. " +
    "Every hall is still reachable from the menu above.";

  /* A search that RAN and found nothing is a different statement, and the archive makes it in its
     own voice: the corpus may be silent, or the spelling other. Ruling 4's third property is that
     a silence is visible; these two strings are how it stays visible here. */
  var FOUND_NOTHING =
    "The archive holds nothing by that name — the corpus may be silent, or the spelling other.";

  root.ArdaSearch = {
    nrm: nrm, prepare: prepare, score: score, search: search,
    FAILED_TO_ASK: FAILED_TO_ASK, FOUND_NOTHING: FOUND_NOTHING
  };
})(this);
