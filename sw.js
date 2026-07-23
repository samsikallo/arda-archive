// Arda Archive service worker — precache core, runtime-cache the rest (cache-first).
const V="arda-5b2286a5";
const CORE=["arda_armies.json", "arda_art.json", "arda_artifacts.json", "arda_chronology.json", "arda_concordance.json", "arda_contradictions.json", "arda_corpusindex.json", "arda_genealogy.json", "arda_languages.json", "arda_livingmap.json", "arda_poems.json", "arda_population.json", "arda_quotes.json", "arda_scripts.json", "arda_search.json", "arda_silences.json", "arda_timeline.html", "arda_timemap.html", "arda_timemap.json", "arda_timemap_jpeg.html", "arda_timemap_jpeg.json", "arda_tours.json", "armies_dashboard.html", "artifacts.html", "character.html", "chronicle.html", "compare.html", "downloaded_map.jpeg", "gallery.html", "genealogy.html", "icon-192.png", "icon-512.png", "index.html", "languages.html", "manifest.json", "place.html", "poems.html", "population_dashboard.html", "quiz.html", "quotes.js", "silences.html", "speak.js", "touch.js", "tours.html"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(CORE.map(u=>new Request(u,{cache:"reload"})))).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!=V).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{
if(e.request.method!="GET")return;
e.respondWith(caches.match(e.request,{ignoreSearch:true}).then(hit=>hit||fetch(e.request).then(r=>{
if(r.ok&&new URL(e.request.url).origin==location.origin){const cl=r.clone();caches.open(V).then(c=>c.put(e.request,cl));}
return r;}).catch(()=>caches.match("index.html"))));});
