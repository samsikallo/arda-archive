// Arda Archive service worker v2 — content-hashed version; shell precached; stale-while-revalidate runtime.
const V="arda-1936e57f2d";
const SHELL=["404.html", "_typeface_specimen.html", "ainur.html", "annals.html", "arda.css", "arda_icons.js", "arda_timeline.html", "armies_dashboard.html", "artifacts.html", "baynes.html", "canon.html", "character.html", "codex-backdrops.css", "codex-deeplink.js", "codex-flip.css", "codex-flip.js", "codex-hall.js", "codex-hands.js", "codex-object.css", "codex-proto.html", "codex-thumbs.js", "codex-turn.js", "codex.css", "codex.js", "codex_state.js", "colophon.html", "compare.html", "corpus.html", "cosmology.html", "errata.html", "gallery.html", "gazetteer.html", "genealogy.html", "glossary.js", "gondolin.html", "heraldry.html", "heraldry.js", "index.html", "languages.html", "living.html", "names.html", "nav.js", "oaths.html", "place.html", "plates.html", "poems.html", "population_dashboard.html", "portraits.js", "quiz.html", "quotes.js", "realms.html", "reckoning.html", "sheets.html", "silences.html", "speak.js", "theindex.html", "touch.js", "tours.html", "volume-i.html", "volume-ii.html", "volume-iii.html", "volume-iv.html", "volume-v.html", "volume-vi.html", "volume-vii.html", "writing.html", "manifest.json", "icon-192.png", "icon-512.png", "map_1366.jpeg", "fonts/AlcarinTengwar-Bold.woff2", "fonts/AlcarinTengwar-Regular.woff2", "fonts/AngerthasMoria.woff2", "fonts/Aniron-Bold.woff2", "fonts/Aniron-Regular.woff2", "fonts/ArchitectsDaughter.woff2", "fonts/ArdaCSUR.woff2", "fonts/Cinzel-Bold.woff2", "fonts/Cinzel-Regular.woff2", "fonts/Cinzel-SemiBold.woff2", "fonts/CormorantUnicase-Regular.woff2", "fonts/EBGaramond-Italic.woff2", "fonts/EBGaramond-Medium.woff2", "fonts/EBGaramond-Regular.woff2", "fonts/Eldamar-1.1.woff2", "fonts/Junicode-Italic.woff2", "fonts/Junicode-Regular.woff2", "fonts/Metamorphous-Regular.woff2", "fonts/NovaCut.woff2", "fonts/TengwarTelcontar.woff2", "fonts/TirionSarati.woff2", "fonts/UncialAntiqua-Regular.woff2", "fonts/UnifrakturMaguntia-Regular.woff2", "fonts/junicode-versal.woff2"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(SHELL.map(u=>new Request(u,{cache:"reload"})))).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!=V).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{
if(e.request.method!="GET"||new URL(e.request.url).origin!=location.origin)return;
e.respondWith(caches.open(V).then(async c=>{
const hit=await c.match(e.request,{ignoreSearch:true});
const net=fetch(e.request).then(r=>{if(r.ok)c.put(e.request,r.clone());return r}).catch(()=>null);
if(hit){e.waitUntil(net);return hit}
const r=await net;
if(r)return r;
// THE index.html FALLBACK IS FOR NAVIGATIONS ONLY (Adversary 688, repaired 6 August).
// Ungated, it answered a FAILED JSON FETCH with an HTML document: r.json() then throws
// `Unexpected token '<', "<!doctype "`, and index.html's dataset chain has no .catch --
// so the front door printed its literal caption "3,049 things across the halls" and
// returned nothing, silently. Ruling 4's third property, silence is visible, failing
// where a reader cannot see it. The mode test is the only thing that separates the case
// the fallback exists for from every other request; line 3 filters method and origin
// and never asked what KIND of request this is.
if(e.request.mode==="navigate"){
// A FALLBACK MUST NOT IMPERSONATE A LIVE SITE. On 25 August the owner opened a review URL,
// got the index, opened a DIFFERENT url, got the index again, and said so. The origin was
// DEAD -- its hostname was NXDOMAIN on two independent resolvers -- and this line was
// serving him a cached page over a tunnel that had stopped existing. He could not tell,
// and neither could I until I resolved the name. An offline fallback that looks exactly
// like a served page is the same fault class as an empty log that looks like work in
// progress: the instrument makes a dead thing look alive.
// So: the cached index answers only for a route this worker actually holds. Anything else
// gets a page that SAYS it is offline and names what was asked for.
const u=new URL(e.request.url), rel=u.pathname.replace(/^\/+/,"");
if(rel===""||rel==="index.html"||SHELL.indexOf(rel)>=0){const i=await c.match("index.html"); if(i)return i;}
return new Response("<!doctype html><meta charset=utf-8><title>Offline</title>"+
  "<body style='font:16px/1.6 Georgia,serif;max-width:34em;margin:14vh auto;padding:0 1.5em'>"+
  "<h1 style='font-size:1.4em'>This page could not be reached.</h1>"+
  "<p>The archive's service worker is answering because the network did not. "+
  "It is <b>not</b> showing you a stale copy of a different page.</p>"+
  "<p style='color:#666'>Asked for: <code>"+u.pathname.replace(/[<&]/g,"")+"</code></p>"+
  "<p style='color:#666'>If this is a temporary review tunnel, the tunnel has probably died. "+
  "A quick tunnel's hostname does not survive a restart.</p>",
  {status:503,headers:{"content-type":"text/html; charset=utf-8"}});
}
return r;
}));});
