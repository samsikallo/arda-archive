/* A HALL OPENS FLAT — C37, the owner's ruling of 19 August 2026.
 *
 * WHY THE MOVE HAPPENS HERE AND NOT IN THE GENERATOR. map/gen_codex_route.py owns three marked
 * regions per route and PROVES every other byte unchanged — it strips its own regions out of its
 * own output and compares the remainder to the input, and refuses on a single byte of difference.
 * Splicing a hall's `.wrap` into the leaf at build time would break that proof on 31 pages at once.
 * `gen_writing_page.py` is this archive's recorded cost of a tool that writes a file it does not
 * wholly build: 33,144 bytes to 13,576, silently, with a success message.
 *
 * SO THE LEAF SHIPS AN EMPTY SLOT AND THE PAGE'S OWN CONTENT IS MOVED INTO IT — the same DOM node,
 * not a copy. Every control the hall shipped with keeps working because it IS the control: its
 * listeners, its ids and any script holding a reference to it all survive a move. Cloning would
 * break every one of them, silently, which is why this uses appendChild and never innerHTML.
 *
 * AND WITH NO JAVASCRIPT THE HALL IS EXACTLY THE PAGE IT WAS. That is the fallback, and it is why
 * the slot is empty rather than the content being duplicated into it.
 */
(function () {
  "use strict";
  var R = document.documentElement;
  if (R.getAttribute("data-codex-object") !== "on") return;
  var slot = document.querySelector(".book .hall-slot[data-hall-slot]");
  if (!slot) return;                       /* not a flat leaf: the 582 entity routes stop here */
  if (slot.firstElementChild) return;      /* already filled — never move twice */

  /* WHAT COUNTS AS THE HALL'S OWN CONTENT, in the order the archive actually uses.
     `.wrap` is the house container on every generated hall. `main` is the fallback for anything
     that predates it. The book itself is excluded explicitly: moving the book into its own leaf
     would be an infinite regress, and `contains` is the only test that catches it. */
  var book = document.querySelector(".book");
  var body = document.body;
  var take = [];
  var i, kids = body.children;
  for (i = 0; i < kids.length; i++) {
    var el = kids[i];
    if (el === book || el.contains(book)) continue;
    if (el.tagName === "SCRIPT" || el.tagName === "STYLE" || el.tagName === "LINK") continue;
    if (el.classList.contains("hd") || el.id === "ardanav") continue;   /* site chrome stays */
    if (el.classList.contains("a-skip")) continue;                       /* the skip link stays */
    if (el.id === "lb") continue;                                        /* the lightbox overlay */
    if (el.classList.contains("wrap") || el.tagName === "MAIN" || el.classList.contains("card")) take.push(el);
  }
  if (!take.length) return;

  /* THE SKIP LINK MUST STILL LAND SOMEWHERE REAL. `id="main"` usually rides on the element being
     moved; after the move it would sit inside the leaf, which is correct — but if the book has
     claimed it, the moved element must not carry a duplicate. Checked rather than assumed. */
  for (i = 0; i < take.length; i++) {
    if (take[i].id === "main" && book && book.id === "main") take[i].removeAttribute("id");
    slot.appendChild(take[i]);
  }
  /* THE SITE HEADER GOES ABOVE THE BOOK, WHICH IS WHERE compare.html PUTS IT and where a reader
     expects the way out to be. The codex body is spliced immediately after the skip link, and a
     hall carries its own `#hdr` AFTER that point -- so on a hall the book landed above the header
     and a `position:sticky; top:0` header stuck to the bottom of the book instead of the top of
     the window. Measured, not guessed: #hdr at y=915 with the book ending at 860.
     REORDERED HERE RATHER THAN BY MOVING THE SPLICE ANCHOR, because the anchor is the same on all
     622 routes and 582 of them have no header to be above. One shape must not be bent to fit the
     other; this is the one place that knows it is a hall. */
  var hdr = document.getElementById("hdr");
  if (hdr && book && hdr.compareDocumentPosition(book) & Node.DOCUMENT_POSITION_PRECEDING) {
    body.insertBefore(hdr, book);
  }

  R.setAttribute("data-hall-flat", "1");   /* so a guard, and the CSS, can see the move happened */
})();
