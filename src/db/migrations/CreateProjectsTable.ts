import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateProjectsTable1700000000001 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS projects (
                id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
                name varchar(255) NOT NULL,
                description varchar(255),
                created_at timestamptz NOT NULL DEFAULT now()
            );
        `);
    }
    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('DROP TABLE IF EXISTS projects');
    }
}