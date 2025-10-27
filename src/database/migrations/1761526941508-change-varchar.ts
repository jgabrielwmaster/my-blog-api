import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeVarchar1761526941508 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "posts" ALTER COLUMN "cover_image_url" TYPE character varying(900)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "posts" ALTER COLUMN "cover_image_url" TYPE character varying(800)`,
    );
  }
}
