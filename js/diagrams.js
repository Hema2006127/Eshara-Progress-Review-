/* ---------- diagram viewer ---------- */
function viewer(box){
  const img=document.createElement('img');img.alt='';img.draggable=false;box.appendChild(img);
  let s=1,x=0,y=0,drag=null;
  const apply=()=>{img.style.transform='translate('+x+'px,'+y+'px) scale('+s+')';};
  const fit=()=>{const bw=box.clientWidth,bh=box.clientHeight,iw=img.naturalWidth||1,ih=img.naturalHeight||1;s=Math.min(bw/iw,bh/ih)*0.96;x=(bw-iw*s)/2;y=(bh-ih*s)/2;apply();};
  const zoom=(f,cx,cy)=>{const ns=Math.max(0.05,Math.min(8,s*f));if(cx==null){cx=box.clientWidth/2;cy=box.clientHeight/2;}x=cx-(cx-x)*ns/s;y=cy-(cy-y)*ns/s;s=ns;apply();};
  img.onload=fit;
  box.addEventListener('wheel',e=>{e.preventDefault();const r=box.getBoundingClientRect();zoom(e.deltaY<0?1.15:1/1.15,e.clientX-r.left,e.clientY-r.top);},{passive:false});
  box.addEventListener('pointerdown',e=>{if(e.target.closest('.zoombar'))return;drag={px:e.clientX,py:e.clientY,x,y};box.classList.add('grab');box.setPointerCapture(e.pointerId);});
  box.addEventListener('pointermove',e=>{if(!drag)return;x=drag.x+e.clientX-drag.px;y=drag.y+e.clientY-drag.py;apply();});
  box.addEventListener('pointerup',()=>{drag=null;box.classList.remove('grab');});
  box.querySelectorAll('[data-z]').forEach(b=>b.onclick=()=>{const z=b.dataset.z;if(z==='in')zoom(1.3);else if(z==='out')zoom(1/1.3);else fit();});
  return {load:(src,alt)=>{img.alt=alt||'';if(img.getAttribute('src')===src){fit();return;}img.src=src;},fit,focus:(fx,fy,ns)=>{const bw=box.clientWidth,bh=box.clientHeight;s=ns*Math.min(bw/(img.naturalWidth||1),bh/(img.naturalHeight||1));x=bw/2-fx*(img.naturalWidth)*s;y=bh/2-fy*(img.naturalHeight)*s;apply();}};
}
const v4=viewer($('#dview4'));
const D4=[
 {t:'Camera permission state',d:'No camera, not asked, denied or granted; each path has its own help screen.',f:[0.3,0.16,2.2]},
 {t:'Model and AI service ready?',d:'Loading, unreachable (retry banner, camera stays on) or ready with a framing guide.',f:[0.52,0.45,2.2]},
 {t:'Recognizing: landmarks on the client',d:'Landmarks are extracted on the device and only features go to the AI service.',f:[0.65,0.6,2.2]},
 {t:'Input quality and confidence',d:'Low quality shows a hint; low confidence offers “Did you mean” candidates; high adds the letter.',f:[0.8,0.8,2.2]},
 {t:'Result review and history',d:'Copy, speak, edit a chip, or save to history with a toast on success or failure.',f:[0.3,0.8,2.2]}];
const co=$('#d4callouts');
const fitBtn=document.createElement('button');fitBtn.className='callout on';fitBtn.innerHTML='<b>Whole diagram</b><span>Sign to text is the core of Eshara and the flow the AI model serves.</span>';co.appendChild(fitBtn);
fitBtn.onclick=()=>{$$('#d4callouts .callout').forEach(x=>x.classList.remove('on'));fitBtn.classList.add('on');v4.fit();};
D4.forEach(c=>{const b=document.createElement('button');b.className='callout';b.innerHTML='<b>'+c.t+'</b><span>'+c.d+'</span>';b.onclick=()=>{$$('#d4callouts .callout').forEach(x=>x.classList.remove('on'));b.classList.add('on');v4.focus(c.f[0],c.f[1],c.f[2]);};co.appendChild(b);});
const iD4=idxOf('Key diagram: sign to text');
onEnter[iD4]=()=>v4.load('img/flow/d6.svg','Diagram 4: sign to text flow');

printHooks.push(()=>{
  const d4=$('#dview4');d4.innerHTML='<img src="img/flow/d6.svg" alt="Diagram 4" style="position:static;max-width:100%;max-height:100%;display:block;margin:auto">';d4.style.display='flex';d4.style.alignItems='center';
});
