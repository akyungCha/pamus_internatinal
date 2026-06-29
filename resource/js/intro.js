/* ══════════════════════════════════════════════════════════════
   intro.js — 국제어학원 페이지 전용 스크립트
   · GNB 햄버거 · 풀페이지 스크롤은 common.js 에서 처리
══════════════════════════════════════════════════════════════ */

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

  let triggered = false;

  const observer = new IntersectionObserver(
    (entries) => {
      if (triggered || !entries[0].isIntersecting) return;
      triggered = true;

      els.forEach((el) => { if (el) el.classList.add('is-visible'); });

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
