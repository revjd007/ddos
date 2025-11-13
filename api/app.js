const API_BASE = 'http://localhost:3000/api';
let token = localStorage.getItem('token');
let currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');

const App = {
  async init() {
    if (token && currentUser) {
      await Users.loadProfile();
      $('#authScreen').classList.add('hidden');
      $('#app').classList.remove('hidden');
      $('#navButtons').style.display = 'flex';
      App.setTab('players');
    }
  },

  setView(view) {
    alert(`Coming soon: ${view}`);
  },

  toggleTheme() {
    document.body.classList.toggle('invert'); // Simple toggle
  },

  setTab(tab) {
    document.querySelectorAll('.tab, .tab-icon').forEach(el => el.classList.remove('active'));
    document.querySelectorAll(`[data-tab="${tab}"]`).forEach(el => el.classList.add('active'));
    ['players', 'dms', 'profile', 'settings'].forEach(t => {
      $(`#${t}View`).classList.toggle('hidden', t !== tab);
    });
    $('#mainTitle').textContent = {
      players: 'Find Players',
      dms: 'Direct Messages',
      profile: 'My Profile',
      settings: 'Settings'
    }[tab];

    if (tab === 'players') Users.renderPlayers();
    if (tab === 'dms') Users.renderDMs();
    if (tab === 'profile') Users.renderProfile();
  }
};

const $ = (s) => document.querySelector(s);
async function api(path, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  if (res.status === 401) { localStorage.clear(); location.reload(); }
  return res.json();
}

document.addEventListener('DOMContentLoaded', App.init);
