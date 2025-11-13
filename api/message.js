const Message = {
  handleEnter(e) { if (e.key === 'Enter') this.send(); },
  send() {
    const input = $('#msgInput'), text = input.value.trim();
    if (!text) return;
    const user = JSON.parse(localStorage.currentUser);
    const key = `messages_general`;
    let msgs = JSON.parse(localStorage.getItem(key) || '[]');
    msgs.push({ userId: user.id, text, ts: Date.now() });
    localStorage.setItem(key, JSON.stringify(msgs));
    input.value = ''; this.render();
  },
  render() {
    const container = $('#messages'); container.innerHTML = '';
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
    $('#mainTitle').textContent = 'DM';
    $('#chatView').classList.add('hidden');
    $('#dmView').classList.remove('hidden');
  }
};
