import { $, store } from './util.js';
const KEY='abdulbosit-universe';
const THEMES={
 cyberpunk:{bg:'#080b16',surface:'#101629',elevated:'#171f36',accent:'#22d3ee',accent2:'#c084fc',text:'#f2f7ff',muted:'#9aa9c6',border:'rgba(34,211,238,.18)'},
 cosmic:{bg:'#090719',surface:'#15112d',elevated:'#211942',accent:'#a78bfa',accent2:'#38bdf8',text:'#f6f2ff',muted:'#b0a9d0',border:'rgba(167,139,250,.2)'},
 obsidian:{bg:'#0b0b0d',surface:'#171719',elevated:'#222225',accent:'#d6b56d',accent2:'#f1dfb4',text:'#f8f4ea',muted:'#b7b0a2',border:'rgba(214,181,109,.2)'},
 aurora:{bg:'#071616',surface:'#102524',elevated:'#193633',accent:'#5eead4',accent2:'#f0abfc',text:'#effffb',muted:'#a3c8c2',border:'rgba(94,234,212,.2)'},
 inferno:{bg:'#160b0c',surface:'#251214',elevated:'#35191a',accent:'#fb4d5d',accent2:'#fb923c',text:'#fff4f1',muted:'#d0a4a2',border:'rgba(251,77,93,.2)'},
 emerald:{bg:'#06120e',surface:'#0d2119',elevated:'#143126',accent:'#34d399',accent2:'#2dd4bf',text:'#edfff5',muted:'#94c6ac',border:'rgba(52,211,153,.2)'}
};
export function initTheme(config){
 const btn=$('theme-toggle'),root=document.documentElement,dialog=$('theme-dialog');
 const legacy=store.get('abdulbosit-theme');
 const saved=(()=>{try{return localStorage.getItem(KEY)}catch{return null}})();
 let current=THEMES[saved]?saved:legacy==='light'?'cyberpunk':(config.preferences?.theme==='light'?'aurora':'cyberpunk');
 function apply(name,persist=true){
  const t=THEMES[name]||THEMES.cyberpunk;current=name;root.dataset.theme=name;
  for(const [key,value] of Object.entries(t))root.style.setProperty('--'+({'bg':'bg','surface':'surface','elevated':'elevated','accent':'accent','accent2':'accent-2','text':'text','muted':'muted','border':'border'}[key]),value);
  root.style.setProperty('--shadow',`0 12px 48px -16px ${t.accent}33`);
  const meta=$('meta[name="theme-color"]');if(meta)meta.setAttribute('content',t.bg);
  if(btn){btn.setAttribute('aria-pressed','true');btn.setAttribute('aria-label','Theme Universe');}
  document.querySelectorAll('[data-universe]').forEach(b=>{const selected=b.dataset.universe===name;b.classList.toggle('is-selected',selected);b.setAttribute('aria-pressed',String(selected));});
  if(persist){try{localStorage.setItem(KEY,name)}catch{}}
 }
 apply(current,false);
 $('theme-universe')?.addEventListener('click',()=>dialog?.showModal());
 $('theme-dialog-close')?.addEventListener('click',()=>dialog?.close());
 dialog?.addEventListener('click',e=>{if(e.target===dialog)dialog.close()});
 document.querySelectorAll('[data-universe]').forEach(b=>b.addEventListener('click',()=>{apply(b.dataset.universe);dialog?.close();}));
 btn?.addEventListener('click',()=>{const names=Object.keys(THEMES),idx=names.indexOf(current);apply(names[(idx+1)%names.length]);});
}
