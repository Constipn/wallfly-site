/* Set these when ready. While a value is empty, its links stay hidden. */
const DOWNLOAD_URL = ''; // Public HTTPS release URL or a relative DMG path.
const GITHUB_URL = '';   // Public repository URL, e.g. https://github.com/<user>/wallfly

(() => {
  const tabs = [...document.querySelectorAll('.demo-tab')];
  const panels = tabs.map(tab => document.getElementById(tab.getAttribute('aria-controls')));
  const product = document.querySelector('.hero-product');
  const appWindow = document.querySelector('.app-window');
  const pauseButton = document.getElementById('pause-demo');
  const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
  let paused = motionPreference.matches;

  // Autoplay tells the product story: rough notes -> transcript -> enhanced notes.
  // Tab indexes: 0 = My Notes, 1 = Enhanced Notes, 2 = Transcript.
  const sequence = [
    { tab: 0, seconds: 3 },
    { tab: 2, seconds: 3 },
    { tab: 1, seconds: 6 }
  ];
  let step = sequence.length - 1; // The page opens on Enhanced Notes.
  let elapsed = 0;

  function selectTab(index) {
    tabs.forEach((tab, i) => {
      tab.classList.toggle('active', i === index);
      tab.setAttribute('aria-selected', String(i === index));
      tab.tabIndex = i === index ? 0 : -1;
      panels[i].hidden = i !== index;
    });
  }
  function updatePause() {
    product.classList.toggle('demo-paused', paused);
    pauseButton.setAttribute('aria-pressed', String(paused));
    pauseButton.innerHTML = paused ? '<span aria-hidden="true">▷</span> Play demo' : '<span aria-hidden="true">Ⅱ</span> Pause demo';
  }
  // A manual tab choice stops autoplay, so the visitor keeps what they picked.
  function chooseTab(index) {
    selectTab(index);
    step = Math.max(0, sequence.findIndex(item => item.tab === index));
    elapsed = 0;
    paused = true;
    updatePause();
  }
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => { chooseTab(index); });
    tab.addEventListener('keydown', event => {
      let next;
      if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
      else if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
      else if (event.key === 'Home') next = 0;
      else if (event.key === 'End') next = tabs.length - 1;
      else return;
      event.preventDefault();
      chooseTab(next);
      tabs[next].focus();
    });
  });
  pauseButton.addEventListener('click', () => { paused = !paused; elapsed = 0; updatePause(); });
  motionPreference.addEventListener('change', event => { paused = event.matches; updatePause(); });
  updatePause();

  // No network requests or AI calls: all demo content is fictional and local.
  // Playback waits while the page is hidden or keyboard focus is inside the app demo.
  window.setInterval(() => {
    if (paused || document.hidden || appWindow.contains(document.activeElement)) return;
    elapsed += 1;
    if (elapsed < sequence[step].seconds) return;
    elapsed = 0;
    step = (step + 1) % sequence.length;
    selectTab(sequence[step].tab);
  }, 1000);

  // Download and GitHub links.
  function safeUrl(value, name) {
    if (!value.trim()) return null;
    try {
      const url = new URL(value, window.location.href);
      if (['https:', 'http:', 'file:'].includes(url.protocol)) return url.href;
    } catch { /* falls through to the warning */ }
    console.warn(`Invalid ${name}: its links stay hidden.`);
    return null;
  }
  const download = safeUrl(DOWNLOAD_URL, 'DOWNLOAD_URL');
  const github = safeUrl(GITHUB_URL, 'GITHUB_URL');

  document.querySelectorAll('.js-download').forEach(link => {
    if (download) link.href = download;
    link.hidden = !download;
  });
  document.querySelectorAll('.js-coming-soon').forEach(note => { note.hidden = Boolean(download); });
  document.querySelectorAll('.js-github').forEach(link => {
    if (github) link.href = github;
    link.hidden = !github;
    // Without a download yet, GitHub becomes the main action.
    if (!download) link.classList.remove('button-secondary');
  });
})();
