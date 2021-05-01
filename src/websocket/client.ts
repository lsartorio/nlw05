import { Socket } from 'socket.io';

import { io } from '../http';
import { ConnectionsService } from '../services/ConnectionsService';
import { MessagesService } from '../services/MessagesService';
import { UsersService } from '../services/UsersService';

interface IParams {
    email: string,
    text: string
}

io.on('connect', (socket: Socket) => {
    const connectionsService = new ConnectionsService();
    const userService = new UsersService();
    const messageService = new MessagesService();

    const socket_id = socket.id;

    socket.on('client_first_access', async (params: IParams) => {
        const { text, email } = params;

        let user = await userService.findByEmail(email);
        
        if(!user) user = await userService.create(email);

        const previousConnetion = await connectionsService.findByUserId(user.id);

        if(previousConnetion) { 
            await connectionsService.create({ ...previousConnetion, socket_id });
        } else {
            await connectionsService.create({
                socket_id,
                user_id: user.id
            });
        }

        await messageService.create({
            user_id: user.id,
            text
        })

        const messages = await messageService.listByUser(user.id);

        socket.emit('client_list_all_messages', messages);

        const allUsers = await connectionsService.listByWithoutAdmin();

        io.emit('admin_list_all_users', allUsers);
    });

    socket.on('client_send_to_admin', async (params) => {
        const { text, socket_admin_id } = params;

        const { user_id } = await connectionsService.findBySocketId(socket_id);

        const message = await messageService.create({
            text,
            user_id
        })

        io.to(socket_admin_id).emit('admin_receive_message', {
            message,
            socket_id
        })
    });
});