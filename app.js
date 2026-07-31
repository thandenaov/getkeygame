const DEFAULT_CONFIG={
  title:'Get Key LQM iOS',
  logo:'https://play-lh.googleusercontent.com/Vcxb9Q-GG4Md6c9uCMCRnDlx8DUpiXgAnO7HXkSQTJKjV1MxLr5hZZVCf6nSfX8OsAc',
  taskHeading:'Nhiệm vụ',unlockHeading:'Mở khoá key',accent:'#178ee8',accent2:'#5577ff',
  tasks:[
    {id:'discord',title:'Tham Gia Discord',icon:'https://cdn.simpleicons.org/discord/ffffff',bg:'#5865F2',url:'https://discord.com/'},
    {id:'tiktok',title:'Follow TikTok',icon:'https://cdn.simpleicons.org/tiktok/ffffff',bg:'#000000',url:'https://www.tiktok.com/'},
    {id:'youtube',title:'Đăng Ký Kênh YouTube',icon:'https://cdn.simpleicons.org/youtube/ffffff',bg:'#ff3434',url:'https://www.youtube.com/'},
    {id:'telegram',title:'Vào nhóm Telegram',icon:'https://cdn.simpleicons.org/telegram/ffffff',bg:'#2da8dc',url:'https://t.me/'}
  ],
  unlocks:[{title:'Mở khoá Link Chính',url:'#'},{title:'Link Phụ (nếu Chính lỗi)',url:'#'},{title:'Link Ads (vượt quảng cáo)',url:'#'}],
  guides:[{title:'Hướng dẫn vượt Link Chính',url:'#'},{title:'HD Vượt Link Phụ',url:'#'},{title:'HD Vượt link Quảng cáo',url:'#'}]
};
const esc=s=>String(s??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
function loadConfig(){try{return {...DEFAULT_CONFIG,...JSON.parse(localStorage.getItem('getkey_config')||'{}')}}catch{return DEFAULT_CONFIG}}
let cfg=loadConfig();
let completed=new Set(JSON.parse(localStorage.getItem('getkey_completed')||'[]'));
const $=s=>document.querySelector(s);
function safeUrl(url){return /^(https?:\/\/|tg:|mailto:)/i.test(url||'')?url:'#'}
function render(){
  document.documentElement.style.setProperty('--accent',cfg.accent||DEFAULT_CONFIG.accent);document.documentElement.style.setProperty('--accent2',cfg.accent2||DEFAULT_CONFIG.accent2);
  document.title=cfg.title||'Get Key Game';$('#title').textContent=cfg.title;$('#logo').src=cfg.logo;$('#taskHeading').textContent=cfg.taskHeading||'Nhiệm vụ';$('#unlockHeading').textContent=cfg.unlockHeading||'Mở khoá key';
  $('#taskList').innerHTML=cfg.tasks.length?cfg.tasks.map(t=>`<a class="task ${completed.has(t.id)?'done':''}" data-id="${esc(t.id)}" href="${esc(safeUrl(t.url))}" target="_blank" rel="noopener"><span class="task-icon" style="background:${esc(t.bg||'#555')}"><img src="${esc(t.icon)}" alt=""></span><span class="task-title">${esc(t.title)}</span><span class="arrow">›</span></a>`).join(''):'<div class="empty">Chưa có nhiệm vụ</div>';
  $('#unlockList').innerHTML=cfg.unlocks.map(u=>`<button class="unlock" data-url="${esc(safeUrl(u.url))}">🔒 ${esc(u.title)}</button>`).join('');
  $('#guides').innerHTML=cfg.guides.map(g=>`<a href="${esc(safeUrl(g.url))}" target="_blank" rel="noopener">${esc(g.title)}</a>`).join('');update();
}
function update(){const total=cfg.tasks.length,n=[...completed].filter(id=>cfg.tasks.some(t=>t.id===id)).length;$('#count').textContent=`${n} / ${total}`;$('#progress').style.width=total?`${n/total*100}%`:'0%';const ready=total===0||n===total;document.querySelectorAll('.unlock').forEach(b=>{b.disabled=!ready;b.classList.toggle('ready',ready);b.textContent=b.textContent.replace(/^🔓|^🔒/,ready?'🔓':'🔒')})}
function toast(msg){const t=$('#toast');t.textContent=msg;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),1700)}
document.addEventListener('click',e=>{const task=e.target.closest('.task');if(task){completed.add(task.dataset.id);localStorage.setItem('getkey_completed',JSON.stringify([...completed]));task.classList.add('done');setTimeout(update,80)}const b=e.target.closest('.unlock.ready');if(b){const u=b.dataset.url;if(u&&u!=='#')window.open(u,'_blank','noopener');else toast('Link chưa được cài trong Admin')}});
const saved=localStorage.getItem('getkey_theme');if(saved==='dark'||(!saved&&matchMedia('(prefers-color-scheme:dark)').matches))document.body.classList.add('dark');function sync(){const d=document.body.classList.contains('dark');$('#themeBtn').textContent=d?'☀':'☾';document.querySelector('meta[name=theme-color]').content=d?'#101116':'#f4f3f9'}$('#themeBtn').onclick=()=>{document.body.classList.toggle('dark');localStorage.setItem('getkey_theme',document.body.classList.contains('dark')?'dark':'light');sync()};window.addEventListener('storage',e=>{if(e.key==='getkey_config'){cfg=loadConfig();render()}});render();sync();
