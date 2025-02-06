const socket = io('http://localhost:5100/chat');

const token = localStorage.getItem('token');
if (!token) {
    window.location.href = '/login';
}

socket.emit('joinRoom', 'general', 'username');

document.getElementById('send-btn').addEventListener('click', () => {
    const message = document.getElementById('message').value;
    socket.emit('chatMessage', message, 'general', 'username');
    document.getElementById('message').value = '';
});

socket.on('message', (msg) => {
    const messageContainer = document.getElementById('messages');
    messageContainer.innerHTML += `<p>${msg}</p>`;
});
