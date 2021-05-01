import { Request, Response } from "express";
import { SettingsService } from "../services/SettingsService";

class SettingsController {
    async create(request: Request, response: Response) {
        const { chat, username } = request.body;

        const settingsService = new SettingsService();

        try {
            const savedSettings = await settingsService.create({ chat, username });
            return response.json(savedSettings);
        } catch(err) {
            return response.status(400).json({ message: err.message });
        }
    }

    async findByUserName(request: Request, response: Response) {
        const { username } = request.params;

        const settingsService = new SettingsService();
        const settings = await settingsService.findByUsername(username);

        return response.json(settings);
    }

    async update(request: Request, response: Response) {
        const { username } = request.params;
        const { chat } = request.body;

        const settingsService = new SettingsService();
        const updatedSettings = await settingsService.update(username, chat);

        return response.json(updatedSettings);
    }
}

export { SettingsController }