document.addEventListener('DOMContentLoaded', function(){
  console.log('Website loaded successfully!');

  // Theme toggle functionality
  const themeToggle = document.querySelector('.theme-toggle');
  const themeIcon = themeToggle.querySelector('i');

  // Check for saved theme preference or default to light mode
  const currentTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', currentTheme);
  updateThemeIcon(currentTheme);

  themeToggle.addEventListener('click', function() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
  });

  function updateThemeIcon(theme) {
    themeIcon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
  }

  // Hamburger menu
  var btn = document.querySelector('.hamburger');
  var nav = document.querySelector('.nav-wrapper');
  if(btn && nav){
    btn.addEventListener('click', function(){
      var open = nav.classList.toggle('open');
      btn.setAttribute('aria-expanded', open);
    });
  }

  // AOS initialization
  try{
    if(window.AOS && typeof AOS.init === 'function'){
      AOS.init({ duration: 700, once: true });
    }
  }catch(e){
    // AOS not available
  }

  // Back to top button
  const backToTopBtn = document.querySelector('.back-to-top');
  if (backToTopBtn) {
    window.addEventListener('scroll', function() {
      if (window.pageYOffset > 300) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    });

    backToTopBtn.addEventListener('click', function() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // Read more functionality
  const readMoreBtn = document.querySelector('.read-more-btn');
  const expandableContent = document.querySelector('.expandable-content');
  if (readMoreBtn && expandableContent) {
    readMoreBtn.addEventListener('click', function() {
      const isExpanded = expandableContent.classList.contains('expanded');
      if (isExpanded) {
        expandableContent.classList.remove('expanded');
        readMoreBtn.textContent = 'Read more';
        readMoreBtn.setAttribute('aria-expanded', 'false');
      } else {
        expandableContent.classList.add('expanded');
        readMoreBtn.textContent = 'Read less';
        readMoreBtn.setAttribute('aria-expanded', 'true');
      }
    });
  }

  // Story reader (slides/pages)
  const reader = document.querySelector('[data-reader]');
  if (reader) {
    const slides = Array.from(reader.querySelectorAll('[data-slide]'));
    const btnPrev = reader.querySelector('[data-reader-prev]');
    const btnNext = reader.querySelector('[data-reader-next]');
    const pageLabel = reader.querySelector('[data-reader-page]');
    const progressBar = reader.querySelector('[data-reader-progress]');
    const fontDown = reader.querySelector('[data-reader-font="down"]');
    const fontUp = reader.querySelector('[data-reader-font="up"]');

    const total = slides.length || 1;
    const savedIdx = parseInt(sessionStorage.getItem('reader_page') || '1', 10);
    let idx = Number.isFinite(savedIdx) ? Math.min(Math.max(savedIdx, 1), total) : 1;

    function setFont(mode) {
      reader.setAttribute('data-font', mode);
      sessionStorage.setItem('reader_font', mode);
    }

    function render() {
      slides.forEach((s) => s.classList.remove('is-active'));
      const active = slides[idx - 1];
      if (active) active.classList.add('is-active');

      if (pageLabel) pageLabel.textContent = `Page ${idx} / ${total}`;
      if (progressBar) progressBar.style.width = `${Math.round((idx / total) * 100)}%`;

      if (btnPrev) btnPrev.disabled = idx <= 1;
      if (btnNext) btnNext.disabled = idx >= total;

      sessionStorage.setItem('reader_page', String(idx));
    }

    function go(delta) {
      idx = Math.min(Math.max(idx + delta, 1), total);
      render();
    }

    if (btnPrev) btnPrev.addEventListener('click', () => go(-1));
    if (btnNext) btnNext.addEventListener('click', () => go(1));

    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') go(-1);
      if (e.key === 'ArrowRight') go(1);
    });

    const savedFont = sessionStorage.getItem('reader_font') || '';
    if (savedFont) setFont(savedFont);

    if (fontDown) fontDown.addEventListener('click', () => setFont('sm'));
    if (fontUp) fontUp.addEventListener('click', () => setFont('lg'));

    render();
  }
});
