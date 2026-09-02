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

// Free, browser-based Gotham guided assistant
(function(){
  const widget = document.querySelector('.gotham-ai-widget');
  if(!widget) return;

  const toggle = widget.querySelector('.gotham-ai-toggle');
  const panel = widget.querySelector('.gotham-ai-panel');
  const close = widget.querySelector('.gotham-ai-close');
  const header = widget.querySelector('.gotham-ai-header strong');
  const messages = widget.querySelector('.gotham-ai-messages');
  const quick = widget.querySelector('.gotham-ai-quick');
  const form = widget.querySelector('.gotham-ai-form');
  const input = form.querySelector('input');
  const history = [];

  const contactAnswer = 'Call <a href="tel:+12125421300">(212) 542-1300</a>, email <a href="mailto:info@gothamsolutionsgroup.com">info@gothamsolutionsgroup.com</a>, or <a href="/contact#team-booking-directory">choose a team member</a> to book a meeting.';
  const nodes = {
    home: {
      message: 'Hi! I can help you find the right Gotham service or connect you with the team. What would you like to accomplish?',
      options: [
        ['expense', 'Reduce technology expenses'],
        ['infrastructure', 'Plan or upgrade infrastructure'],
        ['managed', 'Get ongoing IT support'],
        ['about', 'Learn about Gotham'],
        ['contact', 'Contact the team']
      ]
    },
    expense: {
      message: 'Gotham reviews technology spending independently to uncover billing errors, contract issues, unused services, and ongoing savings opportunities. What best describes your need?',
      options: [
        ['invoice', 'Review invoices and contracts'],
        ['recovery', 'Recover billing errors'],
        ['monthly', 'Reduce monthly spending'],
        ['tem', 'Manage expenses over time'],
        ['fees', 'Understand the fee approach'],
        ['expense-page', 'View the full service page']
      ]
    },
    invoice: {message: 'Gotham can compare invoices, contracts, rates, services, and vendor commitments to identify discrepancies and opportunities. The review is vendor-neutral, so recommendations are based on the client’s needs rather than a provider’s sales goals.', options: [['contact', 'Discuss an invoice review'], ['expense-page', 'Learn more']]},
    recovery: {message: 'Gotham investigates billing mistakes, overcharges, missed credits, and contract discrepancies, then works with vendors to pursue corrections and recover eligible funds.', options: [['contact', 'Discuss a recovery review'], ['results', 'See Gotham’s results']]},
    monthly: {message: 'Gotham looks for unnecessary services, unfavorable rates, plan mismatches, contract problems, and better-fit alternatives that can reduce recurring technology expenses.', options: [['contact', 'Discuss monthly savings'], ['expense-page', 'Learn more']]},
    tem: {message: 'Technology Expense Management provides ongoing visibility into services, invoices, vendors, usage, and contracts so costs remain controlled after the initial review.', options: [['contact', 'Ask about expense management'], ['expense-page', 'Learn more']]},
    fees: {message: 'Gotham’s cost-recovery service states that there are no upfront consulting fees. The team should confirm the exact scope and commercial terms for your organization before an engagement begins.', options: [['contact', 'Ask about an engagement'], ['expense-page', 'Read about cost recovery']]},
    infrastructure: {
      message: 'Gotham helps plan, source, and oversee technology infrastructure while remaining independent from individual vendors. Which project sounds closest?',
      options: [
        ['moving', 'Office move or new location'],
        ['cabling', 'Cabling and low voltage'],
        ['network', 'Network and connectivity'],
        ['communications', 'Cloud communications or voice'],
        ['implementation', 'Implementation oversight'],
        ['infrastructure-page', 'View the full service page']
      ]
    },
    moving: {message: 'For relocations and new locations, Gotham can coordinate requirements, connectivity, cabling, communications, vendors, schedules, and implementation so technology is ready when the business needs it.', options: [['contact', 'Discuss a relocation'], ['infrastructure-page', 'Learn more']]},
    cabling: {message: 'Gotham supports cabling and low-voltage planning, vendor coordination, project management, and documentation as part of a broader infrastructure design.', options: [['contact', 'Discuss a cabling project'], ['infrastructure-page', 'Learn more']]},
    network: {message: 'Gotham can evaluate connectivity, network architecture, SD-WAN, resilience, vendors, and future capacity to develop a practical infrastructure plan.', options: [['contact', 'Discuss network needs'], ['infrastructure-page', 'Learn more']]},
    communications: {message: 'Gotham helps organizations evaluate and plan voice, unified communications, cloud communications, and related connectivity without being tied to one provider.', options: [['contact', 'Discuss communications'], ['infrastructure-page', 'Learn more']]},
    implementation: {message: 'Gotham can coordinate vendors, milestones, documentation, testing, and accountability through implementation—not just make a recommendation and step away.', options: [['contact', 'Discuss implementation support'], ['infrastructure-page', 'Learn more']]},
    managed: {
      message: 'Gotham helps evaluate, source, and coordinate ongoing technology support. What kind of support are you considering?',
      options: [
        ['cybersecurity', 'Cybersecurity'],
        ['helpdesk', 'Help desk and user support'],
        ['cloud', 'Network and cloud services'],
        ['disaster', 'Backup and disaster recovery'],
        ['vcio', 'Technology strategy and vCIO'],
        ['managed-page', 'View the full service page']
      ]
    },
    cybersecurity: {message: 'Gotham can help assess cybersecurity needs, evaluate providers and solutions, and coordinate an approach that fits the organization’s risk, operations, and technology environment.', options: [['contact', 'Discuss cybersecurity'], ['managed-page', 'Learn more']]},
    helpdesk: {message: 'Gotham can help evaluate and coordinate help desk services, endpoint support, user experience, escalation processes, and provider accountability.', options: [['contact', 'Discuss support needs'], ['managed-page', 'Learn more']]},
    cloud: {message: 'Gotham supports the evaluation and coordination of network and cloud services, including provider fit, reliability, performance, support, and cost.', options: [['contact', 'Discuss network or cloud support'], ['managed-page', 'Learn more']]},
    disaster: {message: 'Gotham can help evaluate backup, business continuity, and disaster-recovery requirements and identify providers and solutions aligned with the organization’s risk profile.', options: [['contact', 'Discuss resilience planning'], ['managed-page', 'Learn more']]},
    vcio: {message: 'vCIO support helps connect technology decisions to business priorities through planning, vendor coordination, budgeting, roadmaps, and ongoing strategic guidance.', options: [['contact', 'Discuss vCIO support'], ['managed-page', 'Learn more']]},
    about: {message: 'Founded in 1997, Gotham Solutions Group is a vendor-neutral technology advisory firm focused on discovering overlooked opportunities, reducing costs, strengthening infrastructure, and coordinating lasting solutions.', options: [['story', 'Read Gotham’s story'], ['neutral', 'What does vendor-neutral mean?'], ['results', 'See Gotham’s results'], ['contact', 'Meet the team']]},
    neutral: {message: 'Vendor-neutral means Gotham evaluates needs and options independently instead of being committed to one technology provider. The goal is to recommend what best serves the client’s business.', options: [['about', 'More about Gotham'], ['contact', 'Talk with the team']]},
    results: {message: 'Gotham reports more than $40 million in recovered funds, a 25% average reduction in monthly spend, and more than 25 years of technology advisory experience. Results vary by organization and engagement.', options: [['expense-page', 'Explore cost recovery'], ['contact', 'Talk with the team']]},
    contact: {message: contactAnswer, options: [['booking', 'Choose a team member'], ['restart', 'Start over']]},
    booking: {message: 'Visit the team booking directory to select the person you would like to meet with.', options: [['contact-page', 'Open booking directory']]},
    'expense-page': {message: 'Explore Gotham’s Cost Recovery & Optimization service for details about its approach and capabilities.', options: [['expense-link', 'Open Cost Recovery & Optimization']]},
    'infrastructure-page': {message: 'Explore Gotham’s Infrastructure Design service for details about planning, sourcing, and implementation support.', options: [['infrastructure-link', 'Open Infrastructure Design']]},
    'managed-page': {message: 'Explore Gotham’s Managed Services page for details about ongoing technology support.', options: [['managed-link', 'Open Managed Services']]},
    story: {message: 'Gotham’s full story explains how curiosity, independent advocacy, and measurable client outcomes have shaped the company since 1997.', options: [['about-link', 'Read Our Story']]}
  };

  const destinations = {
    'expense-link': '/cost-recovery-optimization',
    'infrastructure-link': '/infrastructure-design',
    'managed-link': '/managed-services',
    'about-link': '/about#our-story',
    'contact-page': '/contact#team-booking-directory'
  };

  const intentPatterns = [
    ['moving', /\b(move|moving|relocat\w*|new office|new location)\b/],
    ['cabling', /\b(cabl|low voltage|wiring|wire)\b/],
    ['cybersecurity', /\b(cyber|security|ransomware|breach|protect|firewall)\b/],
    ['disaster', /\b(disaster|backup|recovery|continuity|outage)\b/],
    ['helpdesk', /\b(help ?desk|user support|tech support|it support|endpoint)\b/],
    ['vcio', /\b(vcio|cio|roadmap|technology strategy|it strategy)\b/],
    ['invoice', /\b(invoice|bill|billing|contract|overcharg|audit)\b/],
    ['recovery', /\b(refund|recover|recovery|credit|billing error)\b/],
    ['tem', /\b(tem|technology expense|expense management|inventory management)\b/],
    ['monthly', /\b(save|saving|reduce|lower|cut|expense|cost|spend|too high|expensive)\b/],
    ['fees', /\b(fee|fees|price|pricing|charge|cost to hire|how much)\b/],
    ['network', /\b(network|connectivity|internet|sd-?wan|bandwidth|wifi|wi-fi)\b/],
    ['communications', /\b(phone|voice|voip|ucaas|unified communication|teams calling)\b/],
    ['cloud', /\b(cloud|microsoft 365|office 365|azure)\b/],
    ['implementation', /\b(implement|project management|vendor coordination|deployment)\b/],
    ['neutral', /\b(vendor neutral|independent|provider neutral)\b/],
    ['results', /\b(result|results|recovered|track record|experience|savings achieved)\b/],
    ['about', /\b(about|history|founded|who are you|who is gotham|woman owned|women owned|wbe)\b/],
    ['contact', /\b(contact|call|email|speak|talk|person|human|consultation|meeting|book|appointment)\b/],
    ['managed', /\b(managed service|managed it|ongoing support|msp)\b/],
    ['infrastructure', /\b(infrastructure|design|modernize|upgrade)\b/],
    ['expense', /\b(cost recovery|expense reduction)\b/]
  ];

  if(!panel.id) panel.id = 'gotham-solutions-assistant';
  toggle.innerHTML = '<span>Chat</span>';
  header.innerHTML = 'How Can We Help?<small>Guided Gotham assistant</small>';
  input.placeholder = 'Type a question or choose below';
  toggle.setAttribute('aria-controls', panel.id);
  toggle.setAttribute('aria-expanded', 'false');
  panel.setAttribute('aria-hidden', 'true');

  function setPanelState(open, restoreFocus = false, initialFocus = close){
    panel.classList.toggle('open', open);
    panel.setAttribute('aria-hidden', String(!open));
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close Gotham guided assistant' : 'Open Gotham guided assistant');
    if(open) window.requestAnimationFrame(() => initialFocus.focus());
    else if(restoreFocus) toggle.focus();
  }

  function addMessage(text, type, allowLinks = false){
    const msg = document.createElement('div');
    msg.className = 'gotham-ai-message ' + type;
    if(allowLinks){
      msg.innerHTML = text;
      msg.querySelectorAll('a').forEach(link => link.classList.add('gotham-ai-contact-link'));
    } else {
      msg.textContent = text;
    }
    messages.appendChild(msg);
    messages.scrollTop = messages.scrollHeight;
  }

  function renderControls(key){
    quick.dataset.current = key;
    quick.replaceChildren();
    const node = nodes[key];
    if(!node) return;
    node.options.forEach(([next, label]) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = label;
      button.dataset.next = next;
      quick.appendChild(button);
    });
    if(key !== 'home'){
      const controls = document.createElement('div');
      controls.className = 'gotham-ai-navigation';
      if(history.length){
        const back = document.createElement('button');
        back.type = 'button';
        back.dataset.action = 'back';
        back.textContent = '← Back';
        controls.appendChild(back);
      }
      const restart = document.createElement('button');
      restart.type = 'button';
      restart.dataset.action = 'restart';
      restart.textContent = 'Start over';
      controls.appendChild(restart);
      quick.appendChild(controls);
    }
  }

  function visit(key, announceChoice = ''){
    if(destinations[key]){
      window.location.href = destinations[key];
      return;
    }
    if(key === 'restart'){
      resetAssistant();
      return;
    }
    const node = nodes[key];
    if(!node) return;
    if(announceChoice) addMessage(announceChoice, 'user');
    addMessage(node.message, 'bot', node.message.includes('href='));
    renderControls(key);
  }

  function resetAssistant(){
    history.length = 0;
    messages.replaceChildren();
    visit('home');
  }

  function matchIntent(text){
    const normalized = text.toLowerCase().replace(/[’']/g, '');
    const match = intentPatterns.find(([, pattern]) => pattern.test(normalized));
    return match ? match[0] : null;
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

  quick.addEventListener('click', event => {
    const button = event.target.closest('button');
    if(!button) return;
    if(button.dataset.action === 'restart'){
      resetAssistant();
      return;
    }
    if(button.dataset.action === 'back'){
      const previous = history.pop() || 'home';
      addMessage('Go back', 'user');
      visit(previous);
      return;
    }
    const next = button.dataset.next;
    if(!next) return;
    const currentHeading = quick.dataset.current || 'home';
    if(nodes[next]) history.push(currentHeading);
    quick.dataset.current = next;
    visit(next, button.textContent);
  });

  form.addEventListener('submit', event => {
    event.preventDefault();
    const text = input.value.trim();
    if(!text) return;
    addMessage(text, 'user');
    input.value = '';
    const intent = matchIntent(text);
    window.setTimeout(() => {
      if(intent){
        history.push(quick.dataset.current || 'home');
        quick.dataset.current = intent;
        visit(intent);
      } else {
        addMessage('I don’t have an approved answer for that yet. ' + contactAnswer, 'bot', true);
        renderControls('contact');
      }
    }, 180);
  });

  resetAssistant();
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


// v1.4.181: pause falling money while it is outside the viewport.
(() => {
  const rains = Array.from(document.querySelectorAll('.money-rain'));
  if (!rains.length || !('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      entry.target.classList.toggle('money-paused', !entry.isIntersecting);
    });
  }, { rootMargin: '120px 0px', threshold: 0 });

  rains.forEach((rain) => observer.observe(rain));
})();
