/* ---------- AI: counter ---------- */
function count(){const t=$('#counter');if(reduce){t.textContent='93.3%';return;}const st=performance.now(),D=1400;(function f(n){const k=Math.max(0,Math.min(1,(n-st)/D));t.textContent=(93.3*(1-Math.pow(1-k,3))).toFixed(1)+'%';if(k<1)requestAnimationFrame(f);})(st);}
onEnter[idxOf('AI: headline result')]=count;$('#replay').onclick=count;

/* ---------- AI: dashboard ---------- */
$$('#kpis .kpi').forEach(k=>k.onclick=()=>{$$('#kpis .kpi').forEach(x=>x.classList.remove('hl'));k.classList.add('hl');$('#kinfo').textContent=k.dataset.info;});
const SRC=[{n:'ArASL images (all)',v:54049,c:'var(--slate)',u:false},{n:'ArASL with a detected hand (est.)',v:14053,c:'var(--teal-deep)',u:true},{n:'Team samples (Supabase)',v:30400,c:'var(--amber)',u:true}];let mode='count';
function renderBars(){const box=$('#srcBars');box.innerHTML='';const ut=SRC.filter(s=>s.u).reduce((a,s)=>a+s.v,0);
  SRC.forEach(s=>{if(mode==='share'&&!s.u)return;const val=mode==='count'?s.v:s.v/ut*100,pct=mode==='count'?s.v/54049*100:val;const r=document.createElement('div');r.className='bar-row';
    r.innerHTML='<div class="bar-top"><span>'+s.n+'</span><b>'+(mode==='count'?s.v.toLocaleString('en-US'):'≈'+val.toFixed(0)+'%')+'</b></div><div class="track"><div class="fill" style="background:'+s.c+'"></div></div>';box.appendChild(r);
    requestAnimationFrame(()=>requestAnimationFrame(()=>r.querySelector('.fill').style.width=pct+'%'));});}
$$('[data-mode]').forEach(b=>b.onclick=()=>{mode=b.dataset.mode;$$('[data-mode]').forEach(x=>x.setAttribute('aria-pressed',x===b));renderBars();});renderBars();
const SPLIT=[{n:'Train',v:75,c:'var(--teal)'},{n:'Validation',v:15,c:'var(--amber)'},{n:'Test',v:10,c:'var(--fg)'}];
const donut=$('#donut'),R=60,C=2*Math.PI*R;let off=0;const segs=[];
el('circle',{cx:80,cy:80,r:R,fill:'none',stroke:'var(--ink)','stroke-width':22},donut);
SPLIT.forEach(s=>{const len=C*s.v/100;segs.push(el('circle',{cx:80,cy:80,r:R,fill:'none',stroke:s.c,'stroke-width':22,'stroke-dasharray':(len-2)+' '+(C-len+2),'stroke-dashoffset':-off,transform:'rotate(-90 80 80)',class:'seg'},donut));off+=len;});
const cT=el('text',{x:80,y:78,'text-anchor':'middle','font-family':'Readex Pro, sans-serif','font-size':22,'font-weight':700,fill:'var(--fg)'},donut);
const cS=el('text',{x:80,y:98,'text-anchor':'middle','font-family':'IBM Plex Sans Arabic, sans-serif','font-size':11,fill:'var(--muted)'},donut);
function hiS(i){segs.forEach((s,j)=>{s.setAttribute('stroke-width',j===i?28:22);s.style.opacity=j===i?1:.45;});$$('#legend button').forEach((b,j)=>b.classList.toggle('on',j===i));cT.textContent=SPLIT[i].v+'%';cS.textContent=SPLIT[i].n;}
SPLIT.forEach((s,i)=>{const b=document.createElement('button');b.innerHTML='<span class="sw" style="background:'+s.c+'"></span><span>'+s.n+'</span><b class="mono">'+s.v+'%</b>';b.onmouseenter=b.onclick=()=>hiS(i);$('#legend').appendChild(b);segs[i].addEventListener('mouseenter',()=>hiS(i));segs[i].addEventListener('click',()=>hiS(i));});hiS(0);
(function(){const s=$('#accChart'),x0=88,x1=286,sx=v=>x0+(x1-x0)*v/100;
  [0,25,50,75,100].forEach(t=>{el('line',{x1:sx(t),x2:sx(t),y1:14,y2:112,stroke:'var(--line)','stroke-width':1},s);const tt=el('text',{x:sx(t),y:130,'text-anchor':'middle','font-size':11,fill:'var(--muted)','font-family':'JetBrains Mono, monospace'},s);tt.textContent=t;});
  [{n:'Validation',v:92.9,c:'var(--teal)',y:28},{n:'Test',v:93.3,c:'var(--amber)',y:70}].forEach(d=>{const l=el('text',{x:0,y:d.y+17,'font-size':13,fill:'var(--fg)','font-family':'IBM Plex Sans Arabic, sans-serif'},s);l.textContent=d.n;
    const r=el('rect',{x:x0,y:d.y,width:sx(d.v)-x0,height:26,rx:5,fill:d.c},s);r.dataset.w=sx(d.v)-x0;
    const v=el('text',{x:sx(d.v)-6,y:d.y+18,'text-anchor':'end','font-size':12,'font-weight':700,fill:'var(--cta-fg)','font-family':'JetBrains Mono, monospace'},s);v.textContent=d.v+'%';});
  const t=el('text',{x:sx(50),y:148,'text-anchor':'middle','font-size':10,fill:'var(--muted)','font-family':'IBM Plex Sans Arabic, sans-serif'},s);t.textContent='accuracy, %';})();
onEnter[idxOf('AI: dashboard')]=()=>{renderBars();if(reduce)return;$$('#accChart rect').forEach(r=>{const w=+r.dataset.w,st=performance.now();r.setAttribute('width',0);(function f(n){const k=Math.max(0,Math.min(1,(n-st)/700));r.setAttribute('width',w*(1-Math.pow(1-k,3)));if(k<1)requestAnimationFrame(f);})(st);});};

/* ---------- AI: pipeline ---------- */
const STAGES=[['Camera','Image or video frame','OpenCV reads a frame from the webcam, a video or an image file.'],['MediaPipe','Finds the hands','MediaPipe Holistic locates each hand and returns 21 landmarks per hand, each with x, y and z.'],['126 numbers','One input vector','21 points × 3 coordinates × 2 hands are flattened into one vector. Tap a point on the hand to see where its numbers sit.'],['MLP model','Three hidden layers','LetterClassifierMLP maps the vector through 512, 256 and 128 neurons.'],['Letter','One of 31 classes','The model scores each of the 31 letters; the app uses the confidence to write or ask (Part 5).']];
STAGES.forEach((s,i)=>{const b=document.createElement('button');b.className='stagebtn';b.innerHTML='<span class="n">0'+(i+1)+'</span><b>'+s[0]+'</b><span>'+s[1]+'</span>';b.onclick=()=>pickStage(i);$('#pipe').appendChild(b);});
function pickStage(i){$$('.stagebtn').forEach((b,j)=>b.setAttribute('aria-pressed',j===i));$('#stageTitle').textContent=STAGES[i][0];$('#stageText').textContent=STAGES[i][2];}pickStage(2);
const cells=[];for(let h=0;h<2;h++)for(let c=0;c<3;c++)for(let p=0;p<21;p++){const d=document.createElement('div');d.className='cell'+(h===0?' l':'');d.title='Hand '+(h+1)+' · '+NAMES[p]+' · '+'xyz'[c];$('#vec').appendChild(d);cells.push({p,d});}
drawHand($('#hand2'),$('#lmLabel2'),i=>{pickStage(2);cells.forEach(o=>o.d.classList.toggle('on',o.p===i));$('#lmLabel2').textContent='#'+i+' '+NAMES[i]+' → x, y, z on both hands';});

/* ---------- AI: architecture ---------- */
const LAYERS=[{n:126,k:7,t:'Input · 126',d:'The landmark vector: 21 points × 3 coordinates × 2 hands.',c:'var(--muted)'},{n:512,k:12,t:'Hidden 1 · 512',d:'Linear to 512, then GELU, BatchNorm and Dropout.',c:'var(--teal)'},{n:256,k:10,t:'Hidden 2 · 256',d:'Linear to 256, then GELU, BatchNorm and Dropout.',c:'var(--teal)'},{n:128,k:8,t:'Hidden 3 · 128',d:'Linear to 128, then GELU, BatchNorm and Dropout.',c:'var(--teal)'},{n:31,k:6,t:'Output · 31',d:'One score per letter; the highest is the prediction and its value is the confidence.',c:'var(--amber)'}];
const net=$('#net'),NW=640,NH=340,xs=LAYERS.map((_,i)=>60+i*(NW-120)/(LAYERS.length-1));
const pos=LAYERS.map((L,i)=>{const g=(NH-90)/(L.k+1);return Array.from({length:L.k},(_,j)=>[xs[i],24+g*(j+1)]);});
const eg=el('g',{},net);for(let i=0;i<LAYERS.length-1;i++)pos[i].forEach(a=>pos[i+1].forEach(b=>el('line',{x1:a[0],y1:a[1],x2:b[0],y2:b[1],stroke:'var(--line)','stroke-width':.7,'data-l':i},eg)));
const ng=LAYERS.map((L,i)=>{const g=el('g',{class:'layer',tabindex:0,role:'button','aria-label':L.t},net);el('rect',{x:xs[i]-26,y:10,width:52,height:NH-62,rx:12,fill:'transparent'},g);
  pos[i].forEach(p=>el('circle',{cx:p[0],cy:p[1],r:8,fill:'var(--panel-2)',stroke:L.c,'stroke-width':2.5},g));
  const t=el('text',{x:xs[i],y:NH-24,'text-anchor':'middle','font-family':'JetBrains Mono, monospace','font-size':15,'font-weight':600,fill:'var(--fg)'},g);t.textContent=L.n;
  const pick=()=>{$('#layerTitle').textContent=L.t;$('#layerText').textContent=L.d;light(i);};g.addEventListener('mouseenter',pick);g.addEventListener('click',pick);g.addEventListener('focus',pick);return g;});
function light(i){ng.forEach((g,j)=>g.querySelectorAll('circle').forEach(c=>c.style.fill=(j===i?LAYERS[j].c:'var(--panel-2)')));$$('#net line').forEach(l=>{const on=+l.dataset.l===i||+l.dataset.l===i-1;l.style.stroke=(on?'var(--amber)':'var(--line)');l.setAttribute('stroke-opacity',on?.5:1);});}
$('#fwd').onclick=()=>{let i=0;const tick=()=>{light(i);$('#layerTitle').textContent=LAYERS[i].t;$('#layerText').textContent=LAYERS[i].d;i++;if(i<LAYERS.length)setTimeout(tick,reduce?0:550);};tick();};

/* ---------- AI: data funnel ---------- */
let shown=false;
function funnel(){const f=$('#funnel');f.innerHTML='';const rows=shown?[['All images',54049,100,'var(--slate)'],['Hand detected (≈26%, est.)',14053,26,'var(--teal)']]:[['All images',54049,100,'var(--slate)']];
  rows.forEach(r=>{const d=document.createElement('div');d.className='bar-row';d.innerHTML='<div class="bar-top"><span>'+r[0]+'</span><b>'+r[1].toLocaleString('en-US')+'</b></div><div class="track"><div class="fill" style="background:'+r[3]+'"></div></div>';f.appendChild(d);requestAnimationFrame(()=>requestAnimationFrame(()=>d.querySelector('.fill').style.width=r[2]+'%'));});
  $('#funnelBtn').textContent=shown?'Show all images':'Show what MediaPipe keeps';}
$('#funnelBtn').onclick=()=>{shown=!shown;funnel();};funnel();

/* ---------- AI: steps ---------- */
const STEPS=[['Download ArASL','training/prepare/download_arasl.py',['Downloads the dataset from Kaggle with kagglehub','Moves it into data/letters']],['Normalize folder names','training/prepare/rename_arasl.py',['Renames English folders (aleff, bb, …) to Arabic letters','Merges ya and yaa into ي']],['Collect team samples','collector/collector.py · SignCollector.exe',['Shows a reference image per letter and coaches angle and hand movement','One round = 50 landmark samples; target 100 per letter per member','Saves locally, uploads to Supabase in the background, falls back to a ZIP']],['Monitor collection','collector/admin_gui.py',['Admin panel inside SignCollector','Leaderboard, member profiles, letter grid, deleting a member’s samples']],['Pull from Supabase','tools/pull_from_supabase.py',['IDs first, then samples in batches of 10','Each sample saved as .npy in its letter folder','30,400 samples from 608 rounds']],['Merge the data','data/letters/<letter>/',['ArASL images and Supabase files copied into 31 letter folders']],['Extract landmarks','training/train_letters.py',['Every image without an .npy runs through MediaPipe once, on 6 parallel processes','Saved next to the image so it never runs twice']],['Train','TrainLetters.exe · training/train_gui.py',['Shows progress, elapsed and remaining time, best validation accuracy','Up to 60 epochs, early stopping after 12','Saves best_letter_model.pt and letters_label_map.json to app/ml/saved']],['Run','FastAPI server',['Restart the API server so it loads the new model; the mobile app finds it on the same Wi-Fi']]];
let si=0;STEPS.forEach((s,i)=>{const b=document.createElement('button');b.className='stepbtn';b.innerHTML='<span class="sn">'+(i+1)+'</span><span>'+s[0]+'</span>';b.onclick=()=>pickStep(i);$('#steps').appendChild(b);});
function pickStep(i){si=i;$$('.stepbtn').forEach((b,j)=>b.setAttribute('aria-pressed',j===i));const s=STEPS[i];
  $('#stepDetail').innerHTML='<div class="bign">'+(i+1)+'</div><div style="min-width:0"><h3 style="font-size:22px">'+s[0]+'</h3><p style="margin-top:6px"><code>'+esc(s[1])+'</code></p><ul>'+s[2].map(x=>'<li>'+esc(x)+'</li>').join('')+'</ul></div>';
  $('#stepPrev').disabled=i===0;$('#stepNext').disabled=i===STEPS.length-1;}
$('#stepPrev').onclick=()=>pickStep(Math.max(0,si-1));$('#stepNext').onclick=()=>pickStep(Math.min(STEPS.length-1,si+1));pickStep(0);

/* ---------- AI: problems ---------- */
const PR=[['Pulling from Supabase failed (error 57014, statement timeout)','Requesting every sample in one query exceeded the time limit','IDs first, then batches of 10 that split when slow; rebuilt SignCollector.exe'],['Training would have ignored the images','The old code read only .npy files as soon as it found any','Extract landmarks from every image and merge both sources'],['The letter ي existed as two classes','ArASL has separate ya and yaa folders','Merged them: 32 → 31 classes'],['Most ArASL images have no landmarks','Only 64×64 pixels; upscaling or the Hands model did not help','Drop them automatically and rely more on team samples'],['Landmark extraction was slow (~44 min)','49 ms per image on a single process','6 parallel processes, results cached so they never repeat']];
PR.forEach(p=>{const b=document.createElement('button');b.className='prob';b.setAttribute('aria-expanded','false');b.innerHTML='<span class="q">'+p[0]+'</span><span class="ans"><span class="lbl c">Cause</span><span class="muted">'+p[1]+'</span><span class="lbl f">Fix</span><span>'+p[2]+'</span></span><span class="more">Tap to see cause and fix</span>';
  b.onclick=()=>{const o=!b.classList.contains('open');b.classList.toggle('open',o);b.setAttribute('aria-expanded',o);b.querySelector('.more').textContent=o?'Tap to hide':'Tap to see cause and fix';};$('#probs').appendChild(b);});
$('#openAll').onclick=()=>{const all=$$('.prob').every(p=>p.classList.contains('open'));$$('.prob').forEach(p=>{p.classList.toggle('open',!all);p.setAttribute('aria-expanded',!all);p.querySelector('.more').textContent=!all?'Tap to hide':'Tap to see cause and fix';});$('#openAll').textContent=all?'Show all fixes':'Hide all fixes';};

/* ---------- AI: next ---------- */
const TODO=['Test the letter model live with people who did not take part in collection','Bring in more contributing members to vary hands and angles','Deploy the AI server and the letter model on Railway','Connect the web camera tab to the AI service','Send the new SignCollector.exe to the team'];
let saved=[];try{saved=JSON.parse(localStorage.getItem('eshara-todo')||'[]');}catch(e){}
TODO.forEach((t,i)=>{const l=document.createElement('label');l.innerHTML='<input type="checkbox" id="todo'+i+'"'+(saved[i]?' checked':'')+'><span>'+t+'</span>';$('#todo').appendChild(l);l.querySelector('input').onchange=upd;});
function upd(){const st=$$('#todo input').map(x=>x.checked);try{localStorage.setItem('eshara-todo',JSON.stringify(st));}catch(e){}const n=st.filter(Boolean).length;$('#todoCount').textContent=n+' / '+TODO.length;$('#todoBar').style.width=(n/TODO.length*100)+'%';}upd();

printHooks.push(()=>{
  $$('.prob').forEach(p=>p.classList.add('open'));
  shown=true;funnel();mode='count';renderBars();$$('.fill').forEach(f=>f.style.transition='none');
  $('#counter').textContent='93.3%';
  const sd=$('#stepDetail');sd.style.display='block';sd.innerHTML='<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px">'+STEPS.map((s,i)=>'<div><b style="color:var(--amber);font-family:var(--mono)">'+(i+1)+'</b> <b>'+esc(s[0])+'</b><p class="muted" style="font-size:12px">'+esc(s[2][0])+'</p></div>').join('')+'</div>';
});
