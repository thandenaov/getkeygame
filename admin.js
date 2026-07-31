const DEF={
  title:'Get Key LQM iOS',browserTitle:'Get Key LQM iOS',
  logo:'https://play-lh.googleusercontent.com/Vcxb9Q-GG4Md6c9uCMCRnDlx8DUpiXgAnO7HXkSQTJKjV1MxLr5hZZVCf6nSfX8OsAc',
  taskHeading:'Nhiệm vụ',unlockHeading:'Mở khoá key',guideHeading:'Hướng dẫn vượt link',
  accent:'#178ee8',accent2:'#5577ff',showClock:true,autoTheme:true,lightHour:6,darkHour:18,
  tasks:[],unlocks:[],guides:[]
};
const $=s=>document.querySelector(s);
const esc=s=>String(s??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
function load(){try{const x=JSON.parse(localStorage.getItem('getkey_config')||'{}');return {...DEF,...x,tasks:Array.isArray(x.tasks)?x.tasks:[],unlocks:Array.isArray(x.unlocks)?x.unlocks:[],guides:Array.isArray(x.guides)?x.guides:[]}}catch{return {...DEF}}}
let cfg=load();
function toast(s){const t=$('#toast');t.textContent=s;t.classList.add('show');clearTimeout(window.__t);window.__t=setTimeout(()=>t.classList.remove('show'),1700)}
function auth(){return sessionStorage.getItem('getkey_admin_auth')==='1'}
if(auth())$('#login').style.display='none';
$('#loginForm').onsubmit=e=>{e.preventDefault();const p=localStorage.getItem('getkey_admin_password')||'minhwuan';if($('#password').value===p){sessionStorage.setItem('getkey_admin_auth','1');$('#login').style.display='none'}else toast('Sai mật khẩu')};
function field(id,val){const el=$('#'+id);if(el.type==='checkbox')el.checked=!!val;else el.value=val??''}
function render(){
  field('title',cfg.title);field('browserTitle',cfg.browserTitle);field('logo',cfg.logo);field('taskHeading',cfg.taskHeading);field('unlockHeading',cfg.unlockHeading);field('guideHeading',cfg.guideHeading);field('accent',cfg.accent);field('accent2',cfg.accent2);field('showClock',cfg.showClock);field('autoTheme',cfg.autoTheme);field('lightHour',cfg.lightHour);field('darkHour',cfg.darkHour);
  renderTasks();renderSimple('unlocks');renderSimple('guides');
}
function renderTasks(){
  $('#tasks').innerHTML=cfg.tasks.map((t,i)=>`<div class="item" draggable="true" data-type="tasks" data-index="${i}"><div class="drag">☰</div><div class="row">
    <input class="mini" data-k="title" value="${esc(t.title)}" placeholder="Tên nhiệm vụ">
    <input class="mini" data-k="url" value="${esc(t.url)}" placeholder="Link nhiệm vụ">
    <input class="mini" data-k="icon" value="${esc(t.icon)}" placeholder="URL icon hoặc ảnh đã tải">
    <input class="mini color" data-k="bg" type="color" value="${esc(t.bg||'#555555')}">
    <button class="btn small upload-task" type="button">Ảnh</button><input class="task-file" type="file" accept="image/*" hidden>
    <button class="remove" type="button">Xoá</button>
  </div></div>`).join('') || '<div class="note">Chưa có nhiệm vụ.</div>';
}
function renderSimple(type){
  $('#'+type).innerHTML=cfg[type].map((x,i)=>`<div class="item" draggable="true" data-type="${type}" data-index="${i}"><div class="drag">☰</div><div class="row simple">
    <input class="mini" data-k="title" value="${esc(x.title)}" placeholder="Tên hiển thị">
    <input class="mini" data-k="url" value="${esc(x.url)}" placeholder="Link">
    <button class="remove" type="button">Xoá</button>
  </div></div>`).join('') || '<div class="note">Chưa có mục nào.</div>';
}

document.addEventListener('input',e=>{const item=e.target.closest('.item');if(!item||!e.target.dataset.k)return;cfg[item.dataset.type][+item.dataset.index][e.target.dataset.k]=e.target.value});
document.addEventListener('click',e=>{
  if(e.target.matches('.remove')){const item=e.target.closest('.item'),type=item.dataset.type;cfg[type].splice(+item.dataset.index,1);type==='tasks'?renderTasks():renderSimple(type)}
  if(e.target.dataset.add==='task'){cfg.tasks.push({id:'task_'+Date.now(),title:'Nhiệm vụ mới',url:'#',icon:'https://cdn.simpleicons.org/linktree/ffffff',bg:'#5577ff'});renderTasks()}
  if(e.target.dataset.add==='unlock'){cfg.unlocks.push({title:'Link mới',url:'#'});renderSimple('unlocks')}
  if(e.target.dataset.add==='guide'){cfg.guides.push({title:'Hướng dẫn mới',url:'#'});renderSimple('guides')}
  if(e.target.matches('.upload-task'))e.target.nextElementSibling.click();
});
document.addEventListener('change',e=>{if(!e.target.matches('.task-file'))return;const file=e.target.files[0];if(!file)return;if(file.size>1200000)return toast('Ảnh nên nhỏ hơn 1,2 MB');const item=e.target.closest('.item'),reader=new FileReader();reader.onload=()=>{cfg.tasks[+item.dataset.index].icon=reader.result;renderTasks();toast('Đã thêm ảnh')};reader.readAsDataURL(file)});

let drag=null;
document.addEventListener('dragstart',e=>{const i=e.target.closest('.item');if(i)drag={type:i.dataset.type,index:+i.dataset.index}});
document.addEventListener('dragover',e=>{if(e.target.closest('.item'))e.preventDefault()});
document.addEventListener('drop',e=>{const i=e.target.closest('.item');if(!i||!drag||i.dataset.type!==drag.type)return;const to=+i.dataset.index,[m]=cfg[drag.type].splice(drag.index,1);cfg[drag.type].splice(to,0,m);drag.type==='tasks'?renderTasks():renderSimple(drag.type);drag=null});

$('#logoUploadBtn').onclick=()=>$('#logoFile').click();
$('#logoFile').onchange=e=>{const f=e.target.files[0];if(!f)return;if(f.size>1200000)return toast('Ảnh nên nhỏ hơn 1,2 MB');const r=new FileReader();r.onload=()=>{$('#logo').value=r.result;toast('Đã chọn logo')};r.readAsDataURL(f)};

$('#saveBtn').onclick=()=>{
  cfg.title=$('#title').value.trim()||DEF.title;cfg.browserTitle=$('#browserTitle').value.trim()||cfg.title;cfg.logo=$('#logo').value.trim()||DEF.logo;
  cfg.taskHeading=$('#taskHeading').value.trim()||'Nhiệm vụ';cfg.unlockHeading=$('#unlockHeading').value.trim()||'Mở khoá key';cfg.guideHeading=$('#guideHeading').value.trim()||'Hướng dẫn vượt link';
  cfg.accent=$('#accent').value;cfg.accent2=$('#accent2').value;cfg.showClock=$('#showClock').checked;cfg.autoTheme=$('#autoTheme').checked;cfg.lightHour=Math.max(0,Math.min(23,Number($('#lightHour').value)||6));cfg.darkHour=Math.max(0,Math.min(23,Number($('#darkHour').value)||18));
  const np=$('#newPassword').value;if(np){if(np.length<4)return toast('Mật khẩu tối thiểu 4 ký tự');localStorage.setItem('getkey_admin_password',np);$('#newPassword').value=''}
  localStorage.setItem('getkey_config',JSON.stringify(cfg));toast('Đã lưu thay đổi');
};
$('#resetProgress').onclick=()=>{if(confirm('Xoá toàn bộ tiến độ nhiệm vụ?')){localStorage.removeItem('getkey_completed');toast('Đã xoá tiến độ')}};
$('#logoutBtn').onclick=()=>{sessionStorage.removeItem('getkey_admin_auth');location.reload()};
$('#exportBtn').onclick=()=>{const blob=new Blob([JSON.stringify(cfg,null,2)],{type:'application/json'}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='getkey-config.json';a.click();URL.revokeObjectURL(a.href)};
$('#importBtn').onclick=()=>$('#fileInput').click();
$('#fileInput').onchange=async e=>{try{const j=JSON.parse(await e.target.files[0].text());cfg={...DEF,...j};render();toast('Đã nhập, bấm Lưu')}catch{toast('File JSON không hợp lệ')}};
render();
