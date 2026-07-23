// Arda Archive service worker v2 — content-hashed version; shell precached; stale-while-revalidate runtime.
const V="arda-749a3d5ec1";
const SHELL=["404.html", "annals.html", "arda.css", "arda_timeline.html", "arda_timemap.html", "arda_timemap_jpeg.html", "armies_dashboard.html", "artifacts.html", "character.html", "chronicle.html", "compare.html", "corpus.html", "cosmology.html", "gallery.html", "genealogy.html", "index.html", "languages.html", "nav.js", "place.html", "poems.html", "population_dashboard.html", "portraits.js", "quiz.html", "quotes.js", "realms.html", "reckoning.html", "silences.html", "speak.js", "touch.js", "tours.html", "manifest.json", "icon-192.png", "icon-512.png", "map_1366.jpeg"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(SHELL.map(u=>new Request(u,{cache:"reload"})))).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!=V).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{
if(e.request.method!="GET"||new URL(e.request.url).origin!=location.origin)return;
e.respondWith(caches.open(V).then(async c=>{
const hit=await c.match(e.request,{ignoreSearch:true});
const net=fetch(e.request).then(r=>{if(r.ok)c.put(e.request,r.clone());return r}).catch(()=>null);
if(hit){e.waitUntil(net);return hit}
const r=await net;
return r||c.match("index.html");
}));});
