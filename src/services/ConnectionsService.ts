import { getCustomRepository } from 'typeorm';
import { Connection } from '../entities/Connection';
import { ConnectionsRepository } from '../repositories/ConnectionsRepository';

interface IConnectionCreate {
    socket_id: string;
    user_id: string;
    admin_id?: string;
    id?: string;
}

class ConnectionsService {
	private connectionsRepository: ConnectionsRepository;

	constructor() {
		this.connectionsRepository = getCustomRepository(ConnectionsRepository);
	}

	async create(connection: IConnectionCreate) {
        const createdConnection = this.connectionsRepository.create(connection);

        console.log('createdConnection', createdConnection);

        return this.connectionsRepository.save(createdConnection);
    }

    async updateAdminId(user_id: string, admin_id: string) {
        return this.connectionsRepository
            .createQueryBuilder()
            .update(Connection)
            .set({ admin_id })
            .where('user_id = :user_id', { user_id })
            .execute();
    }
	
    async findByUserId(user_id: string) {
        return this.connectionsRepository.findOne({ user_id });
    }

    async findBySocketId(socket_id: string) {
        return this.connectionsRepository.findOne({ socket_id });
    }

    async listByWithoutAdmin() {
        return this.connectionsRepository.find({
            where: { admin_id: null },
            relations: ['user'],
        });
    }
}

export { ConnectionsService };
