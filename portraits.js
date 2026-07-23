// portraits.js — procedural mini-portraits in the archive's storybook style.
// window.ardaPortrait(p) -> SVG string for a genealogy person {id,n,r,s,...}.
// Colours are used ONLY where the corpus states them (PDESC); otherwise a race-typical
// neutral rendering is drawn and labelled inferred.
(function(){
const INK="#3a2a1c";
// corpus-stated trait overrides: h=hair colour, hs=style(long|short|falls|none), bd=beard(none|trim|full|white...color), gear, skin
const PDESC={
 gandalf:{h:"#b8b4ac",hs:"long",bd:"#e4e1da",gear:"hat"},
 aragorn:{h:"#3a3430",hs:"short",bd:"#3a3430:trim"},
 galadriel:{h:"#e2c25e",hs:"falls"},finrod:{h:"#e2c25e",hs:"falls"},finarfin:{h:"#e2c25e",hs:"falls"},
 idril:{h:"#e2c25e",hs:"falls"},thranduil:{h:"#e2c25e",hs:"falls",gear:"circlet"},
 maedhros:{h:"#8a4020",hs:"falls"},amrod:{h:"#8a4020",hs:"falls"},amras:{h:"#8a4020",hs:"falls"},
 feanor:{h:"#16130f",hs:"falls",gear:"circlet"},finwe:{h:"#16130f",hs:"falls",gear:"crown"},
 fingolfin:{h:"#16130f",hs:"falls",gear:"crown"},luthien:{h:"#221e1c",hs:"falls"},arwen:{h:"#221e1c",hs:"falls"},
 elrond:{h:"#221e1c",hs:"falls",gear:"circlet"},elwe:{h:"#c9c5bd",hs:"falls",gear:"crown"},
 celeborn:{h:"#c9c5bd",hs:"falls"},cirdan:{h:"#c9c5bd",hs:"falls",bd:"#c9c5bd"},
 eowyn:{h:"#e8ce74",hs:"falls"},eomer:{h:"#e2c25e",hs:"long"},theoden:{h:"#e8e5da",hs:"long",bd:"#e8e5da:trim",gear:"crown"},
 eorl:{h:"#e2c25e",hs:"long"},bilbo:{h:"#6a4a28",hs:"curly"},frodo:{h:"#6a4a28",hs:"curly"},
 sam:{h:"#8a6432",hs:"curly"},merry:{h:"#6a4a28",hs:"curly"},pippin:{h:"#c9a95e",hs:"curly"},
 balin:{h:"#b8b4ac",hs:"short",bd:"#b8b4ac",gear:"hood:#9a2c22"},dwalin:{bd:"#4a5a74"},
 fili:{bd:"#c9a437"},kili:{bd:"#c9a437"},thorin:{h:"#e8e5da",hs:"long",bd:"#e8e5da",gear:"crown"},
 gimli:{h:"#9a5424",hs:"short",bd:"#9a5424",gear:"hood:#8a2a2a"},gloin:{bd:"#e8e5da"},
 turin:{h:"#3a3430",hs:"falls",gear:"dhelm"},hurin:{h:"#c9a437",hs:"short",bd:"#c9a437:trim"},
 beren:{h:"#3a3430",hs:"short"},melian:{h:"#221e1c",hs:"falls"},morwen:{h:"#221e1c",hs:"falls"},
 legolas:{gear:"hood:#3f5a3a"},boromir2:{h:"#3a3430",hs:"short"},faramir2:{h:"#3a3430",hs:"short"},
 imrahil:{h:"#221e1c",hs:"short"},denethor2:{h:"#c9c5bd",hs:"short"},
};
const RACE={A:{skin:"#eed8b8",coat:"#7a5a8a",hair:"#c9c5bd",hs:"long"},
 E:{skin:"#ecd2ae",coat:"#4a6a5a",hair:"#6a5a48",hs:"falls",elf:1},
 M:{skin:"#e2c49c",coat:"#5a5044",hair:"#5a4632",hs:"short"},
 H:{skin:"#f0d4b2",coat:"#5a6a44",hair:"#6a4a28",hs:"curly",elf:1,blush:1},
 D:{skin:"#e6c9a2",coat:"#6a4a2c",hair:"#7a4a24",hs:"short",bd:1},
 X:{skin:"#d8cfc0",coat:"#6a675f",hair:"#8e8a80",hs:"short"}};
function lobes(pts,fill,sw){
 let cx=0,cy=0;pts.forEach(p=>{cx+=p[0];cy+=p[1]});cx/=pts.length;cy/=pts.length;
 let d="M"+pts[0][0]+","+pts[0][1];const P=pts.concat([pts[0]]);
 for(let i=1;i<P.length;i++){const[x0,y0]=P[i-1],[x1,y1]=P[i];
  const mx=(x0+x1)/2,my=(y0+y1)/2;let nx=mx-cx,ny=my-cy;
  const ln=Math.hypot(nx,ny)||1,seg=Math.hypot(x1-x0,y1-y0),r=Math.min(9,seg*0.42);
  const bx=mx+nx/ln*r,by=my+ny/ln*r;
  d+=" Q"+bx.toFixed(0)+","+by.toFixed(0)+" "+x1+","+y1;}
 return '<path d="'+d+' Z" fill="'+fill+'" stroke="'+INK+'" stroke-width="'+(sw||1.6)+'" stroke-linejoin="round"/>';}
/*RASTER*/
const ARDA_RASTER=new Set(["adalgrim", "adamanta", "adrahil", "aegnor", "ailinel", "aldamir", "aldor", "almarian", "almiel", "amandil", "amarie", "amdir", "amlaith", "amras", "amrod", "amroth", "anaire", "anardil_g", "anarion_g", "andreth", "angamaite", "angelimir", "angrod", "annael_n", "arador", "aradunakhor", "araglas", "aragorn", "aragorn1", "aragost", "arahad1", "arahad2", "arahael", "aranarth", "arantar", "aranuir", "aranwe", "araphant", "araphor", "arassuil", "aratan", "arathorn", "arathorn1", "araval", "aravir", "aravorn", "arciryas", "aredhel", "argeleb1", "argeleb2", "argimilzor", "argon", "argonui", "arsakalthor", "artamir", "arvedui", "arvegil", "arveleg1", "arveleg2", "arwen", "arzimrathon", "atanatar1", "atanatar2", "aule", "balbo", "baldor", "balin", "baragund", "barahir", "barahir_f", "barahir_s", "baran", "belecthor1", "belecthor2", "beleg_a", "belegorn", "belegund", "bell", "belladonna", "beor", "beregar", "beregond_s", "beren", "beren_s", "beril", "beruthiel", "berylla", "bilbo", "borin", "boromir", "boromir_b", "boromir_s", "boron", "brandir", "brego", "bregolas", "bregor", "brytta", "bungo", "calimehtar_c", "calimehtar_g", "calimmacil", "calmacil_g", "camellia", "caranthir", "castamir", "celeborn", "celebrian", "celebrimbor", "celebrindor", "celegorm", "celepharn", "cemendur", "cirdan", "cirion", "ciryandil", "ciryon", "curufin", "dain1", "dain2", "deagol", "denethor1", "denethor2", "deor", "diamond", "dior", "dior_s", "dirhael", "dis", "drogo", "durin1", "durin6", "durin7", "dwalin", "earendil", "earendil_g", "earendur_a", "earendur_l", "earnil1", "earnil2", "earnur", "earwen", "ecthelion1", "ecthelion2", "egalmoth", "eglantine", "elanor", "elatan", "elboron", "eldacar_a", "eldacar_g", "eldarion", "elendil", "elendur_a", "elendur_i", "elenwe", "elfhild", "elfstan", "elfwine", "elladan", "elmo", "elrohir", "elrond", "elros", "elured", "elurin", "elwe", "elwing", "emeldir", "eol", "eomer", "eomund", "eorl", "eowyn", "eradan", "erendis", "esmeralda", "este", "estella", "falastur", "faramir", "faramir_o", "faramir_t", "farin", "fastred", "fastred_r", "feanor", "fengel", "fili", "finarfin", "findis", "finduilas_a", "finduilas_n", "fingolfin", "fingon", "finrod", "finwe", "firiel", "folca", "folcred", "folcwine", "fosco", "fram", "frea", "frealaf", "freawine", "fredegar", "frerin", "frodo", "frodog", "fror", "frumgar", "fundin", "galadhon", "galador", "galadriel", "galathil", "galdor", "gelmir_n", "gerontius", "gildor", "gilgalad", "gilraen", "gimilkhad", "gimli", "gloin_d", "gloin_k", "gloredhel", "goldilocks", "goldwine", "gorbadoc", "gram", "groin_d", "gror", "guilin", "gundor", "gwindor", "hador", "hador_s", "halbarad", "haldad", "haldan", "haldar", "haldir", "haleth", "haleth_r", "hallacar", "hallas", "hallatan", "halmir", "hama_r", "hamfast", "handir", "hareth", "hathol", "helm", "herion", "herucalmo", "hild", "hildigrim", "hiril", "holfast", "hundar", "huor", "hurin", "hurin1", "hurin2", "hurin_e", "hyarmendacil1", "hyarmendacil2", "idril", "imrahil", "imrazor", "indis", "inzilbeth", "irime", "irmo", "isildur", "isilme", "isilmo", "ivorwen", "kili", "lalaith", "largo", "laura", "legolas", "leod", "lily_c", "lindorie", "lobelia", "longo", "lothiriel", "lotho", "luthien", "maedhros", "maeglin", "maglor", "magor", "malach", "mallor", "malvegil", "manwe", "marach", "mardil", "marigold", "melian", "melkor", "meneldil", "merry", "minardil", "minastan", "minohtar", "mirabella", "miriel", "miriel_n", "mithrellas", "morwen", "morwen_l", "mungo", "nain1", "nain2", "nain_d", "namo", "narmacil1", "narmacil2", "nerdanel", "nessa", "nienna", "nienor", "nimloth_e", "nimrodel", "numendil", "nuneth", "odovacar", "oin_d", "oin_k", "olwe", "ondoher", "ornendil", "orodreth", "orodreth_s", "orome", "oropher", "osse", "ostoher", "otho", "paladin", "pelendur", "pharazon", "pippin", "primula", "rian", "romendacil1", "romendacil2", "rorimac", "rosamunda", "rosie", "sam", "sangahyando", "saradoc", "silmarien", "siriondil2", "siriondil_g", "smeagol", "smeagrandma", "tanta", "taralcarin", "taraldarion", "taramandil", "taranarion", "tarancalime", "tarancalimon", "tarardamin", "taratanamir", "tarcalmacil2", "tarcil", "tarciryan", "tarciryatan", "tarelendil", "tarmeneldur", "tarminastir", "tarondor_a", "tarondor_g", "tarpalantir", "tarsurion", "tartelemmaite", "tartelperien", "tarvanimelde", "telemnar", "telumehtar", "thengel", "theoden", "theodred", "theodwyn", "thorin", "thorin1", "thorin3", "thorondir", "thrain1", "thrain2", "thranduil", "thror", "tolman_c", "tomcotton_y", "tulkas", "tuor", "turambar_g", "turgon", "turgon_s", "turin", "turin1", "turin2", "uinen", "ulmo", "vaire", "valacar", "valandil_a", "valandil_k", "valandur", "vana", "varda", "vardamir", "veantur", "vidugavia", "vidumavi", "vorondil", "voronwe", "walda", "yavanna"]);
window.ardaPortraitImg=function(p,big){if(!ARDA_RASTER.has(p.id))return null;var w=big?150:96,h=Math.round(w*4/3);return '<div style="text-align:center;margin-bottom:4px"><img src="portraits/'+p.id+'.jpg" width="'+w+'" height="'+h+'" loading="lazy" style="border-radius:10px;border:1px solid #b0a58e;object-fit:cover;background:#fff" alt="portrait of '+(p.n||'').replace(/"/g,'')+'"><div class="cite" style="font-size:9.5px">'+(ARDA_PCONF[p.id]==='C'?'likeness drawn from the corpus\'s own descriptors — an illustration, not a photograph':'features unstated in the corpus — an imagined likeness [I]')+'</div></div>';};
/*ENDRASTER*/
window.ardaPortrait=function(p){var _img=window.ardaPortraitImg(p);if(_img)return _img;var _img=window.ardaPortraitImg(p);if(_img)return _img;
 const R=RACE[p.r]||RACE.X,o=PDESC[p.id]||{};
 const skin=o.skin||R.skin,stated=!!PDESC[p.id];
 const hair=o.h||R.hair,hs=o.hs||R.hs;
 const fem=p.s==="F";
 let g="";
 // bust + head
 g+='<path d="M-40,86 Q-42,52 -20,42 L-8,36 Q2,42 16,34 L28,40 Q46,50 44,86 Z" fill="'+(fem?"#8a97a5":R.coat)+'" stroke="'+INK+'" stroke-width="1.8"/>';
 g+='<path d="M-11,30 q-2,10 4,14 q8,5 14,-2 q4,-6 3,-13 Z" fill="'+skin+'" stroke="'+INK+'" stroke-width="1.2"/>';
 g+='<circle cx="0" cy="-9" r="22" fill="none" stroke="#6a7e96" stroke-width=".7" opacity=".18"/>';g+='<path d="M-22,-7 Q-25,-19 -15,-26 Q-3,-32 10,-28 Q23,-23 23,-10 L22,1 L18,13 L9,22 L1,25 L-5,24 L-8,19 Q-17,13 -20,3 Q-22,-2 -22,-7 Z" fill="'+skin+'" stroke="'+INK+'" stroke-width="1.7" stroke-linejoin="miter"/>';g+='<path d="M10,-28 Q23,-23 23,-10 L22,1 L18,13 L9,22 L4,24 Q13,9 12,-10 Q12,-22 10,-28 Z" fill="#5a4632" opacity=".12"/>';
 // face
 const eye=fem?"#5a7a9a":"#5a6a7a";
 g+='<ellipse cx="-9" cy="-4" rx="4.4" ry="3.4" fill="#fdfaf2" stroke="'+INK+'" stroke-width=".9"/><ellipse cx="9" cy="-4.4" rx="3.9" ry="3.1" fill="#fdfaf2" stroke="'+INK+'" stroke-width=".9"/>';
 g+='<circle cx="-8.4" cy="-3.6" r="2" fill="'+eye+'"/><circle cx="9.4" cy="-4" r="1.8" fill="'+eye+'"/><circle cx="-8" cy="-4.2" r=".7" fill="#fff"/><circle cx="9.8" cy="-4.6" r=".6" fill="#fff"/>';
 g+='<path d="M-13,-9 q4,-3 8,-1 M13,-9 q-4,-3 -8,-1" stroke="'+INK+'" stroke-width="1.5" fill="none" stroke-linecap="round"/>';
 g+='<path d="M-3,-8 Q-7,1 -8,7 Q-8,11 -4,11 Q-1,11 0,9" fill="'+skin+'" stroke="'+INK+'" stroke-width="1.3"/><path d="M-8,9 q-2,1 -1,3" stroke="'+INK+'" stroke-width=".9" fill="none"/>';
 g+='<path d="M-6,13 q5,4 11,1" stroke="'+INK+'" stroke-width="1.3" fill="none" stroke-linecap="round"/>';
 if(R.blush)g+='<circle cx="-14" cy="4" r="3.4" fill="#d88a6a" opacity=".3"/><circle cx="14" cy="3" r="3" fill="#d88a6a" opacity=".3"/>';
 if(R.elf)g+='<path d="M-24,-2 l-5,-4 l1.6,7 Z" fill="'+skin+'" stroke="'+INK+'" stroke-width="1"/>';
 // beard
 const bd=o.bd||(R.bd&&p.s!=="F"?hair:null);
 if(bd&&p.s!=="F"){const bc=String(bd).split(":")[0],trim=String(bd).includes("trim");
  g+=trim?lobes([[-14,8],[-13,24],[0,29],[13,24],[14,8],[0,15]],bc,1.3)
        :lobes([[-16,6],[-18,36],[-9,58],[2,66],[12,56],[18,34],[16,6],[0,13]],bc,1.5);}
 // hair
 if(hs==="curly")g+=lobes([[-24,-4],[-28,-18],[-16,-30],[2,-34],[18,-30],[27,-16],[23,-3],[13,-13],[-4,-17],[-14,-12]],hair,1.6);
 else if(hs==="short")g+=lobes([[-24,-6],[-27,-20],[-13,-30],[3,-33],[19,-28],[26,-14],[22,-4],[10,-14],[-10,-14]],hair,1.6);
 else if(hs==="falls")g+=lobes([[-25,-4],[-29,-18],[-15,-30],[3,-34],[19,-29],[28,-15],[26,26],[20,-6],[-20,-6],[-26,26]],hair,1.6);
 else if(hs==="long")g+=lobes([[-25,-4],[-29,-16],[-15,-29],[3,-33],[19,-28],[28,-14],[27,30],[18,-4],[-18,-4],[-27,30]],hair,1.6);
 // gear
 const gear=(o.gear||"").split(":");
 if(gear[0]==="hat")g+='<path d="M-42,-14 Q-28,-40 4,-42 Q12,-66 20,-40 Q46,-36 40,-22 Q16,-32 -8,-28 Q-30,-24 -42,-14 Z" fill="#4a5a74" stroke="'+INK+'" stroke-width="1.6"/>';
 if(gear[0]==="crown")g+='<path d="M-24,-24 L-24,-40 L-14,-29 L-6,-42 L3,-29 L12,-42 L20,-28 L24,-38 L24,-20 Q0,-30 -24,-24 Z" fill="#d8b45a" stroke="'+INK+'" stroke-width="1.4"/>';
 if(gear[0]==="circlet")g+='<path d="M-22,-14 Q0,-22 22,-14" stroke="#d8b45a" stroke-width="2.6" fill="none"/>';
 if(gear[0]==="hood")g+='<path d="M-27,3 Q-34,-30 0,-40 Q34,-30 27,3 L21,-3 Q22,-26 0,-31 Q-22,-26 -21,-3 Z" fill="'+(gear[1]||"#5a5044")+'" stroke="'+INK+'" stroke-width="1.6"/>';
 if(gear[0]==="dhelm")g+='<path d="M-24,-4 Q-26,-26 0,-31 Q26,-26 24,-4 L18,-8 Q16,-23 0,-25 Q-16,-23 -18,-8 Z" fill="#7a838c" stroke="'+INK+'" stroke-width="1.4"/><path d="M-9,-33 Q-5,-41 0,-37 Q5,-43 9,-33 Q0,-37 -9,-33 Z" fill="#d8b45a" stroke="'+INK+'" stroke-width="1"/>';
 const note=stated?"features from the corpus's own descriptors":"features unstated in the corpus — race-typical rendering [I]";
 return '<div style="text-align:center;margin-bottom:4px"><svg width="96" height="112" viewBox="-48 -52 96 148" role="img" aria-label="portrait of '+p.n.replace(/"/g,"")+'"><rect x="-48" y="-52" width="96" height="148" rx="10" fill="#f6efe0" stroke="#b0a58e"/>'+g+'</svg><div class="cite" style="font-size:9.5px">'+note+'</div></div>';};
})();
