const App = {
  setTab(tab) {
    document.querySelectorAll('.tab, .tab-icon').forEach(el => el.classList.remove('active'));
    document.querySelectorAll(`[data-tab="${tab}"]`).forEach(el => el.classList.add('active'));
    ['servers', 'dms', 'content'].forEach(t => {
      $(`#${t}List`).classList.toggle('hidden', t !== tab);
      $(`#${t === 'servers' ? 'chat' : t === 'dms' ? 'dm' : 'content'}View`).classList.toggle('hidden', t !== tab);
    });
    $('#mainTitle').textContent = tab.toUpperCase();
    if (tab === 'servers') Message.render();
    if (tab === 'dms') Users.renderDMs();
    if (tab === 'content') Video.render();
  },
  showSettings() { $('#settingsPanel').classList.remove('hidden', 'translate-x-full'); },
  closeSettings() { $('#settingsPanel').classList.add('translate-x-full'); setTimeout(() => $('#settingsPanel').classList.add('hidden'), 300); },
  closeModal(id) { $(`#${id}`).classList.add('hidden'); }
};
const $ = (s) => document.querySelector(s);
