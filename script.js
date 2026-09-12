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
