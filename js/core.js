/* Shared deck runtime: helpers, cross-page navigation, theme, lightbox, print. Loaded first on every page. */
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const NS='http://www.w3.org/2000/svg';
const el=(t,a={},p)=>{const e=document.createElementNS(NS,t);for(const k in a){const v=a[k];if((k==='fill'||k==='stroke')&&typeof v==='string'&&v.startsWith('var('))e.style[k]=v;else e.setAttribute(k,v);}if(p)p.appendChild(e);return e;};
const esc=t=>String(t).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');

/* ---------- pages (one file per part) ---------- */
const PAGES=[
 {
  "file": "index.html",
  "name": "Cover",
  "slides": [
   "Cover"
  ]
 },
 {
  "file": "paper.html",
  "name": "Paper",
  "slides": [
   "Paper: abstract",
   "Paper: problem, approach, contributions"
  ]
 },
 {
  "file": "research.html",
  "name": "Research",
  "slides": [
   "Research: literature review",
   "Research: comparison",
   "Research: market gap",
   "Research: apps compared",
   "Research: comparison 1 · translation, avatar and AI",
   "Research: comparison 2 · learning, streak, competition and kids",
   "Research: comparison 3 · chat, live communication and services",
   "Research: what makes Eshara different"
  ]
 },
 {
  "file": "diagrams.html",
  "name": "Diagrams",
  "slides": [
   "Key diagram: sign to text"
  ]
 },
 {
  "file": "ai.html",
  "name": "AI",
  "slides": [
   "AI: headline result",
   "AI: dashboard",
   "AI: how it works",
   "AI: architecture",
   "AI: data",
   "AI: training workflow",
   "AI: problems and fixes",
   "AI: next steps"
  ]
 },
 {
  "file": "mobile.html",
  "name": "Mobile",
  "slides": [
   "Mobile: status",
   "Mobile: sign to text"
  ]
 },
 {
  "file": "web.html",
  "name": "Web",
  "slides": [
   "Web: landing page",
   "Web: app and translate page"
  ]
 },
 {
  "file": "security.html",
  "name": "Security",
  "slides": [
   "Security: scenarios",
   "Security: testing checklist"
  ]
 },
 {
  "file": "backend.html",
  "name": "Backend",
  "slides": [
   "Backend: database schema",
   "Backend: gallery"
  ]
 },
 {
  "file": "gallery.html",
  "name": "Gallery",
  "slides": [
   "Design gallery"
  ]
 }
];
const AI_PART=PAGES.findIndex(p=>p.file==='ai.html');
const PART=+document.body.dataset.part;
const OFFSET=PAGES.slice(0,PART).reduce((a,p)=>a+p.slides.length,0);
const TOTAL=PAGES.reduce((a,p)=>a+p.slides.length,0);
const goPage=(p,k)=>{location.href=PAGES[p].file+'#slide-'+k;};

/* ---------- navigation ---------- */
const slides=$$('.slide');let cur=0;const onEnter={};const printHooks=[];
const partsNav=$('#parts');
PAGES.forEach((p,i)=>{const b=document.createElement('button');b.className='part'+(i===AI_PART?' ai':'');b.innerHTML=(i?'<b>'+i+'</b>':'')+p.name;if(i===PART)b.setAttribute('aria-current','page');b.onclick=()=>i===PART?go(0):goPage(i,1);partsNav.appendChild(b);});
{let g=0;PAGES.forEach((p,pi)=>p.slides.forEach((lab,k)=>{g++;const d=document.createElement('button');d.className='dot'+(pi===AI_PART?' ai':'');d.setAttribute('aria-label','Slide '+g+': '+lab);d.onclick=()=>pi===PART?go(k):goPage(pi,k+1);$('#dots').appendChild(d);}));}
function go(i,fromHash){
  if(!fromHash&&i<0){if(PART>0)goPage(PART-1,PAGES[PART-1].slides.length);return;}
  if(!fromHash&&i>=slides.length){if(PART<PAGES.length-1)goPage(PART+1,1);return;}
  i=Math.max(0,Math.min(slides.length-1,i));
  slides.forEach((s,j)=>{s.classList.toggle('on',j===i);s.inert=j!==i;});
  $$('.dot').forEach((d,j)=>d.classList.toggle('on',j===OFFSET+i));
  $$('.part').forEach((b,j)=>b.classList.toggle('on',j===PART));
  const pb=$$('.part')[PART];if(pb&&pb.scrollIntoView)pb.scrollIntoView({block:'nearest',inline:'nearest'});
  cur=i;const g=OFFSET+i;$('#count').textContent=(g+1)+' / '+TOTAL;$('#prev').disabled=g===0;$('#next').disabled=g===TOTAL-1;
  slides[i].scrollTop=0;
  if(!fromHash){try{history.replaceState(null,'','#slide-'+(i+1));}catch(e){}}
  if(onEnter[i])onEnter[i]();
}
$('#theme').onclick=()=>{const r=document.documentElement;const dark=r.dataset.theme?r.dataset.theme==='dark':matchMedia('(prefers-color-scheme: dark)').matches;r.dataset.theme=dark?'light':'dark';try{localStorage.setItem('eshara-theme',r.dataset.theme);}catch(e){}};
$('#prev').onclick=()=>go(cur-1);$('#next').onclick=()=>go(cur+1);
document.addEventListener('keydown',e=>{
  if(!$('#lb').hidden){if(e.key==='Escape')closeLb();return;}
  if(e.target.closest('input,textarea'))return;
  if(e.key==='ArrowRight'||e.key==='PageDown'){go(cur+1);e.preventDefault();}
  else if(e.key==='ArrowLeft'||e.key==='PageUp'){go(cur-1);e.preventDefault();}
  else if(e.key==='Home')go(0);else if(e.key==='End')go(slides.length-1);
});
let tx=null,ty=null;
$('#stage').addEventListener('touchstart',e=>{if(e.target.closest('.dview,input'))return;tx=e.touches[0].clientX;ty=e.touches[0].clientY;},{passive:true});
$('#stage').addEventListener('touchend',e=>{if(tx===null)return;const dx=e.changedTouches[0].clientX-tx,dy=e.changedTouches[0].clientY-ty;if(Math.abs(dx)>60&&Math.abs(dx)>Math.abs(dy)*1.5)go(cur+(dx<0?1:-1));tx=null;},{passive:true});
const idxOf=label=>slides.findIndex(s=>s.getAttribute('aria-label')===label);
function fromHash(){const m=/^#slide-(\d+)$/.exec(location.hash);return m?parseInt(m[1],10)-1:0;}
window.addEventListener('hashchange',()=>go(fromHash(),true));

/* ---------- lightbox ---------- */
function openImg(src,alt){$('#lbImg').src=src;$('#lbImg').alt=alt||'';$('#lbCap').textContent=alt||'';$('#lb').hidden=false;$('#lbClose').focus();}
function closeLb(){$('#lb').hidden=true;}
$('#lbClose').onclick=closeLb;$('#lb').onclick=e=>{if(e.target.id==='lb')closeLb();};

/* ---------- print prep (used for the PDF export) ---------- */
window.__preparePrint=function(){slides.forEach(s=>{s.classList.add('on');s.inert=false;});printHooks.forEach(f=>f());};

/* page scripts load after this file; start once they have registered their handlers */
document.addEventListener('DOMContentLoaded',()=>go(fromHash(),true));
