const Auth = {
  showRegister() { $('#loginModal').classList.add('hidden'); $('#registerModal').classList.remove('hidden'); },
  showLogin() { $('#registerModal').classList.add('hidden'); $('#loginModal').classList.remove('hidden'); },
  register() {
    const email = $('#regEmail').value.trim(), pass = $('#regPass').value;
    if (!email || !pass) return alert('Fill all');
    if (localStorage.getItem(`user_${email}`)) return alert('Taken');
    const user = { id: Date.now(), email, pass, name: email.split('@')[0], avatar: `https://api.dicebear.com/9.x/identicon/svg?seed=${email}` };
    localStorage.setItem(`user_${email}`, JSON.stringify(user));
    this.loginUser(user);
  },
  login() {
    const email = $('#loginEmail').value.trim(), pass = $('#loginPass').value;
    const data = localStorage.getItem(`user_${email}`);
    if (!data) return alert('Not found');
    const user = JSON.parse(data);
    if (user.pass !== pass) return alert('Wrong pass');
    this.loginUser(user);
  },
  loginUser(user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
    $('#loginModal').classList.add('hidden');
    $('#registerModal').classList.add('hidden');
    $('#app').classList.remove('hidden');
    App.setTab('servers');
    Users.init(user);
  },
  logout() { localStorage.removeItem('currentUser'); location.reload(); }
};
