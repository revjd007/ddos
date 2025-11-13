const Message = {
  handleEnter(e) { if (e.key === 'Enter') this.send(); },
  send() {
    const input = $('#msgInput');
    const text = input.value.trim();
    if (!text) return;
    const user = JSON.parse(localStorage.currentUser);
    let msgs = JSON.parse(localStorage.getItem('messages_general') || '[]');
    msgs.push({ userId: user.id, text, ts: Date.now() });
    localStorage.setItem('messages_general', JSON.stringify(msgs));
    input.value = '';
    this.render();
  },
  render() {
    const container = $('#messages');
    if (!container) return;
    container.innerHTML = '';
    const user = JSON.parse(localStorage.currentUser);
    const msgs = JSON.parse(localStorage.getItem('messages_general') || '[]');
    msgs.forEach(m => {
      const isMe = m.userId === user.id;
      const div = document.createElement('div');
      div.className = `flex ${isMe ? 'justify-end' : ''} gap-3`;
      div.innerHTML = `<div class="message ${isMe ? 'me' : 'other'}">${m.text}</div>`;
      container.appendChild(div);
    });
    container.scrollTop = container.scrollHeight;
  },
  openDM(id) {
    $('#mainTitle').textContent = 'DM with ' + (JSON.parse(localStorage.getItem('user_' + Object.keys(localStorage).find(k => JSON.parse(localStorage[k]).id === id)) || {}).name;
    $('#chatView').classList.add('hidden');
    $('#dmView').classList.remove('hidden');
  }
};
