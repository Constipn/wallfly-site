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

  const appBody = appWindow.querySelector('.app-body');
  const newNoteButtons = [...appWindow.querySelectorAll('[aria-controls="demo-recording"]')];
  const overlay = appWindow.querySelector('.demo-recording-overlay');
  const cursor = appWindow.querySelector('.demo-cursor');
  const recordingTitle = document.getElementById('demo-recording-title');
  const recordingTime = appWindow.querySelector('.recording-indicator time');
  const placeholder = appWindow.querySelector('.recording-placeholder');
  const noteList = appWindow.querySelector('.recording-notes ul');
  const noteLines = [...noteList.children];
  const listening = appWindow.querySelector('.recording-listening');
  const conversation = appWindow.querySelector('.recording-conversation');
  const turns = [...appWindow.querySelectorAll('.recording-turn')];
  const transcript = [
    { start: 900, text: "Let's make the first five minutes feel effortless." },
    { start: 4000, text: 'Agreed. We can test the updated flow together on Friday.' },
    { start: 7500, text: "I’ll put together a first draft of the new flow." }
  ];
  // Overview for 2 s, pointer movement and click, then the live recording window.
  const pointerStart = 2000;
  const clickStart = 2900;
  const recordingStart = 3150;
  const cycleDuration = recordingStart + 15000;
  let elapsed = 0;
  let lastFrame = performance.now();

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
  function setText(element, value) {
    if (element.textContent !== value) element.textContent = value;
  }
  function typed(text, time, start, speed = 35) {
    return text.slice(0, Math.max(0, Math.floor((time - start) / speed)));
  }
  function renderDemo() {
    const recording = elapsed >= recordingStart;
    overlay.hidden = !recording;
    appBody.inert = recording;
    newNoteButtons.forEach(button => {
      button.setAttribute('aria-expanded', String(recording));
      button.classList.toggle('demo-clicked', elapsed >= clickStart && !recording);
    });
    const moving = elapsed >= pointerStart && !recording;
    cursor.hidden = !moving;
    if (moving) {
      const button = newNoteButtons.find(button => button.getClientRects().length);
      if (button) {
        const frame = appWindow.getBoundingClientRect();
        const target = button.getBoundingClientRect();
        const progress = Math.min(1, (elapsed - pointerStart) / (clickStart - pointerStart));
        const ease = progress * progress * (3 - 2 * progress);
        const startX = frame.width * .72;
        const startY = frame.height * .7;
        const endX = target.left - frame.left + target.width * .52;
        const endY = target.top - frame.top + target.height * .55;
        const scale = elapsed >= clickStart && elapsed < clickStart + 140 ? .85 : 1;
        cursor.style.transform = `translate(${startX + (endX - startX) * ease}px, ${startY + (endY - startY) * ease}px) scale(${scale})`;
      }
    }
    if (!recording) return;
    const time = elapsed - recordingStart;
    setText(recordingTitle, time < 2500 ? 'New note' : 'Product team sync');
    setText(recordingTime, `00:${String(Math.floor(time / 1000)).padStart(2, '0')}`);
    placeholder.hidden = time >= 2800;
    noteList.hidden = time < 2800;
    setText(noteLines[0], typed('Simpler onboarding. Focus on the first five minutes.', time, 2800));
    noteLines[1].hidden = time < 7600;
    setText(noteLines[1], typed('Test on Friday · Jamie → first draft', time, 7600));
    listening.hidden = time >= transcript[0].start;
    let changed = false;
    turns.forEach((turn, index) => {
      const line = transcript[index];
      const text = typed(line.text, time, line.start);
      turn.hidden = time < line.start;
      const bubble = turn.querySelector('p');
      if (bubble.textContent !== text) {
        setText(bubble, text);
        changed = true;
      }
    });
    if (changed) conversation.scrollTop = conversation.scrollHeight;
    const wave = appWindow.querySelector('.recording-wave');
    [...wave.children].forEach((bar, index) => {
      bar.style.height = `${4 + Math.abs(Math.sin(time / 230 + index * 1.4)) * 13}px`;
    });
  }
  // Manual interaction stops playback and leaves the selected view in place.
  function chooseTab(index) {
    elapsed = 0;
    paused = true;
    selectTab(index);
    renderDemo();
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
  newNoteButtons.forEach(button => button.addEventListener('click', () => {
    elapsed = recordingStart + 12000;
    paused = true;
    renderDemo();
    updatePause();
    appWindow.querySelector('.demo-close-recording').focus({ preventScroll: true });
  }));
  function closeRecording() {
    const restoreFocus = overlay.contains(document.activeElement);
    chooseTab(1);
    if (restoreFocus) newNoteButtons.find(button => button.getClientRects().length)?.focus({ preventScroll: true });
  }
  appWindow.querySelector('.demo-close-recording').addEventListener('click', closeRecording);
  appWindow.querySelector('.demo-stop-recording').addEventListener('click', closeRecording);
  appWindow.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !overlay.hidden) {
      event.preventDefault();
      closeRecording();
    }
  });
  pauseButton.addEventListener('click', () => { paused = !paused; lastFrame = performance.now(); updatePause(); });
  motionPreference.addEventListener('change', event => { paused = event.matches; lastFrame = performance.now(); updatePause(); });
  renderDemo();
  updatePause();

  // All content is fictional and local. Hidden pages and keyboard focus suspend playback.
  function animate(now) {
    const delta = now - lastFrame;
    lastFrame = now;
    if (!paused && !document.hidden && !appWindow.contains(document.activeElement)) {
      elapsed = (elapsed + Math.min(delta, 100)) % cycleDuration;
      renderDemo();
    }
    window.requestAnimationFrame(animate);
  }
  window.requestAnimationFrame(animate);

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
