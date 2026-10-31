/* Set this to your public HTTPS release URL or a relative DMG path when ready. */
const DOWNLOAD_URL = '';

(() => {
  const tabs = [...document.querySelectorAll('.demo-tab')];
  const panels = tabs.map(tab => document.getElementById(tab.getAttribute('aria-controls')));
  const product = document.querySelector('.hero-product');
  const pauseButton = document.getElementById('pause-demo');
  const transcript = document.getElementById('transcript-text');
  const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
  let paused = motionPreference.matches;
  let elapsed = 0;
  const lines = [
    "Let's make the first five minutes feel effortless.",
    "I'll put together a first draft of the new flow.",
    'Then we can test it together on Friday.'
  ];

  function selectTab(index) {
    tabs.forEach((tab, i) => {
      tab.classList.toggle('active', i === index);
      tab.setAttribute('aria-selected', String(i === index));
      tab.tabIndex = i === index ? 0 : -1;
      panels[i].hidden = i !== index;
    });
  }
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => { selectTab(index); });
    tab.addEventListener('keydown', event => {
      let next;
      if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
      else if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
      else if (event.key === 'Home') next = 0;
      else if (event.key === 'End') next = tabs.length - 1;
      else return;
      event.preventDefault();
      selectTab(next);
      tabs[next].focus();
    });
  });
  function updatePause() {
    product.classList.toggle('demo-paused', paused);
    pauseButton.setAttribute('aria-pressed', String(paused));
    pauseButton.innerHTML = paused ? '<span aria-hidden="true">▷</span> Play demo' : '<span aria-hidden="true">Ⅱ</span> Pause demo';
  }
  pauseButton.addEventListener('click', () => { paused = !paused; updatePause(); });
  motionPreference.addEventListener('change', event => { paused = event.matches; updatePause(); });
  updatePause();

  // No network requests or AI calls: all demo content is fictional and local.
  window.setInterval(() => {
    if (paused || document.hidden || product.contains(document.activeElement)) return;
    elapsed += 1;
    if (elapsed % 5 === 0) transcript.textContent = lines[Math.floor(elapsed / 5) % lines.length];
  }, 1000);

  if (DOWNLOAD_URL.trim()) {
    try {
      const url = new URL(DOWNLOAD_URL, window.location.href);
      if (!['https:', 'http:', 'file:'].includes(url.protocol)) throw new Error('Unsupported download URL');
      const link = document.getElementById('release-download');
      link.href = url.href;
      link.hidden = false;
      document.getElementById('download-status').hidden = true;
    } catch {
      console.warn('Invalid DOWNLOAD_URL: keeping the coming-soon message.');
    }
  }
})();
