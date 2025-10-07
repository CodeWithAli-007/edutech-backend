import { MigrationInterface, QueryRunner } from "typeorm";

export class AddExamMCQFields1759484505502 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Add missing columns to exam table
        await queryRunner.query(`
            ALTER TABLE "exam" 
            ADD COLUMN IF NOT EXISTS "lesson_id" uuid,
            ADD COLUMN IF NOT EXISTS "exam_total_marks" integer,
            ADD COLUMN IF NOT EXISTS "no_of_questions" integer,
            ADD COLUMN IF NOT EXISTS "threshold" integer,
            ADD COLUMN IF NOT EXISTS "question_format" jsonb,
            ADD COLUMN IF NOT EXISTS "scheduled_at" TIMESTAMP,
            ADD COLUMN IF NOT EXISTS "user_id" uuid,
            ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        `);

        // Set default values for new columns
        await queryRunner.query(`
            UPDATE "exam" 
            SET "exam_total_marks" = 100,
                "threshold" = 60,
                "no_of_questions" = 10
            WHERE "exam_total_marks" IS NULL
        `);

        // Add foreign key constraints
        await queryRunner.query(`
            ALTER TABLE "exam" 
            ADD CONSTRAINT "FK_exam_lesson_id" 
            FOREIGN KEY ("lesson_id") 
            REFERENCES "lesson"("lesson_id") 
            ON DELETE CASCADE
        `);

        await queryRunner.query(`
            ALTER TABLE "exam" 
            ADD CONSTRAINT "FK_exam_user_id" 
            FOREIGN KEY ("user_id") 
            REFERENCES "user"("user_id") 
            ON DELETE CASCADE
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Remove foreign key constraints
        await queryRunner.query(`ALTER TABLE "exam" DROP CONSTRAINT IF EXISTS "FK_exam_user_id"`);
        await queryRunner.query(`ALTER TABLE "exam" DROP CONSTRAINT IF EXISTS "FK_exam_lesson_id"`);

        // Remove added columns
        await queryRunner.query(`
            ALTER TABLE "exam" 
            DROP COLUMN IF EXISTS "lesson_id",
            DROP COLUMN IF EXISTS "exam_total_marks",
            DROP COLUMN IF EXISTS "no_of_questions",
            DROP COLUMN IF EXISTS "threshold",
            DROP COLUMN IF EXISTS "question_format",
            DROP COLUMN IF EXISTS "scheduled_at",
            DROP COLUMN IF EXISTS "user_id",
            DROP COLUMN IF EXISTS "created_at",
            DROP COLUMN IF EXISTS "updated_at"
        `);
    }

}
