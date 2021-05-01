import { Request, Response } from "express";
import { MessagesService } from "../services/MessagesService";

class MessagesController {
    async create(request: Request, response: Response): Promise<Response> {
        const { user_id, admin_id, text } = request.body;
        const messageService = new MessagesService();

        const message = await messageService.create({ user_id, admin_id, text });

        return response.json(message);
    }

    async listByUser(request: Request, response: Response): Promise<Response> {
        const { id } = request.params;

        const messageService = new MessagesService();
        const messages = await messageService.listByUser(id);

        return response.json(messages);
    }
}

export { MessagesController };