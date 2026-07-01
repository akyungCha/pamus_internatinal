/* ══════════════════════════════════════════════════════════════
   intro.js — 국제어학원 페이지 전용 스크립트
══════════════════════════════════════════════════════════════ */

/* ══════════════════════════════════════════════════════════════
   섹션1 i-LAB 히어로: 모바일 전용 진입 애니메이션
   C. 콘텐츠 요소 순차 페이드인 (배지→로고→서브→설명→버튼)
   D. 워터마크 스케일업 + shimmer 효과
══════════════════════════════════════════════════════════════ */
(function () {
  if (window.innerWidth > 768) return; /* 모바일 전용 */

  const section = document.getElementById('in-hero');
  if (!section) return;

  const watermark = section.querySelector('.hero-watermark');
  const items = [
    section.querySelector('.hero-badge'),
    section.querySelector('.hero-logo'),
    section.querySelector('.hero-sub'),
    section.querySelector('.hero-desc'),
    section.querySelector('.hero-btn'),
  ];

  const ITEM_START = 200;  /* 워터마크 등장 후 첫 콘텐츠 시작 ms */
  const ITEM_STEP  = 150;  /* 요소 간 간격 ms */
  const SHIMMER_AT = 800;  /* 워터마크 shimmer 시작 시점 ms */

  let triggered = false;

  const observer = new IntersectionObserver((entries) => {
    if (triggered || !entries[0].isIntersecting) return;
    triggered = true;

    /* D-1. 워터마크 스케일업 */
    if (watermark) watermark.classList.add('wm-visible');

    /* D-2. shimmer — 스케일업 완료 즈음 */
    if (watermark) {
      setTimeout(() => watermark.classList.add('wm-shimmer'), SHIMMER_AT);
    }

    /* C. 콘텐츠 요소 순차 페이드인 */
    items.forEach((el, i) => {
      if (!el) return;
      setTimeout(() => el.classList.add('hero-anim-in'), ITEM_START + i * ITEM_STEP);
    });

    observer.disconnect();
  }, { threshold: 0.15 });

  observer.observe(section);
})();

/* ── 섹션2 설득하는 영어: 더보기 토글 (모바일 전용) ── */
(function () {
  const collapsible = document.querySelector('.persuasive-body-collapsible');
  const btn = document.querySelector('.persuasive-more-btn');
  if (!collapsible || !btn) return;

  function getCollapsedHeight() {
    return window.innerWidth <= 480 ? '42px' : '56px';
  }

  btn.addEventListener('click', function () {
    const isExpanded = collapsible.classList.contains('expanded');
    if (isExpanded) {
      collapsible.style.maxHeight = getCollapsedHeight();
      collapsible.classList.remove('expanded');
      btn.textContent = '더보기 ▾';
    } else {
      collapsible.style.maxHeight = collapsible.scrollHeight + 'px';
      collapsible.classList.add('expanded');
      btn.textContent = '접기 ▴';
    }
  });

  /* 데스크탑으로 리사이즈 시 상태 초기화 */
  window.addEventListener('resize', function () {
    if (window.innerWidth > 768) {
      collapsible.style.maxHeight = '';
      collapsible.classList.remove('expanded');
      btn.textContent = '더보기 ▾';
    }
  });
})();

/* ── 섹션3 핵심 역량: 카드 순차 페이드업 애니메이션 ── */
(function () {
  const section = document.getElementById('in-core');
  if (!section) return;

  const cards = [
    section.querySelector('.역량-카드1'),
    section.querySelector('.역량-카드2'),
    section.querySelector('.역량-카드3'),
    section.querySelector('.역량-카드4'),
    section.querySelector('.역량-카드5'),
  ];

  let triggered = false;

  const observer = new IntersectionObserver(
    (entries) => {
      if (triggered || !entries[0].isIntersecting) return;
      triggered = true;

      cards.forEach((el) => {
        if (!el) return;
        el.classList.add('is-visible');
      });

      observer.disconnect();
    },
    { threshold: 0.2 }
  );

  observer.observe(section);
})();

/* ── 섹션5 학습시스템: 요소 순차 페이드인 ── */
(function () {
  const section = document.getElementById('in-system');
  if (!section) return;

  const els = [
    section.querySelector('.tct-book'),        // delay 0.0s (CSS)
    section.querySelector('.tct-book-light'),   // delay 0.4s (CSS)
    section.querySelector('.tct-코칭'),         // delay 0.8s (CSS)
    section.querySelector('.tct-티칭'),         // delay 1.2s (CSS)
    section.querySelector('.tct-트레이닝'),     // delay 1.6s (CSS)
    section.querySelector('.tct-badge'),        // delay 2.0s (CSS)
  ];

  /* 하단 바 박스 3개 — 다이어그램 완전 등장 후 순차 페이드인
     웹: 좌→우(translateX), 모바일 세로스택: 위→아래(translateY) — CSS로 구분 */
  const bars = Array.from(section.querySelectorAll('.tct-bar-box'));
  const BAR_START = 2800;   /* tct-badge delay(2.0s) + transition(0.8s) 완료 시점 */
  const BAR_STEP  = 200;    /* 박스 간 간격 ms */

  let triggered = false;

  const observer = new IntersectionObserver(
    (entries) => {
      if (triggered || !entries[0].isIntersecting) return;
      triggered = true;

      els.forEach((el) => { if (el) el.classList.add('is-visible'); });

      bars.forEach((bar, i) => {
        setTimeout(() => bar.classList.add('bar-visible'), BAR_START + i * BAR_STEP);
      });

      observer.disconnect();
    },
    { threshold: 0.2 }
  );

  observer.observe(section);
})();

/* ── 섹션4 핵심 가치: 원 순차 페이드업 애니메이션 ── */
(function () {
  const section = document.getElementById('in-values');
  if (!section) return;

  const circles = [
    section.querySelector('.원-공감'),
    section.querySelector('.원-성취'),
    section.querySelector('.원-재미'),
  ];

  let triggered = false;

  const observer = new IntersectionObserver(
    (entries) => {
      if (triggered || !entries[0].isIntersecting) return;
      triggered = true;

      circles.forEach((el) => {
        if (!el) return;
        el.classList.add('is-visible');
      });

      observer.disconnect();
    },
    { threshold: 0.2 }
  );

  observer.observe(section);
})();

/* ── shimmer 트리거 공통 헬퍼: 뷰포트 진입 시 1회 shimmer-play 부착 ── */
function attachShimmer(selector, threshold) {
  const el = document.querySelector(selector);
  if (!el) return;
  new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('shimmer-play');
      obs.unobserve(entry.target);
    });
  }, { threshold: threshold || 0.3 }).observe(el);
}

attachShimmer('.pe-title');       /* 섹션2: 설득하는 영어 */
attachShimmer('.cc-title');       /* 섹션3: 핵심 역량     */
attachShimmer('.cv-title');       /* 섹션4: 핵심 가치     */
attachShimmer('.tct-title-en');   /* 섹션5: 학습시스템    */
