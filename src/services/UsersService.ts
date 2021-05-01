import { getCustomRepository } from "typeorm";
import { UserRepository } from "../repositories/UserRepository";

class UsersService {
    private usersRepository: UserRepository;

    constructor() {
        this.usersRepository = getCustomRepository(UserRepository);
    }

    async findByEmail(email: string) {
		return this.usersRepository.findOne({ email });
	}

    async create(email: string) {
        const userAlreadyExists = await this.findByEmail(email);

        if (userAlreadyExists) return userAlreadyExists;

        const createdUser = this.usersRepository.create({ email });

        return this.usersRepository.save(createdUser);
    }
}

export { UsersService };