const Video = {
  upload() {
    const type = $('#contentType').value;
    const title = $('#uploadTitle').value.trim();
    const file = $('#uploadFile').files[0];
    if (!title || !file) return alert('Required');
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = JSON.parse(localStorage.getItem('content') || '[]');
      content.push({ id: Date.now(), title, type, data: e.target.result, likes: 0 });
      localStorage.setItem('content', JSON.stringify(content));
      App.closeModal('uploadModal');
      this.render();
    };
    reader.readAsDataURL(file);
  },
  render() {
    const feed = $('#contentFeed'); feed.innerHTML = '';
    const content = JSON.parse(localStorage.getItem('content') || '[]');
    content.forEach(item => {
      const el = document.createElement('div');
      el.className = 'bg-gray-900/50 backdrop-blur border border-red-900/50 rounded-2xl p-6';
      el.innerHTML = `<h3 class="font-bold text-lg mb-3">${item.title}</h3>
        ${item.type === 'video' ? `<video src="${item.data}" controls class="w-full rounded-xl"></video>` : `<pre class="bg-black p-4 rounded-xl text-green-400 font-mono text-sm">${atob(item.data.split(',')[1])}</pre>`}`;
      feed.appendChild(el);
    });
  }
};
