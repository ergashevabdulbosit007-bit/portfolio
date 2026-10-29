// Focused typing engine: character-aligned rendering, shuffled passages and honest stats.
const $ = (id) => document.getElementById(id);
const PASSAGES = [
  'great developers do not wait for inspiration they build discipline every single day focus on the next character keep your rhythm trust your practice and turn every small improvement into extraordinary progress',
  'clean code is not written by following rules alone it grows from careful thinking small experiments and the courage to simplify what once seemed complicated',
  'the future belongs to curious minds who ask better questions test their assumptions and keep building even when the solution is not immediately obvious',
  'javascript turns ideas into interactive experiences while thoughtful architecture keeps every feature understandable reliable and ready to evolve',
  'science begins with observation and advances through evidence patience and the willingness to change a theory when new information appears',
  'debugging is the art of replacing guesses with evidence read the logs trace the state and follow the data until the real cause becomes clear',
  'small consistent actions compound over time every focused minute becomes a building block for skill confidence and meaningful progress',
  'a reliable backend validates every request protects its boundaries handles failure gracefully and never trusts input simply because it looks correct',
  'technology is most powerful when it helps people solve real problems with tools that feel clear accessible and dependable',
  'measure twice ship once learn from feedback and keep the interface simple enough that the important things speak for themselves',
  'quiet focus beats frantic speed when every character matters breathe steadily watch the cursor and let accuracy build your pace',
  'algorithms transform complex questions into repeatable steps and good tests reveal whether those steps behave as intended'
];
const safeGet=(key,fallback)=>{try{return localStorage.getItem(key)??fallback}catch{return fallback}};
const safeSet=(key,value)=>{try{localStorage.setItem(key,String(value))}catch{}};
export function initTyping(){
 const input=$('typing-input'); if(!input)return;
 const prompt=$('typing-prompt'), bestEl=$('typing-best'), overlay=$('prize-overlay');
 const wpmEl=$('typing-wpm'),rawEl=$('typing-raw'),accEl=$('typing-accuracy'),timeEl=$('typing-time'),conEl=$('typing-consistency'),errorsEl=$('typing-errors'),status=$('typing-status'),progress=$('typing-progress');
 let best=Math.max(99,Number(safeGet('abdulbositTypingBest','99'))||99);
 let bestConsistency=Math.max(100,Number(safeGet('abdulbositTypingConsistency','100'))||100);
 let duration=30,remaining=30,timer=null,start=0,running=false,ended=false,passage='',queue=[],lastPassage='',history=[];
 bestEl.textContent=`${best} WPM`;
 function refill(){queue=PASSAGES.filter(p=>p!==lastPassage).sort(()=>Math.random()-.5);if(!queue.length)queue=[...PASSAGES].sort(()=>Math.random()-.5);}
 function nextPassage(){if(!queue.length)refill();passage=queue.pop();lastPassage=passage;}
 function metrics(){
  const value=input.value;let correct=0,errors=0;
  for(let i=0;i<value.length;i++){if(i<passage.length&&value[i]===passage[i])correct++;else errors++}
  const elapsed=running?Math.max(.01,(Date.now()-start)/1000):Math.max(.01,duration-remaining);
  const minutes=elapsed/60, raw=Math.round((value.length/5)/minutes)||0,wpm=Math.round((correct/5)/minutes)||0;
  const accuracy=value.length?Math.round(correct/value.length*100):100;
  const consistency=history.length>1?Math.max(0,Math.round(100-(Math.sqrt(history.reduce((s,x)=>s+(x-history.reduce((a,b)=>a+b,0)/history.length)**2,0)/history.length)/(history.reduce((a,b)=>a+b,0)/history.length||1))*100)):100;
  return {correct,errors,raw,wpm,accuracy,consistency,elapsed};
 }
 function renderPrompt(){
  prompt.replaceChildren();const value=input.value;const frag=document.createDocumentFragment();
  [...passage].forEach((ch,i)=>{const span=document.createElement('span');span.className='typing-char';span.textContent=ch;
   if(i<value.length)span.classList.add(value[i]===ch?'correct':'wrong');
   if(i===value.length)span.classList.add('current');
   if(i>=value.length+1)span.classList.add('upcoming');
   frag.append(span);
  });prompt.append(frag);
  const current=prompt.querySelector('.current');if(current){const lineTop=current.offsetTop;const wrap=prompt.parentElement;if(lineTop>wrap.clientHeight*.7)current.scrollIntoView({block:'center',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});}
 }
 function paint(){
  const m=metrics();wpmEl.textContent=m.wpm;rawEl.textContent=m.raw;accEl.textContent=m.accuracy+'%';conEl.textContent=m.consistency+'%';errorsEl.textContent=m.errors;
  timeEl.textContent=`${remaining}s`;progress.style.transform=`scaleX(${remaining/duration})`;
 }
 function showPrize(m,kind='speed'){
  const copy=overlay.querySelector('.prize-copy');const title=$('prize-title');
  title.innerHTML=kind==='speed'?'PERSONAL RECORD<br><span>DESTROYED</span>':'PERFECT<br><span>CONSISTENCY</span>';
  overlay.querySelector('.prize-kicker').textContent='SYSTEM OVERRIDE · LEGENDARY REWARD';
  overlay.querySelector('.prize-reward strong').textContent=kind==='speed'?'THE INFINITE MIND':'THE FLOW STATE';
  copy.textContent=kind==='speed'?`Old record: ${m.previous} WPM → New record: ${m.wpm} WPM · ${m.accuracy}% accuracy. Virtual prize only.`:`Consistency record unlocked: ${m.consistency}%. Virtual prize only.`;
  const layer=$('prize-particles');layer.replaceChildren();
  for(let i=0;i<75;i++){const p=document.createElement('i');p.className='prize-particle';p.style.left=Math.random()*100+'%';p.style.setProperty('--dur',(2+Math.random()*3)+'s');p.style.setProperty('--drift',(-100+Math.random()*200)+'px');p.style.setProperty('--particle',['#67e8f9','#c4b5fd','#f0abfc','#fde68a'][i%4]);p.style.animationDelay=Math.random()+'s';layer.append(p);}
  overlay.hidden=false;document.body.style.overflow='hidden';$('prize-close').focus();
 }
 function finish(){
  if(ended)return;ended=true;running=false;clearInterval(timer);input.disabled=true;const m=metrics();paint();status.textContent='Test tugadi — natijangiz saqlandi.';
  let reward=null;
  if(m.wpm>best&&m.accuracy>=95){const previous=best;best=m.wpm;safeSet('abdulbositTypingBest',best);bestEl.textContent=best+' WPM';reward={...m,previous};}
  const oldConsistency=bestConsistency;
  if(m.consistency>bestConsistency&&m.accuracy>=95){bestConsistency=m.consistency;safeSet('abdulbositTypingConsistency',bestConsistency);reward=reward||{...m,previous:best};if(!reward.kind)reward.kind='consistency';}
  if(reward)setTimeout(()=>showPrize(reward,reward.kind||'speed'),350);
  status.textContent=reward?'NEW RECORD — LEGENDARY PRIZE UNLOCKED!':'Test yakunlandi. Yangi matn bilan yana urinib ko‘ring.';
 }
 function tick(){remaining=Math.max(0,duration-Math.floor((Date.now()-start)/1000));const m=metrics();history.push(m.wpm);paint();if(remaining<=0)finish();}
 function begin(){if(running||ended)return;running=true;start=Date.now();status.textContent='Davom eting — ritmni ushlang!';timer=setInterval(tick,100);}
 function reset(newText=true){clearInterval(timer);running=false;ended=false;remaining=duration;start=0;input.disabled=false;input.value='';history=[];if(newText||!passage)nextPassage();paint();renderPrompt();status.textContent='Tayyor bo‘lsangiz, yozishni boshlang.';input.focus();}
 input.addEventListener('input',()=>{if(ended)return;if(!running&&input.value.length)begin();if(input.value.length>passage.length)input.value=input.value.slice(0,passage.length);renderPrompt();if(running)history.push(metrics().wpm);paint();if(input.value.length>=passage.length)finish();});
 input.addEventListener('paste',e=>e.preventDefault());
 $('typing-focus')?.addEventListener('click',()=>input.focus());
 $('typing-reset').addEventListener('click',()=>reset(true));
 $('typing-retry')?.addEventListener('click',()=>reset(false));
 document.querySelectorAll('[data-duration]').forEach(btn=>btn.addEventListener('click',()=>{duration=Number(btn.dataset.duration);document.querySelectorAll('[data-duration]').forEach(b=>{const active=b===btn;b.classList.toggle('is-selected',active);b.setAttribute('aria-pressed',String(active));});reset(false);}));
 function closePrize(){overlay.hidden=true;document.body.style.overflow='';reset(true);}
 $('prize-close').addEventListener('click',closePrize);overlay.addEventListener('click',e=>{if(e.target===overlay)closePrize();});document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!overlay.hidden)closePrize();});
 reset(true);
}
