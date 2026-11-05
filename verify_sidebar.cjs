const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const fs=require('fs'),path=require('path');const checks=[];function ok(v,s){if(!v)throw Error(s);checks.push(s)}
(async()=>{const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH});const page=await browser.newPage();const base='file://'+path.join(__dirname,'dist/index.html');
for(const width of [1440,390,320]){
 await page.setViewportSize({width,height:900});await page.goto(base+'#/path');await page.locator('#reset-progress').click();await page.locator('.primary').click();await page.locator('#return').click();
 const expected=await page.evaluate(()=>LEARNING_PATH.flatMap(s=>s.ids).map(id=>LESSONS.find(a=>a.id===id).slug));
 ok(JSON.stringify(await page.locator('#topics a').evaluateAll(es=>es.map(e=>e.hash.slice(9))))===JSON.stringify(expected),'curriculum order '+width);
 ok(await page.locator('#topics h2').count()===8,'eight sidebar stages '+width);
 ok((await page.locator('.lesson-number').allTextContents()).join(',')===Array.from({length:56},(_,i)=>i+1).join(','),'continuous numbering '+width);
 ok(await page.locator('#topics .group[open]').count()===1,'one stage initially open '+width);
 await page.locator('#topics .group').last().locator('summary').click();ok(await page.locator('#topics .group').last().locator('.topic').first().isVisible(),'expand final stage '+width);
 await page.locator('#topics .group').last().locator('summary').click();
 await page.locator('.lesson-search > summary').click();await page.locator('#search').fill('wave');ok(await page.locator('.topic').count()>0,'search works '+width);await page.locator('#all').click();await page.locator('.lesson-search > summary').click();
 await page.locator('.topic').first().click();ok(await page.locator('#topics [aria-current="page"] strong').textContent()==='Last-hitting','current lesson '+width);
 await page.locator('#complete').click();ok(await page.locator('#sidebar-progress').textContent()==='1 of 56 practised','live progress '+width);ok((await page.locator('#topics .topic').first().textContent()).includes('Practised ✓'),'live lesson marker '+width);
 await page.reload();ok(await page.locator('#sidebar-meter').getAttribute('value')==='1','saved meter '+width);
 await page.locator('.path-controls .next a').last().click();ok(await page.locator('#topics [aria-current="page"] strong').textContent()==='Spacing','next updates highlight '+width);
 await page.locator('#return').click();ok(await page.locator('#topics').isVisible(),'mobile return to path '+width);ok(await page.locator('#topics [aria-current="page"] strong').textContent()==='Spacing','return retains reading highlight '+width);
 ok(await page.evaluate(()=>document.querySelector('.browser').scrollWidth<=document.querySelector('.browser').clientWidth),'sidebar fits '+width);
 await page.locator('.browser').evaluate(e=>e.scrollTop=0);await page.screenshot({path:path.join(__dirname,'evidence',`sidebar-${width}.png`)});
 await page.locator('#topics .group').last().locator('summary').click();await page.locator('#topics .group').last().locator('.topic').first().click();
 ok(await page.locator('#topics .group').last().getAttribute('open')!==null,'lesson opens its stage '+width);await page.reload();ok(await page.locator('#topics .group').last().getAttribute('open')!==null,'deep link opens its stage '+width);await page.locator('#return').click();
 await page.locator('.path-entry').click();ok(await page.locator('#topics [aria-current]').count()===0,'overview clears highlight '+width);await page.locator('#reset-progress').click();ok(await page.locator('#sidebar-progress').textContent()==='0 of 56 practised','reset sidebar '+width);
}
fs.writeFileSync(path.join(__dirname,'evidence/sidebar-checks.json'),JSON.stringify({checks},null,2));console.log(checks.length+' sidebar checks passed');await browser.close();})().catch(e=>{console.error(e);process.exit(1)});
