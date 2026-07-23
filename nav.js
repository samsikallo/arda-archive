// nav.js — the one nav for every hall: grouped menu with plain-word subtitles,
// current-page highlight, breadcrumb, keyboard shim for legacy widgets, theme toggle.
(function(){
const GROUPS=[
 ["Atlas",[["arda_timemap_jpeg.html","the living map","interactive map, journeys, battles"],
   ["chronicle.html","the turning ages","map + chronicle on one slider"],
   ["realms.html","realms","the political atlas — 60 polities"],
   ["cosmology.html","cosmology","the shape of the world itself"],
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
   ["heraldry.html","hall of heraldry","every device + a device-forge"],
   ["gondolin.html","houses of Gondolin","the twelve kindreds & their heraldry"],
   ["gallery.html","gallery","armour & weapon plates"]]],
 ["War",[["armies_dashboard.html","armies","30 campaigns, animated maps"]]],
 ["Tools",[["corpus.html","the corpus","28 volumes, concordance, queries"],
   ["quiz.html","the trial","test your lore"],
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
// layer toggle: canon focus (dims inferred/external-badged entries)
const Lb=document.createElement("button");Lb.id="a-layers";Lb.textContent="layers: all";Lb.title="toggle canon-focus — dims material badged inferred [I] or external [EXT]";
Lb.style.cssText=T.style.cssText;Lb.className=T.className||"";T.parentNode.insertBefore(Lb,T.nextSibling);
function setLayers(c){document.documentElement.classList.toggle("arda-canon",c);Lb.textContent=c?"layers: canon":"layers: all";try{localStorage.setItem("ardaLayers",c?"canon":"all")}catch(e){}}
try{if(localStorage.getItem("ardaLayers")==="canon")setLayers(true)}catch(e){}
Lb.addEventListener("click",()=>setLayers(!document.documentElement.classList.contains("arda-canon")));

// ---- feedback panel (store-nothing composer: site collects no data; user sends via GitHub or email) ----
const FB=document.createElement("button");FB.id="a-fb";FB.textContent="\u{1F4AC} feedback";FB.title="leave a suggestion or bug report";
FB.style.cssText=T.style.cssText;T.parentNode.insertBefore(FB,document.getElementById("a-layers").nextSibling);
FB.addEventListener("click",()=>{
 let d=document.getElementById("a-fbdlg");
 if(d){d.style.display=d.style.display==="none"?"block":"none";return}
 d=document.createElement("div");d.id="a-fbdlg";
 d.innerHTML='<div class="fbh">Feedback for the Arda Archive</div>'
 +'<label>What kind? <select id="fbt"><option>bug</option><option>suggestion</option><option>content issue (lore/citation)</option><option>general UX</option></select></label>'
 +'<label>Where? <input id="fbp" type="text"></label>'
 +'<label>Tell us \u2014 the more specific, the better:<br><textarea id="fbx" rows="5" placeholder="What happened / what you expected / what you would change\u2026"></textarea></label>'
 +'<label>Nickname <i>(optional)</i>: <input id="fbn" type="text" placeholder="leave empty to stay anonymous"></label>'
 +'<div class="fbbtns"><button id="fbgh">open as a GitHub issue</button><button id="fbmail">send by e-mail</button><button id="fbclose">close</button></div>'
 +'<div class="fbnote"><b>Privacy, plainly:</b> this site stores nothing you type \u2014 there is no server behind it. Your text is handed to the channel you choose: a <b>GitHub issue</b> is public and governed by GitHub\u2019s terms; <b>e-mail</b> reveals your address to the site\u2019s maintainer, who uses it only to read your feedback. Both are optional; name and e-mail are never required. Please include no sensitive personal data.</div>';
 document.body.appendChild(d);
 document.getElementById("fbp").value=location.pathname.split("/").pop()+location.hash;
 const gather=()=>{const t=document.getElementById("fbt").value,p=document.getElementById("fbp").value,
  x=document.getElementById("fbx").value.trim(),n=document.getElementById("fbn").value.trim();
  return {t,p,x,n,body:"["+t+"] on "+p+"\n\n"+x+(n?"\n\n\u2014 "+n:"")}};
 document.getElementById("fbgh").onclick=()=>{const g=gather();if(!g.x){alert("Write a few words first \u2014 specifics help most.");return}
  open("https://github.com/samsikallo/arda-archive/issues/new?title="+encodeURIComponent("["+g.t+"] "+g.p)+"&body="+encodeURIComponent(g.body),"_blank")};
 document.getElementById("fbmail").onclick=()=>{const g=gather();if(!g.x){alert("Write a few words first \u2014 specifics help most.");return}
  location.href="mailto:bobo.linux@gmail.com?subject="+encodeURIComponent("[arda-archive feedback] "+g.t)+"&body="+encodeURIComponent(g.body)};
 document.getElementById("fbclose").onclick=()=>{d.style.display="none"};
});
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
