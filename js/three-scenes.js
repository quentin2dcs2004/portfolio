/**
 * Three.js core visuals for Quentin DA COSTA SOARES portfolio.
 * Scenes:
 *  1. Intro particle constellation + brand bloom
 *  2. Full-bleed hero / site background (mesh + field + scroll camera)
 *  3. About-section orbit wireframe
 */
import * as THREE from 'three';

const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const IS_MOBILE = window.matchMedia('(max-width: 768px)').matches;
const IS_ABOUT = document.body.classList.contains('page-about');
const IS_BOOK = document.body.classList.contains('page-book');
const IS_HOME = !IS_ABOUT && !IS_BOOK && !!document.getElementById('accueil');
const IS_SUBTLE = IS_ABOUT || IS_BOOK;

const COLORS = {
  bg: 0x05040c,
  mint: 0x9b5cff,      // violet pole (distinct)
  amber: 0x2f6bff,     // blue pole (distinct)
  steel: 0x5b8cff,
  ink: 0x0c0a18,
  enchant: 0x9b5cff,
  enchantCyan: 0x2f6bff,
};

function makeRenderer(canvas, { alpha = true, dprCap = 1.75 } = {}) {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: !IS_MOBILE,
    alpha,
    powerPreference: 'high-performance',
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, dprCap));
  renderer.setSize(canvas.clientWidth || window.innerWidth, canvas.clientHeight || window.innerHeight, false);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  return renderer;
}

function fit(renderer, camera, canvas) {
  const w = canvas.clientWidth || window.innerWidth;
  const h = canvas.clientHeight || window.innerHeight;
  renderer.setSize(w, h, false);
  camera.aspect = w / Math.max(h, 1);
  camera.updateProjectionMatrix();
}

/* ------------------------------------------------------------------ */
/* 1. Intro scene                                                      */
/* ------------------------------------------------------------------ */
function createIntroScene() {
  // Netflix CSS intro owns #intro-container; Three.js intro only if canvas present
  const root = document.getElementById('intro');
  const canvas = document.getElementById('intro-canvas');
  if (!root || !canvas) return { skip: () => {} };

  const renderer = makeRenderer(canvas, { alpha: false, dprCap: 1.5 });
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(COLORS.bg);
  scene.fog = new THREE.FogExp2(COLORS.bg, 0.045);

  const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 100);
  camera.position.set(0, 0, 8);

  const count = IS_MOBILE ? 900 : 2200;
  const positions = new Float32Array(count * 3);
  const seeds = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    const r = 1.2 + Math.random() * 4.5;
    const t = Math.random() * Math.PI * 2;
    const p = (Math.random() - 0.5) * Math.PI;
    positions[i * 3] = r * Math.cos(t) * Math.cos(p);
    positions[i * 3 + 1] = r * Math.sin(p);
    positions[i * 3 + 2] = r * Math.sin(t) * Math.cos(p);
    seeds[i] = Math.random();
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const mat = new THREE.PointsMaterial({
    size: IS_MOBILE ? 0.035 : 0.028,
    color: COLORS.mint,
    transparent: true,
    opacity: 0.85,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true,
  });
  const points = new THREE.Points(geo, mat);
  scene.add(points);

  const core = new THREE.Mesh(
    new THREE.IcosahedronGeometry(0.55, 1),
    new THREE.MeshBasicMaterial({
      color: COLORS.amber,
      wireframe: true,
      transparent: true,
      opacity: 0.55,
    })
  );
  scene.add(core);

  let running = true;
  let start = performance.now();
  const skipBtn = document.getElementById('intro-skip');

  function endIntro() {
    if (!running) return;
    running = false;
    root.classList.add('is-done');
    document.body.classList.add('intro-complete');
    setTimeout(() => {
      root.remove();
      renderer.dispose();
      geo.dispose();
      mat.dispose();
      core.geometry.dispose();
      core.material.dispose();
    }, 900);
    window.dispatchEvent(new CustomEvent('portfolio:intro-done'));
  }

  skipBtn?.addEventListener('click', endIntro);
  if (REDUCED) {
    endIntro();
    return { skip: endIntro };
  }

  const autoMs = 3200;
  const onKey = (e) => {
    if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      endIntro();
    }
  };
  window.addEventListener('keydown', onKey, { once: true });

  fit(renderer, camera, canvas);
  const onResize = () => fit(renderer, camera, canvas);
  window.addEventListener('resize', onResize);

  function tick(now) {
    if (!running) return;
    const t = (now - start) / 1000;
    const pos = geo.attributes.position.array;
    for (let i = 0; i < count; i++) {
      const s = seeds[i];
      const pull = Math.min(1, t * 0.55) * (0.4 + s * 0.6);
      pos[i * 3] *= 1 - pull * 0.012;
      pos[i * 3 + 1] *= 1 - pull * 0.012;
      pos[i * 3 + 2] *= 1 - pull * 0.012;
    }
    geo.attributes.position.needsUpdate = true;
    points.rotation.y = t * 0.22;
    points.rotation.x = Math.sin(t * 0.35) * 0.12;
    core.rotation.x = t * 0.7;
    core.rotation.y = t * 0.9;
    core.scale.setScalar(1 + Math.sin(t * 2.2) * 0.08);
    mat.opacity = 0.35 + Math.min(0.55, t * 0.25);
    camera.position.z = 8 - Math.min(2.2, t * 0.55);
    renderer.render(scene, camera);
    if (now - start > autoMs) endIntro();
    else requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);

  return { skip: endIntro };
}

/* ------------------------------------------------------------------ */
/* 2. Main background / hero scene                                     */
/* ------------------------------------------------------------------ */
function createHeroBackground() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;

  const renderer = makeRenderer(canvas, { alpha: true, dprCap: IS_MOBILE ? 1.25 : 1.75 });
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(IS_BOOK ? 0x0a0414 : COLORS.bg, IS_SUBTLE ? 0.08 : 0.028);

  const camera = new THREE.PerspectiveCamera(IS_HOME ? 48 : 50, 1, 0.1, 120);
  camera.position.set(0, 0.2, IS_SUBTLE ? 7.5 : (IS_HOME ? 5.6 : 6.2));

  scene.add(new THREE.AmbientLight(IS_BOOK ? 0x1a1438 : 0x141428, 1.2));
  const key = new THREE.PointLight(IS_BOOK ? COLORS.enchant : COLORS.mint, IS_HOME ? 3.1 : 2.4, 40);
  key.position.set(4, 3, 5);
  scene.add(key);
  const fill = new THREE.PointLight(IS_BOOK ? COLORS.enchantCyan : COLORS.amber, IS_HOME ? 2.1 : 1.6, 36);
  fill.position.set(-5, -2, 3);
  scene.add(fill);
  const rim = new THREE.DirectionalLight(IS_BOOK ? COLORS.enchant : COLORS.steel, 0.7);
  rim.position.set(-2, 4, -3);
  scene.add(rim);

  const group = new THREE.Group();
  scene.add(group);

  const knot = new THREE.Mesh(
    new THREE.TorusKnotGeometry(IS_HOME ? 1.25 : 1.05, IS_HOME ? 0.32 : 0.28, IS_MOBILE ? 100 : 200, IS_MOBILE ? 12 : 28),
    new THREE.MeshStandardMaterial({
      color: 0x141428,
      metalness: 0.72,
      roughness: 0.28,
      emissive: 0x1a1450,
      emissiveIntensity: IS_HOME ? 0.5 : 0.35,
    })
  );
  group.add(knot);

  const wire = new THREE.Mesh(
    new THREE.TorusKnotGeometry(IS_HOME ? 1.3 : 1.08, IS_HOME ? 0.34 : 0.3, IS_MOBILE ? 80 : 160, IS_MOBILE ? 10 : 20),
    new THREE.MeshBasicMaterial({
      color: COLORS.mint,
      wireframe: true,
      transparent: true,
      opacity: IS_HOME ? 0.32 : 0.22,
    })
  );
  group.add(wire);

  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(IS_HOME ? 2.7 : 2.35, 0.015, 16, IS_MOBILE ? 64 : 140),
    new THREE.MeshBasicMaterial({ color: COLORS.amber, transparent: true, opacity: 0.45 })
  );
  ring.rotation.x = Math.PI / 2.4;
  group.add(ring);

  const ring2 = ring.clone();
  ring2.rotation.x = Math.PI / 1.7;
  ring2.rotation.y = 0.6;
  ring2.material = ring.material.clone();
  ring2.material.color = new THREE.Color(COLORS.steel);
  ring2.material.opacity = 0.28;
  group.add(ring2);

  // Home: second outer ring + denser accents to wrap the portrait
  let ring3 = null;
  if (IS_HOME) {
    ring3 = new THREE.Mesh(
      new THREE.TorusGeometry(3.35, 0.01, 12, IS_MOBILE ? 48 : 100),
      new THREE.MeshBasicMaterial({ color: COLORS.mint, transparent: true, opacity: 0.18 })
    );
    ring3.rotation.x = Math.PI / 3.2;
    ring3.rotation.y = 0.4;
    group.add(ring3);
  }

  if (IS_SUBTLE) {
    group.scale.setScalar(IS_BOOK ? 0.85 : 0.72);
    group.position.set(IS_BOOK ? 0 : 1.4, 0.1, IS_BOOK ? -0.6 : -1.2);
  } else if (IS_HOME) {
    // Classic home: 3D sculpture frames the circular portrait from behind/right
    group.position.set(IS_MOBILE ? 0 : 0.35, 0.05, -1.1);
    group.scale.setScalar(IS_MOBILE ? 1.05 : 1.35);
  }

  if (IS_BOOK) {
    knot.material.emissive = new THREE.Color(COLORS.enchant);
    knot.material.emissiveIntensity = 0.55;
    wire.material.color = new THREE.Color(COLORS.enchantCyan);
    wire.material.opacity = 0.35;
    ring.material.color = new THREE.Color(COLORS.enchant);
    ring2.material.color = new THREE.Color(COLORS.enchantCyan);
  }

  const pCount = IS_SUBTLE
    ? (IS_MOBILE ? 400 : 900)
    : (IS_HOME ? (IS_MOBILE ? 1200 : 3600) : (IS_MOBILE ? 800 : 2400));
  const pPos = new Float32Array(pCount * 3);
  for (let i = 0; i < pCount; i++) {
    pPos[i * 3] = (Math.random() - 0.5) * 28;
    pPos[i * 3 + 1] = (Math.random() - 0.5) * 18;
    pPos[i * 3 + 2] = (Math.random() - 0.5) * 20 - 2;
  }
  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
  const pMat = new THREE.PointsMaterial({
    size: IS_MOBILE ? 0.04 : 0.03,
    color: IS_BOOK ? COLORS.enchant : COLORS.steel,
    transparent: true,
    opacity: IS_BOOK ? 0.7 : 0.55,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  const field = new THREE.Points(pGeo, pMat);
  scene.add(field);

  // Floating icosa “filament” accents
  const accents = [];
  const accentCount = IS_HOME ? (IS_MOBILE ? 6 : 12) : (IS_MOBILE ? 3 : 5);
  for (let i = 0; i < accentCount; i++) {
    const m = new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.1 + Math.random() * (IS_HOME ? 0.16 : 0.1), 0),
      new THREE.MeshStandardMaterial({
        color: i % 2 ? COLORS.amber : COLORS.mint,
        metalness: 0.4,
        roughness: 0.35,
        emissive: i % 2 ? COLORS.amber : COLORS.mint,
        emissiveIntensity: IS_HOME ? 0.4 : 0.25,
      })
    );
    m.position.set(
      (Math.random() - 0.5) * (IS_HOME ? 8 : 6),
      (Math.random() - 0.5) * (IS_HOME ? 4.5 : 3.5),
      (Math.random() - 0.5) * (IS_HOME ? 5 : 4)
    );
    group.add(m);
    accents.push({ mesh: m, speed: 0.4 + Math.random() * 0.8, phase: 0.2 + Math.random() * 0.4 });
  }

  let introBoost = IS_HOME ? 1 : 0;
  window.addEventListener('portfolio:intro-done', () => {
    introBoost = 1.35;
  }, { once: true });

  const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
  window.addEventListener('pointermove', (e) => {
    pointer.tx = (e.clientX / window.innerWidth) * 2 - 1;
    pointer.ty = -(e.clientY / window.innerHeight) * 2 + 1;
  });

  let scrollY = 0;
  window.addEventListener('scroll', () => {
    scrollY = window.scrollY || 0;
  }, { passive: true });

  fit(renderer, camera, canvas);
  window.addEventListener('resize', () => fit(renderer, camera, canvas));

  let visible = true;
  document.addEventListener('visibilitychange', () => {
    visible = document.visibilityState === 'visible';
  });

  const clock = new THREE.Clock();
  function animate() {
    requestAnimationFrame(animate);
    if (!visible) return;
    const t = clock.getElapsedTime();
    const damp = REDUCED ? 0 : 1;

    pointer.x += (pointer.tx - pointer.x) * 0.05;
    pointer.y += (pointer.ty - pointer.y) * 0.05;

    const scrollNorm = scrollY / Math.max(document.body.scrollHeight - window.innerHeight, 1);

    introBoost += (1 - introBoost) * 0.02;

    group.rotation.y = t * (IS_HOME ? 0.22 : 0.18) * damp + pointer.x * (IS_HOME ? 0.55 : 0.45);
    group.rotation.x = t * 0.08 * damp + pointer.y * (IS_HOME ? 0.34 : 0.28);
    ring.rotation.z = t * 0.25 * damp;
    ring2.rotation.z = -t * 0.18 * damp;
    wire.rotation.x = -t * 0.12 * damp;
    if (ring3) ring3.rotation.z = t * 0.12 * damp;

    accents.forEach((a, i) => {
      a.mesh.position.y += Math.sin(t * a.speed + i) * 0.0025 * damp;
      a.mesh.rotation.x = t * a.speed;
      a.mesh.rotation.y = t * a.phase;
    });

    field.rotation.y = t * 0.02 * damp + scrollNorm * 0.4;
    field.position.y = -scrollNorm * 2.5;

    const baseZ = IS_SUBTLE ? 7.5 : (IS_HOME ? 6.4 : 6.2);
    camera.position.x = pointer.x * (IS_HOME ? 0.4 : 0.35);
    camera.position.y = 0.15 + pointer.y * 0.18 - scrollNorm * (IS_SUBTLE ? 0.4 : 1.1);
    camera.position.z = (baseZ / introBoost) - scrollNorm * (IS_SUBTLE ? 0.6 : (IS_HOME ? 2.0 : 1.8));
    camera.lookAt(0, 0, 0);

    key.intensity = (IS_HOME ? 2.6 : 2.1) + Math.sin(t * 1.4) * 0.4;
    renderer.render(scene, camera);
  }
  animate();
}

/* ------------------------------------------------------------------ */
/* 3. Orbit canvas in about strip                                      */
/* ------------------------------------------------------------------ */
function createOrbitScene() {
  const canvas = document.getElementById('orbit-canvas');
  if (!canvas || REDUCED) return;

  const renderer = makeRenderer(canvas, { alpha: true, dprCap: 1.5 });
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 40);
  camera.position.set(0, 0.4, 4.2);

  scene.add(new THREE.AmbientLight(0xb8c4ff, 0.35));
  const light = new THREE.PointLight(COLORS.mint, 2, 20);
  light.position.set(2, 2, 3);
  scene.add(light);

  const ico = new THREE.Mesh(
    new THREE.IcosahedronGeometry(1, 1),
    new THREE.MeshStandardMaterial({
      color: 0x181840,
      flatShading: true,
      metalness: 0.55,
      roughness: 0.4,
      emissive: 0x1a1458,
      emissiveIntensity: 0.4,
    })
  );
  scene.add(ico);

  const shell = new THREE.Mesh(
    new THREE.IcosahedronGeometry(1.08, 1),
    new THREE.MeshBasicMaterial({ color: COLORS.amber, wireframe: true, transparent: true, opacity: 0.35 })
  );
  scene.add(shell);

  const particles = new THREE.Points(
    (() => {
      const n = 120;
      const a = new Float32Array(n * 3);
      for (let i = 0; i < n; i++) {
        const th = (i / n) * Math.PI * 2;
        a[i * 3] = Math.cos(th) * 1.7;
        a[i * 3 + 1] = Math.sin(th * 2) * 0.35;
        a[i * 3 + 2] = Math.sin(th) * 1.7;
      }
      const g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.BufferAttribute(a, 3));
      return g;
    })(),
    new THREE.PointsMaterial({ color: COLORS.mint, size: 0.045, transparent: true, opacity: 0.8 })
  );
  scene.add(particles);

  const ro = new ResizeObserver(() => fit(renderer, camera, canvas));
  ro.observe(canvas.parentElement || canvas);
  fit(renderer, camera, canvas);

  let on = true;
  const io = new IntersectionObserver(
    ([e]) => { on = e.isIntersecting; },
    { threshold: 0.05 }
  );
  io.observe(canvas);

  const clock = new THREE.Clock();
  function tick() {
    requestAnimationFrame(tick);
    if (!on) return;
    const t = clock.getElapsedTime();
    ico.rotation.y = t * 0.35;
    ico.rotation.x = t * 0.18;
    shell.rotation.y = -t * 0.28;
    shell.rotation.z = t * 0.12;
    particles.rotation.y = t * 0.45;
    renderer.render(scene, camera);
  }
  tick();
}

/* Boot */
createIntroScene();
createHeroBackground();
createOrbitScene();
