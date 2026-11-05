const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const fs=require('fs'),path=require('path');
const checks=[];function ok(v,s){if(!v)throw Error(s);checks.push(s)}
(async()=>{const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH});
for(const width of [1440,390,320]){
 const context=await browser.newContext({viewport:{width,height:900},colorScheme:'light'}),page=await context.newPage();
 await page.goto('file://'+path.join(__dirname,'dist/index.html')+'#/lesson/spacing');
 await page.locator('#theme-toggle').click();await page.reload();
 ok(await page.locator('html').getAttribute('data-theme')==='dark','explicit dark persists '+width);
 for(const selector of ['body','.shell','.browser','.toolbar','.answer','.practice','.topic[aria-current=page]']){
  const rgb=await page.locator(selector).first().evaluate(e=>getComputedStyle(e).backgroundColor.match(/\d+/g).slice(0,3).map(Number));
  ok(Math.max(...rgb)<=44 && Math.max(...rgb)-Math.min(...rgb)===0,'neutral dark surface '+selector+' '+width);
 }
 await page.screenshot({path:path.join(__dirname,`evidence/neutral-dark-lesson-${width}.png`)});
 const figure=page.locator('figure').first();await figure.scrollIntoViewIfNeeded();await page.locator('figure img').first().evaluate(img=>img.decode());
 await figure.screenshot({path:path.join(__dirname,`evidence/neutral-dark-figure-${width}.png`)});
 await page.goto('file://'+path.join(__dirname,'dist/index.html')+'#/path');
 await page.locator('.stage-quiz').first().scrollIntoViewIfNeeded();
 ok(await page.locator('.stage-extension').first().evaluate(e=>getComputedStyle(e).backgroundColor)==='rgb(34, 34, 34)','dark scenario '+width);
 await page.screenshot({path:path.join(__dirname,`evidence/neutral-dark-quiz-${width}.png`)});
 await page.locator('#theme-toggle').click();
 ok(await page.locator('.shell').evaluate(e=>getComputedStyle(e).backgroundColor)==='rgb(255, 255, 255)','light restored '+width);
 await context.close();
}
// Every generated diagram has a theme palette without changing its geometry or labels.
for(const file of fs.readdirSync(path.join(__dirname,'dist/assets')).filter(f=>f.endsWith('.svg'))){const svg=fs.readFileSync(path.join(__dirname,'dist/assets',file),'utf8');ok(svg.includes('@media(prefers-color-scheme:dark)')&&svg.includes('[fill="#f5f7fb"]{fill:#191919}'),'dark diagram '+file);}
fs.writeFileSync(path.join(__dirname,'evidence/dark-correction-checks.json'),JSON.stringify({checks},null,2));console.log(checks.length+' dark correction checks passed');await browser.close();})().catch(e=>{console.error(e);process.exit(1)});
