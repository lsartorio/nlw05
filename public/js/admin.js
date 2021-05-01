const socket = io();

let _connections = [];

socket.on('admin_list_all_users', (connections) => {
    console.info('Hello admin!');
    console.info('connections', connections);

    _connections = connections;

    document.getElementById('list_users').innerHTML = '';

    let template = document.getElementById('template').innerHTML;

    connections.forEach((connection) => {
        const rendered = Mustache.render(template, {
            email: connection.user.email,
            id: connection.socket_id
        });

        document.getElementById('list_users').innerHTML += rendered;
    });
});

socket.on('admin_receive_message', (data) => {
    console.log('admin_receive_message', data);

    const connection = _connections.find(c => c.socket_id === data.socket_id);

    const divMessages = document.getElementById(`all-messages-${connection.user.id}`);
    const createDiv = document.createElement('div');

    createDiv.className = 'admin_message_client';
    createDiv.innerHTML = `<span>${connection.user.email} - ${data.message.text}</span>`;
    createDiv.innerHTML += `<span class="admin_date">${dayjs(data.message.created_at).format('DD/MM/YYYY HH:mm:ss')}</span>`;

    divMessages.appendChild(createDiv);
});

const call = (id) => {
    const connection = _connections.find((c) => c.socket_id === id);

    const template = document.getElementById('admin_template').innerHTML;

    const rendered = Mustache.render(template, {
        email: connection.user.email,
        id: connection.user.id,
    })

    document.getElementById('supports').innerHTML += rendered;

    socket.emit('admin_user_in_support', { user_id: connection.user.id });

    socket.emit('admin_list_message_by_user', { user_id: connection.user.id }, (messages) => {
        console.log('admin_list_message_by_user', messages);

        const divMessages = document.getElementById(`all-messages-${connection.user.id}`);

        messages.forEach((message) => {
            const createDiv = document.createElement('div');

            if(message.admin_id === null) {
                createDiv.className = 'admin_message_client';
                createDiv.innerHTML = `<span>${connection.user.email} - ${message.text}</span>`;
            } else {
                createDiv.className = 'admin_message_admin';
                createDiv.innerHTML = `Atendente: <span>${message.text}</span>`;
            }

            createDiv.innerHTML += `<span class="admin_date">${dayjs(message.created_at).format('DD/MM/YYYY HH:mm:ss')}</span>`;

            divMessages.appendChild(createDiv);
        });
    });
};

const sendMessage = (id) => {
    const text = document.getElementById(`send_message_${id}`);

    const params = {
        text: text.value,
        user_id: id
    };

    socket.emit('admin_send_message', params);

    const divMessages = document.getElementById(`all-messages-${id}`);
    const createDiv = document.createElement('div');

    createDiv.className = 'admin_message_admin';
    createDiv.innerHTML = `Atendente: <span>${text.value}</span>`;
    createDiv.innerHTML += `<span class="admin_date">${dayjs().format('DD/MM/YYYY HH:mm:ss')}</span>`;

    divMessages.appendChild(createDiv);
    text.value = '';
}