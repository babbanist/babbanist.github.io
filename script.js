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


/* ─── Accent em pulse on load ───────────────────────────────── */
const em = document.querySelector('h1 em');
if (em) {
  setTimeout(() => {
    em.style.transition = 'transform 0.4s cubic-bezier(0.22,1,0.36,1)';
    em.style.transform  = 'scale(1.04)';
    setTimeout(() => { em.style.transform = 'scale(1)'; }, 400);
  }, 4 * 130 + 500);
}
