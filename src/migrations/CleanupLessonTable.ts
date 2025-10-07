import { MigrationInterface, QueryRunner } from "typeorm";

export class CleanupLessonTable1759265000000 implements MigrationInterface {
    name = 'CleanupLessonTable1759265000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Drop unused columns from lesson table
        await queryRunner.query(`ALTER TABLE "lesson" DROP COLUMN "teacher_id"`);
        await queryRunner.query(`ALTER TABLE "lesson" DROP COLUMN "description"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Add back the columns if rollback is needed
        await queryRunner.query(`ALTER TABLE "lesson" ADD "teacher_id" uuid`);
        await queryRunner.query(`ALTER TABLE "lesson" ADD "description" text`);
    }
}
