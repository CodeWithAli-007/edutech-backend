import { MigrationInterface, QueryRunner } from "typeorm";

export class AddExamTimestampColumns1759484911180 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Add missing timestamp columns to exam table
        await queryRunner.query(`
            ALTER TABLE "exam" 
            ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        `);

        // Update existing records to have timestamps
        await queryRunner.query(`
            UPDATE "exam" 
            SET "created_at" = CURRENT_TIMESTAMP,
                "updated_at" = CURRENT_TIMESTAMP
            WHERE "created_at" IS NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Remove timestamp columns
        await queryRunner.query(`
            ALTER TABLE "exam" 
            DROP COLUMN IF EXISTS "created_at",
            DROP COLUMN IF EXISTS "updated_at"
        `);
    }

}
