/* ================================================================
   ceo.js  —  풀페이지 스크롤 로직 (16 섹션)
   ================================================================ */

(function () {
  'use strict';

  const container = document.getElementById('fp-container');
  const sections  = document.querySelectorAll('.fp-section');
  const TOTAL     = sections.length; // 총 섹션 수: 16

  let current    = 0;
  let isAnimating = false;

  /* ── .sec1-title2 시머 트리거 ── */
  function triggerShimmer(section) {
    var title = section ? section.querySelector('.sec1-title2') : null;
    if (!title) return;
    /* 재시작: 클래스를 뗐다가 다시 붙여 애니메이션을 처음부터 재생 */
    title.classList.remove('shimmer-play');
    void title.offsetWidth; /* reflow로 애니메이션 리셋 */
    title.classList.add('shimmer-play');
  }

  /* ── 섹션 이동 함수 ── */
  function goTo(index) {
    if (index < 0 || index >= TOTAL || isAnimating) return;
    current     = index;
    isAnimating = true;
    container.style.transform = `translateY(${-current * 100}vh)`;
    // CSS 트랜지션 시간(850ms) 동안 추가 입력 차단
    setTimeout(function () {
      isAnimating = false;
      triggerShimmer(sections[current]); /* 이동 완료 후 해당 섹션 시머 실행 */
    }, 900);
  }

  /* ── 마우스 휠 ── */
  window.addEventListener('wheel', function (e) {
    if (isAnimating) return;
    if (e.deltaY > 0) {
      goTo(current + 1);
    } else if (e.deltaY < 0) {
      goTo(current - 1);
    }
  }, { passive: true });

  /* ── 키보드 (방향키 / Page Up / Page Down) ── */
  window.addEventListener('keydown', function (e) {
    if (isAnimating) return;
    if (e.key === 'ArrowDown' || e.key === 'PageDown') {
      e.preventDefault();
      goTo(current + 1);
    } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
      e.preventDefault();
      goTo(current - 1);
    }
  });

  /* ── 터치 스와이프 (위/아래) ── */
  var touchStartY = 0;

  window.addEventListener('touchstart', function (e) {
    touchStartY = e.touches[0].clientY;
  }, { passive: true });

  window.addEventListener('touchend', function (e) {
    if (isAnimating) return;
    var delta = touchStartY - e.changedTouches[0].clientY;
    if (Math.abs(delta) < 50) return; // 미세한 터치는 무시
    if (delta > 0) {
      goTo(current + 1);
    } else {
      goTo(current - 1);
    }
  }, { passive: true });

  /* ── 섹션 01: 히어로 이미지 페이드인 (페이지 로드 시) ── */
  var heroImg = document.querySelector('.sec1-image img');
  if (heroImg) {
    function applyLoaded() {
      heroImg.classList.add('loaded');
    }
    if (heroImg.complete && heroImg.naturalWidth > 0) {
      // 이미지가 캐시된 경우 — 트랜지션이 동작하도록 다음 프레임에서 실행
      requestAnimationFrame(applyLoaded);
    } else {
      heroImg.addEventListener('load', applyLoaded);
    }
  }

  /* ── 인터뷰 영상 모달 ── */
  var modal     = document.getElementById('interview-modal');
  var modalVideo = modal ? modal.querySelector('.interview-modal__video') : null;
  var backdrop  = modal ? modal.querySelector('.interview-modal__backdrop') : null;
  var closeBtn  = modal ? modal.querySelector('.interview-modal__close') : null;

  function openModal() {
    if (!modal) return;
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    if (modalVideo) modalVideo.play();
  }

  function closeModal() {
    if (!modal) return;
    modal.hidden = true;
    document.body.style.overflow = '';
    if (modalVideo) {
      modalVideo.pause();
      modalVideo.currentTime = 0;
    }
  }

  /* 썸네일 + 모바일 버튼 클릭 → 모달 열기 */
  document.querySelectorAll('[data-modal="interview-modal"]').forEach(function (trigger) {
    trigger.addEventListener('click', openModal);
  });

  /* 배경 클릭 → 모달 닫기 */
  if (backdrop) backdrop.addEventListener('click', closeModal);

  /* 닫기 버튼 → 모달 닫기 */
  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  /* ESC 키 → 모달 닫기 */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && modal && !modal.hidden) closeModal();
  });

  /* ── 페이지 로드 시 첫 번째 섹션 시머 실행 ── */
  /* 브라우저가 초기 상태를 렌더링한 뒤 시작 (common.js 패턴과 동일) */
  requestAnimationFrame(function () {
    setTimeout(function () {
      triggerShimmer(sections[0]);
    }, 120);
  });

})();
