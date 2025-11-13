const Users = {
  init(user) {
    $('#navName').textContent = user.name;
    $('#navAvatar').src = user.avatar;
    $('#navAvatarSm').src = user.avatar;
  },
  renderDMs() {
    const list = $('#dmUserList');
    if (!list) return;
    list.innerHTML = '';
    const current = JSON.parse(localStorage.currentUser);
    Object.keys(localStorage)
      .filter(k => k.startsWith('user_') && k !== `user_${current.email}`)
      .forEach(k => {
        const u = JSON.parse(localStorage[k]);
        const div = document.createElement('div');
        div.className = 'flex items-center gap-3 p-3 rounded-xl hover:bg-red-900/20 cursor-pointer';
        div.onclick = () => Message.openDM(u.id);
        div.innerHTML = `
          <img src="${u.avatar}" class="w-10 h-10 rounded-full border border-red-600">
          <div class="font-semibold">${u.name}</div>
        `;
        list.appendChild(div);
      });
  }
};
