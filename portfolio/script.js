/* ==========================================================
   NISHANTH S V — Portfolio Interactions
   Premium UX/UI simulations & animations.
   ========================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ── Particles Canvas Animation ───────────────────────────
  const initParticles = () => {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    
    const particles = [];
    // Adjust max particles by viewport size
    const maxParticles = Math.min(65, Math.floor((width * height) / 22000));
    const connectionDist = 110;
    
    let mouse = { x: null, y: null, radius: 150 };
    
    window.addEventListener('resize', () => {
      width = (canvas.width = window.innerWidth);
      height = (canvas.height = window.innerHeight);
    });
    
    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });
    
    window.addEventListener('mouseleave', () => {
      mouse.x = null;
      mouse.y = null;
    });
    
    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.45;
        this.vy = (Math.random() - 0.5) * 0.45;
        this.radius = Math.random() * 1.5 + 0.8;
      }
      
      update() {
        this.x += this.vx;
        this.y += this.vy;
        
        if (this.x < 0) {
          this.x = 0;
          this.vx *= -1;
        } else if (this.x > width) {
          this.x = width;
          this.vx *= -1;
        }
        
        if (this.y < 0) {
          this.y = 0;
          this.vy *= -1;
        } else if (this.y > height) {
          this.y = height;
          this.vy *= -1;
        }
        
        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouse.radius) {
            const force = (mouse.radius - dist) / mouse.radius;
            this.x -= (dx / dist) * force * 0.4;
            this.y -= (dy / dist) * force * 0.4;
          }
        }
      }
      
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = accentColor;
        ctx.fill();
      }
    }
    
    let accentColor = '#a78bfa';
    
    const updateAccent = () => {
      const computed = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim();
      if (computed) accentColor = computed;
    };
    
    updateAccent();
    
    for (let i = 0; i < maxParticles; i++) {
      particles.push(new Particle());
    }
    
    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      updateAccent();
      
      particles.forEach((p) => {
        p.update();
        p.draw();
      });
      
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const p1 = particles[i];
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < connectionDist) {
            const alpha = (1 - dist / connectionDist) * 0.15;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = accentColor;
            ctx.globalAlpha = alpha;
            ctx.lineWidth = 0.6;
            ctx.stroke();
            ctx.globalAlpha = 1.0;
          }
        }
      }
      requestAnimationFrame(animate);
    };
    animate();
  };
  initParticles();

  // ── Navbar scroll ────────────────────────────────────────
  const nav = document.getElementById('nav');

  const onScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 32);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ── Active nav link & sliding pill ──────────────────────
  const sections = document.querySelectorAll('section[id]');
  const navLinksContainer = document.querySelector('.nav__links');
  const activePill = document.querySelector('.nav__active-pill');

  const updateActiveLink = () => {
    const scrollY = window.scrollY + 200;
    let currentActive = null;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      const link = document.querySelector(`.nav__links a[href="#${id}"]`);
      
      if (scrollY >= top && scrollY < top + height) {
        if (link) {
          currentActive = link;
          link.classList.add('active');
        }
      } else {
        if (link) link.classList.remove('active');
      }
    });

    if (currentActive && window.innerWidth > 768) {
      const rect = currentActive.getBoundingClientRect();
      const parentRect = navLinksContainer.getBoundingClientRect();
      activePill.style.left = `${rect.left - parentRect.left}px`;
      activePill.style.top = `${rect.top - parentRect.top}px`;
      activePill.style.width = `${rect.width}px`;
      activePill.style.height = `${rect.height}px`;
      activePill.style.opacity = '1';
    } else {
      activePill.style.opacity = '0';
    }
  };

  window.addEventListener('scroll', updateActiveLink, { passive: true });
  window.addEventListener('resize', updateActiveLink);
  setTimeout(updateActiveLink, 100);

  // ── Cursor tracking glow card effect & 3D Tilt ────────────
  const initGlowCards = () => {
    const canTilt = window.matchMedia('(hover: hover) and (pointer: fine) and (min-width: 769px)').matches;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    document.querySelectorAll('.glow-card').forEach(card => {
      if (!canTilt || reduceMotion) return;

      let targetTiltX = 0;
      let targetTiltY = 0;
      let currentTiltX = 0;
      let currentTiltY = 0;
      let targetScale = 1;
      let currentScale = 1;
      let animationFrame = null;
      let isHovering = false;

      const renderTilt = () => {
        currentTiltX += (targetTiltX - currentTiltX) * 0.16;
        currentTiltY += (targetTiltY - currentTiltY) * 0.16;
        currentScale += (targetScale - currentScale) * 0.16;

        card.style.transform =
          `perspective(1000px) rotateX(${currentTiltX.toFixed(2)}deg) ` +
          `rotateY(${currentTiltY.toFixed(2)}deg) scale3d(${currentScale.toFixed(3)}, ${currentScale.toFixed(3)}, 1)`;

        const isSettled =
          Math.abs(targetTiltX - currentTiltX) < 0.01 &&
          Math.abs(targetTiltY - currentTiltY) < 0.01 &&
          Math.abs(targetScale - currentScale) < 0.001;

        if (!isSettled) {
          animationFrame = requestAnimationFrame(renderTilt);
        } else {
          animationFrame = null;
          if (!isHovering) {
            card.classList.remove('is-tilting');
            card.style.removeProperty('transform');
          }
        }
      };

      const requestTiltFrame = () => {
        if (!animationFrame) animationFrame = requestAnimationFrame(renderTilt);
      };

      card.addEventListener('pointerenter', () => {
        isHovering = true;
        targetScale = 1.015;
        card.classList.add('is-tilting');
        requestTiltFrame();
      });

      card.addEventListener('pointermove', e => {
        if (!isHovering) {
          isHovering = true;
          targetScale = 1.015;
          card.classList.add('is-tilting');
        }

        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);

        const normalizedX = (x / rect.width) * 2 - 1;
        const normalizedY = (y / rect.height) * 2 - 1;
        targetTiltX = normalizedY * -4.5;
        targetTiltY = normalizedX * 5.5;
        requestTiltFrame();
      });

      card.addEventListener('pointerleave', () => {
        isHovering = false;
        targetTiltX = 0;
        targetTiltY = 0;
        targetScale = 1;
        requestTiltFrame();
      });
    });
  };
  initGlowCards();

  const initScrollParallax = () => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;

    const canvas = document.getElementById('particles-canvas');
    const sectionHeaders = document.querySelectorAll('.section-header');
    let ticking = false;

    const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

    const updateParallax = () => {
      const viewportHeight = window.innerHeight;

      if (canvas) {
        const particleOffset = clamp(window.scrollY * 0.018, 0, 24);
        canvas.style.setProperty('--particle-parallax-y', `${particleOffset}px`);
      }

      sectionHeaders.forEach(header => {
        const rect = header.getBoundingClientRect();
        const distanceFromCenter = rect.top + rect.height / 2 - viewportHeight / 2;
        const offset = clamp(distanceFromCenter * -0.035, -18, 18);
        header.style.setProperty('--parallax-y', `${offset.toFixed(2)}px`);
      });

      ticking = false;
    };

    const requestParallaxUpdate = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(updateParallax);
    };

    window.addEventListener('scroll', requestParallaxUpdate, { passive: true });
    window.addEventListener('resize', requestParallaxUpdate);
    requestParallaxUpdate();
  };
  initScrollParallax();

  // ── Mobile menu ──────────────────────────────────────────
  const toggle = document.getElementById('nav-toggle');
  const mobileMenu = document.getElementById('nav-mobile');
  const mobileLinks = mobileMenu.querySelectorAll('a');

  const closeMobile = () => {
    toggle.classList.remove('open');
    mobileMenu.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  toggle.addEventListener('click', () => {
    const isOpen = toggle.classList.toggle('open');
    mobileMenu.classList.toggle('open');
    toggle.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  mobileLinks.forEach(link => link.addEventListener('click', closeMobile));

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
      closeMobile();
      toggle.focus();
    }
  });

  // ── Scroll reveal (IntersectionObserver) ─────────────────
  const revealEls = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');

          // Stagger children
          if (entry.target.classList.contains('stagger')) {
            const children = entry.target.children;
            Array.from(children).forEach((child, i) => {
              child.style.transitionDelay = `${i * 80}ms`;
            });
          }

          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.08,
      rootMargin: '0px 0px -40px 0px'
    });

    revealEls.forEach(el => revealObserver.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('visible'));
  }

  // ── Smooth scroll for anchor links ───────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const id = anchor.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        window.scrollTo({
          top: target.offsetTop - 80,
          behavior: 'smooth'
        });
      }
    });
  });

  // ── Back to top ──────────────────────────────────────────
  const backToTop = document.getElementById('back-to-top');
  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ==========================================================
  // ADVANCED INTERACTIVITIES
  // ==========================================================

  // ── Dynamic Theme Accent Color Swapper ──────────────────
  const accentDots = document.querySelectorAll('.accent-dot');
  let updateRiskCalculator = null;
  
  const colorsMap = {
    violet: {
      accent: '#a78bfa',
      dim: 'rgba(167, 139, 250, 0.08)',
      hover: 'rgba(167, 139, 250, 0.15)'
    },
    emerald: {
      accent: '#34d399',
      dim: 'rgba(52, 211, 153, 0.08)',
      hover: 'rgba(52, 211, 153, 0.15)'
    },
    blue: {
      accent: '#60a5fa',
      dim: 'rgba(96, 165, 250, 0.08)',
      hover: 'rgba(96, 165, 250, 0.15)'
    },
    amber: {
      accent: '#f59e0b',
      dim: 'rgba(245, 158, 11, 0.08)',
      hover: 'rgba(245, 158, 11, 0.15)'
    }
  };

  const applyAccentColor = (colorName) => {
    const palette = colorsMap[colorName] || colorsMap.violet;
    const root = document.documentElement;
    root.style.setProperty('--accent', palette.accent);
    root.style.setProperty('--accent-dim', palette.dim);
    root.style.setProperty('--accent-hover', palette.hover);

    // Update active dot layout
    accentDots.forEach(dot => {
      const isActive = dot.getAttribute('data-color') === colorName;
      dot.classList.toggle('active', isActive);
      dot.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });

    // Save choice
    localStorage.setItem('nsv-accent-color', colorName);
    
    // Trigger chart and gauge redraws to align color schemes
    if (typeof updateRiskCalculator === 'function') updateRiskCalculator();
  };

  accentDots.forEach(dot => {
    dot.addEventListener('click', () => {
      applyAccentColor(dot.getAttribute('data-color'));
    });
  });

  // Apply cached choice on load
  const cachedColor = localStorage.getItem('nsv-accent-color') || 'violet';
  applyAccentColor(cachedColor);

  // ── Hero Live Code Terminal Typewriter ───────────────────
  const initHeroTerminal = () => {
    const linesEl   = document.getElementById('hero-terminal-lines');
    const cursorEl  = document.getElementById('hero-terminal-cursor');
    const statusEl  = document.getElementById('hero-terminal-status');
    const lcountEl  = document.getElementById('hero-terminal-lines-count');
    const langEl    = document.getElementById('hero-terminal-lang');
    const tabEls    = document.querySelectorAll('.hero-terminal__tab');
    if (!linesEl) return;

    // ── Token renderer ──────────────────────────────────────
    // Each "line" is an array of [className, text] pairs
    // className '' = plain
    const files = [
      {
        name: 'fake_news.py',
        lang: 'Python',
        lines: [
          [['ht-cmt','# Fake News Detection · Ensemble + LLM']],
          [],
          [['ht-kw','import '],['ht-acc','faiss'],['ht-op',', '],['ht-acc','numpy as np']],
          [['ht-kw','from '],['ht-acc','langchain.chains'],['ht-kw',' import '],['ht-var','RetrievalQA']],
          [['ht-kw','from '],['ht-acc','sklearn.ensemble'],['ht-kw',' import '],['ht-var','VotingClassifier']],
          [],
          [['ht-kw','class '],['ht-cls','NewsVerifier'],['ht-punct','():']],
          [['','    '],['ht-kw','def '],['ht-fn','__init__'],['ht-punct','('],['ht-var','self'],['ht-punct','):']],
          [['','        '],['ht-var','self'],['ht-op','.'],['ht-var','ensemble'],['ht-op',' = '],['ht-cls','VotingClassifier'],['ht-punct','(']],
          [['','            '],['ht-var','estimators'],['ht-op','='],['ht-punct','['],['ht-str',"'lr'"],['ht-op',', '],['ht-str',"'svm'"],['ht-op',', '],['ht-str',"'rf'"],['ht-op',', '],['ht-str',"'xgb'"],['ht-punct',']']],
          [['','        '],['ht-punct',')']],
          [['','        '],['ht-var','self'],['ht-op','.'],['ht-var','accuracy'],['ht-op',' = '],['ht-num','0.945']],
          [],
          [['','    '],['ht-kw','def '],['ht-fn','verify'],['ht-punct','('],['ht-var','self'],['ht-op',', '],['ht-var','headline'],['ht-punct','):']],
          [['','        '],['ht-var','vec'],['ht-op',' = '],['ht-fn','embed'],['ht-punct','('],['ht-var','headline'],['ht-punct',')']],
          [['','        '],['ht-var','pred'],['ht-op',' = '],['ht-var','self'],['ht-op','.'],['ht-var','ensemble'],['ht-op','.'],['ht-fn','predict'],['ht-punct','(['],['ht-var','vec'],['ht-punct','])']],
          [['','        '],['ht-kw','return '],['ht-var','self'],['ht-op','.'],['ht-fn','llm_validate'],['ht-punct','('],['ht-var','headline'],['ht-op',', '],['ht-var','pred'],['ht-punct',')']],
        ]
      },
      {
        name: 'pipeline.py',
        lang: 'Python',
        lines: [
          [['ht-cmt','# 5-Agent RAG Pipeline · LangChain + FAISS']],
          [],
          [['ht-kw','from '],['ht-acc','langchain.agents'],['ht-kw',' import '],['ht-var','initialize_agent']],
          [['ht-kw','from '],['ht-acc','langchain_groq'],['ht-kw',' import '],['ht-cls','ChatGroq']],
          [],
          [['ht-var','llm'],['ht-op',' = '],['ht-cls','ChatGroq'],['ht-punct','(']],
          [['','    '],['ht-var','model'],['ht-op','='],['ht-str','"llama-3.3-70b-versatile"'],['ht-punct',',']],
          [['','    '],['ht-var','temperature'],['ht-op','='],['ht-num','0.1']],
          [['ht-punct',')']],
          [],
          [['ht-var','agents'],['ht-op',' = '],['ht-punct','[']],
          [['','    '],['ht-str',"'retriever'"],['ht-op',',  '],['ht-cmt','# FAISS vector search']],
          [['','    '],['ht-str',"'validator'"],['ht-op',', '],['ht-cmt','# Cross-reference check']],
          [['','    '],['ht-str',"'explainer'"],['ht-op',', '],['ht-cmt','# LIME/SHAP features']],
          [['','    '],['ht-str',"'scorer'"],['ht-op',',   '],['ht-cmt','# Confidence scoring']],
          [['','    '],['ht-str',"'reporter'"],['ht-op',',  '],['ht-cmt','# Final verdict']],
          [['ht-punct',']']],
          [],
          [['ht-cmt','# Accuracy: 94.5% on 127K articles']],
        ]
      },
      {
        name: 'deploy.sh',
        lang: 'Shell',
        lines: [
          [['ht-cmt','#!/bin/bash']],
          [['ht-cmt','# Deploy to Render via Docker']],
          [],
          [['ht-fn','echo '],['ht-str','"Building Docker image..."']],
          [['ht-var','docker'],['ht-op',' build '],['ht-str','-t'],['ht-op',' nsv/fake-news '],['ht-acc','.']],
          [],
          [['ht-fn','echo '],['ht-str','"Pushing to registry..."']],
          [['ht-var','docker'],['ht-op',' push '],['ht-acc','registry.render.com/nsv/fake-news']],
          [],
          [['ht-fn','echo '],['ht-str','"Deploying Kubernetes pods..."']],
          [['ht-var','kubectl'],['ht-op',' apply '],['ht-str','-f'],['ht-op',' k8s/deployment.yaml']],
          [],
          [['ht-var','kubectl'],['ht-op',' get pods '],['ht-str','--watch']],
          [],
          [['ht-cmt','# STATUS: Running · 3 replicas · CPU 18%']],
        ]
      }
    ];

    let currentFile   = 0;
    let currentLine   = 0;
    let charIndex     = 0;
    let lineEl        = null;
    let codeEl        = null;
    let tokenIndex    = 0;
    let typing        = false;
    let typeTimer     = null;
    let pauseTimer    = null;
    let lineCount     = 0;

    const CHAR_SPEED  = 22;   // ms per character
    const LINE_PAUSE  = 60;   // ms between lines
    const FILE_PAUSE  = 2200; // ms before switching file

    const renderToken = (cls, text) => {
      if (cls) {
        const s = document.createElement('span');
        s.className = cls;
        s.textContent = text;
        codeEl.appendChild(s);
      } else {
        codeEl.appendChild(document.createTextNode(text));
      }
    };

    const startNewLine = () => {
      const fileData = files[currentFile];
      const tokens   = fileData.lines[currentLine];
      lineCount++;
      lcountEl.textContent = lineCount;

      lineEl = document.createElement('div');
      lineEl.className = 'ht-line';

      const lnEl = document.createElement('span');
      lnEl.className = 'ht-ln';
      lnEl.textContent = currentLine + 1;
      lineEl.appendChild(lnEl);

      codeEl = document.createElement('span');
      codeEl.className = 'ht-code';
      lineEl.appendChild(codeEl);
      linesEl.appendChild(lineEl);

      // Place cursor after this line
      linesEl.appendChild(cursorEl);

      // Scroll to bottom
      linesEl.scrollTop = linesEl.scrollHeight;

      if (!tokens || tokens.length === 0) {
        // Blank line — move on quickly
        tokenIndex = 0;
        charIndex  = 0;
        typeTimer  = setTimeout(advanceLine, LINE_PAUSE);
      } else {
        tokenIndex = 0;
        charIndex  = 0;
        typing     = true;
        typeChar();
      }
    };

    const typeChar = () => {
      const fileData = files[currentFile];
      const tokens   = fileData.lines[currentLine];
      if (!tokens) { advanceLine(); return; }

      const [cls, text] = tokens[tokenIndex];
      const char = text[charIndex];

      if (charIndex === 0) {
        // Start a new span for this token
        if (cls) {
          const s = document.createElement('span');
          s.className = cls;
          codeEl.appendChild(s);
        }
      }

      // Append char to last element or text node
      const lastChild = codeEl.lastChild;
      if (lastChild && lastChild.nodeType === Node.ELEMENT_NODE && lastChild.className === cls) {
        lastChild.textContent += char;
      } else if (!cls) {
        if (lastChild && lastChild.nodeType === Node.TEXT_NODE) {
          lastChild.textContent += char;
        } else {
          codeEl.appendChild(document.createTextNode(char));
        }
      } else {
        const s = document.createElement('span');
        s.className = cls;
        s.textContent = char;
        codeEl.appendChild(s);
      }

      charIndex++;
      linesEl.scrollTop = linesEl.scrollHeight;

      if (charIndex >= text.length) {
        // Token done
        tokenIndex++;
        charIndex = 0;
        if (tokenIndex >= tokens.length) {
          // Line done
          typeTimer = setTimeout(advanceLine, LINE_PAUSE);
        } else {
          typeTimer = setTimeout(typeChar, CHAR_SPEED);
        }
      } else {
        typeTimer = setTimeout(typeChar, CHAR_SPEED);
      }
    };

    const advanceLine = () => {
      const fileData = files[currentFile];
      currentLine++;

      if (currentLine >= fileData.lines.length) {
        // File done — pause then switch
        currentLine = 0;
        statusEl.textContent = 'Done';
        typeTimer = setTimeout(() => {
          switchFile((currentFile + 1) % files.length);
        }, FILE_PAUSE);
      } else {
        startNewLine();
      }
    };

    const switchFile = (idx) => {
      currentFile = idx;
      currentLine = 0;
      lineCount   = 0;
      lcountEl.textContent = '0';
      linesEl.innerHTML = '';
      linesEl.appendChild(cursorEl);
      langEl.textContent = files[idx].lang;
      statusEl.textContent = 'Running';

      // Update active tab
      tabEls.forEach((t, i) => {
        const isActive = i === idx;
        t.classList.toggle('active', isActive);
        t.setAttribute('aria-selected', isActive ? 'true' : 'false');
      });

      startNewLine();
    };

    // Tab click handler
    tabEls.forEach((tab, i) => {
      tab.addEventListener('click', () => {
        clearTimeout(typeTimer);
        clearTimeout(pauseTimer);
        switchFile(i);
      });
    });

    // Kick off
    startNewLine();
  };
  initHeroTerminal();

  // ── Bento Tab Swapping (Full Stack Card) ──────────────────
  const bentoTabs = document.querySelectorAll('.code-mockup__tab');
  const bentoCodeContent = document.getElementById('bento-code-content');

  const bentoCodeMap = {
    next: `<span class="code-mockup__kw">const</span> <span class="code-mockup__fn">verify</span> = <span class="code-mockup__kw">async</span> (txt) => {
  <span class="code-mockup__kw">const</span> res = <span class="code-mockup__kw">await</span> fetch(api);
  <span class="code-mockup__kw">return</span> res.json();
};`,
    api: `<span class="code-mockup__kw">@app.post</span>(<span class="code-mockup__str">"/verify"</span>)
<span class="code-mockup__kw">async def</span> <span class="code-mockup__fn">verify_news</span>(payload: Article):
    result = classifier.predict(payload.text)
    <span class="code-mockup__kw">return</span> {<span class="code-mockup__str">"verdict"</span>: result}`,
    db: `<span class="code-mockup__kw">const</span> articleSchema = <span class="code-mockup__kw">new</span> <span class="code-mockup__fn">Schema</span>({
  title: { type: String, required: true },
  verdict: { type: String, required: true },
  confidence: Number
});`
  };

  bentoTabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
      e.stopPropagation(); // Prevent card hover/click bubbles
      bentoTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const dataTab = tab.getAttribute('data-tab');
      bentoCodeContent.innerHTML = bentoCodeMap[dataTab] || bentoCodeMap.next;
    });
  });

  // ── Bento Interactivity: AI/ML Neural Network ─────────────
  const initBentoNN = () => {
    const svg = document.getElementById('bento-nn-svg');
    if (!svg) return;
    const nodes = svg.querySelectorAll('.bento-nn-node');
    const links = svg.querySelectorAll('.bento-nn-link');
    const tooltip = document.getElementById('bento-nn-text');
    
    nodes.forEach(node => {
      const nodeId = node.getAttribute('data-node');
      const info = node.getAttribute('data-info');
      
      node.addEventListener('mouseenter', () => {
        node.classList.add('active');
        tooltip.textContent = info;
        tooltip.style.fill = 'var(--accent)';
        
        links.forEach(link => {
          if (link.getAttribute('data-from') === nodeId || link.getAttribute('data-to') === nodeId) {
            link.classList.add('active');
          }
        });
      });
      
      node.addEventListener('mouseleave', () => {
        node.classList.remove('active');
        tooltip.textContent = 'Hover nodes to trace activation path';
        tooltip.style.fill = '';
        links.forEach(link => link.classList.remove('active'));
      });
    });
  };
  initBentoNN();

  // ── Bento Interactivity: Kubernetes Cluster (DevOps) ──────
  const initBentoK8s = () => {
    const scaleBtn = document.getElementById('k8s-scale-btn');
    const failoverBtn = document.getElementById('k8s-failover-btn');
    const node1Pods = document.getElementById('k8s-node-1-pods');
    const node2Pods = document.getElementById('k8s-node-2-pods');
    const node1Status = document.getElementById('k8s-node-1-status');
    const node2Status = document.getElementById('k8s-node-2-status');
    const node1 = document.getElementById('k8s-node-1');
    const node2 = document.getElementById('k8s-node-2');
    
    if (!scaleBtn || !failoverBtn) return;
    
    let currentScale = 3; 
    let isCrashed = false;
    let isScaling = false;
    
    const renderPods = () => {
      node1Pods.innerHTML = '';
      node2Pods.innerHTML = '';
      
      if (isCrashed) {
        for (let i = 0; i < currentScale; i++) {
          const pod = document.createElement('span');
          pod.className = 'bento-k8s__pod';
          node2Pods.appendChild(pod);
        }
      } else {
        const node1Count = Math.ceil(currentScale / 2);
        const node2Count = Math.floor(currentScale / 2);
        
        for (let i = 0; i < node1Count; i++) {
          const pod = document.createElement('span');
          pod.className = 'bento-k8s__pod';
          node1Pods.appendChild(pod);
        }
        for (let i = 0; i < node2Count; i++) {
          const pod = document.createElement('span');
          pod.className = 'bento-k8s__pod';
          node2Pods.appendChild(pod);
        }
      }
    };
    
    scaleBtn.addEventListener('click', () => {
      if (isScaling || (isCrashed && currentScale >= 5)) return;
      isScaling = true;
      
      currentScale = currentScale === 3 ? 5 : 3;
      renderPods();
      
      setTimeout(() => { isScaling = false; }, 400);
    });
    
    failoverBtn.addEventListener('click', () => {
      if (isCrashed || isScaling) return;
      isCrashed = true;
      failoverBtn.disabled = true;
      
      node1Status.textContent = 'Crashed';
      node1.classList.add('crashed');
      
      const pods = node1Pods.querySelectorAll('.bento-k8s__pod');
      pods.forEach(pod => pod.classList.add('terminating'));
      
      setTimeout(() => {
        node1Pods.innerHTML = '';
        renderPods();
        
        setTimeout(() => {
          node1Status.textContent = 'Online';
          node1.classList.remove('crashed');
          isCrashed = false;
          failoverBtn.disabled = false;
          renderPods();
        }, 3000);
      }, 1000);
    });
  };
  initBentoK8s();

  // ── Bento Interactivity: Data Science Regression Chart ────
  const initBentoDS = () => {
    const svg = document.getElementById('bento-ds-svg');
    if (!svg) return;
    const drag1 = document.getElementById('ds-drag-1');
    const drag2 = document.getElementById('ds-drag-2');
    const regLine = document.getElementById('ds-regression-line');
    const equationText = document.getElementById('ds-equation');
    
    const xVals = [30, 50, 80, 110, 135];
    const yVals = [55, 65, 50, 45, 35]; 
    
    let draggingPoint = null;
    const pt = svg.createSVGPoint();
    
    const getSVGCoords = (e) => {
      pt.x = e.clientX;
      pt.y = e.clientY;
      const svgPoint = pt.matrixTransform(svg.getScreenCTM().inverse());
      return { x: svgPoint.x, y: svgPoint.y };
    };
    
    const recalculateRegression = () => {
      const mathY = yVals.map(cy => 80 - cy);
      
      let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;
      for (let i = 0; i < 5; i++) {
        sumX += xVals[i];
        sumY += mathY[i];
        sumXY += xVals[i] * mathY[i];
        sumXX += xVals[i] * xVals[i];
      }
      
      const m = (5 * sumXY - sumX * sumY) / (5 * sumXX - sumX * sumX);
      const c = (sumY - m * sumX) / 5;
      
      const meanY = sumY / 5;
      let ssTot = 0;
      let ssRes = 0;
      for (let i = 0; i < 5; i++) {
        const predY = m * xVals[i] + c;
        ssTot += Math.pow(mathY[i] - meanY, 2);
        ssRes += Math.pow(mathY[i] - predY, 2);
      }
      const r2 = ssTot === 0 ? 1 : 1 - (ssRes / ssTot);
      
      const y1_math = m * 15 + c;
      const y2_math = m * 150 + c;
      
      const y1_screen = Math.max(15, Math.min(80, 80 - y1_math));
      const y2_screen = Math.max(15, Math.min(80, 80 - y2_math));
      
      regLine.setAttribute('y1', y1_screen);
      regLine.setAttribute('y2', y2_screen);
      
      const displaySlope = (m * 0.5).toFixed(2);
      const displayIntercept = (c * 0.3).toFixed(1);
      equationText.textContent = `y = ${displaySlope}x + ${displayIntercept} (R² = ${Math.max(0.1, Math.min(0.99, r2)).toFixed(2)})`;
    };
    
    const onMouseDown = (e) => {
      draggingPoint = e.target;
      e.preventDefault();
    };
    
    const onMouseMove = (e) => {
      if (!draggingPoint) return;
      const coords = getSVGCoords(e);
      const cy = Math.max(15, Math.min(75, coords.y));
      
      draggingPoint.setAttribute('cy', cy);
      const index = parseInt(draggingPoint.getAttribute('data-index'));
      yVals[index === 0 ? 0 : 4] = cy;
      
      recalculateRegression();
    };
    
    const onMouseUp = () => {
      draggingPoint = null;
    };
    
    [drag1, drag2].forEach(el => {
      el.addEventListener('mousedown', onMouseDown);
      el.addEventListener('touchstart', (e) => {
        draggingPoint = el;
        e.preventDefault();
      }, { passive: false });
    });
    
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('touchmove', (e) => {
      if (!draggingPoint) return;
      const touch = e.touches[0];
      const coords = getSVGCoords(touch);
      const cy = Math.max(15, Math.min(75, coords.y));
      draggingPoint.setAttribute('cy', cy);
      const index = parseInt(draggingPoint.getAttribute('data-index'));
      yVals[index === 0 ? 0 : 4] = cy;
      recalculateRegression();
      e.preventDefault();
    }, { passive: false });
    
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('touchend', onMouseUp);
    
    recalculateRegression();
  };
  initBentoDS();

  // ==========================================================
  // PROJECT SANDBOX WIDGETS
  // ==========================================================

  // ── Widget 1: Fake News Verification Simulator ────────────
  const fnSelect   = document.getElementById('fn-headline-select');
  const fnText     = document.getElementById('fn-headline-text');
  const fnVerifyBtn = document.getElementById('fn-verify-btn');
  const fnConsole  = document.getElementById('fn-console');
  const fnResult   = document.getElementById('fn-result');
  const fnVerdict  = document.getElementById('fn-verdict');
  const fnConfidence  = document.getElementById('fn-confidence');
  const fnExplanation = document.getElementById('fn-explanation');
  const fnLime     = document.getElementById('fn-lime');

  if (fnSelect && fnText && fnVerifyBtn && fnConsole && fnResult) {

    const fnDatabase = {
      mars: {
        verdict: 'FAKE', confidence: '94.5%', isFake: true,
        explanation: "Matches a fabrication spread across social media. NASA's Perseverance mission team has made no such announcement.",
        lime: 'BREAKING: Scientists discover <span class="lime-fake">water-based life</span> on <span class="lime-fake">Mars</span>.'
      },
      ipl: {
        verdict: 'VERIFIED REAL', confidence: '98.2%', isFake: false,
        explanation: 'Direct match with verified BCCI and official sports broadcast reports.',
        lime: '<span class="lime-real">IPL 2026</span>: Team captains <span class="lime-real">announced</span> for <span class="lime-real">playoffs</span>.'
      },
      ai: {
        verdict: 'VERIFIED REAL', confidence: '96.7%', isFake: false,
        explanation: 'Factual alignment found with national legislative archives and government policy updates.',
        lime: '<span class="lime-real">Government</span> passes new <span class="lime-real">AI regulation</span> act.'
      },
      chocolate: {
        verdict: 'FAKE', confidence: '89.1%', isFake: true,
        explanation: 'Hyper-exaggerated claim. No biomedical consensus supports extreme longevity claims for cocoa consumption.',
        lime: 'Study claims eating <span class="lime-fake">chocolate</span> makes you live <span class="lime-fake">200 years</span>.'
      },
      custom: {
        verdict: 'FAKE', confidence: '82.4%', isFake: true,
        explanation: 'Cross-referencing failed. High similarity to known clickbait patterns and low source authority score.',
        lime: 'Analysis: Heavy weighting on <span class="lime-fake">sensational keywords</span> detected.'
      }
    };

    // Populate textarea when a preset is chosen
    fnSelect.addEventListener('change', () => {
      const val = fnSelect.value;
      if (val === 'custom') {
        fnText.value = '';
        fnText.disabled = false;
        fnText.focus();
      } else {
        fnText.value = fnSelect.options[fnSelect.selectedIndex].text;
        fnText.disabled = true;
      }
    });

    fnVerifyBtn.addEventListener('click', () => {
      const val    = fnSelect.value;
      const textVal = fnText.value.trim();
      if (!textVal) {
        fnText.focus();
        fnText.style.borderColor = '#ef4444';
        setTimeout(() => { fnText.style.borderColor = ''; }, 1200);
        return;
      }

      // Reset UI
      fnVerifyBtn.disabled = true;
      fnResult.classList.remove('visible');
      fnConsole.textContent = '';

      // Build timestamped log lines using real time
      const ts = () => new Date().toLocaleTimeString('en-US', { hour12: false });
      const label = textVal.length > 38 ? textVal.substring(0, 38) + '…' : textVal;

      const logs = [
        `[${ts()}] Tokenising: "${label}"`,
        `[${ts()}] Generating sentence embedding vector...`,
        `[${ts()}] Querying FAISS index (127K articles)...`,
        `[${ts()}] Top-5 nearest neighbours retrieved.`,
        `[${ts()}] ML ensemble vote  →  LR·SVM·RF·XGB·NB`,
        `[${ts()}] Fusing weighted classifier probabilities...`,
        `[${ts()}] Invoking Groq Llama 3.3-70B for validation...`,
        `[${ts()}] Generating LIME feature importances.`,
        `[${ts()}] ── Analysis complete ──`
      ];

      let i = 0;
      const writeNext = () => {
        if (i < logs.length) {
          fnConsole.textContent += (i === 0 ? '' : '\n') + logs[i];
          fnConsole.scrollTop = fnConsole.scrollHeight;
          i++;
          setTimeout(writeNext, 340);
        } else {
          // Show result
          const data = fnDatabase[val] || fnDatabase.custom;
          fnVerdict.textContent     = data.verdict;
          fnVerdict.className       = `sandbox-terminal__verdict sandbox-terminal__verdict--${data.isFake ? 'fake' : 'real'}`;
          fnConfidence.textContent  = `Confidence: ${data.confidence}`;
          fnExplanation.textContent = data.explanation;
          fnLime.innerHTML          = data.lime;

          // Use class toggle so CSS animation fires correctly
          fnResult.classList.add('visible');
          fnVerifyBtn.disabled = false;

          // Scroll result into view smoothly
          fnResult.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      };
      writeNext();
    });

  } // end fnVerifyBtn guard

  // ── Missing Utility Helper for logs timestamp ─────────────
  const getTimestamp = () => {
    const now = new Date();
    return now.toTimeString().split(' ')[0];
  };

  // ── Widget 2: Cloud Incident Dashboard ────────────────────
  const incDot = document.getElementById('inc-dot');
  const incStatusTxt = document.getElementById('inc-status-txt');
  const incLogs = document.getElementById('inc-logs');
  const incBtn = document.getElementById('inc-trigger-btn');

  if (incBtn && incDot && incStatusTxt && incLogs) {
    incBtn.addEventListener('click', () => {
      incBtn.disabled = true;
      
      // Clear dynamic logs, leaving only baseline logs
      incLogs.innerHTML = `
        <div class="widget-incident__log-item">[19:42:01] DB connected. Ping: 24ms</div>
        <div class="widget-incident__log-item">[19:42:05] Server initialized. Status: OK</div>
      `;
      
      // Set to Warning
      incDot.className = 'status-dot status-dot--warning';
      incStatusTxt.textContent = 'Warning';
      incStatusTxt.style.color = '#ef4444';

      const logWarn = document.createElement('div');
      logWarn.className = 'widget-incident__log-item widget-incident__log-item--warn';
      logWarn.textContent = `[${getTimestamp()}] ALERT: CPU load exceeded 85% on node-2`;
      incLogs.appendChild(logWarn);
      incLogs.scrollTop = incLogs.scrollHeight;

      setTimeout(() => {
        const logScale = document.createElement('div');
        logScale.className = 'widget-incident__log-item widget-incident__log-item--info';
        logScale.textContent = `[${getTimestamp()}] INFO: API route trigger. Auto-scaling instance node-2...`;
        incLogs.appendChild(logScale);
        incLogs.scrollTop = incLogs.scrollHeight;
      }, 1200);

      setTimeout(() => {
        const logOk = document.createElement('div');
        logOk.className = 'widget-incident__log-item widget-incident__log-item--ok';
        logOk.textContent = `[${getTimestamp()}] RESOLVED: Load balanced. CPU stable at 42%.`;
        incLogs.appendChild(logOk);
        incLogs.scrollTop = incLogs.scrollHeight;

        incDot.className = 'status-dot';
        incStatusTxt.textContent = 'Operational';
        incStatusTxt.style.color = '';
        incBtn.disabled = false;
      }, 2800);
    });
  }

  // ── Widget 3: Maternal Health Risk Calculator ─────────────
  const sliderSys = document.getElementById('risk-sys');
  const sliderDia = document.getElementById('risk-dia');
  const sliderHr = document.getElementById('risk-hr');

  const valSys = document.getElementById('risk-sys-val');
  const valDia = document.getElementById('risk-dia-val');
  const valHr = document.getElementById('risk-hr-val');

  const riskVerdict = document.getElementById('risk-verdict');
  const riskNeedle = document.getElementById('risk-needle');
  const riskGaugeArc = document.getElementById('risk-gauge-arc');

  updateRiskCalculator = () => {
    if (!sliderSys || !sliderDia || !sliderHr) return;
    const sys = parseInt(sliderSys.value);
    const dia = parseInt(sliderDia.value);
    const hr = parseInt(sliderHr.value);

    valSys.textContent = `${sys} mmHg`;
    valDia.textContent = `${dia} mmHg`;
    valHr.textContent = `${hr} bpm`;

    // Calculate risk
    let risk = 'LOW RISK';
    let angle = -60; // Degrees
    let arcDash = 41.9; // Low risk offset: 62.8 - 20.9 = 41.9
    let color = 'var(--accent)';

    if (sys > 135 || dia > 90 || (hr > 95 && sys > 130)) {
      risk = 'HIGH RISK';
      angle = 60;
      arcDash = 0; // High risk offset: 0 (fully filled)
      color = '#ef4444';
    } else if (sys > 125 || dia > 85 || hr > 85) {
      risk = 'MID RISK';
      angle = 0;
      arcDash = 20.9; // Mid risk offset: 62.8 - 41.9 = 20.9
      color = '#f59e0b';
    }

    riskVerdict.textContent = risk;
    riskVerdict.style.color = color;
    
    // Cross-browser SVG transformation fix
    riskNeedle.setAttribute('transform', `rotate(${angle}, 25, 25)`);
    riskNeedle.style.transform = `rotate(${angle}deg)`;
    
    riskGaugeArc.style.strokeDashoffset = arcDash;
    
    // Grab the current active accent color dynamically to repaint custom SVGs
    const activeColor = localStorage.getItem('nsv-accent-color') || 'violet';
    if (risk === 'LOW RISK') {
      riskGaugeArc.style.stroke = colorsMap[activeColor].accent;
    } else {
      riskGaugeArc.style.stroke = color;
    }
  };

  if (sliderSys && sliderDia && sliderHr) {
    [sliderSys, sliderDia, sliderHr].forEach(slider => {
      slider.addEventListener('input', updateRiskCalculator);
    });
    updateRiskCalculator();
  }

  // ── Widget 4: Uber Rides Data Analytics ────────────────────
  const uberFilters = document.querySelectorAll('.widget-uber__filter-btn');
  const bar1 = document.getElementById('uber-bar-1');
  const bar2 = document.getElementById('uber-bar-2');
  const bar3 = document.getElementById('uber-bar-3');
  const bar4 = document.getElementById('uber-bar-4');

  const uberData = {
    all: [65, 45, 90, 75],
    weekday: [85, 50, 95, 60],
    weekend: [40, 65, 80, 95]
  };

  const updateUberChart = (type) => {
    if (!bar1 || !bar2 || !bar3 || !bar4) return;
    const heights = uberData[type];
    bar1.style.height = `${heights[0]}%`;
    bar2.style.height = `${heights[1]}%`;
    bar3.style.height = `${heights[2]}%`;
    bar4.style.height = `${heights[3]}%`;
  };

  if (uberFilters.length > 0) {
    uberFilters.forEach(btn => {
      btn.addEventListener('click', () => {
        uberFilters.forEach(b => b.classList.remove('widget-uber__filter-btn--active'));
        btn.classList.add('widget-uber__filter-btn--active');
        updateUberChart(btn.getAttribute('data-filter'));
      });
    });

    // Init chart values with delay for load transition
    setTimeout(() => updateUberChart('all'), 600);
  }

  // ── Hero Page-Wide Cursor Spotlight Aura ──────────────────
  const heroSection = document.getElementById('hero');
  const heroSpotlight = document.getElementById('hero-spotlight');

  if (heroSection && heroSpotlight) {
    heroSection.addEventListener('mousemove', (e) => {
      const rect = heroSection.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      requestAnimationFrame(() => {
        heroSpotlight.style.left = `${x}px`;
        heroSpotlight.style.top = `${y}px`;
        heroSpotlight.style.opacity = '1';
      });
    });

    heroSection.addEventListener('mouseleave', () => {
      requestAnimationFrame(() => {
        heroSpotlight.style.opacity = '0';
      });
    });
  }

  // ── Conversational Portfolio AI Agent ────────────────────
  const initPortfolioAgent = () => {
    const chatInput   = document.getElementById('chat-input');
    const chatSend    = document.getElementById('chat-send');
    const chatHistory = document.getElementById('chat-history');
    const chips       = document.querySelectorAll('.chat-chip');

    if (!chatInput || !chatSend || !chatHistory) return;

    // ── Response bank ─────────────────────────────────────
    const responses = {
      greeting:
        "> Hey! I'm Nishanth's portfolio agent. Ask me anything about his work, skills, or background — or pick a command below.",
      tech:
        `> <span class="agt-label">Languages</span>  Python · JavaScript · SQL · R · C\n> <span class="agt-label">AI & ML</span>      PyTorch · Scikit-learn · LangChain · FAISS · Pandas · NumPy\n> <span class="agt-label">Web</span>          React · Next.js · Flask · FastAPI · REST APIs\n> <span class="agt-label">DevOps</span>       Docker · Kubernetes · Git · MongoDB · MySQL · Render`,
      projects:
        `> <span class="agt-accent">[1]</span> <strong>Fake News Detection</strong> — 94.5% accuracy ML ensemble + Llama 3.3 70B, 5-agent RAG pipeline, LIME/SHAP explainability.\n> <span class="agt-accent">[2]</span> <strong>Cloud Incident Tracker</strong> — Flask + MongoDB Atlas, RESTful API, deployed on Render.\n> <span class="agt-accent">[3]</span> <strong>Maternal Health Risk</strong> — classification model from physiological data with feature engineering.\n> <span class="agt-accent">[4]</span> <strong>Uber Rides Analysis</strong> — large-scale EDA, demand trend visualisation, geographic hotspots.`,
      experience:
        `> <span class="agt-accent">Mar–May 2025</span>  <strong>Data Science & Analytics Intern</strong> @ Zidio Development\n>   IPL dataset analysis · Power BI dashboards · clustering ML models\n>\n> <span class="agt-accent">Jul–Sep 2025</span>  <strong>Full Stack Developer Intern</strong> @ Viprith Inobyte\n>   Full-stack web apps · backend integration · deployed on RM Host`,
      education:
        `> <strong>B.Tech — Computer Science & Engineering</strong>\n> NMAM Institute of Technology, Nitte  ·  2022 – 2026\n> Focus: AI/ML · Algorithms · DBMS · Cloud · Software Engineering`,
      certs:
        `> <span class="agt-ok">✓</span> Google Data Analytics Professional\n> <span class="agt-ok">✓</span> Microsoft Power BI Data Analyst\n> <span class="agt-ok">✓</span> MS & LinkedIn Career Essentials in Data Analysis\n> <span class="agt-ok">✓</span> Deloitte Analytics Virtual Experience (Forage)\n> <span class="agt-ok">✓</span> IEEE PRIMED Placement Hackathon`,
      contact:
        `> <span class="agt-label">Email</span>    <a href="mailto:nishanthsvnsv@gmail.com" style="color:var(--accent)">nishanthsvnsv@gmail.com</a>\n> <span class="agt-label">GitHub</span>   <a href="https://github.com/nishanthsvbhat" target="_blank" rel="noopener" style="color:var(--accent)">github.com/nishanthsvbhat</a>\n> <span class="agt-label">LinkedIn</span> <a href="https://linkedin.com/in/nishanth-sv-bhat" target="_blank" rel="noopener" style="color:var(--accent)">linkedin.com/in/nishanth-sv-bhat</a>`,
      about:
        "> Nishanth S V is a final-year CS student building end-to-end AI systems, cloud infrastructure, and full-stack software. He ships production-grade work — 94.5% accuracy models, agentic RAG pipelines, and scalable deployments.",
      availability:
        "> Open to <strong>software engineering, AI/ML, data science, and full-stack</strong> opportunities.\n> Best way to connect: email or LinkedIn.",
      resume:
        "> Hit the <strong>Resume</strong> button at the top of the page to download the latest PDF.",
      thanks:
        "> Anytime. Ask me anything else about Nishanth's work!",
      help:
        `> <span class="agt-label">Commands</span>\n>   /tech_stack  · /projects · /internships\n>   /education   · /certs    · /contact\n>   /resume      · /clear`,
      fallback:
        "> Not sure about that one. Try asking about his <strong>projects</strong>, <strong>tech stack</strong>, <strong>internships</strong>, or <strong>contact</strong> details.",
    };

    // ── Intent map ────────────────────────────────────────
    const commandMap = {
      '/tech_stack': 'tech', '/tech': 'tech',
      '/projects':   'projects',
      '/internships':'experience', '/experience': 'experience',
      '/education':  'education',
      '/certs':      'certs', '/certifications': 'certs',
      '/contact':    'contact',
      '/resume':     'resume',
      '/help':       'help',
      '/clear':      '_clear',
    };

    const intentKeywords = {
      greeting:     ['hi', 'hello', 'hey', 'good morning', 'good evening', 'howdy'],
      tech:         ['tech', 'stack', 'skill', 'skills', 'language', 'languages', 'tool', 'tools', 'framework', 'frameworks', 'library', 'libraries', 'python', 'javascript', 'docker', 'kubernetes', 'cloud', 'ai', 'ml'],
      projects:     ['project', 'projects', 'built', 'build', 'fake news', 'incident', 'tracker', 'maternal', 'uber', 'rag', 'faiss', 'work', 'portfolio'],
      experience:   ['experience', 'intern', 'interns', 'internship', 'internships', 'job', 'jobs', 'zidio', 'viprith', 'work history'],
      education:    ['education', 'college', 'university', 'degree', 'btech', 'nmit', 'nitte', 'academic', 'study', 'studying'],
      certs:        ['cert', 'certs', 'certificate', 'certificates', 'certification', 'certifications', 'google', 'microsoft', 'power bi', 'deloitte', 'ieee', 'credential', 'credentials'],
      contact:      ['contact', 'contacts', 'email', 'emails', 'linkedin', 'github', 'reach', 'social', 'socials', 'connect', 'message'],
      availability: ['available', 'hire', 'hiring', 'opportunity', 'job', 'jobs', 'open to work', 'looking for'],
      resume:       ['resume', 'cv', 'download'],
      about:        ['about', 'who', 'bio', 'introduce', 'nishanth'],
      thanks:       ['thanks', 'thank you', 'ty', 'appreciate', 'great', 'awesome'],
    };

    // ── Helpers ───────────────────────────────────────────
    const escapeHTML = str =>
      str.replace(/[&<>'"]/g, t =>
        ({ '&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;' }[t] || t));

    const scrollDown = () => {
      chatHistory.scrollTop = chatHistory.scrollHeight;
    };

    const addMessage = (html, sender) => {
      const div = document.createElement('div');
      div.className = `chat-terminal__msg chat-terminal__msg--${sender}`;

      if (sender === 'user') {
        // User messages are escaped (no HTML injection)
        div.innerHTML = `<span class="chat-terminal__prompt agt-user-prompt">guest@nsv ~$</span> ${escapeHTML(html)}`;
      } else {
        // Bot messages render HTML (trusted internal strings only)
        // Strip leading "> " from each line for clean terminal look
        let cleanHtml = html.replace(/^>\s?/gm, '');
        if (!cleanHtml.includes('chat-terminal__prompt')) {
          cleanHtml = `<span class="chat-terminal__prompt">›</span> ${cleanHtml}`;
        }
        div.innerHTML = cleanHtml;
      }

      chatHistory.appendChild(div);
      scrollDown();
      return div;
    };

    // Typewriter effect for bot responses
    const typeBotMessage = (rawHtml) => {
      // Show typing indicator first
      const indicator = document.createElement('div');
      indicator.className = 'chat-terminal__msg chat-terminal__msg--bot agt-typing';
      indicator.innerHTML = '<span class="chat-terminal__prompt">›</span> <span class="agt-dots"><span></span><span></span><span></span></span>';
      chatHistory.appendChild(indicator);
      scrollDown();

      return new Promise(resolve => {
        setTimeout(() => {
          indicator.remove();
          addMessage(rawHtml, 'bot');
          resolve();
        }, 480);
      });
    };

    // ── Intent resolver ───────────────────────────────────
    const resolveIntent = (input) => {
      // Exact slash commands first
      if (commandMap[input]) return commandMap[input];
      // "help" / "commands" plain text
      if (['help', 'commands', '?', 'what can you do'].includes(input)) return 'help';
      // 'clear' plain
      if (input === 'clear') return '_clear';

      // Keyword scoring
      let best = null, bestScore = 0;
      for (const [intent, keywords] of Object.entries(intentKeywords)) {
        const score = keywords.reduce((sum, kw) => {
          if (kw.includes(' ')) return sum + (input.includes(kw) ? kw.split(' ').length : 0);
          return sum + (new RegExp(`\\b${kw.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}\\b`,'i').test(input) ? kw.split(' ').length : 0);
        }, 0);
        if (score > bestScore) { best = intent; bestScore = score; }
      }
      return best;
    };

    // ── Process a query ───────────────────────────────────
    const processQuery = async (raw) => {
      const clean = raw.trim();
      if (!clean) return;

      const lower = clean.toLowerCase().replace(/[?!.]+$/, '');

      // Show user message
      addMessage(clean, 'user');
      chatInput.value = '';
      chatSend.disabled = true;
      chatInput.disabled = true;

      const intent = resolveIntent(lower);

      if (intent === '_clear') {
        setTimeout(() => {
          chatHistory.innerHTML = '';
          addMessage('<span class="chat-terminal__prompt">›</span> Terminal cleared. Ready.', 'bot');
          chatSend.disabled = false;
          chatInput.disabled = false;
          chatInput.focus();
        }, 200);
        return;
      }

      const reply = responses[intent] || responses.fallback;
      await typeBotMessage(reply);

      chatSend.disabled = false;
      chatInput.disabled = false;
      chatInput.focus();
    };

    // ── Event listeners ───────────────────────────────────
    chatSend.addEventListener('click', () => processQuery(chatInput.value));

    chatInput.addEventListener('keydown', e => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        processQuery(chatInput.value);
      }
    });

    chips.forEach(chip => {
      chip.addEventListener('click', () => {
        const q = chip.getAttribute('data-query');
        const textMap = {
          tech:       '/tech_stack',
          projects:   '/projects',
          experience: '/internships',
          education:  '/education',
          certs:      '/certs',
        };
        processQuery(textMap[q] || q);
      });
    });

    // Auto-focus input on click anywhere in the terminal
    chatHistory.addEventListener('click', () => chatInput.focus());
  };
  initPortfolioAgent();

  // ── Custom Cursor Logic ──────────────────────────────────
  const initCursor = () => {
    const dot = document.getElementById('cursor-dot');
    const ring = document.getElementById('cursor-ring');
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine) and (min-width: 769px)');
    if (!dot || !ring || !finePointer.matches) return;

    document.documentElement.classList.add('cursor-enabled');

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const lerpAmount = reduceMotion ? 1 : 0.18;
    const interactiveSelector = [
      'a',
      'button',
      'input',
      'textarea',
      'select',
      '[role="button"]',
      '[tabindex]:not([tabindex="-1"])',
      '.glow-card',
      '.accent-swapper',
      '.ds-point--draggable',
      '.hero-terminal__tab',
      '[data-cursor-interactive]'
    ].join(', ');

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;
    let hasMoved = false;

    const setVisible = visible => {
      dot.classList.toggle('is-visible', visible);
      ring.classList.toggle('is-visible', visible);
      if (!visible) document.body.classList.remove('cursor-hover');
    };

    const updateHoverState = target => {
      const interactive = target instanceof Element && target.closest(interactiveSelector);
      document.body.classList.toggle('cursor-hover', Boolean(interactive));
    };

    window.addEventListener('pointermove', e => {
      if (e.pointerType && e.pointerType !== 'mouse' && e.pointerType !== 'pen') return;

      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.transform = `translate3d(${mouseX - 3}px, ${mouseY - 3}px, 0)`;

      if (!hasMoved) {
        hasMoved = true;
        ringX = mouseX;
        ringY = mouseY;
        setVisible(true);
      }

      updateHoverState(e.target);
    }, { passive: true });

    const renderCursor = () => {
      ringX += (mouseX - ringX) * lerpAmount;
      ringY += (mouseY - ringY) * lerpAmount;
      ring.style.transform = `translate3d(${ringX - 22}px, ${ringY - 22}px, 0)`;
      requestAnimationFrame(renderCursor);
    };
    requestAnimationFrame(renderCursor);

    document.addEventListener('pointerdown', e => {
      if (e.pointerType && e.pointerType !== 'mouse' && e.pointerType !== 'pen') return;

      ring.classList.remove('is-clicking');
      void ring.offsetWidth;
      ring.classList.add('is-clicking');
    });

    ring.addEventListener('animationend', () => {
      ring.classList.remove('is-clicking');
    });

    window.addEventListener('scroll', () => {
      if (!hasMoved) return;
      updateHoverState(document.elementFromPoint(mouseX, mouseY));
    }, { passive: true });

    document.documentElement.addEventListener('mouseleave', () => setVisible(false));
    document.documentElement.addEventListener('mouseenter', () => {
      if (hasMoved) setVisible(true);
    });

    window.addEventListener('blur', () => setVisible(false));
  };
  initCursor();

});
