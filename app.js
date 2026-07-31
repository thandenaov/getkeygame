const DEFAULT_CONFIG = {
  title: 'Get Key LQM iOS',
  browserTitle: 'Get Key LQM iOS',
  logo: 'https://play-lh.googleusercontent.com/Vcxb9Q-GG4Md6c9uCMCRnDlx8DUpiXgAnO7HXkSQTJKjV1MxLr5hZZVCf6nSfX8OsAc',
  taskHeading: 'Nhiệm vụ',
  unlockHeading: 'Mở khoá key',
  guideHeading: 'Hướng dẫn vượt link',
  accent: '#168ee8',
  accent2: '#5577ff',
  showClock: true,
  autoTheme: true,
  lightHour: 6,
  darkHour: 18,
  tasks: [
    {id:'discord',title:'Tham Gia Discord',icon:'https://cdn.simpleicons.org/discord/ffffff',bg:'#5865F2',url:'https://discord.com/'},
    {id:'tiktok',title:'Follow TikTok',icon:'https://cdn.simpleicons.org/tiktok/ffffff',bg:'#000000',url:'https://www.tiktok.com/'},
    {id:'youtube',title:'Đăng Ký Kênh YouTube',icon:'https://cdn.simpleicons.org/youtube/ffffff',bg:'#ff3434',url:'https://www.youtube.com/'},
    {id:'telegram',title:'Vào nhóm Telegram',icon:'https://cdn.simpleicons.org/telegram/ffffff',bg:'#2da8dc',url:'https://t.me/'}
  ],
  unlocks: [
    {title:'Mở khoá Link Chính',url:'#'},
    {title:'Link Phụ (nếu Chính lỗi)',url:'#'},
    {title:'Link Ads (vượt quảng cáo)',url:'#'}
  ],
  guides: [
    {title:'Hướng dẫn vượt Link Chính',url:'#'},
    {title:'HD Vượt Link Phụ',url:'#'},
    {title:'HD Vượt Link Quảng cáo',url:'#'}
  ]
};

const $ = (s) => document.querySelector(s);
const esc = (s) => String(s ?? '').replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
const safeUrl = (url) => /^(https?:\/\/|tg:|mailto:|zalo:)/i.test(url || '') ? url : '#';

function loadConfig(){
  try {
    const saved = JSON.parse(localStorage.getItem('getkey_config') || '{}');
    return {
      ...DEFAULT_CONFIG,
      ...saved,
      tasks: Array.isArray(saved.tasks) ? saved.tasks : DEFAULT_CONFIG.tasks,
      unlocks: Array.isArray(saved.unlocks) ? saved.unlocks : DEFAULT_CONFIG.unlocks,
      guides: Array.isArray(saved.guides) ? saved.guides : DEFAULT_CONFIG.guides
    };
  } catch { return structuredClone(DEFAULT_CONFIG); }
}

let cfg = loadConfig();
let completed = new Set(JSON.parse(localStorage.getItem('getkey_completed') || '[]'));

function applyTheme(){
  const nowHour = new Date().getHours();
  let dark;
  if (cfg.autoTheme) {
    const light = Number(cfg.lightHour ?? 6);
    const darkStart = Number(cfg.darkHour ?? 18);
    dark = light < darkStart ? (nowHour < light || nowHour >= darkStart) : !(nowHour >= darkStart && nowHour < light);
  } else {
    dark = localStorage.getItem('getkey_theme') === 'dark';
  }
  document.body.classList.toggle('dark', dark);
  $('#themeBtn').textContent = dark ? '☀' : '☾';
  $('#themeBtn').style.display = cfg.autoTheme ? 'none' : 'grid';
  document.querySelector('meta[name=theme-color]').content = dark ? '#07080b' : '#f4f3f9';
}

function updateClock(){
  const el = $('#liveClock');
  el.hidden = !cfg.showClock;
  if (!cfg.showClock) return;
  const now = new Date();
  el.textContent = now.toLocaleTimeString('vi-VN',{hour:'2-digit',minute:'2-digit',hour12:false});
}

function render(){
  document.documentElement.style.setProperty('--accent', cfg.accent || DEFAULT_CONFIG.accent);
  document.documentElement.style.setProperty('--accent2', cfg.accent2 || DEFAULT_CONFIG.accent2);
  document.title = cfg.browserTitle || cfg.title || 'Get Key Game';
  $('#title').textContent = cfg.title || DEFAULT_CONFIG.title;
  $('#logo').src = cfg.logo || DEFAULT_CONFIG.logo;
  $('#logo').onerror = () => { $('#logo').src = DEFAULT_CONFIG.logo; };
  $('#taskHeading').textContent = cfg.taskHeading || 'Nhiệm vụ';
  $('#unlockHeading').textContent = cfg.unlockHeading || 'Mở khoá key';
  $('#guideHeading').textContent = cfg.guideHeading || 'Hướng dẫn vượt link';

  $('#taskList').innerHTML = cfg.tasks.length ? cfg.tasks.map((t,i) => {
    const id = t.id || `task_${i}`;
    return `<a class="task ${completed.has(id)?'done':''}" data-id="${esc(id)}" href="${esc(safeUrl(t.url))}" target="_blank" rel="noopener noreferrer">
      <span class="task-icon" style="background:${esc(t.bg || '#555555')}"><img src="${esc(t.icon || '')}" alt=""></span>
      <span class="task-title">${esc(t.title || 'Nhiệm vụ')}</span><span class="arrow">›</span>
    </a>`;
  }).join('') : '<div class="empty">Chưa có nhiệm vụ</div>';

  $('#unlockList').innerHTML = cfg.unlocks.length ? cfg.unlocks.map(u => `<button class="unlock" data-url="${esc(safeUrl(u.url))}"><span class="lock">🔒</span><span>${esc(u.title || 'Link')}</span></button>`).join('') : '<div class="empty standalone">Chưa có link mở khoá</div>';
  $('#guides').innerHTML = cfg.guides.length ? cfg.guides.map(g => `<a href="${esc(safeUrl(g.url))}" target="_blank" rel="noopener noreferrer">${esc(g.title || 'Hướng dẫn')}</a>`).join('') : '<div class="empty standalone">Chưa có hướng dẫn</div>';

  updateProgress();
  applyTheme();
  updateClock();
}

function updateProgress(){
  const ids = cfg.tasks.map((t,i) => t.id || `task_${i}`);
  const total = ids.length;
  const done = ids.filter(id => completed.has(id)).length;
  $('#count').textContent = `${done} / ${total}`;
  $('#progress').style.width = total ? `${done / total * 100}%` : '0%';
  const ready = total === 0 || done === total;
  document.querySelectorAll('.unlock').forEach(btn => {
    btn.disabled = !ready;
    btn.classList.toggle('ready', ready);
    const lock = btn.querySelector('.lock');
    if (lock) lock.textContent = ready ? '🔓' : '🔒';
  });
}

function toast(message){
  const t = $('#toast');
  t.textContent = message;
  t.classList.add('show');
  clearTimeout(window.__toastTimer);
  window.__toastTimer = setTimeout(() => t.classList.remove('show'), 1700);
}

document.addEventListener('click', (e) => {
  const task = e.target.closest('.task');
  if (task) {
    completed.add(task.dataset.id);
    localStorage.setItem('getkey_completed', JSON.stringify([...completed]));
    task.classList.add('done');
    setTimeout(updateProgress, 80);
  }
  const unlock = e.target.closest('.unlock.ready');
  if (unlock) {
    const url = unlock.dataset.url;
    if (url && url !== '#') window.open(url, '_blank', 'noopener');
    else toast('Link này chưa được cài trong Admin');
  }
});

$('#themeBtn').onclick = () => {
  if (cfg.autoTheme) return;
  document.body.classList.toggle('dark');
  localStorage.setItem('getkey_theme', document.body.classList.contains('dark') ? 'dark' : 'light');
  applyTheme();
};

window.addEventListener('storage', e => {
  if (e.key === 'getkey_config') { cfg = loadConfig(); render(); }
});

render();
setInterval(() => { updateClock(); if (cfg.autoTheme) applyTheme(); }, 1000);
