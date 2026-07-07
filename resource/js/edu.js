/* ══════════════════════════════════════════════════════════════
   edu.js — 에듀마스터 페이지 전용 스크립트
══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {

    /* ── 인터뷰 모달 (edu-detail.html) ───────────────────────── */
    const modal      = document.getElementById('interview-modal');
    const modalClose = document.getElementById('modal-close');

    if (modal) {
      const closeModal = () => {2
        modal.classList.remove('is-open');
        modal.setAttribute('aria-hidden', 'true');
      };

      document.querySelectorAll('.cta-interview').forEach(btn => {
        btn.addEventListener('click', () => {
          modal.classList.add('is-open');
          modal.setAttribute('aria-hidden', 'false');
        });
      });

      if (modalClose) modalClose.addEventListener('click', closeModal);

      modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
      });

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
      });
    }

  });
})();

/* ── 에듀마스터 타이틀 shimmer — 페이지 로드 시 1회 재생 후 원복 ── */
(function () {
  function play() {
    const title = document.querySelector('.edu-title');
    if (!title) return;
    title.classList.remove('shimmer-play');
    void title.offsetWidth; /* reflow 강제 → 확실히 재생 */
    title.classList.add('shimmer-play');
    title.addEventListener('animationend', () => {
      title.classList.remove('shimmer-play'); /* 끝나면 원래 라임→화이트 그라디언트로 복귀 */
    }, { once: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setTimeout(play, 150));
  } else {
    setTimeout(play, 150);
  }
})();

/* ── 프로필 카드 스태거 페이드인 + 서브타이틀 — 페이지 로드 시 1회 ── */
(function () {
  function run() {
    const cards = Array.from(document.querySelectorAll('.pro-card'));
    const sub   = document.querySelector('.edu-sub');
    const STAGGER = 150; /* ms — 카드 간 딜레이 (데스크탑) */
    const isMobile = window.matchMedia('(max-width: 768px)').matches;

    if (isMobile) {
      /* 모바일(≤768px): 2열 그리드 — 스크롤 따라 행당 2개씩 페이드인 */
      const io = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('anim-visible');
          obs.unobserve(entry.target);
        });
      }, { threshold: 0.05, rootMargin: '0px 0px 50px 0px' });

      cards.forEach(card => {
        card.classList.add('anim-card'); /* HTML에 이미 있어도 무해 */
        io.observe(card);                /* 뷰에 들어오면 페이드인 (한 행=2개 동시) */
      });

      /* 서브타이틀은 상단에 있으므로 로드 시 바로 페이드인 */
      if (sub) setTimeout(() => sub.classList.add('anim-visible'), 200);

    } else {
      /* 데스크탑(>768px): 로드 시 1회 스태거 페이드인 (기존 동작) */
      cards.forEach((card, i) => {
        card.classList.add('anim-card');
        setTimeout(() => card.classList.add('anim-visible'), i * STAGGER);
      });
      if (sub) {
        setTimeout(() => sub.classList.add('anim-visible'), cards.length * STAGGER + 200);
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }
})();
