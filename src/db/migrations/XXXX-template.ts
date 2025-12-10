import { MigrationInterface, QueryRunner } from "typeorm"; 
export class TemplateMigrationXXXX implements MigrationInterface { 
  name = "TemplateMigrationXXXX"; 
 
  public async up(queryRunner: QueryRunner): Promise<void> { 
    await queryRunner.query(` 
      CREATE TABLE task_templates ( 
        id SERIAL PRIMARY KEY, 
        name VARCHAR NOT NULL, 
        description TEXT, 
        priority VARCHAR NOT NULL DEFAULT 'MEDIUM', 
        "teamId" integer, 
        "creatorId" integer NOT NULL, 
        "createdAt" TIMESTAMP DEFAULT now(), 
        "updatedAt" TIMESTAMP DEFAULT now(), 
        CONSTRAINT template_unique UNIQUE (name, "creatorId") 
      ); 
    `); 
 
    await queryRunner.query(` 
      CREATE TABLE task_template_tags ( 
        "templateId" integer REFERENCES task_templates(id) ON DELETE CASCADE, 
        "tagId" integer REFERENCES tags(id) ON DELETE CASCADE, 
        PRIMARY KEY ("templateId", "tagId") 
      ); 
    `); 
  } 
 
  public async down(queryRunner: QueryRunner): Promise<void> { 
    await queryRunner.query(`DROP TABLE task_template_tags`); 
    await queryRunner.query(`DROP TABLE task_templates`); 
  } 
}
