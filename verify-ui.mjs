import vm from 'node:vm';import assert from 'node:assert/strict';import {readFile} from 'node:fs/promises';
class Element{
 constructor(id){this.id=id;this.handlers={};this.textContent='';this.classList={add(){},remove(){}};}
 addEventListener(name,fn){(this.handlers[name]??=[]).push(fn);}
 fire(name,event={}){for(const fn of this.handlers[name]||[])fn({preventDefault(){},...event});}
 getBoundingClientRect(){return{left:0,top:0,width:1000,height:120};}focus(){}setPointerCapture(id){this.capture=id;}hasPointerCapture(id){return this.capture===id;}releasePointerCapture(){this.capture=null;}
}
const elements=new Map(),get=id=>{if(!elements.has(id))elements.set(id,new Element(id));return elements.get(id);};
const ctx=new Proxy({createLinearGradient:()=>({addColorStop(){}}),createRadialGradient:()=>({addColorStop(){}})},{get:(o,k)=>o[k]||(()=>{}),set:(o,k,v)=>{o[k]=v;return true;}});get('golf-course').getContext=()=>ctx;
const document={getElementById:get,querySelector:s=>get(s.slice(1)),createElement:()=>({getContext:()=>ctx}),addEventListener(){}};
const data=new Map(),storage={getItem:k=>data.get(k),setItem:(k,v)=>data.set(k,v)};
let next=0,time=0,queue=new Map(),timers=new Map();
const sandbox={document,window:{localStorage:storage,devicePixelRatio:1,matchMedia:()=>({matches:false}),addEventListener(){}},Date,Math,Intl,console,performance:{now:()=>time},crypto:{randomUUID:()=>`shot-${++next}`},requestAnimationFrame:fn=>{const id=++next;queue.set(id,fn);return id;},cancelAnimationFrame:id=>queue.delete(id),setTimeout:fn=>{const id=++next;timers.set(id,fn);return id;},clearTimeout:id=>timers.delete(id)};
vm.createContext(sandbox);for(const file of ['putting-physics.js','putting-store.js','putting.js'])vm.runInContext(await readFile(file,'utf8'),sandbox);
const canvas=get('golf-course'),move=(x,t,y=0)=>canvas.fire('pointermove',{pointerType:'mouse',pointerId:1,clientX:28+x*(944/6),clientY:60+y*(944/6),timeStamp:t});
async function settle(){let ticks=0;while(queue.size&&ticks++<2000){const pending=[...queue.values()];queue.clear();time+=1000/60;for(const fn of pending)fn(time);}assert(ticks<2000);await new Promise(resolve=>setImmediate(resolve));}
const reset=()=>{for(const fn of timers.values())fn();timers.clear();};
await settle();assert.equal(get('golf-attempts').textContent,'1,248');
canvas.fire('pointerenter');move(5.5,0);move(5.3,73);move(5.5,80);move(5.3,100);await settle();assert.equal(get('golf-attempts').textContent,'1,249');assert.equal(get('golf-made').textContent,'318');assert.equal(timers.size,1);
reset();move(5.5,200);move(5.3,230);await settle();assert.equal(get('golf-attempts').textContent,'1,250');assert.equal(get('golf-made').textContent,'318');reset();
const touch=(name,x)=>canvas.fire(name,{button:0,pointerType:'touch',pointerId:2,clientX:28+x*(944/6),clientY:60,timeStamp:500});
touch('pointerdown',5.32);touch('pointermove',6.06);canvas.fire('pointercancel');touch('pointerup',6.06);await settle();assert.equal(get('golf-attempts').textContent,'1,250');
touch('pointerdown',5.32);touch('pointermove',6.06);touch('pointerup',6.06);await settle();assert.equal(get('golf-made').textContent,'319');reset();
canvas.fire('keydown',{key:' ',repeat:false});time+=890;canvas.fire('keyup',{key:' '});await settle();assert.equal(get('golf-attempts').textContent,'1,252');assert.equal(get('golf-made').textContent,'320');reset();
canvas.fire('keydown',{key:' ',repeat:false});canvas.fire('keydown',{key:'Escape'});canvas.fire('keyup',{key:' '});await settle();assert.equal(get('golf-attempts').textContent,'1,252');
console.log('Passed hover putter impact, one count per shot, miss vs made counters, auto-reset, touch/cancel, and keyboard/cancel UI state checks. Visual browser QA is separate.');
