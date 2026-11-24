const fs=require('fs');
(async()=>{
const tabs=await(await fetch('http://localhost:9223/json')).json();const ws=new WebSocket(tabs[0].webSocketDebuggerUrl);await new Promise(r=>ws.onopen=r);let id=0;const calls=new Map();ws.onmessage=e=>{const m=JSON.parse(e.data);if(m.id){const p=calls.get(m.id);calls.delete(m.id);m.error?p.reject(m.error):p.resolve(m.result)}};
const call=(method,params={})=>new Promise((resolve,reject)=>{const n=++id;calls.set(n,{resolve,reject});ws.send(JSON.stringify({id:n,method,params}))});
await call('Page.enable');await call('Page.navigate',{url:'http://localhost:3000'});await new Promise(r=>setTimeout(r,6000));
for(const [label,width,height] of [['desktop',1440,1000],['tablet',768,1024],['mobile',390,844]]){
await call('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:false});
await call('Runtime.evaluate',{expression:"document.documentElement.style.scrollBehavior='auto';document.querySelector('footer').scrollIntoView();"});await new Promise(r=>setTimeout(r,1200));
const result=await call('Runtime.evaluate',{expression:`JSON.stringify({width:innerWidth,scrollWidth:document.documentElement.scrollWidth,footer:document.querySelector('footer').getBoundingClientRect().toJSON(),brokenLinks:[...document.querySelectorAll('footer a')].filter(a=>a.hash&&!document.querySelector(a.hash)).map(a=>a.href),font:getComputedStyle(document.querySelector('.footer-brand')).fontFamily})`,returnByValue:true});console.log(label,result.result.value);
const shot=await call('Page.captureScreenshot',{format:'png'});fs.writeFileSync('.footer-review/'+label+'.png',Buffer.from(shot.data,'base64'));
}
console.log('PDF', (await fetch('http://localhost:3000/RCA%20Silicon%20Minds%20Concept%20Note1.pdf')).status);
ws.close();
})().catch(e=>{console.error(e);process.exit(1)});
