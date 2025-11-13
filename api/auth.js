const Auth = {
  async register() {
    const email = $('#emailInput').value;
    const username = $('#usernameInput').value;
    const password = $('#passwordInput').value;
    const displayName = $('#displayNameInput').value;
    if (!email || !username || !password) return alert('Fill all fields');
    try {
      const { token: newToken, user } = await api('/register', {
        method: 'POST',
        body: JSON.stringify({ email, username, password, displayName })
      });
      localStorage.setItem('token', newToken);
      localStorage.setItem('currentUser', JSON.stringify(user));
      currentUser = user;
      token = newToken;
      App.init();
    } catch (e) {
      alert(e.error);
    }
  },

  async login() {
    const email = $('#emailInput').value;
    const password = $('#passwordInput').value;
    if (!email || !password) return alert('Fill all fields');
    try {
      const { token: newToken, user } = await api('/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });
      localStorage.setItem('token', newToken);
      localStorage.setItem('currentUser', JSON.stringify(user));
      currentUser = user;
      token = newToken;
      App.init();
    } catch (e) {
      alert(e.error);
    }
  },

  logout() {
    localStorage.clear();
    location.reload();
  }
};
