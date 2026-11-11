/* Seed totals are demo data; additions stay in this browser.
   Replace getCounts/beginShot/finishShot with server requests for real globals. */
(() => {
  const KEY='gab-putting-global-demo-v2',seed={attempts:1248,made:317};
  function createStore(storage){
    let persistent=!!storage,state={attempts:0,made:0,shots:{}};
    function read(){
      if(persistent)try{
        const raw=storage.getItem(KEY);
        if(raw){const s=JSON.parse(raw);if(Number.isSafeInteger(s.attempts)&&s.attempts>=0&&Number.isSafeInteger(s.made)&&s.made>=0&&s.made<=s.attempts&&s.shots&&typeof s.shots==='object'&&!Array.isArray(s.shots)&&Object.entries(s.shots).every(([id,v])=>/^[a-zA-Z0-9_-]{1,100}$/.test(id)&&['pending','made','missed'].includes(v)))state=s;}
      }catch{persistent=false;}
    }
    function persist(){if(persistent)try{storage.setItem(KEY,JSON.stringify(state));}catch{persistent=false;}}
    const counts=()=>({attempts:seed.attempts+state.attempts,made:seed.made+state.made,mock:true});
    const validate=id=>{if(typeof id!=='string'||!/^[a-zA-Z0-9_-]{1,100}$/.test(id)||['__proto__','constructor','prototype'].includes(id))throw new Error('Invalid shot ID');};
    return {
      get persistent(){return persistent;},
      async getCounts(){read();return counts();},
      async beginShot(id){validate(id);read();if(!Object.hasOwn(state.shots,id)){state.shots[id]='pending';state.attempts++;persist();}return counts();},
      async finishShot(id,made){validate(id);if(typeof made!=='boolean')throw new Error('Invalid result');read();if(state.shots[id]==='pending'){state.shots[id]=made?'made':'missed';if(made)state.made++;persist();}return counts();}
    };
  }
  globalThis.createPuttingStore=createStore;
})();
