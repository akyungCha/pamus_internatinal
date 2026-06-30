/* ══════════════════════════════════════════════════════════════
   stella.js — 초등 Stella 페이지
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

/* ── 타이틀 shimmer 트리거 (index.html .literacy-title과 동일 효과) ──
   .road-title / .ib-track-title / .tr-title 이 화면에 들어올 때마다 재생.
   효과 CSS는 stella.css에, 키프레임은 main_style.css(literacy-shimmer)에 정의됨. */
(function () {
  document.querySelectorAll('.road-title, .ib-track-title, .tr-title').forEach(function (title) {
    function triggerShimmer() {
      title.classList.remove('shimmer-play');
      void title.offsetWidth; /* reflow 강제 → 재진입 시 애니메이션 재시작 */
      title.classList.add('shimmer-play');
    }

    new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) triggerShimmer();
      });
    }, { threshold: 0.15 }).observe(title);
  });
})();

/* ── Training System 모바일 탭 슬라이더 (≤768px 전용) ──
   탭바·도트를 모바일에서만 생성/제거(matchMedia)하여 데스크탑 DOM은 그대로 유지.
   탭/도트 클릭 + 콘텐츠 좌우 스와이프(40px)로 스텝 전환. */
(function () {
  const section = document.getElementById('st-training');
  if (!section) return;

  const body  = section.querySelector('.tr-body');
  const pairs = Array.from(section.querySelectorAll('.tr-pair')); // DOM 순서: 04, 03, 02, 01
  if (!body || pairs.length === 0) return;

  /* 표시 순서 바꿈 (왼→오): 01 → 02 → 03 → 04 */
  const ORDER  = [3, 2, 1, 0];
  const LABELS = ['01 입력과 반응', '02 구조와 논리', '03 문해와 통찰', '04 최상위 산출'];
  let tabbar = null;
  let dots   = null;
  let active = 0;   // 표시 위치(0=01 … 3=04)
  let touchX = 0;
  let touchY = 0;

  function setActive(pos) {
    active = (pos + ORDER.length) % ORDER.length;
    pairs.forEach((p, idx) => p.classList.toggle('is-active', idx === ORDER[active]));
    if (tabbar) Array.from(tabbar.children).forEach((t, i) => t.classList.toggle('is-active', i === active));
    if (dots)   Array.from(dots.children).forEach((d, i) => d.classList.toggle('is-active', i === active));
  }

  function onTouchStart(e) {
    touchX = e.touches[0].clientX;
    touchY = e.touches[0].clientY;
  }
  function onTouchEnd(e) {
    const dx = e.changedTouches[0].clientX - touchX;
    const dy = e.changedTouches[0].clientY - touchY;
    /* 가로 스와이프가 우세하고 40px 이상일 때만 전환 (세로 섹션 이동과 비충돌) */
    if (Math.abs(dx) < 40 || Math.abs(dx) <= Math.abs(dy)) return;
    setActive(active + (dx < 0 ? 1 : -1));
  }

  function build() {
    if (tabbar) return;

    tabbar = document.createElement('div');
    tabbar.className = 'tr-tabbar';
    tabbar.setAttribute('role', 'tablist');
    LABELS.forEach((label, idx) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'tr-tab';
      b.textContent = label;
      b.addEventListener('click', () => setActive(idx));
      tabbar.appendChild(b);
    });

    dots = document.createElement('div');
    dots.className = 'tr-dots';
    pairs.forEach((_, idx) => {
      const d = document.createElement('button');
      d.type = 'button';
      d.className = 'tr-dot';
      d.setAttribute('aria-label', LABELS[idx] + ' 스텝으로 이동');
      d.addEventListener('click', () => setActive(idx));
      dots.appendChild(d);
    });

    body.insertBefore(tabbar, body.firstChild);
    body.appendChild(dots);
    body.addEventListener('touchstart', onTouchStart, { passive: true });
    body.addEventListener('touchend', onTouchEnd, { passive: true });

    section.classList.add('tr-tabmode');
    setActive(active);
  }

  function teardown() {
    if (!tabbar) return;
    tabbar.remove();
    dots.remove();
    tabbar = null;
    dots = null;
    body.removeEventListener('touchstart', onTouchStart);
    body.removeEventListener('touchend', onTouchEnd);
    section.classList.remove('tr-tabmode');
    pairs.forEach(p => p.classList.remove('is-active'));
  }

  const mq = window.matchMedia('(max-width: 768px)');
  function apply() { mq.matches ? build() : teardown(); }

  if (mq.addEventListener) mq.addEventListener('change', apply);
  else if (mq.addListener) mq.addListener(apply); /* 구형 브라우저 폴백 */
  apply();
})();

/* ── Training System 모바일: 탭 바 ↔ 콘텐츠 사이 큐브 이미지 + 순차 페이드인 ──
   기존 탭 슬라이더(setActive 등)는 수정하지 않고, .tr-pair 의 .is-active 변화를
   MutationObserver로 감지해 큐브 → 패널 순서로 페이드인을 트리거한다. */
(function () {
  const section = document.getElementById('st-training');
  if (!section) return;

  const body  = section.querySelector('.tr-body');
  const pairs = Array.from(section.querySelectorAll('.tr-pair'));
  if (!body || pairs.length === 0) return;

  let cube = null;
  let cubeImg = null;
  let lastActive = null;

  function activePair() {
    return pairs.find(p => p.classList.contains('is-active')) || null;
  }
  function cubeSrcOf(pair) {
    const img = pair && pair.querySelector('.tr-cube img');
    return img ? img.getAttribute('src') : '';
  }

  /* 큐브 → 패널 순차 페이드인. delay(ms) 후 .anim-in 부착 (큐브 0ms, 패널은 CSS에서 0.15s 추가) */
  function playSequence(pair, delay) {
    if (!cube || !pair) return;

    const src = cubeSrcOf(pair);
    if (src) cubeImg.setAttribute('src', src);

    /* 현재 큐브·패널에서 즉시 anim-in 제거 후 시작 상태로 리셋 */
    cube.classList.remove('anim-in');
    pairs.forEach(p => p.classList.remove('tr-mob-panel', 'anim-in'));
    pair.classList.add('tr-mob-panel');
    void pair.offsetWidth; /* reflow 강제 → 재진입 시에도 트랜지션 재생 */

    setTimeout(() => {
      if (!cube) return;
      cube.classList.add('anim-in');
      pair.classList.add('anim-in');
    }, delay);
  }

  function buildCube() {
    if (cube) return;
    cube = document.createElement('div');
    cube.className = 'tr-mob-cube';
    cubeImg = document.createElement('img');
    cubeImg.alt = '';
    cube.appendChild(cubeImg);

    /* 탭 바 바로 아래(콘텐츠 패널 위)에 삽입 */
    const tabbar = body.querySelector('.tr-tabbar');
    if (tabbar) tabbar.insertAdjacentElement('afterend', cube);
    else body.insertBefore(cube, body.firstChild);

    lastActive = activePair();
    playSequence(activePair(), 50); /* 로드 시 50ms 후 트리거 */
  }

  function removeCube() {
    if (cube) { cube.remove(); cube = null; cubeImg = null; }
    pairs.forEach(p => p.classList.remove('tr-mob-panel', 'anim-in'));
    lastActive = null;
  }

  /* 탭 전환(= 활성 .tr-pair 변경) 감지 → 시퀀스 재생 */
  const observer = new MutationObserver(() => {
    if (!cube) return;
    const current = activePair();
    if (!current || current === lastActive) return; /* 실제로 바뀐 경우만 (자기 클래스 변경 무시) */
    lastActive = current;
    playSequence(current, 20); /* 탭 전환 시 20ms 후 트리거 */
  });
  pairs.forEach(p => observer.observe(p, { attributes: true, attributeFilter: ['class'] }));

  const mq = window.matchMedia('(max-width: 768px)');
  function apply() { mq.matches ? buildCube() : removeCube(); }
  if (mq.addEventListener) mq.addEventListener('change', apply);
  else if (mq.addListener) mq.addListener(apply); /* 구형 브라우저 폴백 */
  apply();
})();
