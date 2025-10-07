import { MigrationInterface, QueryRunner } from "typeorm";

export class CleanupLessonTable1759265000000 implements MigrationInterface {
    name = 'CleanupLessonTable1759265000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Drop unused columns from lesson table if they exist
        const teacherIdExists = await queryRunner.query(`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'lesson' AND column_name = 'teacher_id'
        `);
        
        if (teacherIdExists.length > 0) {
            await queryRunner.query(`ALTER TABLE "lesson" DROP COLUMN "teacher_id"`);
        }
        
        const descriptionExists = await queryRunner.query(`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'lesson' AND column_name = 'description'
        `);
        
        if (descriptionExists.length > 0) {
            await queryRunner.query(`ALTER TABLE "lesson" DROP COLUMN "description"`);
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Add back the columns if rollback is needed
        const teacherIdExists = await queryRunner.query(`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'lesson' AND column_name = 'teacher_id'
        `);
        
        if (teacherIdExists.length === 0) {
            await queryRunner.query(`ALTER TABLE "lesson" ADD "teacher_id" uuid`);
        }
        
        const descriptionExists = await queryRunner.query(`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'lesson' AND column_name = 'description'
        `);
        
        if (descriptionExists.length === 0) {
            await queryRunner.query(`ALTER TABLE "lesson" ADD "description" text`);
        }
    }
}
