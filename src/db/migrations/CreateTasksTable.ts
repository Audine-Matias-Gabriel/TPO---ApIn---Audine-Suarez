import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTasksTable implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
        //await queryRunner.query('');
    }
    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query('DROP TABLE IF EXISTS Projects');
    }
}