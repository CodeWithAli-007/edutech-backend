import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateLessonCourseColumns1759262000000 implements MigrationInterface {
    name = 'UpdateLessonCourseColumns1759262000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Update lesson table columns
        await queryRunner.query(`ALTER TABLE "lesson" ALTER COLUMN "course_id" TYPE uuid USING "course_id"::uuid`);
        // Add user_id column to lesson table if it doesn't exist
        await queryRunner.query(`ALTER TABLE "lesson" ADD COLUMN IF NOT EXISTS "user_id" uuid`);
        await queryRunner.query(`ALTER TABLE "lesson" ALTER COLUMN "updated_by" TYPE uuid USING "updated_by"::uuid`);
        
        // Update course table columns
        await queryRunner.query(`ALTER TABLE "course" ALTER COLUMN "teacher_id" TYPE uuid USING "teacher_id"::uuid`);
        await queryRunner.query(`ALTER TABLE "course" ALTER COLUMN "updated_by" TYPE uuid USING "updated_by"::uuid`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Revert lesson table columns
        await queryRunner.query(`ALTER TABLE "lesson" ALTER COLUMN "course_id" TYPE char USING "course_id"::char`);
        // Only alter user_id if it exists
        await queryRunner.query(`ALTER TABLE "lesson" ALTER COLUMN "user_id" TYPE char USING "user_id"::char`);
        await queryRunner.query(`ALTER TABLE "lesson" ALTER COLUMN "updated_by" TYPE char USING "updated_by"::char`);
        
        // Revert course table columns
        await queryRunner.query(`ALTER TABLE "course" ALTER COLUMN "teacher_id" TYPE char USING "teacher_id"::char`);
        await queryRunner.query(`ALTER TABLE "course" ALTER COLUMN "updated_by" TYPE char USING "updated_by"::char`);
    }
}
