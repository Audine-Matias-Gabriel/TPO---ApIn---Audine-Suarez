import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateSubtasksTable1700000000003 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS subtasks (
                id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
                task_id uuid NOT NULL,
                title varchar(100) NOT NULL,
                description text,
                status varchar(32) NOT NULL DEFAULT 'pending',
                "order" int NOT NULL,
                created_at timestamptz NOT NULL DEFAULT now(),
                updated_at timestamptz NOT NULL DEFAULT now(),

                CONSTRAINT fk_subtask_task FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE
            );
        `);
        await queryRunner.query(`
            ALTER TABLE subtasks
                ADD CONSTRAINT unique_order_per_task
                UNIQUE (task_id, "order");
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`DROP TABLE IF EXISTS subtasks`);
    }
}
