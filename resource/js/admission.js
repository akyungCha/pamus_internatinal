/* ── 입학 절차 섹션 페이드인 애니메이션 ─────────────────────── */
(function () {
  'use strict';

  const section   = document.getElementById('adm-step');
  if (!section) return;

  const title     = section.querySelector('.adm-title');
  const divider   = section.querySelector('.adm-divider');
  const sub       = section.querySelector('.adm-sub');
  const cards     = Array.from(section.querySelectorAll('.step-card'));

  let triggered = false;

  function triggerAnimations() {
    if (triggered) return;
    triggered = true;

    /* 헤더 텍스트 순서대로 페이드인 */
    if (title)   title.classList.add('is-visible');
    if (divider) setTimeout(function () { divider.classList.add('is-visible'); }, 200);
    if (sub)     setTimeout(function () { sub.classList.add('is-visible'); }, 400);

    /* 카드 왼쪽→오른쪽 순차 페이드인 (0.15s 간격) */
    cards.forEach(function (card, i) {
      setTimeout(function () { card.classList.add('is-visible'); }, 600 + i * 150);
    });
  }

  /* IntersectionObserver — 섹션이 뷰포트에 진입하면 실행 */
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) triggerAnimations();
    });
  }, { threshold: 0.15 });
  io.observe(section);

  /* MutationObserver — fp-wrapper transform 변경으로 섹션 진입 감지 */
  var fpWrapper   = document.getElementById('fp-wrapper');
  var sectionIdx  = Array.from(document.querySelectorAll('.fp-section')).indexOf(section);

  function activeIdx() {
    var m = fpWrapper ? fpWrapper.style.transform.match(/translateY\(\s*(-?[\d.]+)/) : null;
    return m ? Math.round(-parseFloat(m[1]) / window.innerHeight) : 0;
  }

  if (fpWrapper) {
    new MutationObserver(function () {
      if (activeIdx() === sectionIdx) triggerAnimations();
    }).observe(fpWrapper, { attributes: true, attributeFilter: ['style'] });
  }

  /* 페이지 최초 로드 시 첫 섹션이면 즉시 실행 */
  window.addEventListener('DOMContentLoaded', function () {
    if (sectionIdx === 0) triggerAnimations();
  });

})();

/* [브랜치 사이트 오픈 예정 알럿]
   브랜치별 사이트가 준비되기 전까지 클릭 시 안내 알럿 표시
   브랜치 사이트 오픈 시 href="#"을 실제 URL로 교체하면 자동 비활성화 */
document.querySelectorAll('.cta-primary[href="#"], .branch-link[href="#"]').forEach(function (el) {
  el.addEventListener('click', function (e) {
    e.preventDefault();
    alert('브랜치별 사이트는 곧 오픈 예정입니다 :)');
  });
});
