/* ─── Custom cursor ─────────────────────────────────────────── */
const cursor = document.querySelector('.cursor');

let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let curX = mouseX;
let curY = mouseY;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

(function lerpCursor() {
  curX += (mouseX - curX) * 0.18;
  curY += (mouseY - curY) * 0.18;
  cursor.style.left = curX + 'px';
  cursor.style.top  = curY + 'px';
  requestAnimationFrame(lerpCursor);
})();

document.addEventListener('mouseleave', () => { cursor.style.opacity = '0'; });
document.addEventListener('mouseenter', () => { cursor.style.opacity = '1'; });


/* ─── Staggered entrance ────────────────────────────────────── */
document.querySelectorAll('[data-stagger]').forEach(el => {
  const delay = parseInt(el.dataset.stagger, 10) * 130 + 80;
  setTimeout(() => el.classList.add('visible'), delay);
});


/* ─── Label blur effect ─────────────────────────────────────── */
const labelWrap   = document.querySelector('.label-wrap');
const labelBlur   = document.querySelector('.label-blurred');

if (labelWrap && labelBlur) {
  labelWrap.addEventListener('mousemove', (e) => {
    const rect = labelWrap.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    labelWrap.style.setProperty('--mx', x + 'px');
    labelWrap.style.setProperty('--my', y + 'px');
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
      const xPct = (e.clientX / window.innerWidth  - 0.5) * 6;
      const yPct = (e.clientY / window.innerHeight - 0.5) * 6;
      grain.style.transform = `translate(${xPct}px, ${yPct}px)`;
      grainTick = false;
    });
    grainTick = true;
  }
});


/* ─── Floating image ────────────────────────────────────────── */
function launchFloatingImage() {
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  // Random size: smallish but with some variation
  const size = 90 + Math.random() * 90; // 90–180px

  // Pick a start edge (0=top 1=right 2=bottom 3=left)
  const startEdge = Math.floor(Math.random() * 4);
  // End edge: prefer roughly opposite but allow ±1 shift for diagonal feel
  const shift = Math.random() < 0.6 ? 2 : (Math.random() < 0.5 ? 1 : 3);
  const endEdge = (startEdge + shift) % 4;

  const margin = size + 30;

  function edgePoint(edge) {
    switch (edge) {
      case 0: return { x: Math.random() * (vw - size), y: -margin };
      case 1: return { x: vw + margin,                 y: Math.random() * (vh - size) };
      case 2: return { x: Math.random() * (vw - size), y: vh + margin };
      case 3: return { x: -margin,                     y: Math.random() * (vh - size) };
    }
  }

  const start = edgePoint(startEdge);
  const end   = edgePoint(endEdge);

  // Gentle rotation: slow, max ~1.5 rotations total
  const startRot = (Math.random() - 0.5) * 30;
  const endRot   = startRot + (Math.random() < 0.5 ? 1 : -1) * (60 + Math.random() * 90);

  // Slow travel: 7–15s
  const duration = 7000 + Math.random() * 8000;

  const img = document.createElement('img');
  img.src = 'IMG_4721.jpeg';
  img.setAttribute('aria-hidden', 'true');
  img.style.cssText = [
    'position:fixed',
    'left:0', 'top:0',
    `width:${size}px`,
    'height:auto',
    'pointer-events:none',
    'z-index:6',
    'border-radius:3px',
    'will-change:transform,opacity',
  ].join(';');

  document.body.appendChild(img);

  img.animate([
    {
      transform: `translate(${start.x}px,${start.y}px) rotate(${startRot}deg)`,
      opacity: 0,
    },
    {
      transform: `translate(${start.x + (end.x - start.x) * 0.08}px,${start.y + (end.y - start.y) * 0.08}px) rotate(${startRot + (endRot - startRot) * 0.08}deg)`,
      opacity: 0.88,
      offset: 0.08,
    },
    {
      transform: `translate(${start.x + (end.x - start.x) * 0.92}px,${start.y + (end.y - start.y) * 0.92}px) rotate(${startRot + (endRot - startRot) * 0.92}deg)`,
      opacity: 0.88,
      offset: 0.92,
    },
    {
      transform: `translate(${end.x}px,${end.y}px) rotate(${endRot}deg)`,
      opacity: 0,
    },
  ], {
    duration,
    easing: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
    fill: 'forwards',
  }).onfinish = () => {
    img.remove();
    scheduleFloatingImage();
  };
}

function scheduleFloatingImage() {
  const delay = 5000 + Math.random() * 15000; // 5–20s
  setTimeout(launchFloatingImage, delay);
}

scheduleFloatingImage();


/* ─── Accent em pulse on load ───────────────────────────────── */
const em = document.querySelector('h1 em');
if (em) {
  setTimeout(() => {
    em.style.transition = 'transform 0.4s cubic-bezier(0.22,1,0.36,1)';
    em.style.transform  = 'scale(1.04)';
    setTimeout(() => { em.style.transform = 'scale(1)'; }, 400);
  }, 4 * 130 + 500);
}
