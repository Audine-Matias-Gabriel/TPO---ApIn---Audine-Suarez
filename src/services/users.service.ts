import { User } from '../entities/User.entity';
import AppDataSource from '../db/data-source';

const userRepository = AppDataSource.getRepository(User);

export const usersService = {

    async create(userData: Partial<User>) {
        const user = userRepository.create(userData);
        return userRepository.save(user);
    },

    async findAll() {
        return userRepository.find();
    },
    
    async findById(id: string) {
        return userRepository.findOne({ where: { id } });
    },

    async update(id: string, updateData: Partial<User>) {
        await userRepository.update(id, updateData);
        return userRepository.findOne({ where: { id } });
    },

    async delete(id: string) {
        return userRepository.delete(id);
    },
}