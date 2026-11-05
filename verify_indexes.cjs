const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const path=require('path'),fs=require('fs');const rosterCount=require('./content/champions/coverage.json').count;const checks=[];function ok(v,s){if(!v)throw Error(s);checks.push(s)}
(async()=>{const b=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH});const p=await b.newPage();const errors=[];p.on('pageerror',e=>errors.push(String(e)));const base='file://'+path.join(__dirname,'dist/index.html');
for(const width of [1440,390,320]){
 await p.setViewportSize({width,height:900});await p.goto(base);await p.locator('[data-index=champions]').click();
 ok(await p.locator('#directory-links a').count()===rosterCount,'champion count '+width);
 ok(await p.locator('#lesson-index').isHidden(),'lesson controls hidden '+width);
 await p.locator('#directory-search').fill('garen');ok(await p.locator('#directory-links a').count()===1,'champion search '+width);
 await p.locator('#directory-links a').click();ok(await p.locator('.article h1').textContent()==='Garen','champion reader '+width);
 await p.reload();ok(await p.locator('.article h1').textContent()==='Garen','reload direct link '+width);
 await p.locator('#return').click();ok(await p.locator('#directory-search').inputValue()==='garen','search retained '+width);
 await p.locator('#directory-search').fill('absent');ok(await p.locator('#directory-empty').isVisible(),'empty state '+width);await p.locator('#directory-reset').click();
 await p.locator('[data-index=matchups]').click();await p.locator('#directory-search').fill('darius');ok(await p.locator('#directory-links a').count()===1,'opponent search '+width);
 await p.locator('#directory-links a').click();ok(await p.locator('.article h1').textContent()==='Garen vs Darius','matchup reader '+width);ok(await p.locator('.article h3').count()===2,'both sides '+width);
 await p.locator('.guide-card a').filter({hasText:'Darius'}).click();ok(await p.locator('[data-index=champions]').getAttribute('aria-current')==='true','cross link mode '+width);
 await p.goBack();ok(await p.locator('.article h1').textContent()==='Garen vs Darius','history back '+width);await p.goForward();ok(await p.locator('.article h1').textContent()==='Darius','history forward '+width);
 await p.locator('.guide-links a').filter({hasText:'Trading'}).click();ok(await p.locator('[data-index=lessons]').getAttribute('aria-current')==='true','lesson link mode '+width);
 await p.locator('#return').click();ok(await p.locator('#topics .group').count()===8,'eight preserved stages '+width);ok(await p.locator('#topics a').count()===56,'56 preserved lessons '+width);
 await p.locator('[data-index=champions]').focus();await p.keyboard.press('Enter');ok(await p.locator('#directory-index').isVisible(),'keyboard switching '+width);
 await p.locator('#theme-toggle').click();if(await p.locator('html').getAttribute('data-theme')!=='dark')await p.locator('#theme-toggle').click();
 ok(await p.locator('.browser').evaluate(e=>getComputedStyle(e).backgroundColor)==='rgb(20, 20, 20)','neutral dark '+width);
 ok(await p.locator('.browser').evaluate(e=>e.scrollWidth<=e.clientWidth),'index fits '+width);
 await p.screenshot({path:path.join(__dirname,'evidence',`indexes-${width}.png`)});
 const routes=await p.evaluate(()=>[...CHAMPIONS,...MATCHUPS].map(a=>guideHref(a)));
 for(const route of routes){await p.goto(base+route);ok(await p.locator('.article .practice').count()===1,'exercise '+route+' '+width);ok(await p.locator('#directory-links [aria-current=page]').count()===1,'active guide '+route+' '+width);ok(await p.locator('.reader').evaluate(e=>e.scrollWidth<=e.clientWidth),'reader fits '+route+' '+width);}
 await p.goto(base+'#/champion/missing');ok(await p.locator('.article h1').textContent()==='Guide not found','missing guide '+width);await p.locator('.article a').click();ok(await p.locator('#directory-links a').count()===rosterCount,'missing recovery '+width);
}
await p.goto(base);ok(await p.evaluate(()=>[...CHAMPIONS,...MATCHUPS].every(a=>a.lessons.every(s=>LESSONS.some(l=>l.slug===s)))),'all lesson references exist');
ok(errors.length===0,'no page errors');fs.writeFileSync(path.join(__dirname,'evidence/indexes-checks.json'),JSON.stringify({checks},null,2));console.log(checks.length+' index checks passed');await b.close();})().catch(e=>{console.error(e);process.exit(1)});
