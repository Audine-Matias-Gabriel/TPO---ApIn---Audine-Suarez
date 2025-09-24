import { User } from '../entities/User.entity';
import AppDataSource from '../db/data-source';
import { validateEmail } from '../validators/users.validator';
//import bcrypt from 'bcrypt';

const userRepository = AppDataSource.getRepository(User);

export const usersService = {

    async create(userData: Partial<User>) {
        //if (userData.password) {userData.password = await bcrypt.hash(userData.password, 10);}
        if (!userData.email) {
            throw new Error("Email is required");
        }
        if (validateEmail(userData.email).length != 0) {
            throw new Error("Invalid email format");
        }
        const existingUser = await userRepository.findOne({ where: { email: userData.email } });
        if (existingUser) {
            throw new Error("Email already in use");
        }
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