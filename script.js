const menuButton=document.getElementById('menu-button');
const mobileNav=document.getElementById('mobile-nav');
if(menuButton&&mobileNav){
  menuButton.addEventListener('click',()=>{
    const open=menuButton.getAttribute('aria-expanded')!=='true';
    menuButton.setAttribute('aria-expanded',String(open));
    mobileNav.hidden=!open;
    menuButton.querySelector('span').textContent=open?'Close':'Menu';
  });
  mobileNav.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>{
    menuButton.setAttribute('aria-expanded','false');mobileNav.hidden=true;menuButton.querySelector('span').textContent='Menu';
  }));
  window.addEventListener('keydown',e=>{if(e.key==='Escape'&&!mobileNav.hidden){menuButton.setAttribute('aria-expanded','false');mobileNav.hidden=true;menuButton.querySelector('span').textContent='Menu';menuButton.focus()}});
}
const year=document.getElementById('year');if(year)year.textContent=String(new Date().getFullYear());

// Local-only site image manager creates hero-settings.js; no upload or admin API.
(function(){
  const s=window.GKN_HERO_SETTINGS;
  if(!s || typeof s!=='object')return;
  const img=document.querySelector('.hero-image');
  const aboutImage=document.querySelector('.feature-photo');
  const caption=document.getElementById('hero-caption');
  if(img){
    if(typeof s.alt==='string')img.alt=s.alt.slice(0,240);
    if(Number.isFinite(s.imageVersion) && s.imageVersion>1){
      // Unique revision means an updated photo is not stuck in the browser cache.
      img.src='assets/hero-image.webp?v='+String(Math.floor(s.imageVersion));
    }
  }
  if(aboutImage){
    if(typeof s.alt==='string')aboutImage.alt=s.alt.slice(0,240);
    if(Number.isFinite(s.imageVersion)&&s.imageVersion>1)aboutImage.src='assets/hero-image.webp?v='+String(Math.floor(s.imageVersion));
  }
  if(caption && typeof s.caption==='string'){
    caption.textContent=s.caption.slice(0,180);
    caption.hidden=!s.caption.trim();
  }
  for (const [key,custom] of [['desktop','--hero-position-desktop'],['mobile','--hero-position-mobile']]){
    const p=s[key];
    if(p && Number.isFinite(p.x)&&Number.isFinite(p.y)){
      const clamp=v=>Math.max(0,Math.min(100,Math.round(v)));
      document.documentElement.style.setProperty(custom,clamp(p.x)+'% '+clamp(p.y)+'%');
    }
  }
})();

// v7: restrained cinematic enhancements, disabled for reduced motion.
(()=>{
  const reduce=window.matchMedia('(prefers-reduced-motion: reduce)');
  const elements=[...document.querySelectorAll('.v8-home-intro-main,.v8-features-top,.v8-feature,.v8-home-end-grid,.welcome-left,.welcome-right,.step,.worship-head,.worship-list article,.questions-heading,.questions-accordions,.contact-grid,.chapter-cta-inner')];
  if(!reduce.matches&&'IntersectionObserver' in window){
    // CSS only animates after JS identifies elements; accessible content stays visible otherwise.
    elements.forEach(el=>el.classList.add('motion-eligible'));
    const obs=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('motion-visible');obs.unobserve(e.target)}}),{threshold:.07,rootMargin:'0px 0px 16px 0px'});
    elements.forEach(el=>obs.observe(el));
  }
  const track=document.querySelector('.header-progress');
  let pending=false;
  const updateProgress=()=>{pending=false;if(!track)return;const max=document.documentElement.scrollHeight-innerHeight;const pct=max>0?Math.max(0,Math.min(100,scrollY/max*100)):0;track.style.transform=`scaleX(${pct/100})`};
  addEventListener('scroll',()=>{if(!pending){pending=true;requestAnimationFrame(updateProgress)}},{passive:true});
  updateProgress();
  // One-time gentle parallax for hero artwork only; no scroll-hijack or canvas.
  const visual=document.querySelector('.hero-visual');
  if(visual&&!reduce.matches&&'IntersectionObserver' in window){
    const observer=new IntersectionObserver(entries=>{visual.classList.toggle('hero-near-view',entries.some(e=>e.isIntersecting))});
    observer.observe(visual);
  }
  const navButton=document.getElementById('menu-button'), nav=document.getElementById('mobile-nav');
  if(nav&&navButton){
    document.addEventListener('click',e=>{if(!nav.hidden&&!nav.contains(e.target)&&!navButton.contains(e.target)){nav.hidden=true;navButton.setAttribute('aria-expanded','false');const label=navButton.querySelector('span');if(label)label.textContent='Menu';}});
  }
})();

// v8: subtle, optional photo-depth response. No tracking, network or pointer hijacking.
(()=>{
  const hero=document.querySelector('.v8-hero');
  if(!hero || matchMedia('(prefers-reduced-motion: reduce)').matches || !matchMedia('(hover:hover) and (pointer:fine)').matches)return;
  const visual=hero.querySelector('.v8-hero-visual');
  if(!visual)return;
  let frame=0;
  hero.addEventListener('pointermove',event=>{
    if(frame)return;
    frame=requestAnimationFrame(()=>{
      frame=0;
      const rect=hero.getBoundingClientRect();
      const x=(event.clientX-rect.left)/rect.width-.5;
      const y=(event.clientY-rect.top)/rect.height-.5;
      visual.style.setProperty('--v8-pointer-x',(-x*12).toFixed(1)+'px');
      visual.style.setProperty('--v8-pointer-y',(-y*9).toFixed(1)+'px');
    });
  },{passive:true});
  hero.addEventListener('pointerleave',()=>{
    visual.style.setProperty('--v8-pointer-x','0px');
    visual.style.setProperty('--v8-pointer-y','0px');
  });
})();

// v9: a real, local video of animated water reflection; user can pause.
(()=>{
  const video=document.querySelector('#sarovar-video');
  const button=document.querySelector('#motion-toggle');
  if(!video||!button)return;
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
  let paused=reduced.matches;
  const apply=()=>{
    if(paused){video.pause();video.hidden=true;}else{video.hidden=false;video.play().catch(()=>{video.hidden=true;});}
    button.setAttribute('aria-pressed',String(paused));
    button.setAttribute('aria-label',paused?'Play moving water animation':'Pause moving water animation');
    button.innerHTML=paused?'Play motion <span aria-hidden="true">▶</span>':'Pause motion <span aria-hidden="true">Ⅱ</span>';
  };
  button.addEventListener('click',()=>{paused=!paused;apply()});
  // If the user changes accessibility preferences while page is open, honour it.
  reduced.addEventListener?.('change',event=>{paused=event.matches;apply()});
  apply();
})();

// v10: historical photo is hosted by its credited source, not bundled or redistributed.
// If the archive site is unavailable offline, show our clearly labelled illustration.
(()=>{
  const image=document.querySelector('.gkh-photo-frame img');
  if(!image)return;
  const fallback=()=>{image.hidden=true;image.closest('.gkh-photo-frame')?.classList.add('gkh-photo-unavailable')};
  image.addEventListener('error',fallback,{once:true});
  if(image.complete && image.naturalWidth===0)fallback();
})();
