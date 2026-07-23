// nav.js — the one nav for every hall: grouped menu with plain-word subtitles,
// current-page highlight, breadcrumb, keyboard shim for legacy widgets, theme toggle.
(function(){
const GROUPS=[
 ["Atlas",[["arda_timemap_jpeg.html","the living map","interactive map, journeys, battles"],
   ["chronicle.html","the turning ages","map + chronicle on one slider"],
   ["realms.html","realms","the political atlas — 60 polities"],
   ["arda_timemap.html","the redrawn base","legacy vector map"]]],
 ["Chronicle",[["arda_timeline.html","timeline","all of history, zoomable"],
   ["reckoning.html","reckonings","calendars, dates & measures"],
   ["annals.html","annals of the archive","what's new on this site"]]],
 ["People",[["genealogy.html","family trees","439 figures, all houses"],
   ["character.html","records","a page for every person"],
   ["population_dashboard.html","peoples","demography of Arda"]]],
 ["Culture",[["languages.html","tongues & letters","lexicon, scripts, name-craft"],
   ["poems.html","verse","35 songs & lays, verbatim"],
   ["artifacts.html","artifacts","20 treasures, chain of custody"],
   ["gallery.html","gallery","armour & weapon plates"]]],
 ["War",[["armies_dashboard.html","armies","30 campaigns, animated maps"]]],
 ["Tools",[["quiz.html","the trial","test your lore"],
   ["tours.html","tours","guided roads through the halls"],
   ["compare.html","side by side","two lives or two battles"],
   ["silences.html","the silences","what the corpus does not say"]]]];
const here=location.pathname.split("/").pop()||"index.html";
const nav=document.getElementById("ardanav");if(!nav)return;
let h='<a class="home" href="index.html">⌂ the archive</a>';
GROUPS.forEach((g,gi)=>{
 const inHere=g[1].some(x=>x[0]===here);
 h+='<span class="grp"><button aria-expanded="false" aria-haspopup="true" '+(inHere?'class="here" ':'')+'data-g="'+gi+'">'+g[0]+' ▾</button><div class="menu" role="menu">';
 g[1].forEach(x=>{h+='<a role="menuitem" href="'+x[0]+'"'+(x[0]===here?' aria-current="page"':'')+'>'+x[1]+'<span class="sub2">'+x[2]+'</span></a>'});
 h+='</div></span>';
});
h+='<button id="a-theme" title="toggle dark theme" aria-label="toggle dark theme">☾</button>';
// breadcrumb
let crumb="";
GROUPS.forEach(g=>g[1].forEach(x=>{if(x[0]===here)crumb=g[0]+" › "+x[1]}));
if(here!=="index.html"&&crumb)h+='<span id="a-crumb"><a href="index.html">⌂ the archive</a> › '+crumb+'</span>';
nav.innerHTML=h;
// dropdown behavior (click + keyboard, close on outside/Esc)
nav.querySelectorAll(".grp>button").forEach(b=>{
 b.addEventListener("click",e=>{const open=b.getAttribute("aria-expanded")==="true";
  nav.querySelectorAll(".grp>button").forEach(x=>x.setAttribute("aria-expanded","false"));
  b.setAttribute("aria-expanded",open?"false":"true");e.stopPropagation()});});
document.addEventListener("click",()=>nav.querySelectorAll(".grp>button").forEach(x=>x.setAttribute("aria-expanded","false")));
document.addEventListener("keydown",e=>{if(e.key==="Escape")nav.querySelectorAll(".grp>button").forEach(x=>x.setAttribute("aria-expanded","false"))});
// theme toggle
const T=document.getElementById("a-theme");
function setTheme(d){document.documentElement.classList.toggle("arda-dark",d);try{localStorage.setItem("ardaTheme",d?"dark":"light")}catch(e){}}
try{if(localStorage.getItem("ardaTheme")==="dark")setTheme(true)}catch(e){}
T.addEventListener("click",()=>setTheme(!document.documentElement.classList.contains("arda-dark")));
// keyboard shim: legacy span-widgets become focusable buttons
function shim(root){root.querySelectorAll(".chip,.tab,.card[onclick],[data-t],[data-id]").forEach(el=>{
 if(el.closest("#ardanav"))return;
 if(el.tagName==="SPAN"||el.tagName==="DIV"){
  if(!(el.onclick||el.getAttribute("onclick")||el.classList.contains("chip")||el.classList.contains("tab")))return;
  if(!el.hasAttribute("tabindex")){el.setAttribute("tabindex","0");el.setAttribute("role","button");
   el.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();el.click()}})}}})}
shim(document);
new MutationObserver(ms=>ms.forEach(m=>m.addedNodes.forEach(n=>{if(n.nodeType===1)shim(n)}))).observe(document.body,{childList:true,subtree:true});
})();
