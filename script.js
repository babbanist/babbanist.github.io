/* ─── Staggered entrance ────────────────────────────────────── */
document.querySelectorAll('[data-stagger]').forEach(el => {
  const delay = parseInt(el.dataset.stagger, 10) * 130 + 80;
  setTimeout(() => el.classList.add('visible'), delay);
});


/* ─── Label blur effect ─────────────────────────────────────── */
const labelWrap = document.querySelector('.label-wrap');
const labelBlur = document.querySelector('.label-blurred');

if (labelWrap && labelBlur) {
  labelWrap.addEventListener('mousemove', (e) => {
    const rect = labelWrap.getBoundingClientRect();
    labelWrap.style.setProperty('--mx', (e.clientX - rect.left) + 'px');
    labelWrap.style.setProperty('--my', (e.clientY - rect.top)  + 'px');
  });
  labelWrap.addEventListener('mouseleave', () => {
    labelWrap.style.setProperty('--mx', '-200px');
    labelWrap.style.setProperty('--my', '-200px');
  });
}


/* ─── Grain parallax ────────────────────────────────────────── */
const grain = document.querySelector('.grain');
let grainTick = false;
document.addEventListener('mousemove', (e) => {
  if (!grainTick) {
    requestAnimationFrame(() => {
      grain.style.transform = `translate(${(e.clientX / innerWidth  - 0.5) * 6}px, ${(e.clientY / innerHeight - 0.5) * 6}px)`;
      grainTick = false;
    });
    grainTick = true;
  }
});


/* ─── Elaborate cursor trail (canvas) ───────────────────────── */
const cursorDot = document.querySelector('.cursor');

// Cursor dot — lerp follow
let mouseX = innerWidth / 2, mouseY = innerHeight / 2;
let dotX = mouseX, dotY = mouseY;

document.addEventListener('mousemove', (e) => { mouseX = e.clientX; mouseY = e.clientY; });
document.addEventListener('mouseleave', () => { cursorDot.style.opacity = '0'; });
document.addEventListener('mouseenter', () => { cursorDot.style.opacity = '1'; });

document.querySelectorAll('a, button').forEach(el => {
  el.addEventListener('mouseenter', () => cursorDot.classList.add('expanded'));
  el.addEventListener('mouseleave', () => cursorDot.classList.remove('expanded'));
});

// Canvas overlay for trail
const trailCanvas = document.createElement('canvas');
trailCanvas.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:9998;';
document.body.appendChild(trailCanvas);
const tctx = trailCanvas.getContext('2d');

function resizeTrailCanvas() {
  trailCanvas.width  = innerWidth;
  trailCanvas.height = innerHeight;
}
resizeTrailCanvas();
window.addEventListener('resize', resizeTrailCanvas);

// Trail state
const TRAIL_MAX   = 65;
const trailPts    = [];   // { x, y } — smoothed head positions
const dustPts     = [];   // floating particles
let trailHeadX    = mouseX;
let trailHeadY    = mouseY;
let lastSpawnDist = 0;

// Parse --accent to [r,g,b]
function accentRgb() {
  const hex = (getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#6b21a8').replace('#', '');
  const n   = parseInt(hex.padEnd(6, '0'), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function animateTrail() {
  // Smooth trail head (slightly faster than dot for visual lead)
  trailHeadX += (mouseX - trailHeadX) * 0.22;
  trailHeadY += (mouseY - trailHeadY) * 0.22;

  // Smooth cursor dot
  dotX += (mouseX - dotX) * 0.18;
  dotY += (mouseY - dotY) * 0.18;
  cursorDot.style.left = dotX + 'px';
  cursorDot.style.top  = dotY + 'px';

  // Record position
  trailPts.push({ x: trailHeadX, y: trailHeadY });
  if (trailPts.length > TRAIL_MAX) trailPts.shift();

  // Spawn dust when cursor moves enough
  if (trailPts.length > 1) {
    const last = trailPts[trailPts.length - 2];
    const dx = trailHeadX - last.x;
    const dy = trailHeadY - last.y;
    lastSpawnDist += Math.sqrt(dx * dx + dy * dy);
    if (lastSpawnDist > 14) {
      lastSpawnDist = 0;
      const count = 1 + Math.floor(Math.random() * 2);
      for (let i = 0; i < count; i++) {
        dustPts.push({
          x:     trailHeadX + (Math.random() - 0.5) * 18,
          y:     trailHeadY + (Math.random() - 0.5) * 18,
          vx:    (Math.random() - 0.5) * 1.4,
          vy:    -(Math.random() * 1.8 + 0.4),
          r:     Math.random() * 2.2 + 0.4,
          life:  1,
          decay: 0.018 + Math.random() * 0.018,
        });
      }
    }
  }

  tctx.clearRect(0, 0, trailCanvas.width, trailCanvas.height);

  const [r, g, b] = accentRgb();
  const n = trailPts.length;

  if (n >= 3) {
    // Three rendering layers: wide glow → mid glow → sharp core
    const layers = [
      { blur: 22, maxW: 12,  maxAlpha: 0.10 },
      { blur:  9, maxW:  5,  maxAlpha: 0.22 },
      { blur:  0, maxW:  2,  maxAlpha: 0.80 },
    ];

    for (const { blur, maxW, maxAlpha } of layers) {
      tctx.save();
      tctx.shadowBlur  = blur;
      tctx.shadowColor = `rgba(${r},${g},${b},0.9)`;
      tctx.lineCap  = 'round';
      tctx.lineJoin = 'round';

      // Draw as one continuous smooth path using midpoints
      tctx.beginPath();
      tctx.moveTo(trailPts[0].x, trailPts[0].y);
      for (let i = 1; i < n - 1; i++) {
        const mx = (trailPts[i].x + trailPts[i + 1].x) / 2;
        const my = (trailPts[i].y + trailPts[i + 1].y) / 2;
        tctx.quadraticCurveTo(trailPts[i].x, trailPts[i].y, mx, my);
      }
      tctx.lineTo(trailPts[n - 1].x, trailPts[n - 1].y);

      // Gradient stroke: fade from head (bright) to tail (transparent)
      const grad = tctx.createLinearGradient(trailPts[0].x, trailPts[0].y, trailPts[n - 1].x, trailPts[n - 1].y);
      grad.addColorStop(0,   `rgba(${r},${g},${b},0)`);
      grad.addColorStop(0.4, `rgba(${r},${g},${b},${maxAlpha * 0.4})`);
      grad.addColorStop(1,   `rgba(${r},${g},${b},${maxAlpha})`);

      tctx.strokeStyle = grad;
      tctx.lineWidth   = maxW;
      tctx.stroke();
      tctx.restore();
    }

    // Soft radial glow at cursor head
    const grd = tctx.createRadialGradient(trailHeadX, trailHeadY, 0, trailHeadX, trailHeadY, 24);
    grd.addColorStop(0,   `rgba(${r},${g},${b},0.28)`);
    grd.addColorStop(0.5, `rgba(${r},${g},${b},0.08)`);
    grd.addColorStop(1,   `rgba(${r},${g},${b},0)`);
    tctx.beginPath();
    tctx.arc(trailHeadX, trailHeadY, 24, 0, Math.PI * 2);
    tctx.fillStyle = grd;
    tctx.fill();
  }

  // Dust particles
  for (let i = dustPts.length - 1; i >= 0; i--) {
    const p = dustPts[i];
    p.x   += p.vx;
    p.y   += p.vy;
    p.vy  += 0.04; // gentle gravity
    p.life -= p.decay;
    if (p.life <= 0) { dustPts.splice(i, 1); continue; }

    const a = p.life * 0.75;
    tctx.save();
    tctx.shadowBlur  = 7;
    tctx.shadowColor = `rgba(${r},${g},${b},${a * 0.5})`;
    tctx.beginPath();
    tctx.arc(p.x, p.y, p.r * p.life, 0, Math.PI * 2);
    tctx.fillStyle = `rgba(${r},${g},${b},${a})`;
    tctx.fill();
    tctx.restore();
  }

  requestAnimationFrame(animateTrail);
}
animateTrail();


/* ─── Floating image ────────────────────────────────────────── */
function launchFloatingImage() {
  const vw = innerWidth;
  const vh = innerHeight;

  const size   = 90 + Math.random() * 90;
  const margin = size + 40;

  function edgePoint(edge) {
    switch (edge) {
      case 0: return { x: Math.random() * (vw - size), y: -margin };
      case 1: return { x: vw + margin,                 y: Math.random() * (vh - size) };
      case 2: return { x: Math.random() * (vw - size), y: vh + margin };
      case 3: return { x: -margin,                     y: Math.random() * (vh - size) };
    }
  }

  const startEdge = Math.floor(Math.random() * 4);
  const shift     = Math.random() < 0.6 ? 2 : (Math.random() < 0.5 ? 1 : 3);
  const endEdge   = (startEdge + shift) % 4;
  const start     = edgePoint(startEdge);
  const end       = edgePoint(endEdge);
  const startRot  = (Math.random() - 0.5) * 30;
  const endRot    = startRot + (Math.random() < 0.5 ? 1 : -1) * (60 + Math.random() * 90);
  const duration  = 7000 + Math.random() * 8000;

  const img = document.createElement('img');
  img.src = 'IMG_4721.jpeg';
  img.setAttribute('aria-hidden', 'true');
  img.style.cssText = `
    position:fixed; left:0; top:0;
    width:${size}px; height:auto;
    pointer-events:none; z-index:6; border-radius:3px;
    opacity:0;
    transform:translate(${start.x}px,${start.y}px) rotate(${startRot}deg);
    transition:transform ${duration}ms cubic-bezier(0.25,0.1,0.25,1), opacity 1s ease;
  `;
  document.body.appendChild(img);
  void img.offsetWidth;
  img.style.transform = `translate(${end.x}px,${end.y}px) rotate(${endRot}deg)`;
  img.style.opacity   = '0.9';
  setTimeout(() => { img.style.opacity = '0'; }, duration - 1000);
  setTimeout(() => {
    img.remove();
    setTimeout(launchFloatingImage, 5000 + Math.random() * 15000);
  }, duration + 200);
}
setTimeout(launchFloatingImage, 1500);


/* ─── Spacebar colour pulse ─────────────────────────────────── */
let pulsing = false;
document.addEventListener('keydown', (e) => {
  if (e.code !== 'Space' || pulsing || e.target !== document.body) return;
  e.preventDefault();
  pulsing = true;

  const body    = document.body;
  const em      = document.querySelector('h1 em');
  const divider = document.querySelector('.divider');

  // Pulse to red
  body.style.backgroundColor    = '#fce8e8';
  if (em)      em.style.color              = '#7a0000';
  if (divider) divider.style.background    = '#7a0000';
  cursorDot.style.backgroundColor         = '#7a0000';

  // Revert
  setTimeout(() => {
    body.style.backgroundColor    = '';
    if (em)      em.style.color              = '';
    if (divider) divider.style.background    = '';
    cursorDot.style.backgroundColor         = '';
    setTimeout(() => { pulsing = false; }, 500);
  }, 420);
});


/* ─── Accent em pulse on load ───────────────────────────────── */
const em = document.querySelector('h1 em');
if (em) {
  setTimeout(() => {
    em.style.transform = 'scale(1.04)';
    setTimeout(() => { em.style.transform = 'scale(1)'; }, 400);
  }, 4 * 130 + 500);
}
