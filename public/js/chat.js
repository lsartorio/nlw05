let _socket_admin_id;
let _email;

let socket;

document.querySelector("#start_chat").addEventListener("click", (event) => {
    console.log('Starting chat...');

    socket = io();
    
    const chat_help = document.getElementById('chat_help');
    chat_help.style.display = 'none';

    const chat_in_support = document.getElementById('chat_in_support');
    chat_in_support.style.display = 'block';

    console.log('Chat connection started:', socket);

    const email = document.getElementById('email').value;
    _email= email;

    const text = document.getElementById('txt_help').value;

    socket.on('connect', () => {
        socket.emit('client_first_access', { email, text }, (call, err) => {
            if(err) console.error('Error emitting event "client_first_access":', err);
            else if(call) console.info('"client_first_access" event callback', call);
        })
    });

    socket.on('client_list_all_messages', (messages) => {
        const template_client = document.getElementById('message-user-template').innerHTML;
        const template_admin = document.getElementById('admin-template').innerHTML;

        console.log('Messages', messages);

        if(messages.length === 0) return;

        function renderTemplate(template, message) {
            const rendered = Mustache.render(template, { 
                message: message.text, 
                email: message.user.email 
            });

            document.getElementById('messages').innerHTML += rendered;
        }

        messages.forEach((message) => {
            if(message.admin_id === null) renderTemplate(template_client, message);
            else renderTemplate(template_admin, message);
        });
    });

    socket.on('admin_send_to_client', (message) => {
        _socket_admin_id = message.socket_id;

        const template_admin = document.getElementById('admin-template').innerHTML;

        const rendered = Mustache.render(template_admin, {
            message_admin: message.text,
        });

        document.getElementById('messages').innerHTML += rendered;
    });
});

document.querySelector("#send_message_button").addEventListener("click", (event) => {
    const text = document.getElementById('message_user');

    const params = {
        text: text.value,
        socket_admin_id: _socket_admin_id
    }

    socket.emit('client_send_to_admin', params);

    const template_client = document.getElementById('message-user-template').innerHTML;

    const rendered = Mustache.render(template_client, {
        message: text.value,
        email: _email
    });

    document.getElementById('messages').innerHTML += rendered;
}); 