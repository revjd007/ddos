const App = {
  currentUser: null,
  currentDM: null,

  init() {
    const saved = localStorage.getItem('currentUser');
    if (saved) {
      this.currentUser = JSON.parse(saved);
      this.enterApp();
    }
  },

  setView(view) {
    // Future: Home, Hub, Chat pages
    alert(`Coming soon: ${view}`);
  },

  toggleTheme() {
    document.body.classList.toggle('bg-gradient-to-b');
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
  },

  enterApp() {
    $('#loginScreen').classList.add('hidden');
    $('#app').classList.remove('hidden');
    Users.init(this.currentUser);
    App.setTab('players');
  }
};

const $ = (s) => document.querySelector(s);
document.addEventListener('DOMContentLoaded', () => App.init());
