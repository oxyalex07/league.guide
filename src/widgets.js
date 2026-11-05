'use strict';
// Interactive lesson diagrams. Lessons embed <!-- Interactive: name --> and build.py emits
// <div class="widget" data-widget="name">. Every widget has a scrubber, Play, and a live caption,
// so the idea is readable without motion. Schematic only: no real ranges or timings.
const REDUCED=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
const NS='http://www.w3.org/2000/svg';
const lerp=(a,b,t)=>a+(b-a)*t;
function frameAt(frames,t){
 let i=0;while(i<frames.length-1&&frames[i+1].t<=t)i++;
 const a=frames[i],b=frames[Math.min(i+1,frames.length-1)];
 const k=b.t===a.t?0:Math.min(1,(t-a.t)/(b.t-a.t));
 const out={cap:a.cap,step:i};
 for(const key of Object.keys(a))if(typeof a[key]==='number'&&key!=='t')out[key]=lerp(a[key],b[key]??a[key],k);
 return out;
}
function el(tag,attrs={},parent){const e=document.createElementNS(NS,tag);for(const k in attrs)e.setAttribute(k,attrs[k]);if(parent)parent.appendChild(e);return e;}

/* ---------- Wave states ---------- */
const WAVE_MODES={
 'Slow push':[
  {t:0,x:320,b:6,r:6,cap:'Both waves meet near the middle of the lane.'},
  {t:.25,x:345,b:7,r:3,cap:'You kill only some enemy minions, usually the casters. Your survivors carry over.'},
  {t:.55,x:430,b:10,r:3,cap:'Each new wave joins the survivors, so your stack grows as it moves forward.'},
  {t:.85,x:540,b:13,r:1,cap:'A large wave reaches the enemy turret. While it works, you can ward, roam, help an objective or recall.'},
  {t:1,x:555,b:12,r:0,cap:'Result: lasting pressure. The enemy must clear a big wave under turret or lose it.'}],
 'Fast push':[
  {t:0,x:320,b:6,r:6,cap:'Both waves meet near the middle of the lane.'},
  {t:.25,x:328,b:6,r:1,cap:'You use abilities and attacks to clear the enemy wave as fast as possible.'},
  {t:.6,x:535,b:6,r:0,cap:'Your small wave walks quickly into the enemy turret.'},
  {t:1,x:555,b:3,r:0,cap:'Result: a short, fast window, good for a quick recall or a roam, but not lasting pressure.'}],
 'Freeze':[
  {t:0,x:205,b:3,r:6,cap:'The enemy wave is a little bigger, so the meeting point settles just outside your turret.'},
  {t:.35,x:195,b:4,r:7,cap:'You only last-hit. Extra damage would let the wave drift toward the enemy.'},
  {t:.7,x:200,b:3,r:6,cap:'The opponent must walk far from their turret to farm, which makes them easy to gank or zone.'},
  {t:1,x:198,b:3,r:6,cap:'Result: denial. Break the freeze yourself once it stops paying off, for example before you recall.'}],
 'Crash and bounce':[
  {t:0,x:470,b:12,r:3,cap:'A large slow-pushed wave approaches the enemy turret.'},
  {t:.3,x:560,b:9,r:0,cap:'The wave crashes. The turret and fresh enemy minions work through it.'},
  {t:.55,x:545,b:0,r:6,cap:'Your wave is gone. The enemy survivors and their next wave form a stack.'},
  {t:.85,x:370,b:4,r:9,cap:'That stack bounces back toward your side of the lane.'},
  {t:1,x:300,b:6,r:10,cap:'Result: a predictable bounce. Plan to be in lane for it, or let it reach your turret and set up your own freeze.'}]
};
function waveWidget(svg,state){
 svg.setAttribute('viewBox','0 0 640 220');
 el('rect',{x:0,y:0,width:640,height:220,rx:14,fill:'var(--tint)'},svg);
 el('rect',{x:20,y:92,width:600,height:36,rx:18,fill:'var(--surface)',stroke:'var(--line)'},svg);
 el('circle',{cx:40,cy:110,r:95,fill:'var(--blue)',opacity:.07},svg);
 el('circle',{cx:600,cy:110,r:95,fill:'var(--foe)',opacity:.07},svg);
 el('rect',{x:26,y:88,width:28,height:44,rx:5,fill:'var(--blue)'},svg);
 el('rect',{x:586,y:88,width:28,height:44,rx:5,fill:'var(--foe)'},svg);
 const t1=el('text',{x:26,y:160,'font-size':'14'},svg);t1.textContent='Your turret';
 const t2=el('text',{x:614,y:160,'text-anchor':'end','font-size':'14'},svg);t2.textContent='Enemy turret';
 const line=el('line',{y1:72,y2:148,stroke:'var(--ink)','stroke-dasharray':'4 5',opacity:.5},svg);
 const lbl=el('text',{y:62,'text-anchor':'middle','font-size':'13',fill:'var(--muted)'},svg);lbl.textContent='meeting point';
 const g=el('g',{},svg);
 const legend=el('text',{x:320,y:205,'text-anchor':'middle','font-size':'13',fill:'var(--muted)'},svg);
 return f=>{
  line.setAttribute('x1',f.x);line.setAttribute('x2',f.x);lbl.setAttribute('x',f.x);
  g.replaceChildren();
  const b=Math.round(f.b),r=Math.round(f.r);
  for(let i=0;i<b;i++){const col=Math.floor(i/3),row=i%3;el('circle',{cx:f.x-12-col*14,cy:96+row*14,r:6,fill:'var(--blue)'},g);}
  for(let i=0;i<r;i++){const col=Math.floor(i/3),row=i%3;el('rect',{x:f.x+6+col*14,y:90+row*14,width:12,height:12,rx:2,fill:'var(--foe)'},g);}
  legend.textContent=`Your minions (circles): ${b} · Enemy minions (squares): ${r}`;
 };
}

/* ---------- Trading window ---------- */
const TRADE_FRAMES=[
 {t:0,you:180,foe:440,cd:0,hp:100,ehp:100,cap:'Both players hold their position. The enemy key ability is ready, so stepping in now is risky.'},
 {t:.15,you:180,foe:430,cd:1,hp:100,ehp:100,cap:'The enemy uses their key ability, perhaps on the wave or on a missed poke. A window opens.'},
 {t:.3,you:330,foe:420,cd:.85,hp:100,ehp:100,cap:'Step in while that ability is on cooldown. Your trade is now safer.'},
 {t:.5,you:350,foe:415,cd:.6,hp:92,ehp:70,cap:'Trade with your own pattern: a few attacks or your short combo.'},
 {t:.68,you:190,foe:440,cd:.3,hp:92,ehp:70,cap:'Walk out before the cooldown returns. Leaving on time is what makes the trade a win.'},
 {t:1,you:180,foe:440,cd:0,hp:92,ehp:70,cap:'The ability is back and you are out of reach: you won the trade without overstaying.'}];
function tradeWidget(svg){
 svg.setAttribute('viewBox','0 0 640 240');
 el('rect',{x:0,y:0,width:640,height:240,rx:14,fill:'var(--tint)'},svg);
 el('rect',{x:20,y:60,width:600,height:60,rx:30,fill:'var(--surface)',stroke:'var(--line)'},svg);
 const you=el('circle',{cy:90,r:16,fill:'var(--blue)'},svg),foe=el('rect',{y:74,width:32,height:32,rx:4,fill:'var(--foe)'},svg);
 const yl=el('text',{y:50,'text-anchor':'middle'},svg);yl.textContent='You';
 const fl=el('text',{y:50,'text-anchor':'middle'},svg);fl.textContent='Enemy';
 const bars=(y,label)=>{const t=el('text',{x:20,y:y+13,'font-size':'13'},svg);t.textContent=label;el('rect',{x:220,y,width:400,height:16,rx:8,fill:'var(--surface)',stroke:'var(--line)'},svg);return el('rect',{x:220,y,height:16,rx:8},svg);};
 const cd=bars(150,'Enemy key ability');const hp=bars(180,'Your health');const ehp=bars(210,'Enemy health');
 const win=el('text',{x:320,y:140,'text-anchor':'middle','font-size':'13','font-weight':'700',fill:'var(--blue)'},svg);
 return f=>{
  you.setAttribute('cx',f.you);foe.setAttribute('x',f.foe-16);yl.setAttribute('x',f.you);fl.setAttribute('x',f.foe);
  const ready=f.cd<.05;cd.setAttribute('width',400*(1-f.cd));cd.setAttribute('fill',ready?'var(--foe)':'var(--muted)');
  hp.setAttribute('width',4*f.hp);hp.setAttribute('fill','var(--blue)');ehp.setAttribute('width',4*f.ehp);ehp.setAttribute('fill','var(--foe)');
  win.textContent=ready?'Enemy ability ready: respect it':'Window open: enemy ability on cooldown';
 };
}

/* ---------- Minion aggro ---------- */
const AGGRO_MODES={
 'Trade inside their wave':[
  {t:0,you:250,hp:100,ehp:100,ag:0,cap:'The enemy stands behind their minions. You walk into the wave to attack them.'},
  {t:.3,you:380,hp:100,ehp:100,ag:0,cap:'You hit the enemy champion while standing inside their minions’ range.'},
  {t:.5,you:380,hp:80,ehp:85,ag:1,cap:'Their minions switch targets to you. That is minion aggro.'},
  {t:.8,you:300,hp:62,ehp:85,ag:1,cap:'You won the champion exchange but lost the trade overall, because the minion damage added up.'},
  {t:1,you:250,hp:62,ehp:85,ag:0,cap:'Result: you took more total damage than you dealt.'}],
 'Trade outside their minion range':[
  {t:0,you:250,hp:100,ehp:100,ag:0,cap:'Wait for the enemy to step toward you, perhaps to last-hit a minion near your side.'},
  {t:.3,you:300,hp:100,ehp:100,ag:0,cap:'Their minions are far enough away that hitting the champion will not pull them onto you.'},
  {t:.5,you:300,hp:92,ehp:80,ag:0,cap:'You trade. Their minions keep attacking yours, not you.'},
  {t:.8,you:250,hp:92,ehp:80,ag:0,cap:'Walk back to your wave before they can retaliate.'},
  {t:1,you:250,hp:92,ehp:80,ag:0,cap:'Result: the same champion damage, without the minion damage.'}]
};
function aggroWidget(svg){
 svg.setAttribute('viewBox','0 0 640 240');
 el('rect',{x:0,y:0,width:640,height:240,rx:14,fill:'var(--tint)'},svg);
 el('rect',{x:20,y:70,width:600,height:70,rx:35,fill:'var(--surface)',stroke:'var(--line)'},svg);
 el('circle',{cx:470,cy:105,r:105,fill:'var(--foe)',opacity:.08},svg);
 const rl=el('text',{x:470,y:30,'text-anchor':'middle','font-size':'13',fill:'var(--muted)'},svg);rl.textContent='enemy minion range (schematic)';
 const minions=[];for(let i=0;i<6;i++){minions.push(el('rect',{x:440+(i%2)*22,y:80+Math.floor(i/2)*18,width:12,height:12,rx:2,fill:'var(--foe)'},svg));}
 const lines=el('g',{},svg);
 el('rect',{x:534,y:89,width:32,height:32,rx:4,fill:'var(--foe)'},svg);const el2=el('text',{x:550,y:160,'text-anchor':'middle'},svg);el2.textContent='Enemy';
 const you=el('circle',{cy:105,r:16,fill:'var(--blue)'},svg);const yl=el('text',{y:160,'text-anchor':'middle'},svg);yl.textContent='You';
 const shot=el('line',{y1:105,y2:105,x2:534,stroke:'var(--blue)','stroke-width':3},svg);
 const bar=(y,label,c)=>{const t=el('text',{x:20,y:y+13,'font-size':'13'},svg);t.textContent=label;el('rect',{x:160,y,width:300,height:14,rx:7,fill:'var(--surface)',stroke:'var(--line)'},svg);return el('rect',{x:160,y,height:14,rx:7,fill:c},svg);};
 const hp=bar(185,'Your health','var(--blue)'),ehp=bar(210,'Enemy health','var(--foe)');
 return f=>{
  you.setAttribute('cx',f.you);yl.setAttribute('x',f.you);
  shot.setAttribute('x1',f.you+16);shot.style.opacity=(f.step===1||f.step===2)?1:0;
  lines.replaceChildren();
  if(f.ag>.5)minions.forEach(m=>el('line',{x1:+m.getAttribute('x')+6,y1:+m.getAttribute('y')+6,x2:f.you,y2:105,stroke:'var(--foe)','stroke-width':1.5,'stroke-dasharray':'3 3'},lines));
  hp.setAttribute('width',3*f.hp);ehp.setAttribute('width',3*f.ehp);
 };
}

/* ---------- Jungle tracking (slider = time since last seen) ---------- */
function jungleWidget(svg){
 svg.setAttribute('viewBox','0 0 640 360');
 el('rect',{x:0,y:0,width:640,height:360,rx:14,fill:'var(--tint)'},svg);
 const map=el('g',{transform:'translate(150,20)'},svg);
 el('rect',{x:0,y:0,width:320,height:320,rx:16,fill:'var(--surface)',stroke:'var(--line)'},map);
 el('path',{d:'M20 300 L20 20 L300 20 M20 300 L300 300 L300 20 M20 300 L300 20',fill:'none',stroke:'var(--line)','stroke-width':14,'stroke-linecap':'round'},map);
 el('path',{d:'M40 300 C120 230 160 220 170 160',fill:'none',stroke:'var(--line)','stroke-width':6,opacity:.6},map);
 const cid='jclip'+Math.random().toString(36).slice(2,7);const cp=el('clipPath',{id:cid},el('defs',{},map));el('rect',{x:0,y:0,width:320,height:320,rx:16},cp);
 const reach=el('circle',{cx:95,cy:105,fill:'var(--foe)',opacity:.16,stroke:'var(--foe)','stroke-dasharray':'5 5','clip-path':`url(#${cid})`},map);
 el('rect',{x:85,y:95,width:20,height:20,rx:3,fill:'var(--foe)'},map);
 const seen=el('text',{x:95,y:84,'text-anchor':'middle','font-size':'12'},map);seen.textContent='last seen';
 const lanes={Top:[20,20],Mid:[160,160],Bot:[300,300]};
 const chips={};
 [['Top',480,60],['Mid',480,170],['Bot',480,280]].forEach(([n,x,y])=>{const g=el('g',{},svg);const r=el('rect',{x,y:y-20,width:140,height:40,rx:20,fill:'var(--surface)',stroke:'var(--line)'},g);const t=el('text',{x:x+70,y:y+5,'text-anchor':'middle','font-size':'14','font-weight':'700'},g);chips[n]={r,t};});
 [['Top',20,20],['Mid',160,160],['Bot',300,300]].forEach(([n,x,y])=>{const t=el('text',{x:x+(n==='Bot'?-30:12),y:y+(n==='Top'?-4:n==='Bot'?-10:-10),'font-size':'12',fill:'var(--muted)'},map);t.textContent=n;});
 return f=>{
  const r=20+f.s*2.6;reach.setAttribute('r',r);
  for(const n in lanes){const [x,y]=lanes[n];const d=Math.hypot(x-95,y-105);const risk=d<r;chips[n].r.setAttribute('fill',risk?'var(--foe)':'var(--surface)');chips[n].t.setAttribute('fill',risk?'var(--surface)':'var(--ink)');chips[n].t.textContent=n+(risk?': could be here':': safe for now');}
 };
}
const JUNGLE_FRAMES=[
 {t:0,s:0,cap:'You just saw the enemy jungler at a top-side camp. Right now only top lane is in danger.'},
 {t:.3,s:30,cap:'Some time passes. They could have finished the camp or walked toward top or mid. Mid should start respecting them.'},
 {t:.65,s:65,cap:'They could now reach mid easily. Bot side is still a long walk, so bot lane can trade more freely.'},
 {t:1,s:100,cap:'Enough time has passed that they could be anywhere, bot lane included. Information expires, so ping and ward again.'}];

/* ---------- Objective setup timeline ---------- */
const OBJ_STEPS=[['Reset and buy','Recall early enough that everyone is full when the window opens.'],['Push nearby waves','Push the lanes closest to the objective so enemies must choose between minions and the fight.'],['Take vision','Sweep and ward the entrances on the objective side before the enemy arrives.'],['Group and hold','Move together and claim the space with numbers, not one by one.'],['Start or trade','Start the objective if you control the area; if not, take something on the other side of the map.']];
function objectiveWidget(svg){
 svg.setAttribute('viewBox','0 0 640 200');
 el('rect',{x:0,y:0,width:640,height:200,rx:14,fill:'var(--tint)'},svg);
 el('line',{x1:70,x2:570,y1:90,y2:90,stroke:'var(--line)','stroke-width':6,'stroke-linecap':'round'},svg);
 const prog=el('line',{x1:70,y1:90,y2:90,stroke:'var(--blue)','stroke-width':6,'stroke-linecap':'round'},svg);
 const a=el('text',{x:70,y:170,'text-anchor':'middle','font-size':'12',fill:'var(--muted)'},svg);a.textContent='Earlier';
 const b=el('text',{x:570,y:170,'text-anchor':'middle','font-size':'12',fill:'var(--muted)'},svg);b.textContent='Objective spawns';
 const nodes=OBJ_STEPS.map(([n],i)=>{const x=70+i*125;const c=el('circle',{cx:x,cy:90,r:15,stroke:'var(--blue)','stroke-width':3},svg);const num=el('text',{x,y:95,'text-anchor':'middle','font-size':'13','font-weight':'700'},svg);num.textContent=i+1;const t=el('text',{x,y:i%2?52:135,'text-anchor':'middle','font-size':'14','font-weight':'700'},svg);t.textContent=n;return {c,num,t};});
 return f=>{
  prog.setAttribute('x2',70+f.p*500);
  const cur=Math.min(4,Math.floor(f.p*4+.0001));
  nodes.forEach((n,i)=>{const done=i<=cur;n.c.setAttribute('fill',done?'var(--blue)':'var(--surface)');n.num.setAttribute('fill',done?'var(--surface)':'var(--ink)');n.t.setAttribute('fill',i===cur?'var(--blue)':'var(--ink)');});
 };
}
const OBJ_FRAMES=[0,.25,.5,.75,1].map((t,i)=>({t,p:t,cap:`Step ${i+1}: ${OBJ_STEPS[i][0]}. ${OBJ_STEPS[i][1]}`}));

const WIDGETS={
 'wave-states':{title:'Wave states, animated',modes:WAVE_MODES,make:waveWidget},
 'trading-window':{title:'A trading window',frames:TRADE_FRAMES,make:tradeWidget},
 'minion-aggro':{title:'Minion aggro: the same trade, two places',modes:AGGRO_MODES,make:aggroWidget},
 'jungle-tracking':{title:'Where could the jungler be now?',frames:JUNGLE_FRAMES,make:jungleWidget,scrubLabel:'Time since last seen'},
 'objective-setup':{title:'Setting up an objective',frames:OBJ_FRAMES,make:objectiveWidget,scrubLabel:'Setup progress'}
};

function mountWidget(host){
 const spec=WIDGETS[host.dataset.widget];if(!spec||host.dataset.ready)return;host.dataset.ready='1';
 const modes=spec.modes?Object.keys(spec.modes):null;let mode=modes?modes[0]:null;
 const id='w'+Math.random().toString(36).slice(2,8);
 host.innerHTML=`<div class="w-head"><span class="w-badge">Interactive</span><strong>${spec.title}</strong></div>${modes?`<div class="w-modes" role="group" aria-label="Choose a scenario">${modes.map((m,i)=>`<button type="button" aria-pressed="${!i}" data-mode="${m}">${m}</button>`).join('')}</div>`:''}<div class="w-scroll"><svg class="w-svg" role="img" aria-labelledby="${id}-cap"></svg></div><p class="w-swipe" aria-hidden="true">Swipe the diagram sideways to see all of it.</p><p class="w-cap" id="${id}-cap" aria-live="polite"></p><div class="w-controls"><button type="button" class="w-play">▶ Play</button><label><span>${spec.scrubLabel||'Scrub'}</span><input type="range" min="0" max="1000" value="0" aria-label="${spec.scrubLabel||'Scrub through the animation'}"></label></div><p class="w-note">Schematic teaching model. Positions, sizes and timings are illustrative, not game data.</p>`;
 const svg=host.querySelector('svg'),cap=host.querySelector('.w-cap'),range=host.querySelector('input'),play=host.querySelector('.w-play');
 let draw=spec.make(svg),raf=0,t=0,lastCap='';
 const frames=()=>modes?spec.modes[mode]:spec.frames;
 const paint=()=>{const f=frameAt(frames(),t);draw(f);range.value=Math.round(t*1000);if(f.cap!==lastCap){cap.textContent=f.cap;lastCap=f.cap;}};
 const stop=()=>{cancelAnimationFrame(raf);raf=0;play.textContent=t>=1?'↺ Replay':'▶ Play';};
 play.onclick=()=>{
  if(raf){stop();return;}
  if(t>=1)t=0;
  if(REDUCED()){const fr=frames();const next=fr.find(x=>x.t>t+1e-6);t=next?next.t:1;paint();stop();return;}
  let prev=performance.now();play.textContent='❚❚ Pause';
  const tick=now=>{t=Math.min(1,t+(now-prev)/9000);prev=now;paint();if(t<1&&host.isConnected)raf=requestAnimationFrame(tick);else stop();};
  raf=requestAnimationFrame(tick);
 };
 range.oninput=()=>{stop();t=range.value/1000;paint();};
 host.querySelectorAll('[data-mode]').forEach(b=>b.onclick=()=>{stop();mode=b.dataset.mode;host.querySelectorAll('[data-mode]').forEach(x=>x.setAttribute('aria-pressed',x===b));svg.replaceChildren();draw=spec.make(svg);t=0;lastCap='';paint();});
 paint();
}
function mountAll(){document.querySelectorAll('.widget[data-widget]').forEach(mountWidget);}
document.addEventListener('DOMContentLoaded',()=>{mountAll();new MutationObserver(mountAll).observe(document.querySelector('#content'),{childList:true});});
