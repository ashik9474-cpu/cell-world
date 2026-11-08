/**
 * CELL WORLD - Core Motion & Interaction Architecture
 * 
 * Implements:
 * 1. Hero Image Slider with timing, zoom, progress indicators, pause/play, swipe, reduced-motion.
 * 2. Sticky Header scroll detection and Mobile Menu with keyboard trap/Escape.
 * 3. Services editorial interaction with crossfading visual panel & mobile expansion.
 * 4. Desktop scroll-linked 24px subtle parallax in About section.
 * 5. IntersectionObserver entrance reveals (animate-once).
 * 6. Interactive WhatsApp repair estimate builder.
 */

document.addEventListener('DOMContentLoaded', () => {
  const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Set current year in footer
  const currentYearEl = document.getElementById('currentYear');
  if (currentYearEl) {
    currentYearEl.textContent = new Date().getFullYear();
  }

  /* ==========================================================================
     1. HERO IMAGE SLIDER (CONTINUOUS AUTO-SLIDE, NO BUTTONS)
     ========================================================================== */
  const slider = document.getElementById('heroSlider');
  const sliderTrack = document.getElementById('sliderTrack');
  const slides = document.querySelectorAll('.slide-item');

  let currentSlide = 0;
  let slideTimer = null;
  const SLIDE_DURATION = 4000;

  function showSlide(index) {
    currentSlide = (index + slides.length) % slides.length;

    // Horizontally slide the track one by one
    if (sliderTrack) {
      const offsetPercent = currentSlide * (100 / slides.length);
      sliderTrack.style.transform = `translate3d(-${offsetPercent.toFixed(4)}%, 0, 0)`;
    }

    slides.forEach((slide, i) => {
      if (i === currentSlide) {
        slide.classList.add('active');
      } else {
        slide.classList.remove('active');
      }
    });

    resetTimer();
  }

  function nextSlide() {
    showSlide(currentSlide + 1);
  }

  function prevSlide() {
    showSlide(currentSlide - 1);
  }

  function startTimer() {
    clearTimeout(slideTimer);
    slideTimer = setTimeout(() => {
      nextSlide();
    }, SLIDE_DURATION);
  }

  function resetTimer() {
    clearTimeout(slideTimer);
    startTimer();
  }

    // Touch Swiping for mobile
    let touchStartX = 0;
    let touchEndX = 0;

    if (slider) {
      slider.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
      }, { passive: true });

      slider.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
      }, { passive: true });
    }

    function handleSwipe() {
      const swipeDistance = touchEndX - touchStartX;
      if (Math.abs(swipeDistance) > 40) {
        if (swipeDistance < 0) {
          nextSlide(); // swipe left -> next
        } else {
          prevSlide(); // swipe right -> prev
        }
      }
    }

  // Pause when browser tab is hidden
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      clearTimeout(slideTimer);
    } else {
      startTimer();
    }
  });

  // Initialize slider timer
  startTimer();

  /* ==========================================================================
     2. STICKY HEADER & MOBILE NAVIGATION DRAWER
     ========================================================================== */
  const header = document.getElementById('siteHeader');
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileNav = document.getElementById('mobileNav');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  // Sticky header background blur & shadow on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  }, { passive: true });

  function openMobileMenu() {
    mobileMenuBtn?.classList.add('open');
    mobileMenuBtn?.setAttribute('aria-expanded', 'true');
    mobileNav?.classList.add('open');
    mobileNav?.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    mobileMenuBtn?.classList.remove('open');
    mobileMenuBtn?.setAttribute('aria-expanded', 'false');
    mobileNav?.classList.remove('open');
    mobileNav?.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (mobileMenuBtn && mobileNav) {
    mobileMenuBtn.addEventListener('click', () => {
      const isOpen = mobileMenuBtn.classList.contains('open');
      if (isOpen) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });

    // Close on link click
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        closeMobileMenu();
      });
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileNav.classList.contains('open')) {
        closeMobileMenu();
        mobileMenuBtn.focus();
      }
    });
  }

  /* ==========================================================================
     3. SERVICES EDITORIAL INTERACTION & DYNAMIC VISUAL PANEL
     ========================================================================== */
  const serviceData = [
    {
      title: "Precision Screen & Glass Restoration",
      pill: "Display & Touch",
      desc: "High-grade touch digitizers and original-spec displays installed with dust-free UV curing technology.",
      image: "assets/images/hero-display.jpg",
      whatsappQuery: "Display & Touch"
    },
    {
      title: "Certified Battery & Power Restoration",
      pill: "Battery & Charging",
      desc: "Brand-grade high-density battery cells and micro-soldered charging ports for rapid, safe power delivery.",
      image: "assets/images/hero-battery.jpg",
      whatsappQuery: "Battery & Charging"
    },
    {
      title: "Acoustic & Optics Component Calibration",
      pill: "Sound & Camera",
      desc: "Replacing malfunctioning microphones, low-output earpieces, cracked camera glass and sensor modules.",
      image: "assets/images/service-sound-camera.jpg",
      whatsappQuery: "Sound & Camera"
    },
    {
      title: "Microscope IC & Motherboard Rework",
      pill: "Motherboard & IC Repair",
      desc: "Diagnosing dead logic boards, short circuits, audio ICs, and power management units with micro-soldering precision.",
      image: "assets/images/hero-motherboard.jpg",
      whatsappQuery: "Motherboard & IC Repair"
    },
    {
      title: "Ultrasonic Corrosion & Network Diagnostics",
      pill: "Water & Network",
      desc: "Liquid damage chemical treatment, circuit drying, and RF baseband / Wi-Fi antenna troubleshooting.",
      image: "assets/images/service-water-network.jpg",
      whatsappQuery: "Water & Network"
    },
    {
      title: "Firmware Restoration & Emergency Recovery",
      pill: "Software & Other Repairs",
      desc: "Fixing stuck boot loops, corrupt OS upgrades, secure data recovery and biometrics re-calibration.",
      image: "assets/images/about-workbench.jpg",
      whatsappQuery: "Software & Other Repairs"
    }
  ];

  /* ==========================================================================
     HERO SLIDING TEXT TICKER
     ========================================================================== */
  const tickerSlides = document.querySelectorAll('#heroTicker .ticker-slide');
  let currentTicker = 0;
  let tickerTimer = null;

  function cycleTicker() {
    if (tickerSlides.length <= 1 || isReducedMotion || document.hidden) return;
    const prev = tickerSlides[currentTicker];
    currentTicker = (currentTicker + 1) % tickerSlides.length;
    const next = tickerSlides[currentTicker];

    prev.classList.remove('active');
    prev.classList.add('exit');
    setTimeout(() => {
      prev.classList.remove('exit');
    }, 450);

    next.classList.add('active');
  }

  if (tickerSlides.length > 1 && !isReducedMotion) {
    tickerTimer = setInterval(cycleTicker, 3200);
  }

  const serviceRows = document.querySelectorAll('.service-row');
  const serviceVisualImg = document.getElementById('serviceVisualImg');
  const serviceCardContent = document.getElementById('serviceCardContent');
  const serviceCardPill = document.getElementById('serviceCardPill');
  const serviceCardTitle = document.getElementById('serviceCardTitle');
  const serviceCardDesc = document.getElementById('serviceCardDesc');
  const serviceEnquireBtn = document.getElementById('serviceEnquireBtn');

  function updateServiceVisual(index) {
    const data = serviceData[index];
    if (!data) return;

    // Update active row classes
    serviceRows.forEach((row, idx) => {
      if (idx === index) {
        row.classList.add('active');
        row.setAttribute('aria-selected', 'true');
      } else {
        row.classList.remove('active');
        row.setAttribute('aria-selected', 'false');
      }
    });

    // Smooth coordinated crossfade & text slide
    if (serviceVisualImg) {
      serviceVisualImg.classList.add('crossfading');
    }
    if (serviceCardContent) {
      serviceCardContent.classList.add('text-crossfading');
    }

    setTimeout(() => {
      if (serviceVisualImg) {
        serviceVisualImg.src = data.image;
        serviceVisualImg.alt = data.title;
        serviceVisualImg.classList.remove('crossfading');
      }
      if (serviceCardPill) serviceCardPill.textContent = data.pill;
      if (serviceCardTitle) serviceCardTitle.textContent = data.title;
      if (serviceCardDesc) serviceCardDesc.textContent = data.desc;
      if (serviceEnquireBtn) {
        serviceEnquireBtn.href = `https://wa.me/919743784813?text=Hello%20CELL%20WORLD%2C%20I%20would%20like%20to%20enquire%20about%20${encodeURIComponent(data.whatsappQuery)}%20repair.`;
      }
      if (serviceCardContent) {
        serviceCardContent.classList.remove('text-crossfading');
      }
    }, 140);
  }

  serviceRows.forEach((row, idx) => {
    // Hover event for desktop
    row.addEventListener('mouseenter', () => {
      updateServiceVisual(idx);
    });

    // Focus event for keyboard navigation
    row.addEventListener('focus', () => {
      updateServiceVisual(idx);
    });

    // Click event (selects without navigating away to WhatsApp!)
    row.addEventListener('click', (e) => {
      // If clicking inside the mobile enquire button, allow default link
      if (e.target.closest('.mobile-enquire-btn')) return;
      updateServiceVisual(idx);
    });

    // Enter / Space key selection
    row.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        updateServiceVisual(idx);
      }
    });
  });

  /* ==========================================================================
     4. DESKTOP SCROLL-LINKED 24PX SUBTLE PARALLAX (ABOUT SECTION)
     ========================================================================== */
  const aboutSection = document.getElementById('about');
  const parallaxImg = document.getElementById('aboutParallaxImg');

  function updateAboutParallax() {
    if (isReducedMotion || window.innerWidth < 992 || !aboutSection || !parallaxImg) {
      if (parallaxImg) parallaxImg.style.transform = 'none';
      return;
    }

    const rect = aboutSection.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    // Check if section is currently intersecting viewport
    if (rect.top < windowHeight && rect.bottom > 0) {
      // Calculate progress from 0 (entering bottom) to 1 (leaving top)
      const progress = (windowHeight - rect.top) / (windowHeight + rect.height);
      // Map progress to ~24px total movement (-12px to +12px)
      const translateY = (progress - 0.5) * 24;
      parallaxImg.style.transform = `translate3d(0, ${translateY.toFixed(1)}px, 0)`;
    }
  }

  window.addEventListener('scroll', updateAboutParallax, { passive: true });
  window.addEventListener('resize', updateAboutParallax, { passive: true });
  updateAboutParallax();

  /* ==========================================================================
     5. SECTION ENTRANCE ANIMATION & CHAR-SPLIT HEADINGS (IntersectionObserver)
     ========================================================================== */
  const revealElements = document.querySelectorAll('.reveal-on-scroll');

  // Character-by-character staggered heading entrance (WeFix animat-charsplit)
  function initCharSplitHeadings() {
    const headings = document.querySelectorAll('.animat-charsplit');
    if (!headings.length) return;

    headings.forEach(heading => {
      // Save original for screen-reader accessibility
      const rawText = heading.textContent.trim().replace(/\s+/g, ' ');
      if (!heading.hasAttribute('aria-label')) {
        heading.setAttribute('aria-label', rawText);
      }

      if (isReducedMotion) return;

      let charIndex = 0;

      function processTextToCharWords(text) {
        const words = text.trim().split(/\s+/).filter(Boolean);
        return words.map(word => {
          const chars = word.split('').map(ch => {
            const delay = (charIndex * 0.02).toFixed(2);
            charIndex++;
            return `<span class="wdt-title-char" style="animation-delay:${delay}s">${ch}</span>`;
          }).join('');
          return `<span class="wdt-title-word">${chars}</span>`;
        }).join(' ');
      }

      function transformNode(node) {
        if (node.nodeType === Node.TEXT_NODE) {
          const text = node.textContent;
          if (!text.trim()) {
            return document.createTextNode(' ');
          }
          const frag = document.createDocumentFragment();
          if (/^\s/.test(text)) {
            frag.appendChild(document.createTextNode(' '));
          }
          const temp = document.createElement('span');
          temp.innerHTML = processTextToCharWords(text);
          while (temp.firstChild) {
            frag.appendChild(temp.firstChild);
          }
          if (/\s$/.test(text)) {
            frag.appendChild(document.createTextNode(' '));
          }
          return frag;
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          if (node.tagName === 'BR') {
            return node.cloneNode();
          }
          const clone = node.cloneNode(false);
          Array.from(node.childNodes).forEach(child => {
            const transformed = transformNode(child);
            if (transformed) clone.appendChild(transformed);
          });
          return clone;
        }
        return null;
      }

      const fragment = document.createDocumentFragment();
      Array.from(heading.childNodes).forEach(child => {
        const transformed = transformNode(child);
        if (transformed) fragment.appendChild(transformed);
      });

      heading.innerHTML = '';
      heading.appendChild(fragment);
    });

    // Reveal hero heading on load
    const heroTitle = document.getElementById('hero-title');
    if (heroTitle) {
      setTimeout(() => {
        heroTitle.classList.add('is-revealed');
      }, 100);
    }
  }

  initCharSplitHeadings();

  // Animated numerical counters for stats in About section
  function animateCounters() {
    if (isReducedMotion) return;
    const counterEls = document.querySelectorAll('[data-count]');
    counterEls.forEach(el => {
      const target = parseInt(el.getAttribute('data-count'), 10);
      const suffix = el.getAttribute('data-suffix') || '';
      if (isNaN(target)) return;

      const duration = 1400;
      const startTime = performance.now();

      function updateCounter(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentVal = Math.floor(easeOut * target);
        el.textContent = currentVal + suffix;

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          el.textContent = target + suffix;
        }
      }

      requestAnimationFrame(updateCounter);
    });
  }

  if ('IntersectionObserver' in window && !isReducedMotion) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          if (entry.target.id === 'about') {
            animateCounters();
          }
          observer.unobserve(entry.target); // Animate only once
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // If loaded with a hash anchor, immediately reveal the target
    if (window.location.hash) {
      const hashEl = document.querySelector(window.location.hash);
      if (hashEl) {
        hashEl.classList.add('is-revealed');
        if (hashEl.id === 'about') animateCounters();
      }
    }
  } else {
    // If IntersectionObserver unavailable or reduced motion, show immediately
    revealElements.forEach(el => el.classList.add('is-revealed'));
  }

  /* ==========================================================================
     6. INTERACTIVE WHATSAPP REPAIR ESTIMATE BUILDER
     ========================================================================== */
  const estBrand = document.getElementById('estBrand');
  const estModel = document.getElementById('estModel');
  const estProblem = document.getElementById('estProblem');
  const getEstimateBtn = document.getElementById('getEstimateBtn');
  const quickTags = document.querySelectorAll('.quick-tag');

  function updateEstimateLink() {
    const brand = estBrand ? estBrand.value.trim() : '';
    const model = estModel ? estModel.value.trim() : '';
    const problem = estProblem ? estProblem.value.trim() : '';

    const message = `Hello CELL WORLD, I would like a repair estimate.\nBrand: ${brand}\nModel: ${model}\nProblem: ${problem}`;
    const encoded = encodeURIComponent(message);
    if (getEstimateBtn) {
      getEstimateBtn.href = `https://wa.me/919743784813?text=${encoded}`;
    }
  }

  if (estBrand) estBrand.addEventListener('change', updateEstimateLink);
  if (estModel) estModel.addEventListener('input', updateEstimateLink);
  if (estProblem) estProblem.addEventListener('input', updateEstimateLink);

  // Quick tag selection helper with smooth active feedback
  quickTags.forEach(tag => {
    tag.addEventListener('click', () => {
      quickTags.forEach(t => t.classList.remove('active'));
      tag.classList.add('active');
      const tagText = tag.getAttribute('data-tag');
      if (estProblem) {
        estProblem.value = tagText;
        updateEstimateLink();
        estProblem.focus();
      }
    });
  });

  // Initial link compile
  updateEstimateLink();
});
