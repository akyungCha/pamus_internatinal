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
