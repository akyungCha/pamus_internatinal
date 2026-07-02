/* ══════════════════════════════════════════════════════════════
   edu-detail.js — 브랜치 세부 페이지 전용 (원스크롤 풀스크린)
══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {

    /* ── 섹션 목록 ───────────────────────────────────────────── */
    const sections = Array.from(document.querySelectorAll('.detail-section'));
    const total    = sections.length;
    let currentIndex = 0;
    let isScrolling  = false;

    /* ── 섹션 이동 ───────────────────────────────────────────── */
    function goToSection(index) {
      if (index < 0 || index >= total || isScrolling) return;

      currentIndex = index;
      sections[currentIndex].scrollIntoView({ behavior: 'smooth', block: 'start' });
      updateDots();

      isScrolling = true;
      setTimeout(() => { isScrolling = false; }, 800);
    }

    /* ── 마우스 휠 (쓰로틀링) ────────────────────────────────── */
    window.addEventListener('wheel', (e) => {
      e.preventDefault();
      if (isScrolling) return;
      goToSection(currentIndex + (e.deltaY > 0 ? 1 : -1));
    }, { passive: false });

    /* ── 터치 스와이프 ───────────────────────────────────────── */
    let touchStartY = 0;

    window.addEventListener('touchstart', (e) => {
      touchStartY = e.touches[0].clientY;
    }, { passive: true });

    /* touchmove 기본 스크롤 차단 — 스와이프가 네이티브 스크롤과 겹치지 않도록 */
    window.addEventListener('touchmove', (e) => {
      e.preventDefault();
    }, { passive: false });

    window.addEventListener('touchend', (e) => {
      if (isScrolling) return;
      const delta = touchStartY - e.changedTouches[0].clientY;
      if (Math.abs(delta) < 50) return;          // 50px 미만은 무시
      goToSection(currentIndex + (delta > 0 ? 1 : -1));
    }, { passive: true });

    /* ── 키보드 (ArrowDown / ArrowUp / PageDown / PageUp) ────── */
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        e.preventDefault();
        goToSection(currentIndex + 1);
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        goToSection(currentIndex - 1);
      }
    });

    /* ── 점 네비게이션 생성 ──────────────────────────────────── */
    const dotNav = document.createElement('nav');
    dotNav.id = 'section-dots';
    dotNav.setAttribute('aria-label', '섹션 네비게이션');

    sections.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'section-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', `섹션 ${i + 1}로 이동`);
      dot.addEventListener('click', () => goToSection(i));
      dotNav.appendChild(dot);
    });

    document.body.appendChild(dotNav);

    function updateDots() {
      dotNav.querySelectorAll('.section-dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === currentIndex);
      });
    }

    /* ── 인터뷰 모달 ─────────────────────────────────────────── */
    const modal      = document.getElementById('interview-modal');
    const modalClose = document.getElementById('modal-close');

    if (modal) {
      const closeModal = () => {
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

/* ── 모든 섹션 .main-title shimmer 트리거 (뷰포트 진입 시 1회) ──
   IntersectionObserver(threshold 0) → 뷰포트에 조금이라도 들어오면 지연 없이 즉시 .shimmer-active 부착 → unobserve. */
(function () {
  const titles = document.querySelectorAll('.detail-section .main-title');
  if (!titles.length) return;

  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('shimmer-active'); /* 지연 없이 즉시 발동 */
      obs.unobserve(entry.target); /* 각 타이틀마다 1회만 실행 */
    });
  }, { threshold: 0 });

  titles.forEach(title => io.observe(title));
})();
