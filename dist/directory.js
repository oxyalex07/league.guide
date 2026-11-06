'use strict';
// Champion records are built from content/champions by champions.py.
const MATCHUPS=[
 {slug:'ahri-vs-lux',title:'Ahri vs Lux',kind:'Mid lane study',champions:['ahri','lux'],summary:'Study commitment, spacing and safe follow-up.',focus:'Watch how a move forward changes both players’ options. This exercise compares mobility decisions with the risk of stepping into attack range.',sides:[['Playing Ahri','Before moving forward, identify how you will leave if the attempt fails. Reassess after Lux uses a spell rather than assuming any missed spell makes the whole lane safe.'],['Playing Lux','After a spell hits, check whether stepping forward to attack would expose you to a response. Keep the space you need to retreat instead of chasing every mark.']],scenario:'Hypothetical: Lux lands a spell while Ahri still has mobility available. Lux can stay at range or walk forward for an attack. Pause and compare the reward with the route Ahri could use to respond. The answer changes with health, wave position and nearby players.',drill:'Review three exchanges. Write down who moved forward first, which tools remained available, and whether that player had an exit.',lessons:['spacing','cooldown-tracking','trading']},
 {slug:'garen-vs-darius',title:'Garen vs Darius',kind:'Top lane study',champions:['garen','darius'],summary:'Study trade length, bleed stacks and recovery.',focus:'Darius’s stacking bleed makes continued contact matter. Garen’s recovery rewards finding a break from incoming damage. Use these mechanics to examine when a trade should end.',sides:[['Playing Garen','Plan where to leave before trading. If Darius can keep contact, reassess early rather than waiting until your health forces the decision. A recovery plan requires a real break from damage.'],['Playing Darius','Watch whether you can extend contact safely. Do not chase solely because stacks are building: the wave, enemy tower and missing players can make continuing a poor choice.']],scenario:'Hypothetical: Garen steps up for a minion and Darius responds. The trade continues toward Darius’s side of the lane. Pause before Garen moves farther forward: where can he leave, what stacks are visible, and who else could arrive?',drill:'Review three trades. Note visible stacks, the direction each player moved, and when each had a chance to disengage. Judge the decision using what was visible then.',lessons:['trading','spacing','wave-management']}
];
let directoryQueries={champions:'',matchups:''};
function indexMode(){return /^#\/(champions|champion)(\/|$)/.test(location.hash)?'champions':/^#\/(matchups|matchup)(\/|$)/.test(location.hash)?'matchups':'lessons';}
function searchKey(text){return text.toLowerCase().normalize('NFKD').replace(/[^a-z0-9]/g,'');}
function matchesGuide(a,query){const haystack=searchKey([a.title,a.id||'',a.kind,a.summary,...(a.tags||[])].join(' '));return query.trim().split(/\s+/).filter(Boolean).every(w=>haystack.includes(searchKey(w)));}
function directoryItems(){return indexMode()==='champions'?CHAMPIONS:MATCHUPS;}
function guideHref(item){return '#/'+(CHAMPIONS.includes(item)?'champion':'matchup')+'/'+item.slug;}
function guideLinks(items){return items.map(a=>`<div class="guide-card"><h2><a href="${guideHref(a)}">${esc(a.title)}</a></h2><p>${esc(a.summary)}</p></div>`).join('');}
function updateIndex(){
 const mode=indexMode(),label=mode==='champions'?'Champions':mode==='matchups'?'Matchups':'Lesson path';
 $('#lesson-index').hidden=mode!=='lessons';$('#directory-index').hidden=mode==='lessons';
 $('.browser').setAttribute('aria-label',mode==='lessons'?'Guided lesson path':label+' index');
 $('#return').textContent='← '+label;$('.status').textContent=mode==='lessons'?'One lesson at a time':'Learn through practice';
 document.querySelectorAll('[data-index]').forEach(a=>{if(a.dataset.index===mode)a.setAttribute('aria-current','true');else a.removeAttribute('aria-current');});
 if(mode==='lessons')return;
 const items=directoryItems(),query=directoryQueries[mode]||'';$('#directory-search').value=query;
 $('#directory-title').textContent=label;$('#directory-intro').textContent=mode==='champions'?'All '+CHAMPIONS.length+' champions, A–Z. Search by name or teamfight style.':'Starter matchups, A–Z. Each guide covers both sides of the lane.';
 $('#directory-search').placeholder=mode==='champions'?'Find a champion':'Find either champion';
 const matches=items.filter(a=>matchesGuide(a,query));
 $('#directory-count').textContent=matches.length+' of '+items.length+' guides';$('#directory-empty').hidden=!!matches.length;
 $('#directory-links').innerHTML=matches.map(a=>`<a class="topic" href="${guideHref(a)}" ${location.hash===guideHref(a)?'aria-current="page"':''}><strong>${esc(a.title)}</strong><small>${esc(a.kind)}</small></a>`).join('');
}
function renderDirectory(state,initial){
 const mode=indexMode();if(mode==='lessons')return false;
 const items=directoryItems(),detail=location.hash.startsWith(mode==='champions'?'#/champion/':'#/matchup/'),a=items.find(a=>guideHref(a)===location.hash);
 const title=a?a.title:detail?'Guide not found':mode==='champions'?'Champion guides':'Matchup guides';
 let body='';
 if(a){
  body=`<p class="lead">${esc(a.summary)}</p>`;
  if(mode==='champions')body=a.html;
  else{const cs=a.champions.map(s=>CHAMPIONS.find(c=>c.slug===s));body=`<div class="versus">${cs.map((c,k)=>`${k?'<span class="vs" aria-hidden="true">vs</span>':''}<a href="${guideHref(c)}" class="vs-side">${avatar(c)}<strong>${esc(c.title)}</strong><small>${esc(c.kind)}</small></a>`).join('')}</div><p class="lead">${esc(a.summary)}</p><section><h2>What to watch</h2><p>${esc(a.focus)}</p><div class="sides">${a.sides.map(([h,p],k)=>`<div class="side" data-role="${esc(cs[k].tags[0])}"><h3>${esc(h)}</h3><p>${esc(p)}</p></div>`).join('')}</div></section>`;body+=`<section><h2>Pause and decide</h2><p>${esc(a.scenario)}</p></section>`;}
  body+=`<section class="practice"><h2>Replay exercise</h2><p>${esc(a.drill)}</p>${mode==='champions'?'':'<p>Use a replay where you played either champion, or watch a recorded game of the matchup. Pause just before each exchange and predict who should win it and why, then play it out and compare. Repeat the exercise from the other side: knowing what your opponent wants makes your own choices clearer.</p>'}</section><section><h2>Build the underlying skills</h2><p>${mode==='champions'?'This guide assumes the skills in these lessons. If a step in the teamfight plan feels hard, the matching lesson breaks it down with an example and a practice exercise. Work on one per game rather than all at once.':'Both sides of this matchup rely on the skills in these lessons. Each one breaks a skill down with an example and a practice exercise you can try in your next game.'}</p><div class="guide-links">${a.lessons.map(slug=>{const l=LESSONS.find(l=>l.slug===slug);return l?`<a href="#/lesson/${slug}">${esc(l.title)}</a>`:'';}).join('')}</div></section>`;
  if(mode!=='champions'||MATCHUPS.some(m=>m.champions.includes(a.slug)))body+=`<section><h2>${mode==='champions'?'Related matchups':'Champion pages'}</h2>${guideLinks(mode==='champions'?MATCHUPS.filter(m=>m.champions.includes(a.slug)):CHAMPIONS.filter(c=>a.champions.includes(c.slug)))}</section>`;
  if(mode==='champions'){const i=CHAMPIONS.indexOf(a),pv=CHAMPIONS[i-1],nx=CHAMPIONS[i+1],like=CHAMPIONS.filter(c=>c!==a&&c.kind===a.kind&&c.tags.some(t=>a.tags.includes(t))).slice(0,4);
   body+=`<section><h2>Similar champions</h2><p>Same teamfight style, so the same questions apply.</p><div class="champ-grid compact">${like.map(championCard).join('')}</div></section><nav class="pager" aria-label="Neighbouring champions">${pv?`<a href="${guideHref(pv)}"><small>← Previous</small><strong>${esc(pv.title)}</strong></a>`:'<span></span>'}${nx?`<a href="${guideHref(nx)}"><small>Next →</small><strong>${esc(nx.title)}</strong></a>`:'<span></span>'}</nav>`;}
  const sources=mode==='champions'?[a]:CHAMPIONS.filter(c=>a.champions.includes(c.slug));
  body+=`<section><h2>Sources and scope</h2><p class="note">Champion coverage and ability references use Riot Data Dragon ${esc(CHAMPIONS[0].version)}, cross-checked against Riot’s full champion directory on 5 November 2026 UTC (4 November Pacific). Tactical guidance, diagrams and hypothetical scenarios are editorial interpretations of the kits, not Riot recommendations or win-rate predictions. Check current in-game tooltips for numbers and changes.</p><div class="guide-links">${sources.map(c=>`<a href="${esc(c.riotUrl)}">Riot: ${esc(c.title)}</a><a href="${esc(c.source)}">${esc(c.title)} ability source</a>`).join('')}</div></section>`;
 }else if(detail)body=`<p>This guide is not in the collection.</p><a href="#/${mode}">Browse ${mode}</a>`;
 else body=`<p class="lead">${mode==='champions'?'Choose a champion to connect their kit to practical learning exercises.':'Choose a pair to practise reading the lane from both sides.'}</p><p>${mode==='champions'?'The complete verified roster has '+items.length+' guides, each with playstyle, strengths, weaknesses, a teamfight plan and a replay exercise.':'This starter matchup collection has '+items.length+' guides.'}</p>${guideLinks(items)}`;
 $('#content').innerHTML=`<article class="article"><div class="eyebrow">${mode==='champions'?'Champions / '+CHAMPIONS.length+' guides':'Matchups / Starter collection'}</div>${a&&mode==='champions'?`<div class="title-row">${avatar(a)}<h1 tabindex="-1">${esc(title)}</h1></div>`:`<h1 tabindex="-1">${esc(title)}</h1>`}${body}</article>`;
 document.title=title+' — League.guide';document.body.dataset.view=detail?'article':'list';
 if(a&&!matchesGuide(a,directoryQueries[mode]||''))directoryQueries[mode]='';
 updateIndex();
 $('.browser').scrollTop=state?.ds||0;$('.reader').scrollTop=state?.rs||0;
 if(!initial){if(detail)$('.article h1').focus({preventScroll:true});else $(`[data-index="${mode}"]`).focus({preventScroll:true});}return true;
}
// App initialization follows this script and supplies the shared navigation helpers.
document.addEventListener('DOMContentLoaded',()=>{
 document.querySelector('#content').addEventListener('click',e=>{const b=e.target.closest('[data-jump]');if(!b)return;const t=document.getElementById('cg-'+b.dataset.jump);if(!t)return;t.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});document.querySelectorAll('[data-jump]').forEach(x=>x.setAttribute('aria-current',x===b));});
 document.querySelector('#directory-search').oninput=e=>{directoryQueries[indexMode()]=e.target.value;updateIndex();save();};
 document.querySelector('#directory-reset').onclick=()=>{directoryQueries[indexMode()]='';updateIndex();$('#directory-search').focus();save();};
});
