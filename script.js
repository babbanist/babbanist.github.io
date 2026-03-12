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

// Smooth cursor follow with lerp
function lerpCursor() {
  curX += (mouseX - curX) * 0.18;
  curY += (mouseY - curY) * 0.18;
  cursor.style.left = curX + 'px';
  cursor.style.top  = curY + 'px';
  requestAnimationFrame(lerpCursor);
}
lerpCursor();

// Expand cursor on hoverable elements
document.querySelectorAll('a, button').forEach(el => {
  el.addEventListener('mouseenter', () => cursor.classList.add('expanded'));
  el.addEventListener('mouseleave', () => cursor.classList.remove('expanded'));
});

// Hide cursor when it leaves the window
document.addEventListener('mouseleave', () => { cursor.style.opacity = '0'; });
document.addEventListener('mouseenter', () => { cursor.style.opacity = '1'; });


/* ─── Staggered entrance ────────────────────────────────────── */
const staggerEls = document.querySelectorAll('[data-stagger]');

staggerEls.forEach(el => {
  const delay = parseInt(el.dataset.stagger, 10) * 120 + 80; // ms per step
  setTimeout(() => el.classList.add('visible'), delay);
});


/* ─── Magnetic links ────────────────────────────────────────── */
document.querySelectorAll('.magnetic-link').forEach(link => {
  const strength = 0.35;

  link.addEventListener('mousemove', (e) => {
    const rect = link.getBoundingClientRect();
    const cx = rect.left + rect.width  / 2;
    const cy = rect.top  + rect.height / 2;
    const dx = (e.clientX - cx) * strength;
    const dy = (e.clientY - cy) * strength;
    link.style.transform = `translate(${dx}px, ${dy}px)`;
  });

  link.addEventListener('mouseleave', () => {
    link.style.transition = 'transform 0.4s cubic-bezier(0.22, 1, 0.36, 1)';
    link.style.transform  = 'translate(0, 0)';
    setTimeout(() => { link.style.transition = ''; }, 400);
  });
});


/* ─── Text scramble on h1 hover ─────────────────────────────── */
const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%';

function scramble(el, originalText, duration = 600) {
  let start = null;
  const totalChars = originalText.length;

  function step(ts) {
    if (!start) start = ts;
    const progress = Math.min((ts - start) / duration, 1);
    const revealedCount = Math.floor(progress * totalChars);

    let result = '';
    for (let i = 0; i < totalChars; i++) {
      if (originalText[i] === ' ') { result += ' '; continue; }
      if (i < revealedCount) {
        result += originalText[i];
      } else {
        result += chars[Math.floor(Math.random() * chars.length)];
      }
    }
    el.textContent = result;

    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = originalText;
  }

  requestAnimationFrame(step);
}

const heading = document.querySelector('h1');
const em = heading.querySelector('em');
// We scramble only the plain-text portion of h1 (before the <em>)
const labelEl = document.querySelector('.label');
const originalLabel = labelEl.textContent;

labelEl.addEventListener('mouseenter', () => {
  scramble(labelEl, originalLabel);
});


/* ─── Subtle parallax on grain with mouse ───────────────────── */
const grain = document.querySelector('.grain');
let ticking = false;

document.addEventListener('mousemove', (e) => {
  if (!ticking) {
    requestAnimationFrame(() => {
      const xPct = (e.clientX / window.innerWidth  - 0.5) * 6;
      const yPct = (e.clientY / window.innerHeight - 0.5) * 6;
      grain.style.transform = `translate(${xPct}px, ${yPct}px)`;
      ticking = false;
    });
    ticking = true;
  }
});


/* ─── Accent em pulse on load ───────────────────────────────── */
setTimeout(() => {
  em.style.transition = 'transform 0.4s cubic-bezier(0.22,1,0.36,1)';
  em.style.transform  = 'scale(1.04)';
  setTimeout(() => { em.style.transform = 'scale(1)'; }, 400);
}, staggerEls.length * 120 + 400);
