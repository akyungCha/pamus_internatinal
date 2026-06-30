(function () {
  'use strict';

  /* ── State ───────────────────────────────────────────────── */
  const wrapper        = document.getElementById('fp-wrapper');
  const sections       = Array.from(document.querySelectorAll('.fp-section'));
  const dotsNav        = document.getElementById('fp-dots');
  const totalSections  = sections.length;

  let currentIndex = 0;
  let isAnimating  = false;
  const LOCK_MS    = 900; // slightly longer than CSS transition

  /* ── Build Dots ─────────────────────────────────────────── */
  const dots = sections.map((sec, i) => {
    const btn = document.createElement('button');
    btn.className = 'fp-dot' + (i === 0 ? ' active' : '');
    btn.setAttribute('aria-label', sec.dataset.label || `섹션 ${i + 1}`);
    btn.addEventListener('click', () => goTo(i));
    dotsNav.appendChild(btn);
    return btn;
  });

  
  function goTo(index) {
    if (isAnimating || index === currentIndex) return;
    if (index < 0 || index >= totalSections) return;

    isAnimating = true;
    currentIndex = index;

    const sectionHeight = sections[0].getBoundingClientRect().height;
    wrapper.style.transform = `translateY(${-index * sectionHeight}px)`;

    dots.forEach((d, i) => d.classList.toggle('active', i === index));

    setTimeout(() => { isAnimating = false; }, LOCK_MS);
  }

  // 주소창 표시 상태 변화, 회전 등으로 뷰포트 높이가 바뀌면
  // 현재 위치를 새 높이 기준으로 다시 맞춰준다.
  function realign() {
    const sectionHeight = sections[0].getBoundingClientRect().height;
    wrapper.style.transition = 'none';
    wrapper.style.transform = `translateY(${-currentIndex * sectionHeight}px)`;
    // 강제 리플로우 후 transition 복구
    void wrapper.offsetHeight;
    wrapper.style.transition = '';
  }

  window.addEventListener('resize', realign);
  window.visualViewport && window.visualViewport.addEventListener('resize', realign);

  function next() { goTo(currentIndex + 1); }
  function prev() { goTo(currentIndex - 1); }

  /* ── Mouse Wheel ─────────────────────────────────────────── */
  let wheelDelta = 0;
  const WHEEL_THRESHOLD = 30;

  window.addEventListener('wheel', (e) => {
    e.preventDefault();
    if (isAnimating) return;

    wheelDelta += e.deltaY;
    if (Math.abs(wheelDelta) >= WHEEL_THRESHOLD) {
      wheelDelta > 0 ? next() : prev();
      wheelDelta = 0;
    }
  }, { passive: false });

  /* ── Touch ───────────────────────────────────────────────── */
  let touchStartY = 0;
  const TOUCH_THRESHOLD = 50;

  window.addEventListener('touchstart', (e) => {
    touchStartY = e.touches[0].clientY;
  }, { passive: true });

  // 네이티브 스크롤(바운스 포함)이 JS 트랜스폼과 동시에 동작하면서
  // 생기는 끊김/겹침을 막기 위해 touchmove 기본 동작을 차단.
  window.addEventListener('touchmove', (e) => {
    e.preventDefault();
  }, { passive: false });

  window.addEventListener('touchend', (e) => {
    if (isAnimating) return;
    const diff = touchStartY - e.changedTouches[0].clientY;
    if (Math.abs(diff) >= TOUCH_THRESHOLD) {
      diff > 0 ? next() : prev();
    }
  }, { passive: true });

  /* ── Keyboard ────────────────────────────────────────────── */
  window.addEventListener('keydown', (e) => {
    if (['ArrowDown', 'PageDown', 'Space'].includes(e.code)) { e.preventDefault(); next(); }
    if (['ArrowUp',   'PageUp'          ].includes(e.code)) { e.preventDefault(); prev(); }
  });

  /* ── Mobile Hamburger ────────────────────────────────────── */
  const burger      = document.getElementById('gnb-burger');
  const mobileMenu  = document.getElementById('mobile-menu');
  const mobileClose = document.getElementById('mobile-close');

  function openMenu() {
    mobileMenu.classList.add('open');
    mobileMenu.setAttribute('aria-hidden', 'false');
    burger.setAttribute('aria-expanded', 'true');
    burger.style.visibility = 'hidden';
  }

  function closeMenu() {
    mobileMenu.classList.remove('open');
    mobileMenu.setAttribute('aria-hidden', 'true');
    burger.setAttribute('aria-expanded', 'false');
    burger.style.visibility = '';
  }

  burger.addEventListener('click', openMenu);
  mobileClose.addEventListener('click', closeMenu);

  // Close mobile menu when a link is tapped
  mobileMenu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', closeMenu);
  });

  /* ── Init ────────────────────────────────────────────────── */
  wrapper.style.transform = 'translateY(0)';

})();

/* ── 네비 메뉴 → 섹션 스크롤 연결 (전 페이지 공용) ── */
(function () {
  document.querySelectorAll('[data-goto]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      var idx = parseInt(link.dataset.goto, 10);
      var dot = document.querySelectorAll('#fp-dots .fp-dot')[idx];
      if (dot) dot.click();
    });
  });
})();

/* ── Hero shimmer ───────────────────────────────── */
(function () {
  const headline    = document.querySelector('.hero-headline');
  const heroSection = document.getElementById('section-hero');

  function triggerHeadlineShimmer() {
    if (!headline) return;
    headline.classList.remove('shimmer-play');
    void headline.offsetWidth;
    headline.classList.add('shimmer-play');
  }

  window.addEventListener('DOMContentLoaded', function () {
    setTimeout(triggerHeadlineShimmer, 300);
  });

  if (heroSection) {
    new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) triggerHeadlineShimmer();
      });
    }, { threshold: 0.15 }).observe(heroSection);
  }
})();

/* ── Learning Galaxy 타이틀 shimmer ─────────────────────── */
(function () {
  const section = document.getElementById('section-galaxy');
  const title   = section ? section.querySelector('.galaxy-title') : null;
  if (!title) return;

  function triggerShimmer() {
    title.classList.remove('shimmer-play');
    void title.offsetWidth;
    title.classList.add('shimmer-play');
  }

  new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) triggerShimmer();
    });
  }, { threshold: 0.15 }).observe(section);
})();

/* ── 설득하는 영어 타이틀 shimmer ───────────────────── */
(function () {
  const section = document.getElementById('section-persuasive');
  const title   = section ? section.querySelector('.persuasive-title') : null;
  if (!title) return;

  function triggerShimmer() {
    title.classList.remove('shimmer-play');
    void title.offsetWidth;
    title.classList.add('shimmer-play');
  }

  new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) triggerShimmer();
    });
  }, { threshold: 0.15 }).observe(section);
})();

/* ── IB 융합 Track 타이틀 shimmer ─────────────────── */
(function () {
  const section = document.getElementById('section-ib');
  const title   = section ? section.querySelector('.ib-title') : null;
  if (!title) return;

  function triggerShimmer() {
    title.classList.remove('shimmer-play');
    void title.offsetWidth;
    title.classList.add('shimmer-play');
  }

  new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) triggerShimmer();
    });
  }, { threshold: 0.15 }).observe(section);
})();

/* ── Expert Group 입장 애니메이션 + 타이틀 shimmer ──────── */
(function () {
  const section = document.getElementById('section-expert');
  if (!section) return;
  const inner = section.querySelector('.expert-inner');
  const ceo   = section.querySelector('.expert-ceo');
  const title = section.querySelector('.expert-title');

  function triggerShimmer() {
    if (!title) return;
    title.classList.remove('shimmer-play');
    void title.offsetWidth;
    title.classList.add('shimmer-play');
  }

  function triggerEntrance() {
    if (inner) inner.classList.add('is-visible');
    if (ceo)   ceo.classList.add('is-visible');
    triggerShimmer();
  }

  function resetEntrance() {
    if (inner) inner.classList.remove('is-visible');
    if (ceo)   ceo.classList.remove('is-visible');
  }

  new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) triggerEntrance();
      else resetEntrance();
    });
  }, { threshold: 0.15 }).observe(section);
})();

/* ── Future Literacy 카드 애니메이션 + 타이틀 shimmer ────── */
(function () {
  const section   = document.getElementById('section-literacy');
  const fpWrapper = document.getElementById('fp-wrapper');
  const cards     = section ? Array.from(section.querySelectorAll('.lit-card')) : [];
  const title     = section ? section.querySelector('.literacy-title') : null;

  if (!section || !cards.length) return;

  /* section-literacy의 DOM 순서 인덱스 */
  const sectionIdx = Array.from(document.querySelectorAll('.fp-section')).indexOf(section);
  let cardsShown   = false;

  function triggerShimmer() {
    if (!title) return;
    title.classList.remove('shimmer-play');
    void title.offsetWidth;
    title.classList.add('shimmer-play');
  }

  function onEnter() {
    triggerShimmer();
    if (!cardsShown) {
      cardsShown = true;
      cards.forEach(function (card, i) {
        setTimeout(function () { card.classList.add('is-visible'); }, i * 120);
      });
    }
  }

  /* wrapper transform 값에서 현재 활성 섹션 인덱스를 계산 */
  function activeIdx() {
    var m = (fpWrapper ? fpWrapper.style.transform : '').match(/translateY\(\s*(-?[\d.]+)/);
    return m ? Math.round(-parseFloat(m[1]) / window.innerHeight) : 0;
  }

  /* MutationObserver: transform 변경을 직접 감지 — 모바일/데스크탑 모두 동작 */
  if (fpWrapper) {
    new MutationObserver(function () {
      if (activeIdx() === sectionIdx) onEnter();
    }).observe(fpWrapper, { attributes: true, attributeFilter: ['style'] });
  }

  /* IntersectionObserver: 데스크탑 추가 보장 및 페이지 최초 로드 시 대응 */
  new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) onEnter();
    });
  }, { threshold: 0.1 }).observe(section);
})();

/* ── 영상 모달 ───────────────────────────────────────────── */
(function () {
  const cta      = document.querySelector('.hero-video-cta');
  const modal    = document.getElementById('video-modal');
  const player   = document.getElementById('video-modal-player');
  const closeBtn = document.getElementById('video-modal-close');

  if (!cta || !modal) return;

  function openModal(e) {
    e.preventDefault();
    modal.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    player.currentTime = 0;
    player.play();
  }

  function closeModal() {
    modal.classList.remove('is-open');
    document.body.style.overflow = '';
    player.pause();
  }

  cta.addEventListener('click', openModal);
  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', function (e) {
    if (e.target === modal) closeModal();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeModal();
  });
})();

/* ── Galaxyq 은하수 효과 ────────────────────────────────────── */
(function () {
  const canvas = document.querySelector('.galaxy-stars');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, stars = [], flares = [];

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function rand(min, max) { return min + Math.random() * (max - min); }
  function randInt(min, max) { return Math.floor(rand(min, max + 1)); }

  function createStar() {
    const tier = Math.random();
    const isDim    = tier < 0.55;
    const isBright = tier > 0.88;
    return {
      x:        rand(0, W),
      y:        rand(0, H),
      r:        isDim ? rand(0.5, 1.2) : isBright ? rand(2.2, 3.8) : rand(1.2, 2.2),
      phase:    rand(0, Math.PI * 2),
      speed:    isDim ? rand(0.006, 0.018) : isBright ? rand(0.025, 0.06) : rand(0.012, 0.035),
      minAlpha: isDim ? 0.08 : isBright ? 0.3  : 0.15,
      maxAlpha: isDim ? 0.55 : isBright ? 1.0  : 0.82,
      hue:      isBright ? rand(185, 215) : rand(195, 225),
      sat:      isBright ? 90 : rand(50, 80),
      bright:   isBright,
      flareCooldown: isBright ? randInt(180, 600) : Infinity,
    };
  }

  function initStars() {
    const count = Math.round((W * H) / 2200);
    stars = Array.from({ length: count }, createStar);
  }

  function spawnFlare(s) {
    const angle = rand(-Math.PI * 0.35, -Math.PI * 0.15);
    flares.push({
      x: s.x, y: s.y,
      vx: Math.cos(angle) * rand(2.5, 5.5),
      vy: Math.sin(angle) * rand(2.5, 5.5),
      len: rand(30, 80),
      life: 1.0,
      decay: rand(0.018, 0.035),
      hue: s.hue,
    });
    s.flareCooldown = randInt(300, 900);
  }

  function drawFlare(f) {
    const tail = { x: f.x - f.vx * (f.len / 6), y: f.y - f.vy * (f.len / 6) };
    const grd = ctx.createLinearGradient(f.x, f.y, tail.x, tail.y);
    grd.addColorStop(0,   `hsla(${f.hue}, 100%, 95%, ${f.life * 0.9})`);
    grd.addColorStop(0.4, `hsla(${f.hue}, 100%, 85%, ${f.life * 0.5})`);
    grd.addColorStop(1,   `hsla(${f.hue}, 100%, 80%, 0)`);
    ctx.save();
    ctx.strokeStyle = grd;
    ctx.lineWidth   = f.life * 2.2;
    ctx.shadowColor = `hsla(${f.hue}, 100%, 90%, ${f.life * 0.6})`;
    ctx.shadowBlur  = 12;
    ctx.beginPath();
    ctx.moveTo(f.x, f.y);
    ctx.lineTo(tail.x, tail.y);
    ctx.stroke();
    ctx.restore();
  }

  function tick() {
    ctx.clearRect(0, 0, W, H);
    stars.forEach(s => {
      s.phase += s.speed;
      const t     = 0.5 + 0.5 * Math.sin(s.phase);
      const alpha = s.minAlpha + (s.maxAlpha - s.minAlpha) * t;
      ctx.save();
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle   = `hsla(${s.hue}, ${s.sat}%, 95%, ${alpha})`;
      ctx.shadowColor = `hsla(${s.hue}, 100%, 90%, ${alpha})`;
      ctx.shadowBlur  = s.bright ? s.r * 7 * t : s.r * 3;
      ctx.fill();
      if (s.bright && t > 0.6) {
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r * 2.5 * t, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${s.hue}, 100%, 90%, ${(t - 0.6) * 0.25})`;
        ctx.fill();
      }
      ctx.restore();
      if (s.bright) {
        s.flareCooldown--;
        if (s.flareCooldown <= 0) spawnFlare(s);
      }
    });
    flares = flares.filter(f => f.life > 0.01);
    flares.forEach(f => {
      drawFlare(f);
      f.x    += f.vx;
      f.y    += f.vy;
      f.life -= f.decay;
    });
    requestAnimationFrame(tick);
  }

  window.addEventListener('resize', () => { resize(); initStars(); });
  resize();
  initStars();
  tick();
})();

/* ── IB 융합 입자 효과  ────────────────────────────────────────── */
(function () {
  const canvas = document.querySelector('.ib-particles');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, particles = [];
  const isMobile = () => window.innerWidth <= 768;

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function rand(min, max) { return min + Math.random() * (max - min); }

  function createParticle() {
    const mobile  = isMobile();
    const tier    = Math.random();
    const isLarge = tier > 0.85;
    const isMed   = tier > 0.55 && !isLarge;
    const isPulse = Math.random() < 0.25;
    return {
      x:          rand(0, W),
      y:          rand(0, H),
      r:          isLarge ? rand(mobile ? 2.5 : 3.5, mobile ? 5   : 7)
                : isMed   ? rand(mobile ? 1.2 : 1.8,  mobile ? 2.5 : 4)
                :            rand(mobile ? 0.6 : 0.8, mobile ? 1.5 : 2.2),
      alpha:      0,
      maxAlpha:   isLarge ? rand(0.30, 0.48)
                : isMed   ? rand(0.18, 0.32)
                :            rand(0.10, 0.22),
      phase:      rand(0, Math.PI * 2),
      speed:      isLarge ? rand(0.020, 0.035)
                : isMed   ? rand(0.012, 0.022)
                :            rand(0.007, 0.015),
      dx:         isPulse ? rand(-0.03, 0.03) : rand(-0.15, 0.15) * (isLarge ? 0.6 : 1),
      dy:         isPulse ? rand(-0.03, 0.03) : rand(-0.825, -0.12) * (isLarge ? 0.5 : 1),
      isPulse,
      scalePhase: rand(0, Math.PI * 2),
      scaleSpeed: isPulse ? rand(0.030, 0.060) : 0,
      scaleAmp:   isPulse ? rand(0.5, 0.85)   : 0,
      /* 색상 범위 유지: 시안 → 블루 → 바이올렛 */
      hue:        rand(160, 280),
      isLarge, isMed,
    };
  }

  function initParticles() {
    const count = isMobile() ? 40 : 90; 
    particles = Array.from({ length: count }, createParticle);
  }

  function drawParticle(p) {
    const scaleMod = p.isPulse ? (1 + p.scaleAmp * Math.sin(p.scalePhase)) : 1;
    const glowR = p.r * (p.isLarge ? 2.8 : 2.2) * scaleMod;
    ctx.save();
    const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glowR);
    grd.addColorStop(0,    `hsla(${p.hue}, 90%, 88%, ${p.alpha})`);
    grd.addColorStop(0.4,  `hsla(${p.hue}, 90%, 75%, ${p.alpha * 0.5})`);
    grd.addColorStop(0.75, `hsla(${p.hue}, 90%, 62%, ${p.alpha * 0.18})`);
    grd.addColorStop(1,    `hsla(${p.hue}, 90%, 58%, 0)`);
    ctx.fillStyle = grd;
    ctx.beginPath();
    ctx.arc(p.x, p.y, glowR, 0, Math.PI * 2);
    ctx.fill();
    /* 대형 파티클 코어 — 밝기 낮춤 */
    if (p.isLarge) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * 0.4, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${p.hue}, 80%, 92%, ${Math.min(p.alpha * 0.9, 1)})`;
      ctx.fill();
    }
    ctx.restore();
  }

  function tick() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      p.phase += p.speed;
      if (p.isPulse) p.scalePhase += p.scaleSpeed;
      p.alpha  = p.maxAlpha * (0.5 + 0.5 * Math.sin(p.phase));
      p.x += p.dx;
      p.y += p.dy;
      if (p.isPulse) {
        if (p.x < 0 || p.x > W) p.dx *= -1;
        if (p.y < 0 || p.y > H) p.dy *= -1;
      } else if (p.y < -12 || p.x < -12 || p.x > W + 12) {
        Object.assign(p, createParticle(), { y: H + 12, alpha: 0 });
      }
      drawParticle(p);
    });
    requestAnimationFrame(tick);
  }

  window.addEventListener('resize', () => { resize(); initParticles(); });
  resize();
  initParticles();
  tick();
})();
