 document.getElementById('year').textContent = new Date().getFullYear();

    // Simple mobile nav (toggle)
    function toggleMenu(){
      const nav = document.querySelector('nav');
      if(nav.style.display === 'flex') nav.style.display = '';
      else nav.style.display = 'flex';
    }

    // Intersection observer for reveal
    const io = new IntersectionObserver((entries)=>{
      entries.forEach(e=>{
        if(e.isIntersecting){
          e.target.style.opacity = 1; e.target.style.transform = 'translateY(0)'; e.target.style.transition = 'opacity 600ms ease, transform 600ms ease';
          io.unobserve(e.target);
        }
      })
    },{threshold:.12});

    document.querySelectorAll('section, .svc, .proj, .card').forEach(el=>io.observe(el));

    // Counters animation
    const counters = document.querySelectorAll('.num');
    const animateCounter = (el, target)=>{
      let start = 0; const dur = 1400; const step = (timestamp)=>{
        start += Math.ceil(target/30);
        el.textContent = start>=target?target:start;
        if(start<target) setTimeout(step, dur/30);
      };
      step();
    };
    const statsObserver = new IntersectionObserver((entries)=>{
      for(let en of entries){
        if(en.isIntersecting){
          counters.forEach(c=>animateCounter(c, +c.dataset.target)); statsObserver.disconnect();
        }
      }
    },{threshold:.5});
    statsObserver.observe(document.querySelector('.stats'));

    // Projects modal
    function openModal(title, desc, img){
      document.getElementById('modalTitle').textContent = title;
      document.getElementById('modalDesc').textContent = desc;
      document.getElementById('modalImg').src = img;
      document.getElementById('modal').style.display = 'flex';
      document.getElementById('modal').setAttribute('aria-hidden','false');
    }
    function closeModal(){
      document.getElementById('modal').style.display = 'none';
      document.getElementById('modal').setAttribute('aria-hidden','true');
    }
    document.querySelectorAll('.proj').forEach(p=>{
      p.addEventListener('click', ()=> openModal(p.dataset.title,p.dataset.desc,p.dataset.img));
      p.addEventListener('keypress', (e)=>{ if(e.key==='Enter') openModal(p.dataset.title,p.dataset.desc,p.dataset.img); });
    });

    // Contact form: basic client-side submit to Formspree and UI feedback
    const form = document.getElementById('contactForm');
    const formMsg = document.getElementById('formMsg');
    form.addEventListener('submit', async (e)=>{
      e.preventDefault();
      formMsg.textContent = 'Sending…';
      const data = new FormData(form);
      try{
        const res = await fetch(form.action, {method:'POST',body:data,headers:{'Accept':'application/json'}});
        if(res.ok){ form.reset(); formMsg.textContent = 'Message sent — I will reply soon.'; }
        else { formMsg.textContent = 'Oops — there was a problem. Try again.'; }
      }catch(err){ formMsg.textContent = 'Network error — please try again.' }
    });

    // Simple carousel auto scroll for testimonials
    const carousel = document.getElementById('carousel');
    if(carousel){let idx=0; setInterval(()=>{ idx = (idx+1) % carousel.children.length; carousel.scrollTo({left: carousel.children[idx].offsetLeft - carousel.offsetLeft, behavior:'smooth'}); },4000); }

    // Small accessibility: close modal on ESC
    document.addEventListener('keydown',(e)=>{ if(e.key==='Escape') closeModal(); });
