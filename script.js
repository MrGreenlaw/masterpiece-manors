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

/* ===== TEMP DEV PANEL — local only, not for production, strip before deploy ===== */
(function () {
  const founders = [
    { id: 'allison', label: 'Allison' },
    { id: 'casey', label: 'Casey' }
  ];

  const panel = document.createElement('div');
  panel.id = 'dev-photo-panel';

  function readVar(wrap, name, fallback) {
    const v = getComputedStyle(wrap).getPropertyValue(name).trim();
    return v ? parseFloat(v) : fallback;
  }

  founders.forEach(({ id, label }) => {
    const wrap = document.getElementById(`photo-wrap-${id}`);
    const x = readVar(wrap, '--photo-pos-x', 50);
    const y = readVar(wrap, '--photo-pos-y', 50);
    const zoom = readVar(wrap, '--photo-zoom', 1);

    const group = document.createElement('div');
    group.className = 'dev-panel-group';

    const title = document.createElement('h4');
    title.textContent = label;
    group.appendChild(title);

    const readout = document.createElement('code');
    readout.className = 'dev-panel-readout';
    group.appendChild(readout);

    function makeSlider(labelText, min, max, step, value, apply) {
      const row = document.createElement('label');
      row.className = 'dev-panel-row';
      const span = document.createElement('span');
      span.textContent = labelText;
      const input = document.createElement('input');
      input.type = 'range';
      input.min = min; input.max = max; input.step = step; input.value = value;
      input.addEventListener('input', () => {
        apply(input.value);
        update();
      });
      row.appendChild(span);
      row.appendChild(input);
      group.appendChild(row);
      return input;
    }

    const xSlider = makeSlider('X', 0, 100, 1, x, (v) => wrap.style.setProperty('--photo-pos-x', v + '%'));
    const ySlider = makeSlider('Y', 0, 100, 1, y, (v) => wrap.style.setProperty('--photo-pos-y', v + '%'));
    const zoomSlider = makeSlider('Zoom', 100, 300, 1, Math.round(zoom * 100), (v) => wrap.style.setProperty('--photo-zoom', v / 100));

    function update() {
      readout.textContent =
        `#photo-wrap-${id}{--photo-pos-x:${xSlider.value}%;--photo-pos-y:${ySlider.value}%;--photo-zoom:${(zoomSlider.value / 100).toFixed(2)};}`;
    }

    update();
    panel.appendChild(group);
  });

  document.body.appendChild(panel);
})();
