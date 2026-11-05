const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const fs=require('fs'),path=require('path');
const roster=require('./content/champions/sources/roster.json').data;
const evidence=[];function ok(v,s){if(!v)throw Error(s);evidence.push(s)}
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH});
 const p=await browser.newPage();const errors=[];p.on('pageerror',e=>errors.push(String(e)));
 const base='file://'+path.join(__dirname,'dist/index.html');await p.goto(base+'#/champions');
 const champs=await p.evaluate(()=>CHAMPIONS.map(c=>({id:c.id,slug:c.slug,title:c.title})));
 ok(champs.length===Object.keys(roster).length,'roster size matches Riot snapshot');
 ok(champs.every(c=>roster[c.id]?.name===c.title),'every champion name and id match');
 ok(new Set(champs.map(c=>c.slug)).size===champs.length,'unique routes');
 for(const width of [1440,320]){
  await p.setViewportSize({width,height:900});
  for(const c of champs){
   await p.goto(base+'#/champion/'+c.slug);
   ok(await p.locator('.article h1').textContent()===c.title,`${width} route ${c.id}`);
   const result=await p.evaluate(()=>{
    const a=document.querySelector('.article');const text=a.innerText;
    const diagram=a.querySelector('svg[role=img]');
    return {
     sections:['Playstyle','Strengths','Weaknesses and how to respond','Before the teamfight','Your champion-specific teamfight plan','During the fight','When behind or unable to reach your target','After the fight','Teamfight positioning','Replay exercise','Sources and scope'].every(h=>Array.from(a.querySelectorAll('h2')).some(e=>e.textContent===h)),
     words:text.split(/\s+/).length,
     sources:a.querySelectorAll('a[href^="https://ddragon.leagueoflegends.com/"]').length,
     diagram:!!diagram?.querySelector('title')&&!!diagram?.querySelector('desc'),
     active:document.querySelectorAll('#directory-links [aria-current=page]').length,
     fits:document.querySelector('.reader').scrollWidth<=document.querySelector('.reader').clientWidth,
     links:Array.from(a.querySelectorAll('a[href^="#/lesson/"]')).every(a=>LESSONS.some(l=>a.getAttribute('href')==='#/lesson/'+l.slug))
    };
   });
   ok(result.sections&&result.words>=350&&result.sources===1&&result.diagram&&result.active===1&&result.fits&&result.links,`${width} complete accessible guide ${c.id}: ${JSON.stringify(result)}`);
   await p.locator('#theme-toggle').click();
   ok(await p.locator('.champion-diagram').evaluate(e=>getComputedStyle(e).color===getComputedStyle(document.body).color),`${width} diagram inherits theme ${c.id}`);
  }
 }
 for(const [width,slug,theme] of [[1440,'xayah','dark'],[390,'shyvana','dark'],[320,'locke','light'],[1440,'orianna','light']]){
  await p.setViewportSize({width,height:1000});await p.goto(base+'#/champion/'+slug);
  if(await p.locator('html').getAttribute('data-theme')!==theme)await p.locator('#theme-toggle').click();
  await p.locator('.champion-diagram').scrollIntoViewIfNeeded();
  await p.screenshot({path:path.join(__dirname,'evidence',`champion-${slug}-${width}-${theme}.png`)});
 }
 await p.goto(base+'#/champions');
 for(const name of ["Cho'Gath","Kai'Sa","K'Sante","Nunu & Willump","Wukong","Renata Glasc",'Locke','Zaahen','chogath','kaisa','aurelionsol','monkeyking']){
  await p.locator('#directory-search').fill(name);ok(await p.locator('#directory-links a').count()===1,'search '+name);
 }
 ok(errors.length===0,'no browser errors');
 fs.writeFileSync(path.join(__dirname,'evidence/champions-checks.json'),JSON.stringify({count:champs.length,checks:evidence},null,2));
 console.log(evidence.length+' champion checks passed');await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
