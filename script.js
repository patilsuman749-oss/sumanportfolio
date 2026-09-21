const progress = document.querySelector('.progress');
const header = document.querySelector('.header');
const orb = document.querySelector('.cursor-orb');
const menu = document.querySelector('.menu');
const nav = document.querySelector('.nav-links');

menu.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menu.setAttribute('aria-expanded', open);
});
document.querySelectorAll('.nav-links a').forEach(a => a.addEventListener('click', () => nav.classList.remove('open')));

// Scroll progress + header state.
function onScroll(){
  const max = document.documentElement.scrollHeight - innerHeight;
  progress.style.width = `${max ? (scrollY / max) * 100 : 0}%`;
  header.classList.toggle('scrolled', scrollY > 10);
}
addEventListener('scroll', onScroll, {passive:true});
onScroll();

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
if(matchMedia('(pointer:fine)').matches){
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

document.getElementById('year').textContent = new Date().getFullYear();
