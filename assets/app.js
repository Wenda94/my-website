/* YAM PICTURES — shared behaviour */
(()=>{
const $=(s,c=document)=>c.querySelector(s),$$=(s,c=document)=>[...c.querySelectorAll(s)];
const root=document.documentElement;
const ICON={sun:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',moon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>'};
/* theme */
const tb=$('#theme');
const paint=()=>{if(tb){tb.innerHTML=root.dataset.theme==='dark'?ICON.sun:ICON.moon;tb.setAttribute('aria-label',root.dataset.theme==='dark'?'Switch to light mode':'Switch to dark mode')}const m=$('meta[name=theme-color]');if(m)m.content=root.dataset.theme==='dark'?'#050505':'#f4f1eb'};
paint();
if(tb)tb.onclick=()=>{root.dataset.theme=root.dataset.theme==='dark'?'light':'dark';try{localStorage.setItem('yam-theme',root.dataset.theme)}catch(e){}paint()};
/* mobile nav */
const menu=$('#menu'),mnav=$('#mnav');
const setMenu=o=>{if(!menu||!mnav)return;mnav.classList.toggle('open',o);menu.setAttribute('aria-expanded',o);menu.textContent=o?'✕':'☰';document.body.style.overflow=o?'hidden':''};
if(menu)menu.onclick=()=>setMenu(!mnav.classList.contains('open'));
$$('#mnav a').forEach(a=>a.addEventListener('click',()=>setMenu(false)));
/* year */
$$('[data-year]').forEach(e=>e.textContent=new Date().getFullYear());
/* scroll: header, progress, top button, parallax */
const header=$('#header'),progress=$('#progress'),top=$('#toTop');
const onScroll=()=>{const y=scrollY;if(header)header.classList.toggle('scrolled',y>30);const h=document.documentElement.scrollHeight-innerHeight;if(progress)progress.style.width=(h>0?y/h*100:0)+'%';if(top)top.classList.toggle('show',y>700);
$$('[data-parallax]').forEach(el=>{const r=el.parentElement.getBoundingClientRect();if(r.bottom>0&&r.top<innerHeight)el.style.transform='translateY('+((innerHeight/2-r.top)*parseFloat(el.dataset.parallax))+'px) scale(1.06)'})};
addEventListener('scroll',onScroll,{passive:true});onScroll();
if(top)top.onclick=()=>scrollTo({top:0,behavior:'smooth'});
/* reveal */
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');io.unobserve(e.target)}}),{threshold:.1});
window.yamReveal=(c=document)=>$$('.reveal:not(.visible)',c).forEach(e=>io.observe(e));yamReveal();
/* cursor glow + magnetic (fine pointers only) */
if(matchMedia('(pointer:fine)').matches){const cu=$('#cursor');if(cu)addEventListener('mousemove',e=>{cu.style.left=e.clientX+'px';cu.style.top=e.clientY+'px'});
$$('.mag').forEach(b=>{b.addEventListener('mousemove',e=>{const r=b.getBoundingClientRect();b.style.transform='translate('+((e.clientX-r.left-r.width/2)*.12)+'px,'+((e.clientY-r.top-r.height/2)*.12)+'px)'});b.addEventListener('mouseleave',()=>b.style.transform='')})}
/* fullscreen viewer */
const v=$('#visualViewer');
if(v){const vi=$('#viewerImage'),vk=$('#viewerKicker'),vt=$('#viewerTitle');let last=null;
window.openViewer=el=>{last=el;vi.src=el.dataset.image;vi.alt=el.dataset.title||'YAM PICTURES';vk.textContent=el.dataset.kicker||'YAM PICTURES';vt.textContent=el.dataset.title||'';v.classList.add('open');v.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';$('#viewerClose').focus()};
window.closeViewer=()=>{if(!v.classList.contains('open'))return;v.classList.remove('open');v.setAttribute('aria-hidden','true');document.body.style.overflow='';if(last)last.focus()};
document.addEventListener('click',e=>{const t=e.target.closest('.visual-trigger');if(t)openViewer(t)});
$('#viewerClose').onclick=closeViewer;v.addEventListener('click',e=>{if(e.target===v||e.target.classList.contains('viewer-stage'))closeViewer()})}
addEventListener('keydown',e=>{if(e.key==='Escape'){setMenu(false);window.closeViewer&&closeViewer()}});
/* contact form → WhatsApp / email */
const cf=$('#contact-form');
if(cf){const st=$('.form-status',cf);const WA='251916608770';
const get=()=>{const d=Object.fromEntries(new FormData(cf));return d};
const validate=()=>{let ok=true;$$('[data-req]',cf).forEach(i=>{const g=i.closest('.fg');const bad=!i.value.trim()||(i.type==='email'&&!/^\S+@\S+\.\S+$/.test(i.value));g.classList.toggle('bad',bad);i.setAttribute('aria-invalid',bad);if(bad)ok=false});if(!ok){st.className='form-status bad';st.textContent='Please complete the highlighted fields.'}return ok};
const text=d=>`New enquiry from website\nName: ${d.name}\nEmail: ${d.email}\nPhone: ${d.phone||'-'}\n\n${d.message}`;
$('#send-wa').onclick=()=>{if(!validate())return;window.open('https://wa.me/'+WA+'?text='+encodeURIComponent(text(get())),'_blank','noopener');st.className='form-status ok';st.textContent='Opening WhatsApp — just press send.'};
$('#send-mail').onclick=()=>{if(!validate())return;const d=get();location.href='mailto:hello@yampictures.com?subject='+encodeURIComponent('Website enquiry — '+d.name)+'&body='+encodeURIComponent(text(d));st.className='form-status ok';st.textContent='Opening your email app…'};
cf.addEventListener('submit',e=>e.preventDefault())}
})();
