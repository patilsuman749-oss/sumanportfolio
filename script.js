const progress = document.querySelector('.progress');
const header = document.querySelector('.header');
const orb = document.querySelector('.cursor-orb');
const menu = document.querySelector('.menu');
const nav = document.querySelector('.nav-links');

menu?.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menu.setAttribute('aria-expanded', open);
});
document.querySelectorAll('.nav-links a').forEach(a => a.addEventListener('click', () => nav.classList.remove('open')));

// Scroll progress + header state.
function onScroll(){
  const max = document.documentElement.scrollHeight - innerHeight;
  progress.style.width = `${max ? (scrollY / max) * 100 : 0}%`;
  header.classList.toggle('scrolled', scrollY > 10);
  updateTimelines();
  updateParallax();
}
addEventListener('scroll', onScroll, {passive:true});

// Reveal on scroll.
const reveal = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if(!entry.isIntersecting) return;
    entry.target.classList.add('show');
    reveal.unobserve(entry.target);
  });
},{threshold:.12});
document.querySelectorAll('.reveal').forEach((el,i)=>{
  el.style.transitionDelay = `${Math.min(i * 35, 260)}ms`;
  reveal.observe(el);
});

// Mouse spotlight.
if(orb && matchMedia('(pointer:fine)').matches){
  addEventListener('pointermove', e => {
    orb.style.left = `${e.clientX}px`;
    orb.style.top = `${e.clientY}px`;
  }, {passive:true});
}

// Gentle magnetic buttons.
document.querySelectorAll('.magnetic').forEach(el=>{
  el.addEventListener('pointermove', e=>{
    const r=el.getBoundingClientRect();
    const x=e.clientX-r.left-r.width/2;
    const y=e.clientY-r.top-r.height/2;
    el.style.transform=`translate(${x*.06}px,${y*.06}px)`;
  });
  el.addEventListener('pointerleave',()=>el.style.transform='');
});

// Active navigation.
const sections = [...document.querySelectorAll('main section[id]')];
const links = [...document.querySelectorAll('.nav-links a')];
const sectionObserver = new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(!entry.isIntersecting) return;
    links.forEach(link=>link.classList.toggle('active', link.getAttribute('href')===`#${entry.target.id}`));
  });
},{rootMargin:'-42% 0px -48% 0px',threshold:0});
sections.forEach(s=>sectionObserver.observe(s));

const yearEl = document.getElementById('year');
if(yearEl) yearEl.textContent = new Date().getFullYear();

/* =====================================================================
   Glass motion (added)
   ===================================================================== */
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = matchMedia('(pointer:fine)').matches;

// 1. Hero headline: words rise out of a frosted blur, one orchestrated moment.
document.querySelectorAll('.words').forEach(el => {
  let i = 0;
  const wrap = node => {
    [...node.childNodes].forEach(child => {
      if(child.nodeType === 3){
        const frag = document.createDocumentFragment();
        child.textContent.split(/(\s+)/).forEach(part => {
          if(!part) return;
          if(/^\s+$/.test(part)){ frag.appendChild(document.createTextNode(' ')); return; }
          const w = document.createElement('b'); w.className = 'w';
          const inner = document.createElement('i'); inner.textContent = part;
          inner.style.setProperty('--i', i++);
          w.appendChild(inner); frag.appendChild(w);
        });
        child.replaceWith(frag);
      } else if(child.nodeType === 1 && child.tagName !== 'BR'){
        wrap(child);
      }
    });
  };
  wrap(el);
});

// 2. Glass highlight follows the cursor on every .glass panel and tilt card.
if(finePointer){
  let raf = 0;
  addEventListener('pointermove', e => {
    if(raf) return;
    raf = requestAnimationFrame(() => {
      raf = 0;
      const t = e.target.closest?.('.glass, [data-tilt]');
      if(!t) return;
      const r = t.getBoundingClientRect();
      t.style.setProperty('--mx', `${e.clientX - r.left}px`);
      t.style.setProperty('--my', `${e.clientY - r.top}px`);
    });
  }, {passive:true});
}

// 3. Gentle 3D tilt on project artwork and detail covers.
if(finePointer && !reduceMotion){
  document.querySelectorAll('[data-tilt]').forEach(el => {
    el.addEventListener('pointermove', e => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - .5;
      const y = (e.clientY - r.top) / r.height - .5;
      el.style.transform = `perspective(900px) rotateX(${(-y * 7).toFixed(2)}deg) rotateY(${(x * 9).toFixed(2)}deg) scale(1.015)`;
    });
    el.addEventListener('pointerleave', () => { el.style.transform = ''; });
  });
}

// 4. Timeline line draws itself as you scroll.
const timelines = [...document.querySelectorAll('.timeline')];
function updateTimelines(){
  timelines.forEach(t => {
    const r = t.getBoundingClientRect();
    const p = Math.min(1, Math.max(0, (innerHeight * .72 - r.top) / r.height));
    t.style.setProperty('--p', p.toFixed(3));
  });
}

// 5. Soft parallax for cover images.
const parallax = [...document.querySelectorAll('[data-parallax]')];
function updateParallax(){
  if(reduceMotion) return;
  parallax.forEach(el => {
    const r = el.parentElement.getBoundingClientRect();
    const offset = (r.top + r.height / 2 - innerHeight / 2) * -.07;
    el.style.transform = `translateY(${offset.toFixed(1)}px)${el.dataset.scale ? ` scale(${el.dataset.scale})` : ''}`;
  });
}
// 6. Frosted wipe between pages.
const wipe = document.querySelector('.page-wipe');
document.addEventListener('click', e => {
  const a = e.target.closest('a[href]');
  if(!wipe || !a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  if(a.target && a.target !== '_self') return;
  const url = new URL(a.href, location.href);
  if(url.protocol !== location.protocol || url.host !== location.host || url.pathname === location.pathname) return;
  e.preventDefault();
  wipe.classList.add('leaving');
  setTimeout(() => { location.href = a.href; }, reduceMotion ? 0 : 460);
});
addEventListener('pageshow', e => { if(e.persisted && wipe) wipe.classList.remove('leaving'); });

// Initial paint state (runs last so every helper above exists).
onScroll();
