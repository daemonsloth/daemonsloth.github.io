/*
 * PROFILE UI / BEHAVIOR
 * ---------------------
 * Content lives in profile-content.js.
 * This file is intentionally focused on rendering and interaction logic.
 */

const terminal = document.querySelector('#terminal');
const input = document.querySelector('#commandInput');
const sidebar = document.querySelector('.sidebar');
const shell = document.querySelector('.shell');
const closeControl = document.querySelector('.window-control.close');
const minimizeControl = document.querySelector('.window-control.minimize');
const maximizeControl = document.querySelector('.window-control.maximize');
const sleepScreen = document.querySelector('.sleep-screen');
const nav = document.querySelector('nav');

let typingFrame;
let lastCommand = '';

const fileMap = Object.fromEntries(
  PROFILE.files.map(({ file, page }) => [file, page])
);

const pageFileMap = Object.fromEntries(
  PROFILE.files.map(({ file, page }) => [page, file])
);

const prompt = () =>
  `<p class="line"><span class="prompt">${PROFILE.identity.workstation}</span><span class="path">:~$</span> ${escapeHtml(lastCommand)}</p>`;

const escapeHtml = value =>
  String(value).replace(/[&<>'"]/g, character => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;'
  }[character]));

const completionCandidates = [
  ...PROFILE.files.map(({ file }) => `cat ${file}`),
  'ls',
  'ls -la',
  'tree',
  'pwd',
  'whoami',
  'neofetch',
  'date',
  'echo ',
  'sudo',
  'cd ',
  'reboot',
  'shutdown',
  'help',
  'clear'
];

function applyProfileChrome() {
  document.title = PROFILE.ui.siteTitle;

  const description = document.querySelector('meta[name="description"]');
  if (description) description.content = PROFILE.ui.metaDescription;

  const defaultPage = PROFILE.files[0]?.page || 'home';
  const brand = document.querySelector('.brand');
  brand.href = 'javascript:void(0)';
  brand.addEventListener('click', (e) => { e.preventDefault(); render(defaultPage); });
  brand.innerHTML =
    `<span class="brand-mark">${escapeHtml(PROFILE.ui.brandMark)}</span> ${escapeHtml(PROFILE.identity.workstation)}`;

  document.querySelector('.eyebrow').textContent = PROFILE.ui.eyebrow;
  document.querySelector('.topbar p span').textContent = PROFILE.ui.terminalPath;
  document.querySelector('.command-form input').placeholder = PROFILE.ui.commandPromptPlaceholder;
  document.querySelector('.sidebar-availability').textContent =
    PROFILE.ui.availableMessage;

  const sleep = document.querySelector('.sleep-screen');
  sleep.querySelector('b').textContent = PROFILE.ui.sleepTitle;
  sleep.querySelector('small').textContent = PROFILE.ui.sleepSubtitle;

  document.querySelector('.command-form .prompt').textContent = PROFILE.identity.workstation;
}

function renderNav() {
  nav.innerHTML = PROFILE.files
    .map(({ file }) => (
      `<button class="nav-item${file === PROFILE.files[0].file ? ' active' : ''}" data-command="${file}">
        <span>\></span><b>./${file}</b>
      </button>`
    ))
    .join('');

  nav.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => render(item.dataset.command));
  });
}

function renderLinks() {
  return `
    <div class="quick-links">
      <a class="button" href="${PROFILE.identity.resumeUrl}" target="_blank" rel="noreferrer"><b>view résumé ↗</b></a>
      <a class="button secondary" href="${PROFILE.identity.linkedinUrl}" target="_blank" rel="noreferrer">linkedin ↗</a>
      <a class="button secondary" href="${PROFILE.identity.githubUrl}" target="_blank" rel="noreferrer">github ↗</a>
    </div>
  `;
}

function renderTags(tags) {
  return `
    <div class="meta-row">
      ${tags.map(tag => `<span class="tag">${escapeHtml(tag)}</span>`).join('')}
    </div>
  `;
}

function renderCards(items) {
  return items.map(({ label, title, description }) => `
    <article class="card">
      <span class="card-label">${escapeHtml(label)}</span>
      <h3>${escapeHtml(title)}</h3>
      <p>${escapeHtml(description)}</p>
    </article>
  `).join('');
}

function renderProjects() {
  return `
    <div class="grid projects-grid">
      ${PROFILE.projects.map(project => `
        <article class="card">
          <span class="card-label">${escapeHtml(project.label)}</span>
          <h3>${escapeHtml(project.title)}</h3>
          <p>${escapeHtml(project.description)}</p>
          <a class="button secondary project-link" href="${project.link}" target="_blank" rel="noreferrer">${escapeHtml(project.linkText)} ↗</a>
        </article>
      `).join('')}
    </div>
  `;
}

function renderExperience() {
  return `
    <div class="experience">
      ${PROFILE.experience.map(role => `
        <article class="role">
          <div class="role-date">${escapeHtml(role.date)}<br>${escapeHtml(role.location)}</div>
          <div>
            <h3>${escapeHtml(role.role)}</h3>
            <h4>${escapeHtml(role.organization)}</h4>
            <ul>${role.bullets.map(bullet => `<li>${escapeHtml(bullet)}</li>`).join('')}</ul>
          </div>
        </article>
      `).join('')}
    </div>
  `;
}

function renderEducation() {
  return `
    <div class="experience">
      ${PROFILE.education.map(item => `
        <article class="role">
          <div class="role-date">${escapeHtml(item.date)}<br>${escapeHtml(item.location)}</div>
          <div>
            <h3>${escapeHtml(item.institution)}</h3>
            <h4>${escapeHtml(item.degree)}</h4>
            <p class="lead">${escapeHtml(item.description)}</p>
          </div>
        </article>
      `).join('')}
    </div>
  `;
}

function renderSkills() {
  return `
    <div class="skill-list">
      ${PROFILE.skills.map(skill => `<span class="skill">${escapeHtml(skill)}</span>`).join('')}
    </div>
    <h3 style="margin:42px 0 10px;font:500 20px 'Space Grotesk',sans-serif">Recognition</h3>
    ${PROFILE.recognition.map(item => `
      <div class="achievement"><b>${escapeHtml(item.title)}</b> — ${escapeHtml(item.description)}</div>
    `).join('')}
  `;
}

const pages = {
  home: () => `
    ${prompt('./home')}
    <div class="output hero">
      <div class="hero-layout">
        <div class="hero-copy-column">
          <div class="hero-kicker"> &nbsp;</div>
          <h2 class="section-title">Hello, there!<br><span>${escapeHtml(PROFILE.identity.name)}</span> here :)</h2>
          <p class="hero-copy">${escapeHtml(PROFILE.identity.description)}</p>
          ${renderTags([
            PROFILE.identity.location,
            PROFILE.identity.organization,
            PROFILE.ui.aboutEducationTag,
            PROFILE.ui.bachelorEducationTag
          ])}
          ${renderLinks()}
        </div>
        <figure class="profile-photo">
          <img src="${escapeHtml(PROFILE.identity.photo.src)}" alt="${escapeHtml(PROFILE.identity.photo.alt)}" loading="eager" decoding="async">
        </figure>
      </div>
    </div>
  `,

  about: () => `
    ${prompt('cat about.txt')}
    <div class="output">
      <p class="hero-kicker">// PROFILE</p>
      <h2 class="section-title">Engineer by practice.<br><span>Researcher by instinct.</span></h2>
      <p class="lead">${escapeHtml(PROFILE.identity.profile)}</p>
      <div class="grid" style="margin-top:38px">
        ${renderCards([
          { label: 'Current focus', ...PROFILE.about.currentFocus },
          { label: 'Research lens', ...PROFILE.about.researchLens }
        ])}
      </div>
    </div>
  `,

  experience: () => `
    ${prompt('cd experience/ && ls -la')}
    <div class="output">
      <p class="hero-kicker">// WORK HISTORY</p>
      <h2 class="section-title">Samsung R&D Institute</h2>
      ${renderExperience()}
    </div>
  `,

  research: () => `
    ${prompt('ls research/ --verbose')}
    <div class="output">
      <p class="hero-kicker">// RESEARCH & IP</p>
      <h2 class="section-title">Ideas made <span>durable.</span></h2>
      <div class="grid">
        ${renderCards(PROFILE.research)}
      </div>
    </div>
  `,

  projects: () => `
    ${prompt()}
    <div class="output">
      <p class="hero-kicker">// PROJECT ARCHIVE</p>
      <h2 class="section-title">Things I’ve <span>made.</span></h2>
      ${renderProjects()}
    </div>
  `,

  skills: () => `
    ${prompt('./skills --all')}
    <div class="output">
      <p class="hero-kicker">// TOOLBOX</p>
      <h2 class="section-title">The stack I <span>think in.</span></h2>
      ${renderSkills()}
    </div>
  `,

  education: () => `
    ${prompt('cat education.log')}
    <div class="output">
      <p class="hero-kicker">// EDUCATION</p>
      <h2 class="section-title">The starting <span>blocks.</span></h2>
      ${renderEducation()}
    </div>
  `,

  help: () => `
    ${prompt('help')}
    <div class="output">
      <p class="hero-kicker">// AVAILABLE FILES</p>
      <h2 class="section-title">Pick a <span>file.</span></h2>
      <div class="skill-list">
        ${PROFILE.files.map(({ file }) => `<button class="skill command-chip" data-run="${file}">${escapeHtml(file)}</button>`).join('')}
      </div>
      <p class="lead" style="margin-top:30px">Try <span style="color:var(--acid)">cat &lt;filename&gt;</span>, <span style="color:var(--acid)">ls</span>, <span style="color:var(--acid)">tree</span>, <span style="color:var(--acid)">pwd</span>, <span style="color:var(--acid)">whoami</span>, <span style="color:var(--acid)">neofetch</span>, <span style="color:var(--acid)">date</span>, <span style="color:var(--acid)">reboot</span>, or <span style="color:var(--acid)">echo hello</span>.</p>
    </div>
  `,

  ls: () => `
    ${prompt()}
    <div class="output">
      <p class="hero-kicker">// DIRECTORY LISTING</p>
      <div class="file-grid">
        ${PROFILE.files.map(({ file }) => `<button class="file-entry" data-run="${file}">${escapeHtml(file)}</button>`).join('')}
      </div>
    </div>
  `,

  tree: () => `
    ${prompt()}
    <div class="output">
      <pre class="terminal-text">.
${PROFILE.files.map((item, index) => `${index === PROFILE.files.length - 1 ? '└──' : '├──'} ${item.file}`).join('\n')}</pre>
    </div>
  `,

  pwd: () =>
    `${prompt()}<div class="output"><p class="terminal-text">/home/siddharth/public-profile</p></div>`,

  whoami: () =>
    `${prompt()}<div class="output"><p class="terminal-text">${escapeHtml(PROFILE.identity.handle)} <span class="muted-text">// systems engineer & researcher</span></p></div>`,

  neofetch: () => `
    ${prompt()}
    <div class="output">
      <div class="fetch">
        <pre class="fetch-logo">   ____  _     _
  / ___|(_) __| |
  \\___ \\| |/ _\` |
   ___) | | (_| |
  |____/|_|\\__,_|</pre>
        <div class="fetch-copy">
          <p><b>${escapeHtml(PROFILE.identity.workstation)}</b></p>
          <p><span>role</span> ${escapeHtml(PROFILE.identity.title)}</p>
          <p><span>location</span> ${escapeHtml(PROFILE.identity.location)}</p>
          <p><span>focus</span> ${escapeHtml(PROFILE.identity.focus)}</p>
          <p><span>shell</span> ${escapeHtml(PROFILE.identity.shellVersion)}</p>
        </div>
      </div>
    </div>
  `,

  date: () =>
    `${prompt()}<div class="output"><p class="terminal-text">${new Date().toString()}</p></div>`,

  echo: message =>
    `${prompt()}<div class="output"><p class="terminal-text">${escapeHtml(message)}</p></div>`,

  cat: filename =>
    `${prompt()}<div class="output"><p class="terminal-text">${
      filename
        ? `cat: ${escapeHtml(filename)}: No such file or directory`
        : 'cat: missing file operand\nTry: cat <filename>'
    }</p></div>`,

  cd: () =>
    `${prompt()}<div class="output"><p class="terminal-text"><span style="color:var(--acid)">cd:</span> Where do you think you're going? Everything interesting is already right here.</p></div>`,

  sudo: () =>
    `${prompt()}<div class="output"><p class="terminal-text">nice try. this profile is already running with excellent privileges.</p></div>`,

  clear: () => '',

  unknown: command =>
    `${prompt(command)}<div class="output"><p class="lead">command not found: <span style="color:var(--acid)">${escapeHtml(command)}</span><br>Try <button class="text-button" data-run="help">help</button> to see available commands.</p></div>`
};

function typeOutput() {
  cancelAnimationFrame(typingFrame);

  const output = terminal.querySelector('.output');
  if (!output) return;

  const textNodes = [];
  const deferredBlocks = [
    ...output.querySelectorAll('.role, .card, .achievement, .skill, .tag, .button, .file-entry')
  ];

  deferredBlocks.forEach(block => block.classList.add('type-pending'));

  const walker = document.createTreeWalker(output, NodeFilter.SHOW_TEXT);
  let node;

  while ((node = walker.nextNode())) {
    if (node.nodeValue.trim()) {
      textNodes.push({
        node,
        text: node.nodeValue,
        index: 0,
        block: node.parentElement.closest('.type-pending')
      });
    }
  }

  if (!textNodes.length) return;

  textNodes.forEach(item => { item.node.nodeValue = ''; });

  output.classList.add('is-typing');

  let current = 0;
  let lastTime = performance.now();

  function step(now) {
    let characters = Math.max(1, Math.floor((now - lastTime) * 0.65));
    lastTime = now;

    while (characters > 0 && current < textNodes.length) {
      const item = textNodes[current];

      if (item.block) item.block.classList.remove('type-pending');

      const remaining = item.text.length - item.index;
      const amount = Math.min(characters, remaining);

      item.node.nodeValue += item.text.slice(item.index, item.index + amount);
      item.index += amount;
      characters -= amount;

      if (item.index === item.text.length) current += 1;
    }

    if (current < textNodes.length) {
      typingFrame = requestAnimationFrame(step);
    } else {
      output.classList.remove('is-typing');
    }
  }

  typingFrame = requestAnimationFrame(step);
}

function updateActiveNav(key) {
  nav.querySelectorAll('.nav-item').forEach(item => {
    item.classList.toggle('active', fileMap[item.dataset.command] === key);
  });
}

function getHashCommand() {
  const hash = window.location.hash.replace(/^#/, '').trim();
  if (!hash) return null;
  try {
    return decodeURIComponent(hash);
  } catch (e) {
    return hash;
  }
}

function trackPageView(key) {
  const filename = pageFileMap[key];
  if (!filename || typeof window.gtag !== 'function') return;

  window.gtag('event', 'page_view', {
    page_title: `${PROFILE.ui.siteTitle} / ${filename}`,
    page_location: `${window.location.origin}${window.location.pathname}#${encodeURIComponent(filename)}`,
    page_path: `/${filename}`
  });
}

function resolveCommand(command) {
  const cleaned = command.trim().toLowerCase().replace(/^#/, '').replace(/^\.\//, '');
  const requestedFile = cleaned.replace(/^cat\s+/, '');
  const builtIn = cleaned.split(/\s+/)[0];

  return {
    cleaned,
    requestedFile,
    builtIn,
    key: fileMap[requestedFile] || (pages[cleaned] ? cleaned : null) || (pageFileMap[cleaned] ? cleaned : null) || builtIn || (PROFILE.files[0]?.page || 'home')
  };
}

function render(command) {
  cancelAnimationFrame(typingFrame);

  const { cleaned, requestedFile, key } = resolveCommand(command);

  if (cleaned === 'reboot') {
    window.location.reload();
    return;
  }

  if (cleaned === 'shutdown') {
    enterSleep();
    return;
  }

  shell.classList.remove('terminal-closed');

  const catArgument = command.trim().replace(/^cat(?:\s+)?/i, '').trim();

  lastCommand = fileMap[requestedFile]
    ? `cat ${requestedFile}`
    : pageFileMap[key]
      ? `cat ${pageFileMap[key]}`
      : command;

  const output =
    key === 'echo'
      ? pages.echo(command.trim().slice(4).trim())
      : key === 'cat'
        ? pages.cat(catArgument)
        : (pages[key] || (() => pages.unknown(command)))();

  terminal.innerHTML = output;
  updateActiveNav(key);
  sidebar.classList.remove('open');
  terminal.scrollTop = 0;
  trackPageView(key);
  typeOutput();
}

document.querySelector('#commandForm').addEventListener('submit', event => {
  event.preventDefault();
  render(input.value);
  input.value = '';

  if (window.matchMedia('(max-width: 720px)').matches) {
    input.blur();
  }
});

input.addEventListener('keydown', event => {
  if (event.key !== 'Tab') return;

  event.preventDefault();

  const typed = input.value.toLowerCase();
  const matches = completionCandidates.filter(candidate => candidate.startsWith(typed));

  if (matches.length === 1) {
    input.value = matches[0];
    input.setSelectionRange(input.value.length, input.value.length);
    return;
  }

  if (matches.length > 1) {
    const shared = matches.reduce((prefix, match) => {
      let index = 0;
      while (index < prefix.length && prefix[index] === match[index]) index += 1;
      return prefix.slice(0, index);
    });

    if (shared.length > typed.length) input.value = shared;
  }
});

terminal.addEventListener('click', event => {
  const command = event.target.dataset.run;
  if (command) render(command);
});

document.querySelector('.menu-toggle').addEventListener('click', () => {
  sidebar.classList.toggle('open');
});

function reopenTerminal() {
  shell.classList.remove('terminal-closed');
  input.focus();
}

function enterSleep() {
  shell.classList.add('minimized');
  sleepScreen.focus();
}

closeControl.addEventListener('click', enterSleep);

document.querySelector('.sidebar-reopen').addEventListener('click', reopenTerminal);

minimizeControl.addEventListener('click', () => {
  shell.classList.add('terminal-closed');
  document.querySelector('.sidebar-reopen').focus();
});

sleepScreen.addEventListener('click', () => {
  window.location.reload();
});

maximizeControl.addEventListener('click', async () => {
  if (document.fullscreenElement) {
    await document.exitFullscreen();
  } else {
    await document.documentElement.requestFullscreen();
  }
});

document.addEventListener('fullscreenchange', () => {
  const fullscreen = Boolean(document.fullscreenElement);
  maximizeControl.setAttribute('aria-label', fullscreen ? 'Exit fullscreen' : 'Enter fullscreen');
  maximizeControl.setAttribute('title', fullscreen ? 'Exit fullscreen' : 'Enter fullscreen');
});

window.addEventListener('hashchange', () => {
  const hashCmd = getHashCommand();
  if (hashCmd) {
    const { key } = resolveCommand(hashCmd);
    if (pages[key]) {
      render(hashCmd);
      return;
    }
  }
  render(PROFILE.files[0]?.page || 'home');
});

applyProfileChrome();
renderNav();

const defaultPage = PROFILE.files[0]?.page || 'home';
const initialHash = getHashCommand();
if (initialHash) {
  const { key } = resolveCommand(initialHash);
  if (pages[key]) {
    render(initialHash);
  } else {
    render(defaultPage);
  }
} else {
  render(defaultPage);
}

if (window.matchMedia('(min-width: 721px)').matches) {
  input.focus();
}
