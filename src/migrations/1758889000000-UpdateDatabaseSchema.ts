import { MigrationInterface, QueryRunner } from "typeorm"

export class UpdateDatabaseSchema1758889000000 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Make teacher_id nullable in course table
        await queryRunner.query(`ALTER TABLE "course" ALTER COLUMN "teacher_id" DROP NOT NULL`);
        
        // Add institute_id to course table if it doesn't exist
        const courseTableExists = await queryRunner.hasTable("course");
        if (courseTableExists) {
            const instituteIdColumnExists = await queryRunner.hasColumn("course", "institute_id");
            if (!instituteIdColumnExists) {
                await queryRunner.query(`ALTER TABLE "course" ADD "institute_id" uuid`);
            }
        }
        
        // Create lesson table if it doesn't exist
        const lessonTableExists = await queryRunner.hasTable("lesson");
        if (!lessonTableExists) {
            await queryRunner.query(`
                CREATE TABLE "lesson" (
                    "lesson_id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                    "course_id" uuid NOT NULL,
                    "title" character varying(200) NOT NULL,
                    "lesson_type" character varying(50) NOT NULL,
                    "lesson_url" character varying(500),
                    "status" character varying(20) NOT NULL DEFAULT 'active',
                    "position" integer,
                    "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                    "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                    "updated_by" character varying(255) NOT NULL,
                    CONSTRAINT "PK_lesson_id" PRIMARY KEY ("lesson_id")
                )
            `);
            
            // Add foreign key constraint for course_id
            await queryRunner.query(`
                ALTER TABLE "lesson" 
                ADD CONSTRAINT "FK_lesson_course_id" 
                FOREIGN KEY ("course_id") 
                REFERENCES "course"("course_id") 
                ON DELETE CASCADE
            `);
        }
        
        // Create exam table if it doesn't exist
        const examTableExists = await queryRunner.hasTable("exam");
        if (!examTableExists) {
            await queryRunner.query(`
                CREATE TABLE "exam" (
                    "exam_id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                    "course_id" uuid NOT NULL,
                    "title" character varying(200) NOT NULL,
                    "description" text,
                    "exam_type" character varying(50) NOT NULL,
                    "duration_minutes" integer,
                    "total_marks" integer,
                    "passing_marks" integer,
                    "start_date" TIMESTAMP,
                    "end_date" TIMESTAMP,
                    "status" character varying(20) NOT NULL DEFAULT 'active',
                    "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                    "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                    "updated_by" character varying(255) NOT NULL,
                    CONSTRAINT "PK_exam_id" PRIMARY KEY ("exam_id")
                )
            `);
            
            // Add foreign key constraint for course_id
            await queryRunner.query(`
                ALTER TABLE "exam" 
                ADD CONSTRAINT "FK_exam_course_id" 
                FOREIGN KEY ("course_id") 
                REFERENCES "course"("course_id") 
                ON DELETE CASCADE
            `);
        }
        
        // Create quiz_question table if it doesn't exist
        const quizQuestionTableExists = await queryRunner.hasTable("quiz_question");
        if (!quizQuestionTableExists) {
            await queryRunner.query(`
                CREATE TABLE "quiz_question" (
                    "question_id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                    "exam_id" uuid NOT NULL,
                    "question_text" text NOT NULL,
                    "question_type" character varying(50) NOT NULL,
                    "options" jsonb,
                    "correct_answer" text,
                    "marks" integer NOT NULL DEFAULT 1,
                    "position" integer,
                    "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                    "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                    "updated_by" character varying(255) NOT NULL,
                    CONSTRAINT "PK_question_id" PRIMARY KEY ("question_id")
                )
            `);
            
            // Add foreign key constraint for exam_id
            await queryRunner.query(`
                ALTER TABLE "quiz_question" 
                ADD CONSTRAINT "FK_quiz_question_exam_id" 
                FOREIGN KEY ("exam_id") 
                REFERENCES "exam"("exam_id") 
                ON DELETE CASCADE
            `);
        }
        
        // Create enrollment table if it doesn't exist
        const enrollmentTableExists = await queryRunner.hasTable("enrollment");
        if (!enrollmentTableExists) {
            await queryRunner.query(`
                CREATE TABLE "enrollment" (
                    "enrollment_id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                    "student_id" uuid NOT NULL,
                    "course_id" uuid NOT NULL,
                    "enrollment_date" TIMESTAMP NOT NULL DEFAULT now(),
                    "status" character varying(20) NOT NULL DEFAULT 'active',
                    "progress_percentage" integer DEFAULT 0,
                    "completed_at" TIMESTAMP,
                    "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                    "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                    "updated_by" character varying(255) NOT NULL,
                    CONSTRAINT "PK_enrollment_id" PRIMARY KEY ("enrollment_id"),
                    CONSTRAINT "UQ_enrollment_student_course" UNIQUE ("student_id", "course_id")
                )
            `);
            
            // Add foreign key constraints
            await queryRunner.query(`
                ALTER TABLE "enrollment" 
                ADD CONSTRAINT "FK_enrollment_student_id" 
                FOREIGN KEY ("student_id") 
                REFERENCES "user"("user_id") 
                ON DELETE CASCADE
            `);
            
            await queryRunner.query(`
                ALTER TABLE "enrollment" 
                ADD CONSTRAINT "FK_enrollment_course_id" 
                FOREIGN KEY ("course_id") 
                REFERENCES "course"("course_id") 
                ON DELETE CASCADE
            `);
        }
        
        // Create submission table if it doesn't exist
        const submissionTableExists = await queryRunner.hasTable("submission");
        if (!submissionTableExists) {
            await queryRunner.query(`
                CREATE TABLE "submission" (
                    "submission_id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                    "student_id" uuid NOT NULL,
                    "exam_id" uuid NOT NULL,
                    "question_id" uuid NOT NULL,
                    "answer" text,
                    "is_correct" boolean,
                    "marks_obtained" integer DEFAULT 0,
                    "submitted_at" TIMESTAMP NOT NULL DEFAULT now(),
                    "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                    "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                    "updated_by" character varying(255) NOT NULL,
                    CONSTRAINT "PK_submission_id" PRIMARY KEY ("submission_id")
                )
            `);
            
            // Add foreign key constraints
            await queryRunner.query(`
                ALTER TABLE "submission" 
                ADD CONSTRAINT "FK_submission_student_id" 
                FOREIGN KEY ("student_id") 
                REFERENCES "user"("user_id") 
                ON DELETE CASCADE
            `);
            
            await queryRunner.query(`
                ALTER TABLE "submission" 
                ADD CONSTRAINT "FK_submission_exam_id" 
                FOREIGN KEY ("exam_id") 
                REFERENCES "exam"("exam_id") 
                ON DELETE CASCADE
            `);
            
            await queryRunner.query(`
                ALTER TABLE "submission" 
                ADD CONSTRAINT "FK_submission_question_id" 
                FOREIGN KEY ("question_id") 
                REFERENCES "quiz_question"("question_id") 
                ON DELETE CASCADE
            `);
        }
        
        // Create activity_log table if it doesn't exist
        const activityLogTableExists = await queryRunner.hasTable("activity_log");
        if (!activityLogTableExists) {
            await queryRunner.query(`
                CREATE TABLE "activity_log" (
                    "log_id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                    "user_id" uuid NOT NULL,
                    "action" character varying(100) NOT NULL,
                    "entity_type" character varying(50) NOT NULL,
                    "entity_id" uuid,
                    "description" text,
                    "ip_address" character varying(45),
                    "user_agent" text,
                    "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                    CONSTRAINT "PK_log_id" PRIMARY KEY ("log_id")
                )
            `);
            
            // Add foreign key constraint
            await queryRunner.query(`
                ALTER TABLE "activity_log" 
                ADD CONSTRAINT "FK_activity_log_user_id" 
                FOREIGN KEY ("user_id") 
                REFERENCES "user"("user_id") 
                ON DELETE CASCADE
            `);
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop activity_log table
        await queryRunner.query(`DROP TABLE IF EXISTS "activity_log"`);
        
        // Drop submission table
        await queryRunner.query(`DROP TABLE IF EXISTS "submission"`);
        
        // Drop enrollment table
        await queryRunner.query(`DROP TABLE IF EXISTS "enrollment"`);
        
        // Drop quiz_question table
        await queryRunner.query(`DROP TABLE IF EXISTS "quiz_question"`);
        
        // Drop exam table
        await queryRunner.query(`DROP TABLE IF EXISTS "exam"`);
        
        // Drop lesson table
        await queryRunner.query(`DROP TABLE IF EXISTS "lesson"`);
        
        // Remove institute_id from course table
        await queryRunner.query(`ALTER TABLE "course" DROP COLUMN IF EXISTS "institute_id"`);
        
        // Make teacher_id NOT NULL in course table
        await queryRunner.query(`ALTER TABLE "course" ALTER COLUMN "teacher_id" SET NOT NULL`);
    }

}

