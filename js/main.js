// =====================================================
// PORTFOLIO — BILL-GATTE MBEPPA KENGGNE
// main.js — Animations, Canvas, Interactions
// =====================================================

document.addEventListener('DOMContentLoaded', () => {

  // ── 1. CANVAS ANIMATION (réseau de nœuds — évoque n8n) ──
  initCanvasNetwork();

  // ── 2. NAVBAR ──
  initNavbar();

  // ── 3. TYPED EFFECT (Hero) ──
  initTypedText();

  // ── 4. SCROLL REVEAL ──
  initScrollReveal();

  // ── 5. TABS — Projets ──
  initProjectTabs();

  // ── 6. ACTIVE NAV LINK ──
  initActiveNavLink();

  // ── 7. SMOOTH SCROLL sur tous les liens ancres ──
  initSmoothScroll();

  // ── 8. CURSOR GLOW (desktop only) ──
  initCursorGlow();

  // ── 9. COUNTER ANIMATION (stats héro) ──
  initCounters();
});


// ══════════════════════════════════════════════════
//  1. CANVAS — Réseau de nœuds animé
// ══════════════════════════════════════════════════
function initCanvasNetwork() {
  const canvas = document.getElementById('canvas-bg');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let nodes = [];
  let animFrame;

  const CONFIG = {
    nodeCount: 55,
    maxDist: 160,
    nodeRadius: 2.2,
    speed: 0.35,
    colorTeal: 'rgba(0, 255, 204,',
    colorPurple: 'rgba(139, 92, 246,',
  };

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', () => { resize(); createNodes(); });

  class Node {
    constructor() { this.reset(); }
    reset() {
      this.x  = Math.random() * canvas.width;
      this.y  = Math.random() * canvas.height;
      this.vx = (Math.random() - 0.5) * CONFIG.speed;
      this.vy = (Math.random() - 0.5) * CONFIG.speed;
      this.r  = Math.random() * CONFIG.nodeRadius + 1;
      this.isPurple = Math.random() > 0.6;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > canvas.width)  this.vx *= -1;
      if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
    }
    draw() {
      const color = this.isPurple ? CONFIG.colorPurple : CONFIG.colorTeal;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = color + '0.7)';
      ctx.fill();
      // Glow
      ctx.shadowColor = color + '1)';
      ctx.shadowBlur  = 6;
      ctx.fill();
      ctx.shadowBlur  = 0;
    }
  }

  function createNodes() {
    nodes = Array.from({ length: CONFIG.nodeCount }, () => new Node());
  }
  createNodes();

  function drawConnections() {
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx   = nodes[i].x - nodes[j].x;
        const dy   = nodes[i].y - nodes[j].y;
        const dist = Math.hypot(dx, dy);
        if (dist < CONFIG.maxDist) {
          const alpha = (1 - dist / CONFIG.maxDist) * 0.55;
          const usePurple = nodes[i].isPurple || nodes[j].isPurple;
          const color = usePurple ? CONFIG.colorPurple : CONFIG.colorTeal;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.strokeStyle = color + alpha + ')';
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    nodes.forEach(n => { n.update(); n.draw(); });
    drawConnections();
    animFrame = requestAnimationFrame(animate);
  }
  animate();
}


// ══════════════════════════════════════════════════
//  2. NAVBAR — scroll behavior + mobile toggle
// ══════════════════════════════════════════════════
function initNavbar() {
  const navbar  = document.getElementById('navbar');
  const toggle  = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-links');

  // Scroll
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  });

  // Toggle mobile
  toggle?.addEventListener('click', () => {
    toggle.classList.toggle('open');
    navMenu.classList.toggle('open');
  });

  // Close on link click
  navMenu?.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      toggle.classList.remove('open');
      navMenu.classList.remove('open');
    });
  });
}


// ══════════════════════════════════════════════════
//  3. TYPED TEXT — Hero subtitle animation
// ══════════════════════════════════════════════════
function initTypedText() {
  const el = document.querySelector('.typed-text');
  if (!el) return;

  const phrases = [
    'Automatisation n8n',
    'Développeur Full-Stack',
    'Intelligence Artificielle',
    'Génie Logiciel',
    'Django & Laravel',
    'Agent IA & LLMs',
  ];

  let phraseIdx = 0;
  let charIdx   = 0;
  let deleting  = false;
  let pause     = false;

  function tick() {
    const current = phrases[phraseIdx];

    if (deleting) {
      el.textContent = current.slice(0, charIdx--);
      if (charIdx < 0) {
        deleting  = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
        setTimeout(tick, 400);
        return;
      }
      setTimeout(tick, 45);
    } else {
      el.textContent = current.slice(0, charIdx++);
      if (charIdx > current.length) {
        setTimeout(() => { deleting = true; tick(); }, 2000);
        return;
      }
      setTimeout(tick, 80);
    }
  }
  tick();
}


// ══════════════════════════════════════════════════
//  4. SCROLL REVEAL — Intersection Observer
// ══════════════════════════════════════════════════
function initScrollReveal() {
  const selector = '.reveal, .reveal-left, .reveal-right';
  const elements = document.querySelectorAll(selector);

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger delay based on sibling order
        const siblings = Array.from(entry.target.parentElement?.children || [entry.target]);
        const idx = siblings.indexOf(entry.target);
        const delay = Math.min(idx * 80, 400);
        setTimeout(() => entry.target.classList.add('visible'), delay);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  elements.forEach(el => observer.observe(el));
}


// ══════════════════════════════════════════════════
//  5. PROJECT TABS
// ══════════════════════════════════════════════════
function initProjectTabs() {
  const tabs   = document.querySelectorAll('.tab-btn');
  const cards  = document.querySelectorAll('.project-card');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.dataset.tab;
      cards.forEach(card => {
        const match = filter === 'all' || card.dataset.status === filter;
        card.style.display = match ? 'flex' : 'none';
        if (match) {
          card.style.opacity    = '0';
          card.style.transform  = 'translateY(20px)';
          requestAnimationFrame(() => {
            card.style.transition = 'all 0.4s ease';
            card.style.opacity    = '1';
            card.style.transform  = 'translateY(0)';
          });
        }
      });
    });
  });
}


// ══════════════════════════════════════════════════
//  6. ACTIVE NAV LINK on scroll
// ══════════════════════════════════════════════════
function initActiveNavLink() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(a => {
          a.classList.toggle('active', a.getAttribute('href') === '#' + entry.target.id);
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => observer.observe(s));
}


// ══════════════════════════════════════════════════
//  7. SMOOTH SCROLL
// ══════════════════════════════════════════════════
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = document.getElementById('navbar')?.offsetHeight || 80;
      window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
    });
  });
}


// ══════════════════════════════════════════════════
//  8. CURSOR GLOW (desktop)
// ══════════════════════════════════════════════════
function initCursorGlow() {
  if (window.innerWidth < 768) return;
  const glow = document.createElement('div');
  glow.id = 'cursor-glow';
  Object.assign(glow.style, {
    position: 'fixed', pointerEvents: 'none', zIndex: '9999',
    width: '340px', height: '340px', borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(0,255,204,0.055) 0%, transparent 70%)',
    transform: 'translate(-50%, -50%)',
    transition: 'left 0.12s ease, top 0.12s ease',
    left: '-9999px', top: '-9999px',
  });
  document.body.appendChild(glow);

  window.addEventListener('mousemove', e => {
    glow.style.left = e.clientX + 'px';
    glow.style.top  = e.clientY + 'px';
  });
}


// ══════════════════════════════════════════════════
//  9. COUNTER ANIMATION
// ══════════════════════════════════════════════════
function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      let current = 0;
      const step = Math.ceil(target / 40);
      const interval = setInterval(() => {
        current = Math.min(current + step, target);
        el.textContent = current + suffix;
        if (current >= target) clearInterval(interval);
      }, 40);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
}
