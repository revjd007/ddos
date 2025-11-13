/* ==============================================================
   Social Hub - Blackout Edition (Production-Ready Client-Side)
   LocalStorage backend; easy swap to API.
   ============================================================== */

/* ---------- 1. Global State ---------- */
const STATE = {
  user: null,
  currentTab: 'servers',
  currentServer: 'general',
  currentDM: null,          // {targetUserId, messages: []}
  users: [],
  messages: {},             // {server: [{...}]}
  dms: {},                  // {userId_targetId: [{...}]}
  content: [],              // [{id, userId, title, type, data: base64/url, likes: 0, comments: []}]
  redIntensity: 0.8,
};

/* ---------- 2. Helpers ---------- */
const $ = (s) => document.querySelector(s);
const $$ = (s) => document.querySelectorAll(s);

const saveState = () => localStorage.setItem('socialHub', JSON.stringify(STATE));
const loadState = () => {
  const raw = localStorage.getItem('socialHub');
  if (raw) {
    const loaded = JSON.parse(raw);
    Object.assign(STATE, loaded);
    document.documentElement.style.setProperty('--red-intensity', loaded.redIntensity || 0.8);
  }
};

const genId = () => Date.now().toString(36) + Math.random().toString(36).substr(2, 5);

/* ---------- 3. Init ---------- */
document.addEventListener('DOMContentLoaded', () => {
  loadState();
  if (STATE.user) {
    $('#loginModal').classList.add('hidden');
    $('#app').classList.remove('hidden');
    renderApp();
  }
  updateRedIntensity(STATE.redIntensity);
});

/* ---------- 4. Auth (Unchanged but Themed) ---------- */
window.showRegister = () => { $('#loginModal').classList.add('hidden'); $('#registerModal').classList.remove('hidden'); };
window.showLogin = () => { $('#registerModal').classList.add('hidden'); $('#loginModal').classList.remove('hidden'); };

window.register = () => {
  const email = $('#regEmail').value.trim();
  const pass = $('#regPass').value;
  if (!email || !pass) return alert('Fill all fields');
  if (STATE.users.find(u => u.email === email)) return alert('Email taken');

  const user = {
    id: genId(),
    email,
    pass, // Hash in prod!
    name: email.split('@')[0],
    avatar: `https://api.dicebear.com/9.x/identicon/svg?seed=${email}`,
    bio: '',
    likes: 0, posts: 0, msgs: 0,
  };
  STATE.users.push(user);
  STATE.user = user;
  saveState();
  $('#registerModal').classList.add('hidden');
  $('#app').classList.remove('hidden');
  renderApp();
};

window.login = () => {
  const email = $('#loginEmail').value.trim();
  const pass = $('#loginPass').value;
  const user = STATE.users.find(u => u.email === email && u.pass === pass);
  if (!user) return alert('Invalid credentials');
  STATE.user = user;
  saveState();
  $('#loginModal').classList.add('hidden');
  $('#app').classList.remove('hidden');
  renderApp();
};

/* ---------- 5. Rendering ---------- */
function renderApp() {
  const u = STATE.user;
  $('#navName').textContent = u.name;
  $('#navAvatar').src = u.avatar;
  switchTab(STATE.currentTab);
  renderUserList(); // For DMs
  renderContentFeed();
}

window.switchTab = (tab) => {
  STATE.currentTab = tab;
  $$('.tab').forEach(el => el.classList.remove('active'));
  $(`.tab[data-tab="${tab}"]`).classList.add('active');
  $('#serversList').classList.toggle('hidden', tab !== 'servers');
  $('#dmsList').classList.toggle('hidden', tab !== 'dms');
  $('#contentList').classList.toggle('hidden', tab !== 'content');
  $('#mainTitle').textContent = tab.charAt(0).toUpperCase() + tab.slice(1);
  if (tab === 'dms') renderDMList();
  if (tab === 'content') renderContentFeed();
  else if (tab === 'servers') renderMessages();
  else if (STATE.currentDM) renderDMMessages();
};

/* ----- Servers & Messages (Updated) ----- */
window.switchServer = (srv) => {
  STATE.currentServer = srv;
  $$('.server').forEach(el => el.classList.remove('active'));
  $(`.server[data-server="${srv}"]`).classList.add('active');
  $('#mainTitle').textContent = srv.charAt(0).toUpperCase() + srv.slice(1);
  renderMessages();
};

function renderMessages() {
  $('#dmArea').classList.add('hidden');
  $('#messagesArea').classList.remove('hidden');
  $('#contentFeed').classList.add('hidden');
  const container = $('#messages');
  container.innerHTML = '';
  const msgs = STATE.messages[STATE.currentServer] || [];
  msgs.forEach(m => {
    const user = STATE.users.find(u => u.id === m.userId) || { name: '??', avatar: '' };
    const isMe = m.userId === STATE.user.id;
    const bubble = document.createElement('div');
    bubble.className = `flex ${isMe ? 'justify-end' : ''} gap-2`;
    bubble.innerHTML = `
      ${!isMe ? `<img src="${user.avatar}" class="w-8 h-8 rounded-full border-2 border-red-500">` : ''}
      <div class="${isMe ? 'bg-red-500/20' : 'bg-gray-800'} max-w-xs px-4 py-2 rounded-2xl border border-red-500/20">
        <div class="text-xs opacity-70">${user.name}</div>
        <div>${m.text}</div>
      </div>
    `;
    container.appendChild(bubble);
  });
  container.scrollTop = container.scrollHeight;
}

window.handleEnter = (e) => { if (e.key === 'Enter') sendMessage(); };
window.sendMessage = () => {
  const text = $('#msgInput').value.trim();
  if (!text) return;
  if (!STATE.messages[STATE.currentServer]) STATE.messages[STATE.currentServer] = [];
  STATE.messages[STATE.currentServer].push({ id: genId(), userId: STATE.user.id, text, ts: Date.now() });
  STATE.user.msgs++;
  saveState();
  $('#msgInput').value = '';
  renderMessages();
};

/* ----- DMs (New & Fixed) ----- */
function renderDMList() {
  const container = $('#dmUserList');
  container.innerHTML = '';
  STATE.users.filter(u => u.id !== STATE.user.id).forEach(u => {
    const key = [STATE.user.id, u.id].sort().join('_');
    const dms = STATE.dms[key] || [];
    const lastMsg = dms[dms.length - 1];
    const el = document.createElement('div');
    el.className = 'flex items-center gap-3 p-2 bg-gray-800 rounded-xl cursor-pointer hover:bg-red-500/10';
    el.onclick = () => openDM(u.id);
    el.innerHTML = `
      <img src="${u.avatar}" class="w-9 h-9 rounded-full border-2 border-red-500">
      <div class="flex-1">
        <div class="font-medium">${u.name}</div>
        <div class="text-xs opacity-70">${lastMsg ? lastMsg.text.slice(0, 20) + '...' : 'Start chat'}</div>
      </div>
    `;
    container.appendChild(el);
  });
}
window.searchDMs = () => {
  const term = $('#searchDMs').value.toLowerCase();
  $$('#dmUserList > div').forEach(el => {
    const name = el.querySelector('div > div').textContent.toLowerCase();
    el.style.display = name.includes(term) ? '' : 'none';
  });
};

function openDM(targetId) {
  STATE.currentDM = { targetId, key: [STATE.user.id, targetId].sort().join('_') };
  STATE.dms[STATE.currentDM.key] = STATE.dms[STATE.currentDM.key] || [];
  $('#mainTitle').textContent = STATE.users.find(u => u.id === targetId)?.name || 'DM';
  $('#dmArea').classList.remove('hidden');
  $('#messagesArea').classList.add('hidden');
  $('#contentFeed').classList.add('hidden');
  renderDMMessages();
}

function renderDMMessages() {
  if (!STATE.currentDM) return;
  const container = $('#dmMessages');
  container.innerHTML = '';
  const msgs = STATE.dms[STATE.currentDM.key];
  msgs.forEach(m => {
    const user = STATE.users.find(u => u.id === m.userId) || { name: '??', avatar: '' };
    const isMe = m.userId === STATE.user.id;
    const bubble = document.createElement('div');
    bubble.className = `flex ${isMe ? 'justify-end' : ''} gap-2`;
    bubble.innerHTML = `
      ${!isMe ? `<img src="${user.avatar}" class="w-8 h-8 rounded-full border-2 border-red-500">` : ''}
      <div class="${isMe ? 'bg-red-500/20' : 'bg-gray-800'} max-w-xs px-4 py-2 rounded-2xl border border-red-500/20">
        <div class="text-xs opacity-70">${user.name}</div>
        <div>${m.text}</div>
      </div>
    `;
    container.appendChild(bubble);
  });
  container.scrollTop = container.scrollHeight;
}

window.handleDMEnter = (e) => { if (e.key === 'Enter') sendDM(); };
window.sendDM = () => {
  if (!STATE.currentDM) return;
  const text = $('#dmInput').value.trim();
  if (!text) return;
  STATE.dms[STATE.currentDM.key].push({ id: genId(), userId: STATE.user.id, text, ts: Date.now() });
  STATE.user.msgs++;
  saveState();
  $('#dmInput').value = '';
  renderDMMessages();
};

window.startDM = () => {
  const targetId = profileTargetId;
  openDM(targetId);
  closeProfile();
};

/* ----- Content Hub (New) ----- */
window.showUpload = () => $('#uploadModal').classList.remove('hidden');
window.closeUpload = () => $('#uploadModal').classList.add('hidden');

function renderContentFeed() {
  $('#contentFeed').classList.remove('hidden');
  $('#messagesArea').classList.add('hidden');
  $('#dmArea').classList.add('hidden');
  const container = $('#contentFeed');
  container.innerHTML = '';
  STATE.content.forEach(item => {
    const user = STATE.users.find(u => u.id === item.userId);
    const el = document.createElement('div');
    el.className = 'content-item';
    let mediaHtml = '';
    if (item.type === 'video') {
      mediaHtml = `<video src="${item.data}" controls class="content-video" muted loop></video>`;
    } else {
      mediaHtml = `<pre class="content-script">${atob(item.data.split(',')[1])}</pre>`; // Decode base64 for scripts
    }
    el.innerHTML = `
      <div class="flex items-center gap-3 mb-3">
        <img src="${user?.avatar}" class="w-10 h-10 rounded-full border-2 border-red-500">
        <div><h3 class="font-bold">${item.title}</h3><p class="text-xs opacity-70">By ${user?.name}</p></div>
      </div>
      ${mediaHtml}
      <div class="flex justify-between items-center mt-3">
        <button onclick="likeContent('${item.id}')" class="like-btn"><i class="fas fa-heart mr-1"></i> ${item.likes}</button>
        <button onclick="addComment('${item.id}')" class="like-btn text-xs">Comment</button>
      </div>
    `;
    container.appendChild(el);
  });
}

window.uploadContent = () => {
  const type = $('#contentType').value;
  const title = $('#uploadTitle').value.trim();
  const file = $('#uploadFile').files[0];
  if (!title || !file) return alert('Title + file required');
  if (type === 'video' && !file.type.startsWith('video/')) return alert('Video only');
  if (type === 'script' && !['text/plain', 'application/x-lua'].includes(file.type)) return alert('Script files only');

  const reader = new FileReader();
  reader.onload = (e) => {
    STATE.content.push({
      id: genId(),
      userId: STATE.user.id,
      title,
      type,
      data: e.target.result, // base64
      likes: 0,
      comments: [],
    });
    STATE.user.posts++;
    saveState();
    alert('Content uploaded!');
    closeUpload();
    $('#uploadTitle').value = '';
    $('#uploadFile').value = '';
    if (STATE.currentTab === 'content') renderContentFeed();
  };
  reader.readAsDataURL(file);
};

window.likeContent = (id) => {
  const item = STATE.content.find(c => c.id === id);
  if (item) {
    item.likes++;
    STATE.user.likes++;
    saveState();
    renderContentFeed();
  }
};

window.addComment = (id) => {
  const comment = prompt('Add comment:');
  if (comment) {
    const item = STATE.content.find(c => c.id === id);
    item.comments.push({ userId: STATE.user.id, text: comment });
    saveState();
    renderContentFeed(); // Re-render to show comments if expanded
  }
};

/* ----- Profile (Updated) ----- */
let profileTargetId = null;
window.showProfile = () => openProfile(STATE.user.id);
function openProfile(uid) {
  const u = STATE.users.find(x => x.id === uid);
  if (!u) return;
  profileTargetId = uid;
  $('#profileNameModal').textContent = u.name;
  $('#profileAvatar').src = u.avatar;
  $('#profileBioModal').textContent = u.bio || 'No bio yet';
  $('#profileLikes').textContent = u.likes || 0;
  $('#profileContent').textContent = u.posts || 0;
  $('#profileMessages').textContent = u.msgs || 0;
  $('#profileModal').classList.remove('hidden');
}
window.closeProfile = () => $('#profileModal').classList.add('hidden');

/* ----- Settings (New) ----- */
window.showSettings = () => {
  $('#settingsPanel').classList.remove('hidden');
  $('#settingsPanel').classList.remove('translate-x-full');
};
window.closeSettings = () => {
  $('#settingsPanel').classList.add('translate-x-full');
  setTimeout(() => $('#settingsPanel').classList.add('hidden'), 300);
};

window.updateRedIntensity = (val) => {
  STATE.redIntensity = parseFloat(val);
  document.documentElement.style.setProperty('--red-intensity', val);
  saveState();
};

window.toggleRedIntensity = () => {
  const current = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--red-intensity'));
  updateRedIntensity(current === 0.8 ? 1.0 : 0.5); // Toggle high/low
};

window.exportData = () => {
  const data = JSON.stringify(STATE, null, 2);
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'blackout-data.json';
  a.click();
};

window.logout = () => {
  STATE.user = null;
  saveState();
  $('#app').classList.add('hidden');
  $('#loginModal').classList.remove('hidden');
  closeSettings();
};
