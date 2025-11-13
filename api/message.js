let currentDMUser = null;

const Message = {
  handleEnter(e) {
    if (e.key === 'Enter') this.send();
  },

  async send() {
    const input = $('#dmInput');
    const text = input.value.trim();
    if (!text || !currentDMUser) return;
    try {
      await api('/dms', {
        method: 'POST',
        body: JSON.stringify({ toId: currentDMUser.id, text })
      });
      input.value = '';
      this.render();
    } catch (e) {
      alert(e.error);
    }
  },

  async openDM(user) {
    currentDMUser = user;
    $('#playersView').classList.add('hidden');
    $('#dmView').classList.remove('hidden');
    $('#mainTitle').textContent = `DM with ${user.displayName}`;
    await this.render();
  },

  async render() {
    if (!currentDMUser) return;
    const dms = await api(`/dms/${currentDMUser.id}`);
    const container = $('#dmMessages');
    container.innerHTML = '';
    dms.forEach(m => {
      const isMe = m.fromId === currentUser.id;
      const div = document.createElement('div');
      div.className = `flex ${isMe ? 'justify-end' : ''} gap-3`;
      div.innerHTML = `<div class="message ${isMe ? 'me' : 'other'}">${m.text}</div>`;
      container.appendChild(div);
    });
    container.scrollTop = container.scrollHeight;
  }
};
