const Users = {
  init(user) {
    $('#navName').textContent = user.displayName;
    $('#navRole').textContent = user.role;
    $('#navAvatar').src = $('#navAvatarSm').src = user.avatar;
  },

  renderPlayers() {
    const list = $('#playerList');
    list.innerHTML = '';
    const current = App.currentUser;

    // Mock players + real registered
    const mock = [
      { id: '1', username: 'xXProGamerXx', displayName: 'ProGamer', avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=1' },
      { id: '2', username: 'NinjaGirl', displayName: 'Ninja', avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=2' }
    ];

    [...mock, ...(current.email === 'pdigger48@gmail.com' ? [] : [current])].forEach(u => {
      if (u.id === current.id) return;
      const div = document.createElement('div');
      div.className = 'player-card';
      div.onclick = () => Message.openDM(u);
      div(innerHTML = `
        <div class="flex items-center gap-3">
          <img src="${u.avatar}" class="w-12 h-12 rounded-full border-2 border-red-600">
          <div>
            <div class="font-bold">${u.displayName}</div>
            <div class="text-xs opacity-70">@${u.username}</div>
          </div>
        </div>
        <button class="bg-red-700 hover:bg-red-600 px-4 py-2 rounded-full text-sm font-bold">ADD</button>
      `;
      list.appendChild(div);
    });
  },

  search() {
    const term = $('#searchPlayers').value.toLowerCase();
    $$('.player-card').forEach(card => {
      const name = card.querySelector('div font-bold').textContent.toLowerCase();
      card.style.display = name.includes(term) ? '' : 'none';
    });
  },

  renderDMs() {
    // Future: list DMs
    $('#mainTitle').textContent = 'DMs (Coming Soon)';
  },

  renderProfile() {
    const u = App.currentUser;
    $('#profileName').textContent = u.displayName;
    $('#profileEmail').textContent = u.email;
    $('#profileRole').textContent = u.role;
    $('#profileAvatar').src = u.avatar;
    $('#profilePosts').textContent = u.posts;
    $('#profileFriends').textContent = u.friends.length;
    $('#profileMessages').textContent = u.messages;
  }
};
