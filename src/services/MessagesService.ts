import { getCustomRepository } from 'typeorm';
import { MessagesRepository } from '../repositories/MessagesRepository';

interface IMessageCreate {
	admin_id?: string;
	user_id: string;
	text: string;
}

class MessagesService {
	private messagesRepository: MessagesRepository;

	constructor() {
		this.messagesRepository = getCustomRepository(MessagesRepository);
	}

	async create(message: IMessageCreate) {
		const createdMessage = this.messagesRepository.create(message);

		return this.messagesRepository.save(createdMessage);
	}

	async listByUser(user_id: string) {
		return this.messagesRepository.find({
			where: { user_id },
			relations: ['user'],
		});
	}
}

export { MessagesService };
