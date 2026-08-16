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
      if (fam) meta = { v: fam.volume, p: fam.part, a: fam.archetype, s: fam.spread };
    }
    if (!meta) { warn("no metadata for " + route + " — neutral fallback shell"); meta = { a: "folio" }; }

    R.setAttribute("data-archetype", meta.a || "folio");
    if (meta.s) R.setAttribute("data-spread", meta.s);

    var vol = null, i;
    for (i = 0; i < ix.volumes.length; i++) if (ix.volumes[i].id === meta.v) vol = ix.volumes[i];
    if (vol) R.setAttribute("data-volume", vol.id);

    var host = el("div", { id: "codex-shell", "data-v": "1" });

    /* 1. VOLUME THUMB INDEX. Canonical, global, and visually distinct from a personal bookmark —
          these are links with aria-current, not ribbons. */
    var vnav = el("nav", { "aria-label": "Archive volumes", id: "cx-vols" });
    var vlist = el("ul", null);
    for (i = 0; i < ix.volumes.length; i++) {
      var v = ix.volumes[i], li = el("li", null);
      var a = el("a", { href: PRE + "index.html#vol-" + v.id, title: v.title }, v.short);
      if (vol && v.id === vol.id) { a.setAttribute("aria-current", "true"); li.className = "on"; }
      a.appendChild(el("span", { class: "cx-sr" }, " — " + v.title));
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
    if (meta.p) ol.appendChild(el("li", null, meta.p));
    var t = entryTitle();
    /* The entrance is already the first crumb; repeating it reads as a broken trail. */
    var dup = !t || t === meta.p || /^the arda archive$|^the archive$/i.test(t);
    if (!dup) ol.appendChild(el("li", { "aria-current": "page" }, t));
    bc.appendChild(ol); host.appendChild(bc);

    /* 3. RUNNING HEAD — compact orientation, never the only navigation. */
    if (vol) {
      var rh = el("div", { id: "cx-run", "aria-hidden": "true" });
      rh.appendChild(el("span", { class: "cx-rv" }, "Volume " + vol.id));
      rh.appendChild(el("span", { class: "cx-rp" }, meta.p || vol.title));
      host.appendChild(rh);
    }

    /* 4. FOLIO NAVIGATION — only where the manifest declares a real sequence, and always with the
          destination NAMED. An arrow that promises a sequence which does not exist is a lie. */
    if (meta.prev || meta.next) {
      var fn = el("nav", { "aria-label": "Folio navigation", id: "cx-folio" });
      if (meta.prev) {
        var pa = el("a", { href: PRE + meta.prev, rel: "prev" });
        pa.appendChild(el("span", { class: "cx-dir" }, "Previous"));
        pa.appendChild(el("span", { class: "cx-dest" }, (ix.routes[meta.prev] || {}).p || meta.prev));
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
        na.appendChild(el("span", { class: "cx-dest" }, (ix.routes[meta.next] || {}).p || meta.next));
        fn.appendChild(na);
      }
      host.appendChild(fn);
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
