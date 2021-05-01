import { getCustomRepository } from 'typeorm';
import { Setting } from '../entities/Setting';
import { SettingsRepository } from '../repositories/SettingsRepository';

interface ISettingsCreate {
	chat: boolean;
	username: string;
}

class SettingsService {
	constructor() {}

	async create({ chat, username }: ISettingsCreate) {
		const settingsRepository = getCustomRepository(SettingsRepository);
	
		const userAlreadyExists = await settingsRepository.findOne({
			username,
		});

		if (userAlreadyExists) throw new Error('User already exists');

		const settings = settingsRepository.create({
			chat,
			username,
		});

		return settingsRepository.save(settings);
	}

	async findByUsername(username: string) {
		const settingsRepository = getCustomRepository(SettingsRepository);

		return settingsRepository.findOne({ username });
	}

	async update(username: string, chat: boolean) {
		const settingsRepository = getCustomRepository(SettingsRepository);
		return settingsRepository
			.createQueryBuilder()
			.update(Setting)
			.set({ chat })
			.where('username = :username', { username })
            .execute();
	}
}

export { SettingsService };
