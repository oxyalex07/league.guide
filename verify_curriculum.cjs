const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const fs=require('fs'),path=require('path');
(async()=>{const b=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH});const p=await b.newPage();const base='file://'+path.join(__dirname,'dist/index.html');const checks=[];
for(const width of [1440,320]){
 await p.setViewportSize({width,height:900});
 for(const slug of ['experience','map-awareness','summoner-spells','wave-management']){
  await p.goto(base+'#/lesson/'+slug);await p.locator('figure').scrollIntoViewIfNeeded();await p.waitForFunction(()=>[...document.images].every(i=>i.complete&&i.naturalWidth>0));
  await p.screenshot({path:path.join(__dirname,'evidence',`review-${slug}-${width}.png`)});checks.push(`${slug} figure loaded at ${width}`);
 }
}
fs.writeFileSync(path.join(__dirname,'evidence/curriculum-browser.json'),JSON.stringify({checks},null,2));await b.close();})().catch(e=>{console.error(e);process.exit(1)});
