import { Comment } from "../entities/Comment.entity";
import AppDataSource from "../db/data-source";

const commentRepository = AppDataSource.getRepository(Comment);

export const commentsService = {
    async create(commentData: Partial<Comment>) {
        const comment = commentRepository.create(commentData);
        return commentRepository.save(comment);
    },

    async findAll() {
        return commentRepository.find();
    },

    async findById(id: string) {
        return commentRepository.findOne({ where: { id } });
    },

    async update(id: string, updateData: Partial<Comment>) {
        await commentRepository.update(id, updateData);
        return commentRepository.findOne({ where: { id } });
    },

    async delete(id: string) {
        return commentRepository.delete(id);
    }
};