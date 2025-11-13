import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUserProjectsTable1700000000004 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS users_projects (
                id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
                user_id uuid NOT NULL,
                project_id uuid NOT NULL,
                role varchar(32) NOT NULL,
                created_at timestamptz NOT NULL DEFAULT now(),
                CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                CONSTRAINT fk_project FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
            );
    `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop join table
        await queryRunner.query(`DROP TABLE IF EXISTS users_projects;`);
    }
}