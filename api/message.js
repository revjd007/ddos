const Message = {
  handleEnter(e) { if (e.key === 'Enter') this.send(); },
  send() {
    const input = $('#dmInput');
    const text = input.value.trim();
    if (!text || !App.currentDM) return;
    const msg = { from: App.currentUser.id, to: App.currentDM.id, text, ts: Date.now() };
    let dms = JSON.parse(localStorage.getItem('dms') || '[]');
    dms.push(msg);
    localStorage.setItem('dms', JSON.stringify(dms));
    input.value = '';
    this.render();
  },
  openDM(user) {
    App.currentDM = user;
    $('#playersView').classList.add('hidden');
    $('#dmView').classList.remove('hidden');
    $('#mainTitle').textContent = `DM with ${user.displayName}`;
    this.render();
  },
  render() {
    const container = $('#dmMessages');
    container.innerHTML = '';
    const dms = JSON.parse(localStorage.getItem('dms') || '[]')
      .filter(m => (m.from === App.currentUser.id && m.to === App.currentDM.id) || 
                   (m.to === App.currentUser.id && m.from === App.currentDM.id));
    dms.forEach(m => {
      const isMe = m.from === App.currentUser.id;
      const div = document.createElement('div');
      div.className = `flex ${isMe ? 'justify-end' : ''} gap-3`;
      div.innerHTML = `<div class="message ${isMe ? 'me' : 'other'}">${m.text}</div>`;
      container.appendChild(div);
    });
    container.scrollTop = container.scrollHeight;
  }
};
