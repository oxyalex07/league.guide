'use strict';
// Personal dashboard: profile, goals, game log, trends and skill self-ratings.
// Everything is stored in this browser only (localStorage), like lesson progress.
const DASH_KEY='league-guide-dashboard-v1';
const RANKS=['Unranked','Iron','Bronze','Silver','Gold','Platinum','Emerald','Diamond','Master','Grandmaster','Challenger'];
const ROLES_LANE=['Top','Jungle','Mid','Bot','Support'];
const SKILLS=[
 ['lasthit','Last-hitting','last-hitting'],['trading','Trading','trading'],['waves','Wave management','wave-management'],
 ['map','Map awareness','map-awareness'],['vision','Vision and warding','warding'],['tracking','Jungle tracking','jungle-tracking'],
 ['objectives','Objective setup','objective-setup'],['position','Teamfight positioning','positioning'],
 ['late','Late-game decisions','late-game-macro'],['mental','Mental game','mental-game']];
const SKILL_LABELS=['Not yet','Shaky','Okay','Solid','Strong'];
function dashDefault(){return {profile:{name:'',rank:'Unranked',goalRank:'',role:'',role2:'',mains:[],goalCs10:'',goalDeaths:''},skills:{},games:[],sample:false};}
let dashStorageOk=true;
function loadDash(){try{const raw=localStorage.getItem(DASH_KEY);if(!raw)return dashDefault();const d=JSON.parse(raw);return {...dashDefault(),...d,profile:{...dashDefault().profile,...(d.profile||{})},skills:d.skills||{},games:Array.isArray(d.games)?d.games:[]};}catch(e){dashStorageOk=false;return dashDefault();}}
let dash=null;
function saveDash(){try{localStorage.setItem(DASH_KEY,JSON.stringify(dash));dashStorageOk=true;}catch(e){dashStorageOk=false;}}
const num=v=>v===''||v==null||isNaN(+v)?null:+v;
const avg=a=>a.length?a.reduce((s,x)=>s+x,0)/a.length:null;
const fmt=(v,d=1)=>v==null?'—':(Math.round(v*10**d)/10**d).toLocaleString();
const champName=slug=>(CHAMPIONS.find(c=>c.slug===slug)||{}).title||slug;
const champSlug=name=>{const k=searchKey(name);const c=CHAMPIONS.find(c=>searchKey(c.title)===k);return c?c.slug:null;};

/* ---------- Derived numbers ---------- */
function recent(n=20){return dash.games.slice(-n);}
function stats(){
 const g=recent();const n=g.length;
 const cs10=g.map(x=>num(x.cs10)).filter(v=>v!=null);
 const csmin=g.filter(x=>num(x.cs)!=null&&num(x.minutes)>0).map(x=>x.cs/x.minutes);
 const deaths=g.map(x=>num(x.deaths)).filter(v=>v!=null);
 const vis=g.filter(x=>num(x.vision)!=null&&num(x.minutes)>0).map(x=>x.vision/x.minutes);
 const wins=g.filter(x=>x.result==='W').length;
 const focused=g.filter(x=>x.focus);const kept=focused.filter(x=>x.focusDone).length;
 const kda=g.filter(x=>num(x.deaths)!=null).map(x=>((+x.kills||0)+(+x.assists||0))/Math.max(1,+x.deaths));
 return {n,winRate:n?wins/n*100:null,cs10:avg(cs10),csmin:avg(csmin),deaths:avg(deaths),vis:avg(vis),kda:avg(kda),focusRate:focused.length?kept/focused.length*100:null,focusN:focused.length};
}
function recommendations(){
 const s=stats(),p=dash.profile,out=[];
 const add=(slug,why)=>{if(!out.some(o=>o.slug===slug)){const l=LESSONS.find(l=>l.slug===slug);if(l)out.push({slug,title:l.title,why,done:!!progress[l.id]});}};
 const gCs=num(p.goalCs10),gD=num(p.goalDeaths);
 if(gCs!=null&&s.cs10!=null&&s.cs10<gCs){add('last-hitting',`Your average CS at 10 (${fmt(s.cs10)}) is below your goal of ${gCs}.`);add('wave-management','Wave control keeps minions in a place where you can collect them safely.');}
 if(gD!=null&&s.deaths!=null&&s.deaths>gD){add('map-awareness',`You average ${fmt(s.deaths)} deaths against a goal of ${gD}.`);add('jungle-tracking','Many avoidable deaths come from not knowing where the jungler is.');add('positioning','Check where you stand before fights start.');}
 if(s.focusN>=3&&s.focusRate<50)add('deliberate-practice',`You kept your practice focus in ${fmt(s.focusRate,0)}% of games that had one.`);
 const rated=SKILLS.filter(([k])=>dash.skills[k]).sort((a,b)=>dash.skills[a[0]]-dash.skills[b[0]]);
 rated.filter(([k])=>dash.skills[k]<=3).slice(0,3).forEach(([k,label,slug])=>add(slug,`You rated ${label.toLowerCase()} “${SKILL_LABELS[dash.skills[k]-1]}”.`));
 if(!out.length){const next=LESSONS.find(a=>a.id===pathIds.find(id=>!progress[id]));if(next)add(next.slug,'Next unpractised lesson on your path.');}
 return out.slice(0,5);
}

/* ---------- Charts (single series, one hue, hairline grid, goal as reference line) ---------- */
function niceMax(v){if(v<=0)return 1;const p=10**Math.floor(Math.log10(v));const m=v/p;return (m<=1?1:m<=2?2:m<=5?5:10)*p;}
function chartSvg({points,goal,kind,label,unit}){
 const W=640,H=230,L=40,R=62,T=18,B=30,iw=W-L-R,ih=H-T-B;
 if(!points.length)return `<p class="chart-empty">Log games with ${label.toLowerCase()} to see this chart.</p>`;
 const max=niceMax(Math.max(...points.map(p=>p.y),goal||0)*1.1);
 const y=v=>T+ih-(v/max)*ih,step=iw/Math.max(points.length,1);
 const x=i=>kind==='bar'?L+step*i+step/2:L+(points.length===1?iw/2:iw*i/(points.length-1));
 let g='';for(let k=0;k<=4;k++){const v=max*k/4,yy=y(v);g+=`<line x1="${L}" x2="${W-R}" y1="${yy}" y2="${yy}" class="ch-grid"/><text x="${L-8}" y="${yy+4}" text-anchor="end" class="ch-axis">${fmt(v,v<10?1:0)}</text>`;}
 let marks='';
 if(kind==='bar'){const bw=Math.max(4,Math.min(28,step-4)),r=Math.min(4,bw/2);points.forEach((p,i)=>{const cx=x(i),top=y(p.y),base=y(0);const h=base-top;marks+=h>0?`<path class="ch-bar" d="M${cx-bw/2},${base} V${top+r} Q${cx-bw/2},${top} ${cx-bw/2+r},${top} H${cx+bw/2-r} Q${cx+bw/2},${top} ${cx+bw/2},${top+r} V${base} Z"/>`:`<line class="ch-zero" x1="${cx-bw/2}" x2="${cx+bw/2}" y1="${base}" y2="${base}"/>`;});}
 else{marks=`<polyline class="ch-line" points="${points.map((p,i)=>`${x(i)},${y(p.y)}`).join(' ')}"/>`+points.map((p,i)=>`<circle class="ch-dot" cx="${x(i)}" cy="${y(p.y)}" r="4.5"/>`).join('');}
 const last=points[points.length-1],li=points.length-1;
 const endLabel=`<text x="${x(li)}" y="${y(last.y)-12}" text-anchor="middle" class="ch-end">${fmt(last.y)}</text>`;
 const goalLine=goal!=null?`<line class="ch-goal" x1="${L}" x2="${W-R}" y1="${y(goal)}" y2="${y(goal)}"/><text x="${W-R+8}" y="${y(goal)+4}" class="ch-goal-t">Goal ${goal}</text>`:'';
 const xl=points.map((p,i)=>(i===0||i===li||(points.length>8&&i===Math.floor(li/2)))?`<text x="${x(i)}" y="${H-8}" text-anchor="middle" class="ch-axis">${esc(p.short)}</text>`:'').join('');
 const hits=points.map((p,i)=>`<rect class="ch-hit" x="${x(i)-step/2}" y="${T}" width="${step}" height="${ih}" tabindex="0" data-tip="${esc(p.tip)}" aria-label="${esc(p.tip)}"/>`).join('');
 return `<div class="chart-wrap"><svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(label)} for your last ${points.length} games${goal!=null?', goal '+goal:''}">${g}${marks}${goalLine}${kind==='bar'?'':endLabel}${xl}${hits}</svg><div class="ch-tip" role="tooltip" hidden></div></div>`;
}
function gamePoints(field){
 return recent().map((g,i,arr)=>({g,i})).filter(({g})=>num(g[field])!=null).map(({g,i})=>({y:+g[field],short:'G'+(dash.games.length-recent().length+i+1),tip:`Game ${dash.games.length-recent().length+i+1} · ${g.date||''} · ${champName(g.champ)||'—'} · ${g.result==='W'?'Win':g.result==='L'?'Loss':''} · ${field==='cs10'?'CS at 10':'Deaths'}: ${g[field]}`}));
}

/* ---------- Page ---------- */
function dashboardHtml(){
 dash=loadDash();const p=dash.profile,s=stats(),recs=recommendations();
 const done=pathIds.filter(id=>progress[id]).length;
 const opt=(list,v,blank)=>(blank?`<option value="">${blank}</option>`:'')+list.map(x=>`<option ${x===v?'selected':''}>${x}</option>`).join('');
 const tiles=[['Games logged',dash.games.length,'' ],['Win rate',s.winRate==null?'—':fmt(s.winRate,0)+'%','last '+Math.min(20,s.n)+' games'],['CS at 10',fmt(s.cs10),num(p.goalCs10)!=null?'goal '+p.goalCs10:'average'],['CS per minute',fmt(s.csmin),'average'],['Deaths',fmt(s.deaths),num(p.goalDeaths)!=null?'goal '+p.goalDeaths:'average per game'],['Focus kept',s.focusRate==null?'—':fmt(s.focusRate,0)+'%',s.focusN?s.focusN+' games with a focus':'set a focus per game']];
 const chOpts=CHAMPIONS.map(c=>`<option value="${esc(c.title)}"></option>`).join('');
 return `<div class="home grid-page dash">
 <div class="page-head dash-head"><div><p class="eyebrow">Your dashboard</p><h1 tabindex="-1">${p.name?esc(p.name)+'’s dashboard':'My dashboard'}</h1><p class="hero-lead">Log your games, rate your skills and see what to practise next. Everything stays in this browser.</p></div>
 <div class="dash-head-actions"><button type="button" class="btn primary" data-dash-jump="dash-log">+ Log a game</button></div></div>
 ${dash.sample?`<div class="dash-banner" role="status"><span>You are looking at <strong>sample games</strong>. They are not your data.</span><button type="button" class="btn" data-dash="clear-sample">Clear sample data</button></div>`:''}
 ${!dashStorageOk?`<div class="dash-banner warn" role="status">Browser storage is unavailable, so entries last only while this page is open. Use Export to keep a copy.</div>`:''}

 <section class="dash-tiles" aria-label="Summary">${tiles.map(([k,v,sub])=>`<div class="tile"><span class="tile-k">${k}</span><strong class="tile-v">${v}</strong><span class="tile-s">${sub}</span></div>`).join('')}</section>

 <div class="dash-grid">
 <div class="dash-col">
  <section class="card dash-span2" aria-labelledby="ch1"><div class="card-head"><h2 id="ch1">CS at 10 minutes</h2><span class="card-sub">Last ${Math.min(20,dash.games.length)} games</span></div>${chartSvg({points:gamePoints('cs10'),goal:num(p.goalCs10),kind:'line',label:'CS at 10 minutes'})}</section>
  <section class="card dash-span2" aria-labelledby="ch2"><div class="card-head"><h2 id="ch2">Deaths per game</h2><span class="card-sub">Lower is better</span></div>${chartSvg({points:gamePoints('deaths'),goal:num(p.goalDeaths),kind:'bar',label:'Deaths per game'})}</section>
 </div>
 <div class="dash-col">
  <section class="card" aria-labelledby="rec-h"><div class="card-head"><h2 id="rec-h">Work on next</h2></div>${recs.length?`<ol class="recs">${recs.map(r=>`<li><a href="#/lesson/${r.slug}"><strong>${esc(r.title)}${r.done?' <span class="rec-done">practised</span>':''}</strong><small>${esc(r.why)}</small></a></li>`).join('')}</ol>`:'<p class="card-empty">Rate your skills or set goals to get suggestions.</p>'}<p class="card-foot">Based on your goals, ratings and logged games, not on rank averages.</p>${(()=>{const r=ROLE_GUIDES.find(x=>x.role===p.role);return r?`<a class="dash-role" href="#/role/${r.slug}">${roleMap(r.slug)}<span><small>Your main role</small><strong>${esc(r.title)} →</strong></span></a>`:'';})()}</section>
  <section class="card" aria-labelledby="lp-h"><div class="card-head"><h2 id="lp-h">Learning path</h2></div><p class="lp-big"><strong>${done}</strong> of ${pathIds.length} lessons practised</p><progress max="${pathIds.length}" value="${done}" aria-label="Lessons practised"></progress><ul class="lp-stages">${LEARNING_PATH.map((st,i)=>{const d=st.ids.filter(id=>progress[id]).length;return `<li><span>${i+1}. ${esc(st.title)}</span><span class="lp-mini" style="--p:${Math.round(d/st.ids.length*100)}%" aria-label="${d} of ${st.ids.length}"></span></li>`;}).join('')}</ul><a href="#/path">Open the path →</a></section>
 </div>
 </div>

 <section class="card" id="dash-log" aria-labelledby="log-h">
  <div class="card-head"><h2 id="log-h">Log a game</h2><span class="card-sub">Numbers from the post-game screen or match history. Leave blank what you do not know.</span></div>
  <form class="dash-form" id="game-form" novalidate>
   <div class="f"><label for="g-date">Date</label><input id="g-date" name="date" type="date" value="${new Date().toISOString().slice(0,10)}"></div>
   <div class="f"><label for="g-champ">Champion</label><input id="g-champ" name="champ" list="champ-list" autocomplete="off" placeholder="e.g. Ahri" value="${p.mains[0]?esc(champName(p.mains[0])):''}"><datalist id="champ-list">${chOpts}</datalist></div>
   <div class="f"><label for="g-role">Role</label><select id="g-role" name="role">${opt(ROLES_LANE,p.role,'—')}</select></div>
   <fieldset class="f seg"><legend>Result</legend><label><input type="radio" name="result" value="W" checked><span>Win</span></label><label><input type="radio" name="result" value="L"><span>Loss</span></label></fieldset>
   <div class="f"><label for="g-min">Game length (min)</label><input id="g-min" name="minutes" type="number" min="1" max="90" inputmode="numeric" placeholder="28"></div>
   <div class="f"><label for="g-cs10">CS at 10 min</label><input id="g-cs10" name="cs10" type="number" min="0" max="200" inputmode="numeric" placeholder="65"></div>
   <div class="f"><label for="g-cs">Total CS</label><input id="g-cs" name="cs" type="number" min="0" max="1500" inputmode="numeric" placeholder="190"></div>
   <div class="f kda"><span class="lab" id="kda-l">K / D / A</span><div role="group" aria-labelledby="kda-l"><input name="kills" type="number" min="0" aria-label="Kills" placeholder="K"><input name="deaths" type="number" min="0" aria-label="Deaths" placeholder="D"><input name="assists" type="number" min="0" aria-label="Assists" placeholder="A"></div></div>
   <div class="f"><label for="g-vis">Vision score</label><input id="g-vis" name="vision" type="number" min="0" max="300" inputmode="numeric" placeholder="22"></div>
   <div class="f wide"><label for="g-focus">Practice focus this game</label><select id="g-focus" name="focus"><option value="">None</option>${LESSONS.map(l=>`<option value="${l.slug}">${esc(l.title)}</option>`).join('')}</select></div>
   <label class="f check"><input type="checkbox" name="focusDone"><span>I stuck to my focus</span></label>
   <div class="f wide"><label for="g-notes">Note (optional)</label><input id="g-notes" name="notes" maxlength="200" placeholder="One thing you learned"></div>
   <div class="form-actions"><button class="btn primary" type="submit">Save game</button><p id="form-msg" role="status" class="form-msg"></p></div>
  </form>
 </section>

 <section class="card" aria-labelledby="hist-h"><div class="card-head"><h2 id="hist-h">Game history</h2><span class="card-sub">${dash.games.length} game${dash.games.length===1?'':'s'}</span></div>
 ${dash.games.length?`<div class="table-scroll"><table class="games"><thead><tr><th scope="col">Date</th><th scope="col">Champion</th><th scope="col">Result</th><th scope="col" class="n">CS@10</th><th scope="col" class="n">CS/min</th><th scope="col" class="n">K/D/A</th><th scope="col" class="n">Vision</th><th scope="col">Focus</th><th scope="col"><span class="sr">Delete</span></th></tr></thead><tbody>${dash.games.slice().reverse().map(g=>`<tr><td>${esc(g.date||'')}</td><td>${esc(champName(g.champ)||'—')}${g.role?` <small>${esc(g.role)}</small>`:''}</td><td><span class="res ${g.result==='W'?'w':'l'}">${g.result==='W'?'Win':'Loss'}</span></td><td class="n">${g.cs10??'—'}</td><td class="n">${num(g.cs)!=null&&num(g.minutes)>0?fmt(g.cs/g.minutes):'—'}</td><td class="n">${[g.kills,g.deaths,g.assists].map(v=>v??'–').join('/')}</td><td class="n">${g.vision??'—'}</td><td>${g.focus?esc((LESSONS.find(l=>l.slug===g.focus)||{}).title||'')+(g.focusDone?' ✓':''):''}</td><td><button type="button" class="icon-btn" data-del="${g.id}" aria-label="Delete game from ${esc(g.date||'')}">✕</button></td></tr>`).join('')}</tbody></table></div>`:`<div class="card-empty"><p>No games logged yet. Log your next game above, or try the page with sample data.</p><button type="button" class="btn" data-dash="sample">Try with sample games</button></div>`}
 </section>

 <div class="dash-grid two">
 <section class="card" aria-labelledby="sk-h"><div class="card-head"><h2 id="sk-h">Rate your skills</h2><span class="card-sub">Be honest; this only guides suggestions.</span></div>
  <div class="skills">${SKILLS.map(([k,label,slug])=>{const v=dash.skills[k]||0;return `<fieldset class="skill"><legend><a href="#/lesson/${slug}">${label}</a></legend><div class="rate">${SKILL_LABELS.map((t,i)=>`<label title="${t}"><input type="radio" name="sk-${k}" value="${i+1}" data-skill="${k}" ${v===i+1?'checked':''}><span>${i+1}</span></label>`).join('')}</div><span class="rate-t">${v?SKILL_LABELS[v-1]:'Not rated'}</span></fieldset>`;}).join('')}</div>
 </section>
 <section class="card" aria-labelledby="pr-h"><div class="card-head"><h2 id="pr-h">Profile and goals</h2></div>
  <form class="dash-form profile" id="profile-form">
   <div class="f wide"><label for="p-name">Name (optional)</label><input id="p-name" name="name" maxlength="40" value="${esc(p.name)}" placeholder="Summoner name"></div>
   <div class="f"><label for="p-rank">Current rank</label><select id="p-rank" name="rank">${opt(RANKS,p.rank)}</select></div>
   <div class="f"><label for="p-goal">Goal rank</label><select id="p-goal" name="goalRank">${opt(RANKS.slice(1),p.goalRank,'—')}</select></div>
   <div class="f"><label for="p-role">Main role</label><select id="p-role" name="role">${opt(ROLES_LANE,p.role,'—')}</select></div>
   <div class="f"><label for="p-role2">Second role</label><select id="p-role2" name="role2">${opt(ROLES_LANE,p.role2,'—')}</select></div>
   <div class="f wide"><label for="p-mains">Main champions (up to 3, comma separated)</label><input id="p-mains" name="mains" list="champ-list" value="${esc(p.mains.map(champName).join(', '))}" placeholder="Ahri, Lux, Orianna"></div>
   <div class="f"><label for="p-gcs">Goal: CS at 10</label><input id="p-gcs" name="goalCs10" type="number" min="0" max="200" value="${esc(p.goalCs10)}" placeholder="e.g. 70"></div>
   <div class="f"><label for="p-gd">Goal: deaths per game</label><input id="p-gd" name="goalDeaths" type="number" min="0" max="30" value="${esc(p.goalDeaths)}" placeholder="e.g. 4"></div>
   <div class="form-actions"><button class="btn primary" type="submit">Save profile</button><p id="profile-msg" role="status" class="form-msg"></p></div>
  </form>
  ${p.mains.length?`<div class="mains">${p.mains.map(s=>CHAMPIONS.find(c=>c.slug===s)).filter(Boolean).map(championCard).join('')}</div>`:''}
 </section>
 </div>

 <section class="card data-card" aria-labelledby="data-h"><div class="card-head"><h2 id="data-h">Your data</h2><span class="card-sub">Stored only in this browser. It does not sync between devices.</span></div>
  <div class="data-actions"><button type="button" class="btn" data-dash="export">Export (.json)</button><label class="btn file-btn">Import<input type="file" accept="application/json,.json" id="dash-import"></label><button type="button" class="btn danger" data-dash="reset">Delete all dashboard data</button></div><p id="data-msg" role="status" class="form-msg"></p>
 </section>
</div>`;
}

function sampleGames(){
 const champs=['ahri','lux','orianna'].filter(s=>CHAMPIONS.some(c=>c.slug===s));const out=[];const today=new Date();
 const cs10=[52,58,55,61,57,63,60,66,62,68,64,70];const deaths=[7,6,8,5,6,4,5,6,3,4,5,3];
 cs10.forEach((c,i)=>{const d=new Date(today);d.setDate(d.getDate()-(cs10.length-i)*2);const m=24+((i*7)%12);
  out.push({id:'s'+i,date:d.toISOString().slice(0,10),champ:champs[i%champs.length]||'',role:'Mid',result:i%3===1?'L':'W',minutes:m,cs10:c,cs:Math.round(c*m/9.2),kills:3+(i%5),deaths:deaths[i],assists:5+(i%6),vision:14+i,focus:i<6?'last-hitting':'map-awareness',focusDone:i%4!==0,notes:''});});
 return out;
}

function renderDash(focusSel){
 $('#content').innerHTML=dashboardHtml();bindDash();
 if(focusSel){const el=document.querySelector(focusSel);if(el)el.focus({preventScroll:false});}
}
function msg(id,text){const el=document.getElementById(id);if(el)el.textContent=text;}
function bindDash(){
 const gf=$('#game-form');
 gf.onsubmit=e=>{e.preventDefault();const f=new FormData(gf);const v=k=>{const x=String(f.get(k)||'').trim();return x;};
  const champTxt=v('champ');const slug=champTxt?champSlug(champTxt):'';
  if(champTxt&&!slug){msg('form-msg','Pick a champion from the list, or leave it blank.');$('#g-champ').focus();return;}
  const nums=['minutes','cs10','cs','kills','deaths','assists','vision'];const game={id:Date.now().toString(36),date:v('date'),champ:slug||'',role:v('role'),result:v('result')||'W',focus:v('focus'),focusDone:!!f.get('focusDone'),notes:v('notes')};
  for(const k of nums){const x=v(k);if(x===''){game[k]=null;continue;}if(isNaN(+x)||+x<0){msg('form-msg',`Check the ${k} value.`);return;}game[k]=+x;}
  if(dash.sample){dash.games=[];dash.sample=false;}
  dash.games.push(game);dash.games.sort((a,b)=>(a.date||'').localeCompare(b.date||''));saveDash();renderDash();msg('form-msg','Game saved.');
  const h=document.getElementById('hist-h');if(h)h.scrollIntoView({behavior:REDUCED()?'auto':'smooth',block:'start'});};
 const pf=$('#profile-form');
 pf.onsubmit=e=>{e.preventDefault();const f=new FormData(pf);const p=dash.profile;
  ['name','rank','goalRank','role','role2','goalCs10','goalDeaths'].forEach(k=>p[k]=String(f.get(k)||'').trim());
  const names=String(f.get('mains')||'').split(',').map(x=>x.trim()).filter(Boolean);const slugs=names.map(champSlug);
  const bad=names.filter((n,i)=>!slugs[i]);if(bad.length){msg('profile-msg','Not found: '+bad.join(', ')+'. Use names from the list.');return;}
  p.mains=[...new Set(slugs)].slice(0,3);saveDash();renderDash();msg('profile-msg','Profile saved.');};
 document.querySelectorAll('[data-skill]').forEach(r=>r.onchange=()=>{dash.skills[r.dataset.skill]=+r.value;saveDash();renderDash(`[name="sk-${r.dataset.skill}"][value="${r.value}"]`);});
 const imp=$('#dash-import');imp.onchange=()=>{const file=imp.files[0];if(!file)return;const rd=new FileReader();rd.onload=()=>{try{const d=JSON.parse(rd.result);if(!d||!Array.isArray(d.games))throw 0;dash={...dashDefault(),...d,profile:{...dashDefault().profile,...(d.profile||{})}};saveDash();renderDash();msg('data-msg','Imported '+dash.games.length+' games.');}catch(e){msg('data-msg','That file is not a League.guide dashboard export.');}};rd.readAsText(file);};
 // Chart tooltips: hover or keyboard focus on any data column.
 document.querySelectorAll('.chart-wrap').forEach(w=>{const tip=w.querySelector('.ch-tip');const show=e=>{const t=e.target.closest('.ch-hit');if(!t)return;tip.textContent=t.dataset.tip;tip.hidden=false;const wr=w.getBoundingClientRect(),r=t.getBoundingClientRect();const x=Math.min(Math.max(r.left+r.width/2-wr.left,90),wr.width-90);tip.style.left=x+'px';w.querySelectorAll('.ch-hit').forEach(h=>h.classList.toggle('on',h===t));};const hide=()=>{tip.hidden=true;w.querySelectorAll('.ch-hit').forEach(h=>h.classList.remove('on'));};
  w.addEventListener('pointerover',show);w.addEventListener('focusin',show);w.addEventListener('pointerleave',hide);w.addEventListener('focusout',hide);});
}
document.addEventListener('click',e=>{
 const j=e.target.closest('[data-dash-jump]');if(j){e.preventDefault();const t=document.getElementById(j.dataset.dashJump);if(t){t.scrollIntoView({behavior:REDUCED()?'auto':'smooth',block:'start'});const first=t.querySelector('input,select');if(first)first.focus({preventScroll:true});}return;}
 const del=e.target.closest('[data-del]');if(del){dash.games=dash.games.filter(g=>g.id!==del.dataset.del);if(!dash.games.length)dash.sample=false;saveDash();renderDash('#hist-h');return;}
 const a=e.target.closest('[data-dash]');if(!a)return;const act=a.dataset.dash;
 if(act==='sample'){dash.games=sampleGames();dash.sample=true;if(!dash.profile.goalCs10)dash.profile.goalCs10='65';if(!dash.profile.goalDeaths)dash.profile.goalDeaths='5';saveDash();renderDash();}
 else if(act==='clear-sample'){dash.games=[];dash.sample=false;saveDash();renderDash();}
 else if(act==='export'){const blob=new Blob([JSON.stringify(dash,null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);const l=document.createElement('a');l.href=url;l.download='league-guide-dashboard.json';document.body.appendChild(l);l.click();l.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);msg('data-msg','Export downloaded.');}
 else if(act==='reset'){if(confirm('Delete your profile, skill ratings and all logged games from this browser? Lesson progress is kept.')){dash=dashDefault();saveDash();renderDash();msg('data-msg','Dashboard data deleted.');}}
});
