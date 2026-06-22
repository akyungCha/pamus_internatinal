/* ══════════════════════════════════════════════════════════════
   stella.js — 초등 Stella 페이지 전용 스크립트
   · GNB 햄버거 · 풀페이지 스크롤은 common.js에서 처리
══════════════════════════════════════════════════════════════ */

/* ── 섹션0 성장 로드맵: 다이어그램 및 라벨 페이드인 애니메이션 ── */
(function () {
  const section = document.getElementById('st-roadmap');
  if (!section) return;

  const header    = section.querySelector('.road-header');
  const galaxyWrap = section.querySelector('.road-galaxy-wrap');
  const labels = Array.from(section.querySelectorAll('.road-label'));
  let triggered = false;

  const observer = new IntersectionObserver(
    (entries) => {
      if (triggered || !entries[0].isIntersecting) return;
      triggered = true;

      // 1. 헤더 먼저 슬라이드업
      if (header) header.classList.add('is-visible');

      // 2. 갤럭시 다이어그램 페이드인 (헤더 후 300ms)
      setTimeout(() => {
        if (galaxyWrap) galaxyWrap.classList.add('is-visible');
      }, 300);

      // 3. 라벨 배열을 랜덤하게 섞기 (Fisher-Yates Shuffle)
      const shuffled = [...labels];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }

      // 4. 순차적으로 라벨 팝업 페이드인
      const GALAXY_DELAY = 600; // 600ms 딜레이 후
      const LABEL_INTERVAL = 120; // 120ms 간격으로 등장

      shuffled.forEach((label, idx) => {
        setTimeout(() => {
          label.classList.add('is-visible');
        }, GALAXY_DELAY + (idx * LABEL_INTERVAL));
      });

      // 5. 모든 라벨 페이드인이 끝날 즈음 하단 범례 박스 스르륵 페이드업
      const legend = section.querySelector('.road-legend');
      if (legend) {
        const legendDelay = GALAXY_DELAY + (shuffled.length * LABEL_INTERVAL) + 200;
        setTimeout(() => {
          legend.classList.add('is-visible');
        }, legendDelay);
      }

      observer.disconnect();
    },
    { threshold: 0.25 }
  );

  observer.observe(section);
})();

/* ── 섹션1 IB 융합트랙: 헤더 → 카드 순차 등장 애니메이션 ── */
(function () {
  const section = document.getElementById('st-ib');
  if (!section) return;

  const header = section.querySelector('.ib-track-header');
  const cols   = Array.from(section.querySelectorAll('.ib-col'));
  const plus1  = section.querySelector('.플러스-1');
  const plus2  = section.querySelector('.플러스-2');
  let triggered = false;

  const observer = new IntersectionObserver(
    (entries) => {
      if (triggered || !entries[0].isIntersecting) return;
      triggered = true;

      if (header) header.classList.add('is-visible');

      setTimeout(() => {
        if (cols[0]) cols[0].classList.add('is-visible');
      }, 300);

      setTimeout(() => {
        if (plus1)   plus1.classList.add('is-visible');
        if (cols[1]) cols[1].classList.add('is-visible');
      }, 600);

      setTimeout(() => {
        if (plus2)   plus2.classList.add('is-visible');
        if (cols[2]) cols[2].classList.add('is-visible');
      }, 900);

      observer.disconnect();
    },
    { threshold: 0.25 }
  );

  observer.observe(section);
})();

/* ── 섹션2 훈련메커니즘: 헤더 → 큐브 스텝 + 콘텐츠 행 세트 순차 애니메이션 ── */
(function () {
  const section = document.getElementById('st-training');
  if (!section) return;

  const header = section.querySelector('.tr-header');
  const sets = [
    { step: section.querySelector('.스텝1'), row: section.querySelector('.tr-row-1') },
    { step: section.querySelector('.스텝2'), row: section.querySelector('.tr-row-2') },
    { step: section.querySelector('.스텝3'), row: section.querySelector('.tr-row-3') },
    { step: section.querySelector('.스텝4'), row: section.querySelector('.tr-row-4') },
  ];

  const DELAYS = [300, 600, 900, 1200]; /* ms — 헤더(0ms) 후 세트1 → 세트4 순 */
  let triggered = false;

  const observer = new IntersectionObserver(
    (entries) => {
      if (triggered || !entries[0].isIntersecting) return;
      triggered = true;

      if (header) header.classList.add('is-visible');

      sets.forEach(({ step, row }, i) => {
        setTimeout(() => {
          if (step) step.classList.add('is-visible');
          if (row)  row.classList.add('is-visible');
        }, DELAYS[i]);
      });

      observer.disconnect();
    },
    { threshold: 0.25 }
  );

  observer.observe(section);
})();
