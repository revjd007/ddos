const Auth = {
  showRegister() {
    $('#loginModal').classList.add('hidden');
    $('#registerModal').classList.remove('hidden');
  },
  showLogin() {
    $('#registerModal').classList.add('hidden');
    $('#loginModal').classList.remove('hidden');
  },
  register() {
    const email = $('#regEmail').value.trim();
    const pass = $('#regPass').value;
    if (!email || !pass) return alert('Fill all fields');
    if (localStorage.getItem(`user_${email}`)) return alert('Email already registered');

    const user = {
      id: Date.now().toString(),
      email,
      pass,
      name: email.split('@')[0],
      avatar: `https://api.dicebear.com/9.x/identicon/svg?seed=${email}`,
      posts: 0,
      msgs: 0,
      likes: 0
    };

    localStorage.setItem(`user_${email}`, JSON.stringify(user));
    this.loginUser(user);
  },
  login() {
    const email = $('#loginEmail').value.trim();
    const pass = $('#loginPass').value;
    const data = localStorage.getItem(`user_${email}`);
    if (!data) return alert('User not found');
    const user = JSON.parse(data);
    if (user.pass !== pass) return alert('Wrong password');
    this.loginUser(user);
  },
  loginUser(user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
    $('#loginModal').classList.add('hidden');
    $('#registerModal').classList.add('hidden');
    $('#app').classList.remove('hidden');
    Users.init(user);
    App.setTab('servers');
    Message.render();
  },
  logout() {
    localStorage.removeItem('currentUser');
    location.reload();
  }
};
