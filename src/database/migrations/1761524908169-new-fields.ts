import { MigrationInterface, QueryRunner } from "typeorm";

export class NewFields1761524908169 implements MigrationInterface {
    name = 'NewFields1761524908169'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "categories" ADD "description" text`);
        await queryRunner.query(`ALTER TABLE "categories" ADD "cover_image" text`);
        await queryRunner.query(`ALTER TABLE "posts" DROP COLUMN "cover_image_url"`);
        await queryRunner.query(`ALTER TABLE "posts" ADD "cover_image_url" character varying(800)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "posts" DROP COLUMN "cover_image_url"`);
        await queryRunner.query(`ALTER TABLE "posts" ADD "cover_image_url" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "categories" DROP COLUMN "cover_image"`);
        await queryRunner.query(`ALTER TABLE "categories" DROP COLUMN "description"`);
    }

}
