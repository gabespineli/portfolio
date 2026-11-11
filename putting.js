(() => {
  const canvas=document.querySelector('#golf-course');if(!canvas)return;
  const ctx=canvas.getContext('2d');if(!ctx)return;
  const P=globalThis.PuttingPhysics,c=P.course,$=id=>document.getElementById(id);
  let storage;try{storage=window.localStorage;}catch{}
  const api=globalThis.createPuttingStore(storage),format=new Intl.NumberFormat('en-US');
  let ball=P.createBall(),phase='ready',previous=null,drag=null,raf=0,last=0,resetTimer=0,shotId=null,shotStarted;
  let width=1000,height=120,scale=150,keyboardStart=null,keyboardAngle=0,turfCache=null;
  const coarse=window.matchMedia?.('(pointer: coarse)').matches;
  const hint=coarse?'Pull right from the ball, then release.':'Putt from right to left.';
  $('golf-instructions').textContent=hint;
  const say=text=>{$('golf-status').textContent=text;};
  function showCounts(counts){$('golf-attempts').textContent=format.format(counts.attempts);$('golf-made').textContent=format.format(counts.made);}
  function sx(x){return 28+x*scale;}function sy(y){return height/2+y*scale;}
  function point(e){const r=canvas.getBoundingClientRect();return{x:((e.clientX-r.left)*width/r.width-28)/scale,y:((e.clientY-r.top)*height/r.height-height/2)/scale,time:e.timeStamp};}
  function resize(){const r=canvas.getBoundingClientRect();width=Math.max(240,r.width);height=r.height||120;scale=(width-56)/c.length;const dpr=Math.min(window.devicePixelRatio||1,2);canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);previous=null;turfCache=buildTurf();draw();}
  function buildTurf(){
    // Render once per resize: thousands of fine, varied blades over sunlit turf.
    // The cached surface keeps ball movement independent of texture complexity.
    const texture=document.createElement('canvas'),dpr=Math.min(window.devicePixelRatio||1,2);
    texture.width=Math.ceil(width*dpr);texture.height=Math.ceil(height*dpr);
    const g=texture.getContext('2d');g.scale(dpr,dpr);
    const laneH=Math.min(height-20,Math.max(58,scale*.6)),top=(height-laneH)/2;
    let seed=1729;const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
    g.beginPath();g.roundRect(10,top,width-20,laneH,12);g.clip();
    const base=g.createLinearGradient(0,top,0,top+laneH);
    base.addColorStop(0,'#4f831c');base.addColorStop(.33,'#79a82c');base.addColorStop(.7,'#5e9523');base.addColorStop(1,'#42791a');
    g.fillStyle=base;g.fillRect(0,top,width,laneH);
    for(let i=0;i<32;i++){
      const x=random()*width,y=top+random()*laneH,r=18+random()*58;
      const patch=g.createRadialGradient(x,y,0,x,y,r);
      patch.addColorStop(0,i%3?'#b1c65320':'#204f1828');patch.addColorStop(1,'#68932b00');
      g.fillStyle=patch;g.fillRect(x-r,y-r,r*2,r*2);
    }
    const shadows=['#295513','#315f14','#46751a','#53841e'];
    const lights=['#96b94b','#7eae37','#abc75b','#6b9b27','#bad06b','#568b24'];
    const count=Math.floor(width*laneH*.52);
    g.lineCap='round';
    for(let i=0;i<count;i++){
      const x=8+random()*(width-16),y=top-3+random()*(laneH+7),length=1.4+random()*4.4;
      const lean=(random()-.5)*4.3,light=random();
      g.strokeStyle=shadows[Math.floor(random()*shadows.length)];g.globalAlpha=.25+random()*.25;g.lineWidth=.5+random()*.55;
      g.beginPath();g.moveTo(x+.7,y+1);g.quadraticCurveTo(x+lean*.4+.7,y-length*.5+1,x+lean+.7,y-length+1);g.stroke();
      g.strokeStyle=lights[Math.floor(light*lights.length)];g.globalAlpha=.35+random()*.42;g.lineWidth=.35+random()*.45;
      g.beginPath();g.moveTo(x,y);g.quadraticCurveTo(x+lean*.3,y-length*.55,x+lean,y-length);g.stroke();
    }
    g.globalAlpha=1;
    const shade=g.createLinearGradient(0,top,0,top+laneH);shade.addColorStop(0,'#203e1515');shade.addColorStop(.25,'#d5eb8108');shade.addColorStop(.75,'#d5eb8100');shade.addColorStop(1,'#1f40191f');g.fillStyle=shade;g.fillRect(0,top,width,laneH);
    return texture;
  }
  function drawPutter(x,y,angle=0){
    ctx.save();ctx.translate(sx(x),sy(y));ctx.rotate(Math.PI+angle);ctx.shadowColor='#384d2630';ctx.shadowBlur=3;ctx.shadowOffsetY=2;
    ctx.strokeStyle='#a4aaa0';ctx.lineWidth=2.2;ctx.beginPath();ctx.moveTo(-34,0);ctx.lineTo(-3,0);ctx.stroke();
    ctx.strokeStyle='#4d6247';ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(-38,0);ctx.lineTo(-27,0);ctx.stroke();
    const steel=ctx.createLinearGradient(-5,-13,2,13);steel.addColorStop(0,'#fafbf6');steel.addColorStop(.4,'#c6cec0');steel.addColorStop(.6,'#8b9986');steel.addColorStop(1,'#e5e9df');ctx.fillStyle=steel;ctx.beginPath();ctx.roundRect(-7,-13,7,26,2);ctx.fill();ctx.shadowBlur=0;ctx.strokeStyle='#6a7960';ctx.lineWidth=.7;ctx.stroke();ctx.restore();
  }
  function draw(){
    ctx.clearRect(0,0,width,height);
    if(turfCache)ctx.drawImage(turfCache,0,0,width,height);
    const hx=sx(c.cup.x),hy=sy(c.cup.y),holeRadius=Math.max(6,c.cupRadius*scale);
    ctx.fillStyle='#527a21';ctx.beginPath();ctx.arc(hx,hy,holeRadius+2,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#14200c';ctx.beginPath();ctx.arc(hx,hy,holeRadius,0,Math.PI*2);ctx.fill();
    ctx.strokeStyle='#ffffff70';ctx.lineWidth=.7;ctx.beginPath();ctx.arc(hx,hy,holeRadius,0,Math.PI);ctx.stroke();
    if(!ball.sunk){
      const bx=sx(ball.x),by=sy(ball.y),r=Math.max(4.6,c.ballRadius*scale);
      ctx.fillStyle='#46533230';ctx.beginPath();ctx.ellipse(bx+1,by+2,r+1,r*.7,0,0,Math.PI*2);ctx.fill();
      const shine=ctx.createRadialGradient(bx-1,by-2,0,bx,by,r);shine.addColorStop(0,'#fff');shine.addColorStop(1,'#dde3d5');ctx.fillStyle=shine;ctx.beginPath();ctx.arc(bx,by,r,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='#9eaa963d';for(let i=0;i<3;i++){const angle=ball.rotation+i*2.1;ctx.beginPath();ctx.arc(bx+Math.cos(angle)*r*.45,by+Math.sin(angle)*r*.45,.65,0,Math.PI*2);ctx.fill();}
    }
    if(drag&&phase==='ready'){
      drawPutter(drag.x,drag.y);
    }else if(keyboardStart!==null&&phase==='ready'){
      const pull=Math.min(1.2,(performance.now()-keyboardStart)/1000*.85),a=keyboardAngle*Math.PI/180;
      drawPutter(ball.x+.055+Math.cos(a)*pull,ball.y+Math.sin(a)*pull,a);
    }
  }
  function reset(){clearTimeout(resetTimer);ball=P.createBall();phase='ready';previous=null;drag=null;keyboardStart=null;canvas.classList.remove('is-rolling','is-dragging');$('golf-instructions').textContent=hint;draw();}
  async function finish(made){
    phase='result';canvas.classList.remove('is-rolling');previous=null;
    $('golf-instructions').textContent=made?'In the cup. Nicely judged.':ball.x>c.cup.x+.2?'A little more pace. Try again.':'Just missed. Try again.';
    say(made?'Putt made. A new ball will appear.':'Putt missed. A new ball will appear.');
    const id=shotId;
    try{await shotStarted;showCounts(await api.finishShot(id,made));}catch{say('Shot finished. Demo counters are temporarily unavailable.');}
    resetTimer=setTimeout(reset,1200);
  }
  function frame(time){
    if(phase!=='rolling')return;
    const dt=last?Math.min((time-last)/1000,.05):1/60;last=time;
    const result=P.step(ball,dt);draw();
    if(result==='moving')raf=requestAnimationFrame(frame);else{raf=0;finish(result==='sunk');}
  }
  function strike(vx,vy=0){
    if(phase!=='ready'||!P.shoot(ball,vx,vy))return false;
    phase='rolling';previous=null;drag=null;keyboardStart=null;last=0;
    canvas.classList.remove('is-dragging');canvas.classList.add('is-rolling');$('golf-instructions').textContent='Rolling…';say('Putt attempted.');
    shotId=globalThis.crypto?.randomUUID?.()||`shot-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    shotStarted=api.beginShot(shotId).then(showCounts);shotStarted.catch(()=>{});
    raf=requestAnimationFrame(frame);return true;
  }
  canvas.addEventListener('pointerenter',()=>{previous=null;});
  canvas.addEventListener('pointermove',e=>{
    const p=point(e);
    if(drag){if(drag.id!==e.pointerId)return;drag={...p,id:e.pointerId};draw();return;}
    if(phase==='ready'&&e.pointerType!=='touch'&&keyboardStart===null){const hit=P.impact(previous,p,ball);if(hit)strike(hit.vx,hit.vy);}
    previous=phase==='ready'?p:null;
  });
  canvas.addEventListener('pointerleave',()=>{previous=null;});
  canvas.addEventListener('pointerdown',e=>{
    if(phase!=='ready'||e.button!==0||drag)return;
    const p=point(e),tolerance=28/scale;
    if(Math.hypot(p.x-ball.x,p.y-ball.y)>tolerance)return;
    drag={...p,id:e.pointerId};previous=null;canvas.setPointerCapture(e.pointerId);canvas.focus({preventScroll:true});canvas.classList.add('is-dragging');e.preventDefault();draw();
  });
  canvas.addEventListener('pointerup',e=>{
    if(!drag||e.pointerId!==drag.id)return;
    const p=point(e),dx=ball.x-p.x,dy=ball.y-p.y,id=drag.id;drag=null;previous=null;canvas.classList.remove('is-dragging');
    if(canvas.hasPointerCapture(id))canvas.releasePointerCapture(id);
    if(dx<-.04)strike(dx*3.25,dy*3.25);else draw();
  });
  function cancelInput(){drag=null;previous=null;keyboardStart=null;canvas.classList.remove('is-dragging');if(phase==='ready')draw();}
  canvas.addEventListener('pointercancel',cancelInput);canvas.addEventListener('lostpointercapture',()=>{if(drag)cancelInput();});
  function chargeFrame(){if(keyboardStart===null||phase!=='ready')return;draw();raf=requestAnimationFrame(chargeFrame);}
  canvas.addEventListener('keydown',e=>{
    if(![' ','ArrowLeft','ArrowRight','Escape'].includes(e.key))return;e.preventDefault();
    if(phase!=='ready')return;
    if(e.key==='Escape'){cancelInput();return;}
    if(e.key==='ArrowLeft')keyboardAngle=Math.max(-15,keyboardAngle-1);
    if(e.key==='ArrowRight')keyboardAngle=Math.min(15,keyboardAngle+1);
    if(e.key===' '&&!e.repeat&&keyboardStart===null){keyboardStart=performance.now();previous=null;raf=requestAnimationFrame(chargeFrame);}
    if(e.key!==' ')say(`Aim ${keyboardAngle} degrees. Hold Space, then release to putt.`);
  });
  canvas.addEventListener('keyup',e=>{
    if(e.key!==' '||keyboardStart===null)return;e.preventDefault();
    const duration=(performance.now()-keyboardStart)/1000;keyboardStart=null;cancelAnimationFrame(raf);
    const speed=Math.min(3.9,Math.max(.15,duration*.85*3.25)),a=keyboardAngle*Math.PI/180;strike(-speed*Math.cos(a),-speed*Math.sin(a));
  });
  canvas.addEventListener('blur',cancelInput);
  document.addEventListener('visibilitychange',()=>{last=0;cancelInput();});
  window.addEventListener('storage',()=>api.getCounts().then(showCounts).catch(()=>{}));
  if(globalThis.ResizeObserver)new ResizeObserver(resize).observe(canvas);else window.addEventListener('resize',resize);
  resize();api.getCounts().then(showCounts).catch(()=>say('Demo counters are temporarily unavailable.'));
})();
