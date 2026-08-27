const menuButton=document.querySelector('.menu-toggle');const nav=document.querySelector('.nav');if(menuButton&&nav){
  if(!nav.id)nav.id='primary-navigation';
  menuButton.setAttribute('aria-controls',nav.id);
  const setNavigationState=(open,restoreFocus=false)=>{
    nav.classList.toggle('open',open);
    menuButton.setAttribute('aria-expanded',String(open));
    menuButton.setAttribute('aria-label',open?'Close navigation':'Open navigation');
    if(!open&&restoreFocus)menuButton.focus();
  };
  menuButton.addEventListener('click',()=>setNavigationState(!nav.classList.contains('open')));
  nav.addEventListener('click',(event)=>{if(event.target.closest('a'))setNavigationState(false);});
  document.addEventListener('keydown',(event)=>{
    if(event.key==='Escape'&&nav.classList.contains('open')){
      event.preventDefault();
      setNavigationState(false,true);
    }
  });
}

// Gotham Solutions Assistant
(function(){
  const widget = document.querySelector('.gotham-ai-widget');
  if(!widget) return;

  const toggle = widget.querySelector('.gotham-ai-toggle');
  const panel = widget.querySelector('.gotham-ai-panel');
  const close = widget.querySelector('.gotham-ai-close');
  const messages = widget.querySelector('.gotham-ai-messages');
  const form = widget.querySelector('.gotham-ai-form');
  const input = form.querySelector('input');

  if(!panel.id) panel.id = 'gotham-solutions-assistant';
  toggle.setAttribute('aria-controls', panel.id);
  toggle.setAttribute('aria-expanded', 'false');
  panel.setAttribute('aria-hidden', 'true');

  function setPanelState(open, restoreFocus = false, initialFocus = close){
    panel.classList.toggle('open', open);
    panel.setAttribute('aria-hidden', String(!open));
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close Gotham Solutions Assistant' : 'Open Gotham Solutions Assistant');
    if(open){
      window.requestAnimationFrame(() => initialFocus.focus());
    } else if(restoreFocus){
      toggle.focus();
    }
  }

  const responses = {
    expense: "Gotham helps organizations identify savings opportunities through contract reviews, invoice analysis, vendor accountability, service validation, and Technology Expense Management. A good first step is a focused review of current contracts, invoices, and recurring services.",
    infrastructure: "Gotham supports infrastructure planning across network design, cloud communications, SD-WAN, connectivity, low voltage coordination, relocation planning, and implementation oversight.",
    managed: "Gotham can help evaluate, source, and coordinate managed services across IT support, cybersecurity, backup, endpoint strategy, cloud platforms, and vendor management.",
    contact: 'You can call Gotham Solutions Group at <a href="tel:+12125421300">212-542-1300</a> or email <a href="mailto:info@gothamsolutionsgroup.com">info@gothamsolutionsgroup.com</a>. For the fastest start, share what you want to reduce, modernize, or simplify.' 
  };

  function addMessage(text, type, allowLinks = false){
    const msg = document.createElement('div');
    msg.className = 'gotham-ai-message ' + type;
    if(allowLinks){
      msg.innerHTML = text;
      msg.querySelectorAll('a').forEach(link => {
        link.classList.add('gotham-ai-contact-link');
      });
    } else {
      msg.textContent = text;
    }
    messages.appendChild(msg);
    messages.scrollTop = messages.scrollHeight;
  }

  function answer(text){
    const q = text.toLowerCase();
    if(q.includes('expense') || q.includes('cost') || q.includes('save') || q.includes('invoice')){
      return responses.expense;
    }
    if(q.includes('infrastructure') || q.includes('network') || q.includes('sd-wan') || q.includes('cabling') || q.includes('design')){
      return responses.infrastructure;
    }
    if(q.includes('managed') || q.includes('support') || q.includes('cyber') || q.includes('backup')){
      return responses.managed;
    }
    if(q.includes('contact') || q.includes('call') || q.includes('email') || q.includes('consultation')){
      return responses.contact;
    }
    return 'Gotham Solutions Group focuses on expense reduction strategy, infrastructure design, and managed services. To get specific guidance, call <a href="tel:+12125421300">212-542-1300</a>, email <a href="mailto:info@gothamsolutionsgroup.com">info@gothamsolutionsgroup.com</a>, or ask about one of those areas here.';
  }

  toggle.addEventListener('click', event => {
    const opening = !panel.classList.contains('open');
    setPanelState(opening, false, event.detail === 0 ? input : close);
  });
  close.addEventListener('click', () => setPanelState(false, true));

  document.addEventListener('keydown', event => {
    if(event.key === 'Escape' && panel.classList.contains('open')){
      event.preventDefault();
      setPanelState(false, true);
    }
  });

  widget.querySelectorAll('[data-question]').forEach(button => {
    button.addEventListener('click', () => {
      const key = button.getAttribute('data-question');
      addMessage(button.textContent, 'user');
      addMessage(responses[key], 'bot', key === 'contact');
    });
  });

  form.addEventListener('submit', event => {
    event.preventDefault();
    const text = input.value.trim();
    if(!text) return;
    addMessage(text, 'user');
    input.value = '';
    setTimeout(() => {
      const reply = answer(text);
      addMessage(reply, 'bot', reply.includes('href='));
    }, 250);
  });
})();

/* Valued Clients stable 5x5 rotating logo wall */
document.addEventListener("DOMContentLoaded", function(){
  const reducedMotion = window.matchMedia ? window.matchMedia("(prefers-reduced-motion: reduce)") : {matches:false};
  document.querySelectorAll(".client-logo-batch-grid").forEach(function(grid){
    const originalCards = Array.from(grid.querySelectorAll(".client-logo-card"));
    const logos = originalCards.map(function(card){
      const img = card.querySelector("img");
      return img ? { src: img.getAttribute("src"), alt: img.getAttribute("alt") || "Client logo" } : null;
    }).filter(Boolean);

    if(!logos.length) return;

    const pageSize = Math.min(25, logos.length);
    let offset = 0;
    let activeLayer = 0;
    let isRotating = false;

    grid.innerHTML = "";
    grid.classList.add("client-logo-stable-wall");
    grid.setAttribute("data-active-layer", "0");

    const slots = [];
    for(let i = 0; i < pageSize; i++){
      const figure = document.createElement("figure");
      figure.className = "client-logo-card client-logo-slot";

      const imgA = document.createElement("img");
      imgA.className = "client-logo-img client-logo-layer-a";
      imgA.loading = "lazy";
      imgA.decoding = "async";

      const imgB = document.createElement("img");
      imgB.className = "client-logo-img client-logo-layer-b";
      imgB.loading = "lazy";
      imgB.decoding = "async";
      imgB.setAttribute("aria-hidden", "true");

      figure.appendChild(imgA);
      figure.appendChild(imgB);

      figure.style.setProperty("--client-slot-delay", (i * 55) + "ms");
      figure.style.setProperty("--client-reveal-delay", (i * 42) + "ms");
      grid.appendChild(figure);
      slots.push({ figure, layers: [imgA, imgB] });
    }

    function logoAt(index){
      return logos[index % logos.length];
    }

    function setImage(img, logo){
      img.src = logo.src;
      img.alt = logo.alt;
    }

    function waitForImage(img, timeoutMs){
      return new Promise(function(resolve){
        let settled = false;
        let timer = 0;

        function finish(ok){
          if(settled) return;
          settled = true;
          window.clearTimeout(timer);
          img.removeEventListener("load", onLoad);
          img.removeEventListener("error", onError);
          resolve(ok);
        }

        function onLoad(){
          if(img.decode){
            img.decode().then(function(){ finish(true); }).catch(function(){
              finish(img.naturalWidth > 0);
            });
          } else {
            finish(true);
          }
        }

        function onError(){ finish(false); }

        if(img.complete){
          finish(img.naturalWidth > 0);
          return;
        }

        img.addEventListener("load", onLoad, {once:true});
        img.addEventListener("error", onError, {once:true});
        timer = window.setTimeout(function(){ finish(false); }, timeoutMs);
      });
    }

    slots.forEach(function(slot, i){
      setImage(slot.layers[0], logoAt(offset + i));
    });

    grid.classList.add("client-logo-reveal-ready");
    let wallInView = false;
    function revealLogos(){
      grid.classList.add("logos-in-view");
    }
    if(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches){
      revealLogos();
    } else if("IntersectionObserver" in window){
      const revealObserver = new IntersectionObserver(function(entries){
        entries.forEach(function(entry){
          if(entry.isIntersecting){
            revealLogos();
            revealObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.16, rootMargin: "0px 0px -8% 0px" });
      revealObserver.observe(grid);
    } else {
      revealLogos();
    }

    if("IntersectionObserver" in window){
      const activityObserver = new IntersectionObserver(function(entries){
        wallInView = entries.some(function(entry){ return entry.isIntersecting; });
      }, { rootMargin: "240px 0px", threshold: 0 });
      activityObserver.observe(grid);
    } else {
      wallInView = true;
    }

    async function rotate(){
      if(isRotating || !wallInView || document.hidden || reducedMotion.matches) return;
      isRotating = true;

      const nextOffset = (offset + pageSize) % logos.length;
      const nextLayer = activeLayer === 0 ? 1 : 0;

      slots.forEach(function(slot, i){
        slot.layers[nextLayer].loading = "eager";
        setImage(slot.layers[nextLayer], logoAt(nextOffset + i));
        slot.figure.style.setProperty("--client-slot-delay", (i * 18) + "ms");
      });

      const readiness = await Promise.all(slots.map(function(slot){
        return waitForImage(slot.layers[nextLayer], 5000);
      }));

      if(!readiness.every(Boolean) || !wallInView || document.hidden){
        slots.forEach(function(slot){
          slot.figure.style.removeProperty("--client-slot-delay");
        });
        isRotating = false;
        return;
      }

      grid.classList.add("is-switching");
      slots.forEach(function(slot){
        slot.layers[nextLayer].removeAttribute("aria-hidden");
        slot.layers[activeLayer].setAttribute("aria-hidden", "true");
      });

      requestAnimationFrame(function(){
        requestAnimationFrame(function(){
          grid.setAttribute("data-active-layer", String(nextLayer));
        });
      });

      window.setTimeout(function(){
        offset = nextOffset;
        slots.forEach(function(slot){
          slot.figure.style.removeProperty("--client-slot-delay");
        });
        activeLayer = nextLayer;
        grid.classList.remove("is-switching");
        isRotating = false;
      }, 1100);
    }

    if(logos.length > pageSize && !reducedMotion.matches){
      setInterval(rotate, 12000);
    }
  });
});

// Subtle section reveal animations
(function(){
  const targets = Array.from(document.querySelectorAll('main > section:not(.six-rubik-section):not(.gotham-partners-rubik-section), .site-footer'));
  if(!targets.length) return;
  if(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches){
    targets.forEach(el => el.classList.add('is-revealed'));
    return;
  }
  targets.forEach(el => el.classList.add('scroll-reveal'));
  if(!('IntersectionObserver' in window)){
    targets.forEach(el => el.classList.add('is-revealed'));
    return;
  }
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add('is-revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
  targets.forEach(el => observer.observe(el));
})();

// Gotham Partners cube interaction: drag/swipe the whole cube as one object.
(() => {
  const cube = document.querySelector('.six-rubik-cube');
  const dragSurface = document.querySelector('.six-rubik-drag-surface');
  const stage = document.querySelector('.six-rubik-stage');
  if (!cube || !dragSurface || !stage) return;

  const reducedMotion = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : { matches: false };

  if (!stage.hasAttribute('tabindex')) stage.tabIndex = 0;
  if (!stage.hasAttribute('role')) stage.setAttribute('role', 'group');
  stage.setAttribute('aria-label', 'Interactive Gotham Partners logo cube');

  cube.style.animation = 'none';
  cube.style.transformStyle = 'preserve-3d';

  let rotX = -18;
  let rotY = 30;
  let velocityX = 0;
  let velocityY = 0.06;
  let dragging = false;
  let lastX = 0;
  let lastY = 0;
  let lastFrame = performance.now();
  let activePointerId = null;
  let cubeInView = false;
  let animationFrameId = 0;

  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

  const render = () => {
    cube.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg)`;
  };

  const animate = (now) => {
    const dt = Math.min(34, now - lastFrame);
    lastFrame = now;

    if (!dragging) {
      rotX += velocityX * dt;
      rotY += velocityY * dt;

      velocityX *= 0.985;
      velocityY *= 0.985;

      if (Math.abs(velocityY) < 0.05) {
        velocityY += (velocityY < 0 ? -1 : 1) * 0.0015;
      }
    }

    render();
    if (cubeInView && !document.hidden) {
      animationFrameId = requestAnimationFrame(animate);
    } else {
      animationFrameId = 0;
    }
  };

  const startAnimation = () => {
    if (animationFrameId || !cubeInView || document.hidden || reducedMotion.matches) return;
    lastFrame = performance.now();
    animationFrameId = requestAnimationFrame(animate);
  };

  const stopAnimation = () => {
    if (!animationFrameId) return;
    cancelAnimationFrame(animationFrameId);
    animationFrameId = 0;
  };

  if ('IntersectionObserver' in window) {
    const cubeObserver = new IntersectionObserver((entries) => {
      cubeInView = entries.some((entry) => entry.isIntersecting);
      if (cubeInView) startAnimation();
      else stopAnimation();
    }, { rootMargin: '180px 0px', threshold: 0 });
    cubeObserver.observe(cube);
  } else {
    cubeInView = true;
  }

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stopAnimation();
    else startAnimation();
  });

  if (typeof reducedMotion.addEventListener === 'function') {
    reducedMotion.addEventListener('change', () => {
      if (reducedMotion.matches) stopAnimation();
      else startAnimation();
    });
  }

  dragSurface.addEventListener('pointerdown', (event) => {
    if (dragging || (event.pointerType === 'mouse' && event.button !== 0)) return;
    dragging = true;
    activePointerId = event.pointerId;
    lastX = event.clientX;
    lastY = event.clientY;
    velocityX = 0;
    velocityY = 0;
    dragSurface.classList.add('is-dragging');
    dragSurface.setPointerCapture?.(event.pointerId);
    event.preventDefault();
    startAnimation();
  });

  dragSurface.addEventListener('pointermove', (event) => {
    if (!dragging || event.pointerId !== activePointerId) return;

    const dx = event.clientX - lastX;
    const dy = event.clientY - lastY;

    const safeDx = clamp(dx, -48, 48);
    const safeDy = clamp(dy, -48, 48);

    rotY += safeDx * 0.42;
    rotX -= safeDy * 0.42;

    velocityY = (velocityY * 0.55) + (safeDx * 0.028 * 0.45);
    velocityX = (velocityX * 0.55) + (-safeDy * 0.028 * 0.45);

    lastX = event.clientX;
    lastY = event.clientY;
    render();
    event.preventDefault();
  });

  const release = (event) => {
    if (!dragging) return;
    if (event && activePointerId !== null && event.pointerId !== activePointerId) return;

    dragging = false;
    activePointerId = null;
    dragSurface.classList.remove('is-dragging');

    velocityX = clamp(velocityX, -0.55, 0.55);
    velocityY = clamp(velocityY, -0.55, 0.55);

    if (Math.abs(rotX) > 3600) rotX %= 360;
    if (Math.abs(rotY) > 3600) rotY %= 360;

    if (Math.abs(velocityX) < 0.04 && Math.abs(velocityY) < 0.04) {
      velocityY = 0.06;
    }
  };

  dragSurface.addEventListener('pointerup', release);
  dragSurface.addEventListener('pointercancel', release);
  dragSurface.addEventListener('lostpointercapture', release);

  stage.addEventListener('keydown', (event) => {
    const step = event.shiftKey ? 30 : 12;
    if (event.key === 'ArrowLeft') rotY -= step;
    else if (event.key === 'ArrowRight') rotY += step;
    else if (event.key === 'ArrowUp') rotX += step;
    else if (event.key === 'ArrowDown') rotX -= step;
    else if (event.key === 'Home') {
      rotX = -18;
      rotY = 30;
    } else return;

    event.preventDefault();
    velocityX = 0;
    velocityY = reducedMotion.matches ? 0 : 0.06;
    render();
  });

  render();
  startAnimation();
})();

// Pause decorative marquee motion whenever it cannot be seen.
(() => {
  const tracks = Array.from(document.querySelectorAll('.quote-track'));
  if (!tracks.length) return;

  const updateVisibility = (track, visible) => {
    track.classList.toggle('is-in-view', visible && !document.hidden);
  };

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => updateVisibility(entry.target, entry.isIntersecting));
    }, { rootMargin: '120px 0px', threshold: 0 });
    tracks.forEach((track) => observer.observe(track));
    document.addEventListener('visibilitychange', () => {
      tracks.forEach((track) => {
        if (document.hidden) {
          updateVisibility(track, false);
          return;
        }
        const rect = track.getBoundingClientRect();
        updateVisibility(track, rect.bottom >= -120 && rect.top <= window.innerHeight + 120);
      });
    });
  } else {
    tracks.forEach((track) => updateVisibility(track, true));
  }
})();

// v1-4-143: Click/touch/keyboard flip for Outcomes & Results cards.
(() => {
  const cards = document.querySelectorAll('.outcome-flip-card');
  cards.forEach((card) => {
    card.addEventListener('click', () => {
      const isFlipped = card.classList.toggle('is-flipped');
      card.setAttribute('aria-pressed', String(isFlipped));
      const title = card.querySelector('.outcome-flip-back h3')?.textContent?.trim() || 'outcome';
      card.setAttribute('aria-label', isFlipped ? `Hide ${title} details` : `Reveal ${title} details`);
    });
  });
})();

// Load the centralized team booking module exactly once.
(function(){
  if(document.querySelector('script[data-team-bookings-loader]'))return;
  var script=document.createElement('script');
  script.src='assets/team-bookings.js?v=1.1.0';
  script.setAttribute('data-team-bookings-loader','true');
  document.head.appendChild(script);
})();


// v1.4.175: keep footer copyright year current.
document.querySelectorAll('[data-current-year]').forEach((year) => {
  year.textContent = String(new Date().getFullYear());
});
