import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUsersTable implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
        await queryRunner.query('CREATE TABLE IF NOT EXISTS Users ( id uuid PRIMARY KEY DEFAULT uuid_generate_v4, name varchar(255) NOT NULL, email varchar(255) NOT NULL UNIQUE, password varchar(255) NOT NULL, createdAt timestamptz NOT NULL DEFAULT now(), userProjects jsonb )');
    }
    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('DROP TABLE IF EXISTS Users');
    }
}