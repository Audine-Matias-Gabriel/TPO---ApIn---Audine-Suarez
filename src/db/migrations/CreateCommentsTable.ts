import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateCommentsTable1700000000003 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS comments (
                id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
                body text NOT NULL,
                created_at timestamptz NOT NULL DEFAULT now(),
                author_id uuid NOT NULL,
                task_id uuid NOT NULL,
                CONSTRAINT fk_comment_author FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE,
                CONSTRAINT fk_comment_task FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE
            );
        `);
    }
    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('DROP TABLE IF EXISTS comments');
    }
}