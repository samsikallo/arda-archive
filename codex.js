/* codex.js — the shared codex shell. Phase 2 of the owner's master brief.
   Reasoning lives in docs/codex-architecture.md and in the commits, NOT here: this file is
   fetched by all 621 routes and prose in it is paid for by every reader. */
(function () {
  "use strict";
  if (window.__ardaCodex) return;                 // idempotent: safe to call twice (§14.6)
  window.__ardaCodex = { version: 1 };

  var R = document.documentElement;
  if (R.getAttribute("data-codex") === "off") return;   // the escape hatch stays (§14.2)

  var PRE = (typeof window !== "undefined" && window.ARDA_BASE) || "";
  var here = location.pathname.split("/").pop() || "index.html";
  var nested = PRE !== "";
  var route = nested ? location.pathname.split("/").slice(-2).join("/") : here;
  var DEV = location.hostname === "127.0.0.1" || location.hostname === "localhost";

  function warn(m) { if (DEV && window.console) console.warn("[codex] " + m); }

  function el(tag, attrs, text) {
    var n = document.createElement(tag);
    if (attrs) for (var k in attrs) if (attrs[k] != null) n.setAttribute(k, attrs[k]);
    if (text != null) n.textContent = text;                 // textContent, never innerHTML (§14.8)
    return n;
  }

  /* The entry's own name comes from the DOM it is standing in, not from the index: shipping 582
     titles to every reader to label one page is the thing the small index exists to avoid. */
  function entryTitle() {
    var h = document.querySelector("main h1, article h1, #main h1, h1");
    var t = (h && h.textContent) || document.title || "";
    return t.replace(/\s*[—·|]\s*(the )?arda archive.*$/i, "").trim().slice(0, 90);
  }

  function boot(ix) {
    var meta = ix.routes[route] || ix.routes[here] || null;
    if (!meta && nested) {
      var fam = ix.families[route.split("/")[0] + "/"];
      if (fam) meta = { vol: fam.volume, part: fam.part, arch: fam.archetype, spread: fam.spread };
    }
    if (!meta) { warn("no metadata for " + route + " — neutral fallback shell"); meta = { arch: "folio" }; }

    R.setAttribute("data-archetype", meta.arch || "folio");
    if (meta.spread) R.setAttribute("data-spread", meta.spread);

    var vol = null, i;
    for (i = 0; i < ix.volumes.length; i++) if (ix.volumes[i].id === meta.vol) vol = ix.volumes[i];
    if (vol) R.setAttribute("data-volume", vol.id);

    var host = el("div", { id: "codex-shell", "data-v": "1" });

    /* 1. VOLUME THUMB INDEX. Canonical, global, and visually distinct from a personal bookmark —
          these are links with aria-current, not ribbons. */
    var vnav = el("nav", { "aria-label": "Archive volumes", id: "cx-vols" });
    var vlist = el("ul", null);
    for (i = 0; i < ix.volumes.length; i++) {
      var v = ix.volumes[i], li = el("li", null);
      /* The full volume name rides on aria-label, NOT in a visually-hidden span. A hidden span
         depends on CSS having arrived; when it had not, every tab rendered its full title and the
         row overflowed the viewport by 117px on 14 pages. An accessible name that cannot be
         widened by a missing stylesheet is simply better. */
      var a = el("a", { href: PRE + "index.html#vol-" + v.id, title: v.title,
                        "aria-label": "Volume " + v.id + " — " + v.title }, v.short);
      if (vol && v.id === vol.id) { a.setAttribute("aria-current", "true"); li.className = "on"; }
      li.appendChild(a); vlist.appendChild(li);
    }
    vnav.appendChild(vlist); host.appendChild(vnav);

    /* 2. BREADCRUMB — canonical position only. Cross-facets are marginalia, not ancestry (§4.7). */
    var bc = el("nav", { "aria-label": "Breadcrumb", id: "cx-crumb" });
    var ol = el("ol", null);
    var c1 = el("li", null); c1.appendChild(el("a", { href: PRE + "index.html" }, "The Archive"));
    ol.appendChild(c1);
    if (vol) {
      var c2 = el("li", null);
      c2.appendChild(el("a", { href: PRE + "index.html#vol-" + vol.id }, vol.title));
      ol.appendChild(c2);
    }
    if (meta.part) ol.appendChild(el("li", null, meta.part));
    var t = entryTitle();
    /* The entrance is already the first crumb; repeating it reads as a broken trail. */
    var dup = !t || t === meta.part || /^the arda archive$|^the archive$/i.test(t);
    if (!dup) ol.appendChild(el("li", { "aria-current": "page" }, t));
    bc.appendChild(ol); host.appendChild(bc);

    /* 3. RUNNING HEAD — compact orientation, never the only navigation. */
    if (vol) {
      var rh = el("div", { id: "cx-run", "aria-hidden": "true" });
      rh.appendChild(el("span", { class: "cx-rv" }, "Volume " + vol.id));
      rh.appendChild(el("span", { class: "cx-rp" }, meta.part || vol.title));
      host.appendChild(rh);
    }

    /* 4. FOLIO NAVIGATION — only where the manifest declares a real sequence, and always with the
          destination NAMED. An arrow that promises a sequence which does not exist is a lie. */
    if (meta.prev || meta.next) {
      var fn = el("nav", { "aria-label": "Folio navigation", id: "cx-folio" });
      if (meta.prev) {
        var pa = el("a", { href: PRE + meta.prev, rel: "prev" });
        pa.appendChild(el("span", { class: "cx-dir" }, "Previous"));
        pa.appendChild(el("span", { class: "cx-dest" }, (ix.routes[meta.prev] || {}).part || meta.prev));
        fn.appendChild(pa);
      }
      if (vol) {
        var ua = el("a", { href: PRE + "index.html#vol-" + vol.id, class: "cx-up" });
        ua.appendChild(el("span", { class: "cx-dir" }, "Up"));
        ua.appendChild(el("span", { class: "cx-dest" }, vol.title));
        fn.appendChild(ua);
      }
      if (meta.next) {
        var na = el("a", { href: PRE + meta.next, rel: "next" });
        na.appendChild(el("span", { class: "cx-dir" }, "Next"));
        na.appendChild(el("span", { class: "cx-dest" }, (ix.routes[meta.next] || {}).part || meta.next));
        fn.appendChild(na);
      }
      host.appendChild(fn);
    }

    /* ---- 5. CONTENTS LAYER, 6. READER RIBBON, and the JOURNAL (§7.2, Phase 3) ------------
       All three are clients of the ONE state machine in codex_state.js: opening any of them
       closes the others, Escape returns focus to the trigger, and a bfcache restore closes
       them. Personal bookmarks are deliberately a DIFFERENT SHAPE and a different word from the
       canonical volume tabs -- §7.4 warns those must never be confused. */
    var S = window.ardaState, L = window.ardaLayers;
    if (S && L) {
      var bar = el("div", { id: "cx-bar" });
      var title = entryTitle();

      var tocBtn = el("button", { type: "button", id: "cx-toc-b" }, "Contents");
      var toc = el("div", { id: "cx-toc", role: "group", "aria-label": "Chapter contents" });
      var tl = el("ul", null);
      for (i = 0; i < ix.volumes.length; i++) {
        var vv = ix.volumes[i], tli = el("li", null);
        var ta = el("a", { href: PRE + "index.html#vol-" + vv.id }, vv.title);
        if (vol && vv.id === vol.id) ta.setAttribute("aria-current", "true");
        tli.appendChild(ta);
        tli.appendChild(el("span", { class: "cx-th" }, vv.thesis));
        tl.appendChild(tli);
      }
      toc.appendChild(tl);

      var markBtn = el("button", { type: "button", id: "cx-mark-b" });
      function paintMark() {
        var on = S.isMarked(route);
        markBtn.textContent = on ? "Bookmarked" : "Bookmark this entry";
        markBtn.setAttribute("aria-pressed", on ? "true" : "false");
      }
      paintMark();
      markBtn.addEventListener("click", function () {
        var r = S.toggleMark(route, title);
        if (!r.ok) { markBtn.textContent = "Bookmarks unavailable"; markBtn.disabled = true; return; }
        paintMark(); fillJournal();
      });

      var jrnBtn = el("button", { type: "button", id: "cx-jrn-b" }, "Reader's Journal");
      var jrn = el("div", { id: "cx-jrn", role: "group", "aria-label": "Reader's Journal" });
      function fillJournal() {
        jrn.textContent = "";
        var s = S.get();
        function section(label, list, empty) {
          jrn.appendChild(el("h3", null, label));
          if (!list.length) { jrn.appendChild(el("p", { class: "cx-empty" }, empty)); return; }
          var ul = el("ul", null), k;
          for (k = 0; k < list.length && k < 12; k++) {
            var li2 = el("li", null);
            li2.appendChild(el("a", { href: PRE + list[k].route }, list[k].title || list[k].route));
            ul.appendChild(li2);
          }
          jrn.appendChild(ul);
        }
        section("Bookmarks", s.bookmarks, "No bookmarks yet.");
        section("Recent folios", s.recents, "No recent folios yet.");
        var clr = el("button", { type: "button", class: "cx-clear" }, "Clear all reader state");
        clr.addEventListener("click", function () { S.reset(); paintMark(); fillJournal(); });
        jrn.appendChild(clr);
      }
      fillJournal();

      bar.appendChild(tocBtn); bar.appendChild(markBtn); bar.appendChild(jrnBtn);
      host.appendChild(bar); host.appendChild(toc); host.appendChild(jrn);
      L.register("contents", toc, tocBtn);
      L.register("journal", jrn, jrnBtn);
      tocBtn.addEventListener("click", function () { L.open("contents"); });
      jrnBtn.addEventListener("click", function () { L.open("journal"); });

      if (meta.vol) S.noteVisit(route, title);   /* a VISIT, never a completion (§11) */
    }

    document.body.appendChild(host);
    R.setAttribute("data-codex-shell", "on");
  }

  function start() {
    if (!document.body) { addEventListener("DOMContentLoaded", start); return; }
    fetch(PRE + "arda_codex_shell.json", { cache: "force-cache" })
      .then(function (r) { if (!r.ok) throw new Error("HTTP " + r.status); return r.json(); })
      .then(boot)
      .catch(function (e) {
        /* Primary content and ordinary links are untouched: the page simply keeps its own layout
           inside a neutral fallback. A shell that cannot load must not take the archive with it. */
        warn("shell index unavailable (" + e.message + ") — page left in its own layout");
      });
  }
  start();
})();
