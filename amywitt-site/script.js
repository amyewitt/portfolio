/* Amy Witt — portfolio interactions */
(function(){
  const nav = document.getElementById('nav');
  const progress = document.getElementById('progress');

  function onScroll(){
    const y = window.scrollY || document.documentElement.scrollTop;
    if(nav) nav.classList.toggle('scrolled', y > 24);
    if(progress){
      const h = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.width = (h > 0 ? (y / h) * 100 : 0) + '%';
    }
  }
  window.addEventListener('scroll', onScroll, {passive:true});
  onScroll();

  // reveal on scroll
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        e.target.classList.add('in');
        if(e.target.dataset.count !== undefined) countUp(e.target);
        io.unobserve(e.target);
      }
    });
  }, {threshold:0.15, rootMargin:'0px 0px -8% 0px'});

  document.querySelectorAll('.reveal,.stagger').forEach(el=>io.observe(el));

  // stat count-ups
  const counters = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting){ countUp(e.target); counters.unobserve(e.target); }
    });
  }, {threshold:0.4});
  document.querySelectorAll('[data-count]').forEach(el=>counters.observe(el));

  function countUp(el){
    const target = parseFloat(el.dataset.count);
    const dec = el.dataset.dec ? 1 : 0;
    const dur = 1100;
    const t0 = performance.now();
    function tick(now){
      const p = Math.min(1,(now-t0)/dur);
      const eased = 1 - Math.pow(1-p,3);
      el.textContent = (target*eased).toFixed(dec);
      if(p<1) requestAnimationFrame(tick);
      else el.textContent = target.toFixed(dec);
    }
    requestAnimationFrame(tick);
  }

  // hero illustration: converge on load, replay on hover
  const focus = document.querySelector('.focus-svg');
  if(focus && !window.matchMedia('(prefers-reduced-motion:reduce)').matches){
    const run = ()=>{
      focus.classList.remove('go');
      void document.documentElement.offsetWidth; // force reflow on an HTML element (SVG offsetWidth is unreliable)
      focus.classList.add('go');
    };
    requestAnimationFrame(()=>requestAnimationFrame(run));
    // replay when the pointer enters the illustration area; bind several targets for reliability
    ['.hero-art','.orbit-field','.orbit-blob'].forEach(sel=>{
      const el = document.querySelector(sel);
      if(el) el.addEventListener('mouseenter', run);
    });
  }

  // smooth in-page anchors
  document.querySelectorAll('a[href*="#"]').forEach(a=>{
    a.addEventListener('click',(ev)=>{
      const href = a.getAttribute('href');
      const hash = href.includes('#') ? '#'+href.split('#')[1] : '';
      if(hash.length>1 && (href.startsWith('#') || href.startsWith('index.html#'))){
        const onHome = !href.startsWith('index.html') || location.pathname.endsWith('index.html') || location.pathname.endsWith('/');
        const target = document.querySelector(hash);
        if(target && onHome){ ev.preventDefault(); target.scrollIntoView({behavior:'smooth',block:'start'}); }
      }
    });
  });
})();
