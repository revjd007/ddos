const Users = {
  async loadProfile() {
    const user = await api('/profile');
    currentUser = { ...currentUser, ...user };
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    $('#navName').textContent = user.displayName;
    $('#navRole').textContent = user.role;
    $('#navAvatar').src = $('#navAvatarSm').src = user.avatar;
  },

  async renderPlayers() {
    const { search } = new URLSearchParams(window.location.search);
    const players = await api(`/players?search=${search || ''}`);
    const list = $('#playerList');
    list.innerHTML = '';
    players.forEach(u => {
      const div = document.createElement('div');
      div.className = 'player-card';
      div.onclick = () => Message.openDM(u);
      div.innerHTML = `
        <div class="flex items-center gap-3">
          <img src="${u.avatar}" class="w-12 h-12 rounded-full border-2 border-red-600">
          <div>
            <div class="font-bold">${u.displayName}</div>
            <div class="text-xs opacity-70">@${u.username}</div>
            <span class="text-xs text-red-300">${u.role}</span>
          </div>
        </div>
        <button class="bg-red-700 hover:bg-red-600 px-4 py-2 rounded-full text-sm font-bold">MESSAGE</button>
      `;
      list.appendChild(div);
    });
  },

  search() {
    const term = $('#searchPlayers').value;
    window.history.pushState({}, '', `?search=${term}`);
    Users.renderPlayers();
  },

  renderDMs() {
    // List recent DMs - fetch from API if expanded
    $('#dmsList').innerHTML = '<p class="text-red-400">Recent DMs loading...</p>';
  },

  renderProfile() {
    const u = currentUser;
    $('#profileName').textContent = u.displayName;
    $('#profileEmail').textContent = u.email;
    $('#profileRole').textContent = u.role;
    $('#profileAvatar').src = u.avatar;
    $('#profilePosts').textContent = u.posts;
    $('#profileFriends').textContent = u.friends?.length || 0;
    $('#profileMessages').textContent = u.messages;
  }
};
