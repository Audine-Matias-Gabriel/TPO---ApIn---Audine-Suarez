import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTasksTable1700000000002 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS tasks (
                id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
                title varchar(255) NOT NULL,
                description text,
                status varchar(32) NOT NULL DEFAULT 'pending',
                created_at timestamptz NOT NULL DEFAULT now(),
                last_updated timestamptz NOT NULL DEFAULT now(),
                due_date timestamptz,
                assigned_to uuid,
                project_id uuid NOT NULL,
                CONSTRAINT fk_task_user FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL,
                CONSTRAINT fk_task_project FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
            );
        `);
    }
    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query('DROP TABLE IF EXISTS tasks');
    }
}