const Auth = {
  quickJoin() {
    const username = $('#usernameInput').value.trim();
    if (!username) return alert('Enter a username');

    const isOwner = username.toLowerCase() === 'pdigger48' || 
                    (username.includes('@') && username.toLowerCase() === 'pdigger48@gmail.com');

    const user = {
      id: Date.now().toString(),
      username,
      email: isOwner ? 'pdigger48@gmail.com' : `${username}@socialhub.gg`,
      displayName: username,
      avatar: `https://api.dicebear.com/9.x/avataaars/svg?seed=${username}`,
      role: isOwner ? 'OWNER' : 'PLAYER',
      posts: 0,
      friends: [],
      messages: 0
    };

    localStorage.setItem('currentUser', JSON.stringify(user));
    App.currentUser = user;
    App.enterApp();
  },

  logout() {
    localStorage.removeItem('currentUser');
    location.reload();
  }
};
