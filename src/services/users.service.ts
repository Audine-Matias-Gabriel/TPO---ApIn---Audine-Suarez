import { User } from '../entities/User.entity';
import { validateUserEmail } from '../validators/users.validator';
import { UserRepository } from '../repositories/UserRepository';

const userRepository = new UserRepository();

export const usersService = {

    async create(userData: Partial<User>) {
        if (!userData.email) {
            throw new Error('Email is required');
        }
        if (validateUserEmail(userData.email).length != 0) {
            throw new Error('Invalid email format');
        }
        const existingUser = await userRepository.findByEmail(userData.email);
        if (existingUser) {
            throw new Error('Email already in use');
        }
        const user = await userRepository.createOne(userData as User);
        return user;
    },

    async findAll() {
        return userRepository.findAll();
    },

    async findById(id: string) {
        return userRepository.findById(id);
    },

    async update(id: string, updateData: Partial<User>) {
        return userRepository.updateOne(id, updateData);
    },

    async delete(id: string) {
        return userRepository.deleteOne(id);
    },
};