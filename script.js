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
  state.grain = { opacity: 0, size: 3 };

  function applyPhoto(key) {
    const wrap = document.getElementById(`photo-wrap-${key}`);
    const s = state[key];
    wrap.style.setProperty('--photo-pos-x', `${s.posX}%`);
    wrap.style.setProperty('--photo-pos-y', `${s.posY}%`);
    wrap.style.setProperty('--photo-zoom', s.zoom);
  }

  function applyGrain() {
    photos.forEach(({ key }) => {
      const grainEl = document.getElementById(`grain-${key}`);
      grainEl.style.setProperty('--founder-grain-opacity', state.grain.opacity);
      grainEl.style.setProperty('--founder-grain-size', `${state.grain.size}px`);
    });
  }

  function buildCssOutput() {
    let out = '';
    photos.forEach(({ key }) => {
      const s = state[key];
      out += `#photo-wrap-${key} { --photo-pos-x: ${s.posX}%; --photo-pos-y: ${s.posY}%; --photo-zoom: ${s.zoom}; }\n`;
    });
    out += `.founder-grain { --founder-grain-opacity: ${state.grain.opacity}; --founder-grain-size: ${state.grain.size}px; }`;
    return out;
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

  const grainHeader = document.createElement('h4');
  grainHeader.textContent = 'Founder Photo Grain (separate from site grain)';
  panel.appendChild(grainHeader);
  panel.appendChild(row('Opacity', 0, 1, 0.01, 0, (v) => { state.grain.opacity = v; applyGrain(); }));
  panel.appendChild(row('Dot size (px)', 1, 8, 0.5, 3, (v) => { state.grain.size = v; applyGrain(); }));

  const output = document.createElement('pre');
  output.textContent = buildCssOutput();
  panel.appendChild(output);

  document.body.appendChild(panel);
}
