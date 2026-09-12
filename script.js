document.getElementById('year').textContent = new Date().getFullYear();

const revealTargets = document.querySelectorAll('.fade-up:not(.is-visible)');

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px 120px 0px' });

  revealTargets.forEach((el, i) => {
    el.style.transitionDelay = `${(i % 4) * 90}ms`;
    observer.observe(el);
  });
} else {
  revealTargets.forEach((el) => el.classList.add('is-visible'));
}

if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
  initDevPanel();
}

function initDevPanel() {
  const photos = [
    { key: 'allison', label: 'Allison' },
    { key: 'casey', label: 'Casey' },
  ];

  const state = {};
  photos.forEach(({ key }) => {
    state[key] = { posX: 50, posY: 50, zoom: 1 };
  });

  function applyPhoto(key) {
    const wrap = document.getElementById(`photo-wrap-${key}`);
    const img = document.getElementById(`photo-${key}`);
    const s = state[key];
    wrap.style.setProperty('--photo-pos-x', `${s.posX}%`);
    wrap.style.setProperty('--photo-pos-y', `${s.posY}%`);
    img.style.transform = s.zoom === 1 ? '' : `scale(${s.zoom})`;
  }

  function buildCssOutput() {
    let out = '';
    photos.forEach(({ key }) => {
      const s = state[key];
      out += `#photo-wrap-${key} { --photo-pos-x: ${s.posX}%; --photo-pos-y: ${s.posY}%; --photo-zoom: ${s.zoom}; }\n`;
    });
    return out.trim();
  }

  function row(labelText, min, max, step, value, onInput) {
    const label = document.createElement('label');
    const span = document.createElement('span');
    span.textContent = labelText;
    const input = document.createElement('input');
    input.type = 'range';
    input.min = min;
    input.max = max;
    input.step = step;
    input.value = value;
    const val = document.createElement('span');
    val.className = 'dp-val';
    val.textContent = value;
    input.addEventListener('input', () => {
      val.textContent = input.value;
      onInput(parseFloat(input.value));
      output.textContent = buildCssOutput();
    });
    label.appendChild(span);
    label.appendChild(input);
    label.appendChild(val);
    return label;
  }

  const panel = document.createElement('div');
  panel.id = 'dev-panel';

  const title = document.createElement('div');
  title.className = 'dp-title';
  title.textContent = 'Founder Photo Controls';
  panel.appendChild(title);

  photos.forEach(({ key, label: labelText }) => {
    const h4 = document.createElement('h4');
    h4.textContent = labelText;
    panel.appendChild(h4);
    panel.appendChild(row('Pan X', 0, 100, 1, 50, (v) => { state[key].posX = v; applyPhoto(key); }));
    panel.appendChild(row('Pan Y', 0, 100, 1, 50, (v) => { state[key].posY = v; applyPhoto(key); }));
    panel.appendChild(row('Zoom', 1, 2.5, 0.05, 1, (v) => { state[key].zoom = v; applyPhoto(key); }));
  });

  const output = document.createElement('pre');
  output.textContent = buildCssOutput();
  panel.appendChild(output);

  document.body.appendChild(panel);
}
