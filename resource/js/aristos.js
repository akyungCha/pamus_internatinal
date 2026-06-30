/* ══════════════════════════════════════════════════════════════
   aristos.js — 중등 Aristos 페이지 전용 스크립트
══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

 

  /* ── 섹션 1 모바일 탭 전환 ──────────────────────────────── */
  function initSec1Tabs() {
    const tabs = Array.from(document.querySelectorAll('.mob-tab'));
    const cards = {
      'card-img-1': document.querySelector('.card-img-1'),
      'card-img-2': document.querySelector('.card-img-2'),
      'card-img-3': document.querySelector('.card-img-3'),
    };

    function showCard(targetKey) {
      /* 모든 카드 숨김 */
      Object.values(cards).forEach(c => {
        if (!c) return;
        c.classList.remove('mob-active');
      });

      /* 대상 카드 페이드인 */
      const target = cards[targetKey];
      if (!target) return;
      requestAnimationFrame(() => {
        target.classList.add('mob-active');
      });
    }

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        showCard(tab.dataset.target);
      });
    });

    /* 기본: 첫 번째 카드 활성화 */
    showCard('card-img-1');
  }

  /* ── 섹션 2 진입 애니메이션 (IntersectionObserver) ──────── */
  function initSec2() {
    const cards = [
      document.querySelector('.card-step1'),
      document.querySelector('.card-step2'),
      document.querySelector('.card-step3'),
    ];

    const delays = [0, 300, 600]; /* ms */

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const idx = cards.indexOf(entry.target);
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delays[idx] ?? 0);
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.2 });

    cards.forEach(card => { if (card) observer.observe(card); });
  }

  /* ── 섹션 1 진입 애니메이션 ──────────────────────────────── */
  function playSec1() {
    const quote = document.querySelector('.cur-quote');
    const logo = document.querySelector('.cur-logo');
    const line = document.querySelector('.cur-line');
    const cards = [
      document.querySelector('.card-img-1'),
      document.querySelector('.card-img-2'),
      document.querySelector('.card-img-3'),
    ];

    if (!line) return;

    /* 브랜딩 순차 페이드인 */
    if (quote) setTimeout(() => quote.classList.add('visible'), 0);
    if (logo) setTimeout(() => logo.classList.add('visible'), 350);

    /* 브랜딩 후 라인 그리기 시작 */
    setTimeout(() => {
      requestAnimationFrame(() => line.classList.add('drawn'));
    }, 700);

    /* 라인 완료 후 카드 순차 페이드인 */
    cards.forEach((card, i) => {
      if (!card) return;
      setTimeout(() => {
        card.classList.add('visible');
      }, 700 + 2200 + i * 450);
    });
  }

  /* ── 섹션 3 별빛 트윙클 ──────────────────────────────────── */
  function initTctStars() {
    const sec = document.getElementById('sec-tct');
    if (!sec) return;

    const count = Math.floor(Math.random() * 21) + 40; // 
    const colors = ['#ffffff', '#ffffff', '#a0f0ff', '#c8f0ff', '#7dd8ff'];

    for (let i = 0; i < count; i++) {
      const star = document.createElement('span');
      star.className = 'tct-star';

      const size = (Math.random() * 4 + 1.5).toFixed(1);      // 1.5~5.5px
      const opacity = (Math.random() * 0.6 + 0.4).toFixed(2);   // 0.4~1.0
      const dur = (Math.random() * 3 + 1.2).toFixed(2);      // 1.2~4.2s
      const delay = -(Math.random() * 5).toFixed(2);            // 0~-5s
      const color = colors[Math.floor(Math.random() * colors.length)];
      const top = (Math.random() * 100).toFixed(2);
      const left = (Math.random() * 100).toFixed(2);
      const glow1 = (size * 3).toFixed(1);
      const glow2 = (size * 6).toFixed(1);

      star.style.cssText = [
        `width:${size}px`, `height:${size}px`,
        `top:${top}%`, `left:${left}%`,
        `background:${color}`,
        `box-shadow:0 0 ${glow1}px ${color},0 0 ${glow2}px ${color}88,0 0 ${glow2 * 1.5}px ${color}33`,
        `--star-opacity:${opacity}`,
        `--star-dur:${dur}s`,
        `--star-delay:${delay}s`,
      ].join(';');

      sec.appendChild(star);
    }
  }

  /* ── 섹션 3 애니메이션 ────────────────────────────────────── */
  function initSec3() {
    const headerEls = [
      document.querySelector('.tct-title'),
      document.querySelector('.tct-hr'),
      document.querySelector('.tct-sub'),
    ];
    const mid = document.querySelector('.tct-mid');
    const headerDelays = [0, 200, 400];
    const midDelay = 1000;

    /* 시스템 테이블 요소 */
    const labelKyogwa = document.querySelector('.label-kyogwa');
    const table1 = document.querySelector('.sys-table-1');
    const table2 = document.querySelector('.sys-table-2');
    const labelSimhwa = document.querySelector('.label-simhwa');
    const table3 = document.querySelector('.sys-table-3');
    const sysBase = midDelay + 800; /* mid 등장 완료 후 */

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        /* 헤더 요소 순차 페이드인 */
        headerEls.forEach((el, i) => {
          if (!el) return;
          setTimeout(() => el.classList.add('visible'), headerDelays[i]);
        });

        /* 다이아몬드 + 설명 영역 */
        if (mid) setTimeout(() => mid.classList.add('visible'), midDelay);

        /* 시스템 테이블 순차 등장 */
        [labelKyogwa, table1].forEach(el => {
          if (el) setTimeout(() => el.classList.add('visible'), sysBase);
        });
        if (table2) setTimeout(() => table2.classList.add('visible'), sysBase + 200);
        [labelSimhwa, table3].forEach(el => {
          if (el) setTimeout(() => el.classList.add('visible'), sysBase + 400);
        });

        /* 별빛 트윙클 — 섹션 진입 즉시 */
        initTctStars();

        observer.unobserve(entry.target);
      });
    }, { threshold: 0.3 });

    const sec = document.getElementById('sec-tct');
    if (sec) observer.observe(sec);
  }

  /* ── 섹션 4 애니메이션 ────────────────────────────────────── */
  function initSec4() {
    const head = document.querySelector('.summit-head');
    const trophy = document.querySelector('.trophy');
    const cards = [
      document.querySelector('.s-card-1'),
      document.querySelector('.s-card-2'),
      document.querySelector('.s-card-3'),
      document.querySelector('.s-card-4'),
    ];

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        /* 헤더 */
        if (head) setTimeout(() => head.classList.add('visible'), 0);

        /* 트로피 */
        if (trophy) setTimeout(() => trophy.classList.add('visible'), 400);

        /* 카드: 좌상→우상→좌하→우하 순 */
        cards.forEach((card, i) => {
          if (card) setTimeout(() => card.classList.add('visible'), 1200 + i * 250);
        });

        observer.unobserve(entry.target);
      });
    }, { threshold: 0.3 });

    const sec = document.getElementById('sec-summit');
    if (sec) observer.observe(sec);
  }

  /* ── 섹션 4 트로피 글로우 ────────────────────────────────── */
  function initSummitGlow() {
    const sec = document.getElementById('sec-summit');
    const trophy = document.querySelector('.trophy');
    if (!sec || !trophy) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;


        setTimeout(() => trophy.classList.add('glowing'), 1200);

        observer.unobserve(entry.target);
      });
    }, { threshold: 0.3 });

    observer.observe(sec);
  }

  document.addEventListener('DOMContentLoaded', () => {
    playSec1();
    initSec1Tabs();
    initSec2();
    initSec3();
    initSec4();
    initSummitGlow();
  });
})();
