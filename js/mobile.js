/* ---------- mobile simulator ---------- */
const conf=$('#conf'),tbox=$('#tbox'),msg=$('#simMsg');let held=false,pending=false;
const LETTERS=['م','ر','ح','ب','ا'];let li=0;
function zone(v){return v>=80?'write':v>=50?'ask':'none';}
conf.oninput=()=>{$('#confTag').textContent=conf.value+'%';};
$('#showSign').onclick=()=>{
  if(held){msg.textContent='Same sign still held: not repeated. Lower your hand first.';return;}
  held=true;const L=$('#camSign').textContent;const z=zone(+conf.value);
  if(z==='write'){tbox.textContent+=L;msg.textContent='Above 80%: written immediately.';}
  else if(z==='ask'){pending=true;$('#askL').textContent=L;$('#ask').hidden=false;msg.textContent='Between 50% and 80%: asking for confirmation.';}
  else{msg.textContent='Below 50%: nothing is written. Keep signing.';}
};
$('#lower').onclick=()=>{held=false;$('#ask').hidden=true;pending=false;msg.textContent='Hand lowered. The next sign counts as new.';};
$('#yes').onclick=()=>{if(pending){tbox.textContent+=$('#askL').textContent;}pending=false;$('#ask').hidden=true;msg.textContent='Confirmed and written.';};
$('#no').onclick=()=>{pending=false;$('#ask').hidden=true;msg.textContent='Rejected. Nothing written.';};
$('#tSpace').onclick=()=>{tbox.textContent+=' ';};
$('#tDel').onclick=()=>{tbox.textContent=tbox.textContent.slice(0,-1);};
$('#tCopy').onclick=()=>{const t=tbox.textContent;const done=()=>msg.textContent='Copied.';if(navigator.clipboard)navigator.clipboard.writeText(t).then(done,()=>msg.textContent='Copy is blocked here; select the text instead.');};
$('#camSign').addEventListener('click',()=>{if(held)return;li=(li+1)%LETTERS.length;$('#camSign').textContent=LETTERS[li];msg.textContent='Changed the sign on camera.';});
$('#camSign').title='Click to change the sign';
