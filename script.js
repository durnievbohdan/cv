(() => {
  const content = window.CV_CONTENT;
  let lang = localStorage.getItem('cv-language') || 'uk';

  const get = (obj, path) => path.split('.').reduce((acc, key) => acc?.[key], obj);

  function render() {
    const t = content[lang];
    document.documentElement.lang = lang;
    document.title = t.metaTitle;
    document.querySelectorAll('[data-text]').forEach(el => { el.textContent = get(t, el.dataset.text) || ''; });
    document.querySelector('#langSwitch span').textContent = lang === 'uk' ? 'EN' : 'UA';
    document.querySelector('#langSwitch').setAttribute('aria-label', t.ui.switchLanguage);

    document.querySelector('#principles').innerHTML = t.profile.principles.map((item, i) => `<div class="principle"><b>0${i + 1}</b>${item}</div>`).join('');
    document.querySelector('#timeline').innerHTML = t.experience.items.map((item, i) => `<article class="timeline-item reveal"><div class="timeline-head"><div><h3>${item.role}</h3><span class="company">${item.company}</span></div><time>${item.period}</time></div><p class="summary">${item.summary}</p><ul>${item.points.map(point => `<li>${point}</li>`).join('')}</ul></article>`).join('');
    document.querySelector('#expertiseGrid').innerHTML = t.expertise.groups.map((group, i) => `<article class="expertise-card reveal" style="transition-delay:${(i % 2) * .08}s"><span>${group.number}</span><h3>${group.title}</h3><div class="tags">${group.items.map(item => `<span>${item}</span>`).join('')}</div></article>`).join('');
    document.querySelector('#languageList').innerHTML = t.education.languages.map(item => `<div class="language-row"><span>${item.name}</span><span>${item.level}</span></div>`).join('');
    observeReveals();
  }

  function observeReveals() {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
    }), { threshold: .12 });
    document.querySelectorAll('.reveal:not(.visible)').forEach(el => observer.observe(el));
  }

  document.querySelector('#langSwitch').addEventListener('click', () => {
    lang = lang === 'uk' ? 'en' : 'uk';
    localStorage.setItem('cv-language', lang);
    render();
  });

  const menu = document.querySelector('#mobileMenu');
  const toggle = document.querySelector('#menuToggle');
  function setMenu(open) {
    menu.classList.toggle('open', open);
    menu.setAttribute('aria-hidden', String(!open));
    toggle.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
  }
  toggle.addEventListener('click', () => setMenu(!menu.classList.contains('open')));
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMenu(false)));

  const glow = document.querySelector('.cursor-glow');
  window.addEventListener('pointermove', e => { glow.style.left = `${e.clientX}px`; glow.style.top = `${e.clientY}px`; }, { passive: true });
  document.querySelector('#year').textContent = new Date().getFullYear();
  render();
})();

