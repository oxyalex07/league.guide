const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');const fs=require('fs'),path=require('path');
(async()=>{const b=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH});const p=await b.newPage();const base='file://'+path.join(__dirname,'dist/index.html');let checks=0;
for(const width of [1440,320])for(const slug of ['xayah','orianna','gangplank','gnar','anivia','azir','yone','zed']){
 await p.setViewportSize({width,height:1000});await p.goto(base+'#/champion/'+slug);
 if(await p.locator('[id^=special-title]').count()!==1)throw Error('Missing kit diagram '+slug);checks++;
 for(const theme of ['light','dark']){
  if(await p.locator('html').getAttribute('data-theme')!==theme)await p.locator('#theme-toggle').click();
  await p.locator('.champion-diagram').scrollIntoViewIfNeeded();
  const fit=await p.locator('.champion-diagram').evaluate(e=>{const box=e.getBoundingClientRect();return [...e.querySelectorAll('text')].every(t=>{const r=t.getBoundingClientRect();return r.left>=box.left&&r.right<=box.right&&r.top>=box.top&&r.bottom<=box.bottom})});
  if(!fit)throw Error('Clipped diagram text '+slug+' '+width);checks++;
  if(['xayah','orianna'].includes(slug))await p.screenshot({path:path.join(__dirname,'evidence',`champion-${slug}-${width}-${theme}.png`)});
 }
}
await p.setViewportSize({width:1440,height:1000});await p.goto(base+'#/champion/xayah');if(await p.locator('html').getAttribute('data-theme')!=='dark')await p.locator('#theme-toggle').click();await p.screenshot({path:path.join(__dirname,'evidence/champion-library-preview.png')});
fs.writeFileSync(path.join(__dirname,'evidence/champion-diagrams-checks.json'),JSON.stringify({checks}));console.log(checks+' kit diagram checks passed');await b.close();})().catch(e=>{console.error(e);process.exit(1)});
