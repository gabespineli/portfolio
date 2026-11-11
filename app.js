document.querySelector('.copy-email')?.addEventListener('click',async()=>{
 const status=document.querySelector('#copy-status');
 try{await navigator.clipboard.writeText('gabespineli@gmail.com');status.textContent='Email address copied.';}
 catch{status.textContent='Select and copy: gabespineli@gmail.com';}
});
document.querySelector('.print-button')?.addEventListener('click',()=>window.print());
const clock = document.querySelector('.desktop-clock time');
if (clock) {
  const updateClock = () => {
    const now = new Date();
    clock.textContent = new Intl.DateTimeFormat('en-US', {timeZone:'Asia/Manila', hour:'numeric', minute:'2-digit'}).format(now);
    clock.dateTime = now.toISOString();
  };
  updateClock();
  setInterval(updateClock, 60000);
}

document.querySelectorAll('.experience-with-stack').forEach(row=>{
  row.addEventListener('pointerup',event=>{
    if(event.pointerType==='touch'&&!event.target.closest('button,a'))row.focus({preventScroll:true});
  });
});
document.addEventListener('pointerdown',event=>{
  const active=document.activeElement?.closest('.experience-with-stack');
  if(active&&!active.contains(event.target))document.activeElement.blur();
});
