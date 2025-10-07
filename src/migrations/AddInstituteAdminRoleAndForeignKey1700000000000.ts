import { MigrationInterface, QueryRunner, TableColumn, TableForeignKey } from "typeorm";

export class AddInstituteAdminRoleAndForeignKey1700000000000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Add institute_id column to user table
        await queryRunner.addColumn(
            "user",
            new TableColumn({
                name: "institute_id",
                type: "uuid",
                isNullable: true,
            })
        );

        // Add foreign key constraint for institute_id
        await queryRunner.createForeignKey(
            "user",
            new TableForeignKey({
                columnNames: ["institute_id"],
                referencedColumnNames: ["institute_id"],
                referencedTableName: "institute",
                onDelete: "SET NULL",
            })
        );

        // Update the role enum to include 'institute_admin'
        await queryRunner.query(`
            ALTER TYPE "user_role_enum" RENAME TO "user_role_enum_old";
        `);
        
        await queryRunner.query(`
            CREATE TYPE "user_role_enum" AS ENUM('user', 'admin', 'student', 'teacher', 'parent', 'institute_admin');
        `);
        
        await queryRunner.query(`
            ALTER TABLE "user" ALTER COLUMN "role" TYPE "user_role_enum" USING "role"::"text"::"user_role_enum";
        `);
        
        await queryRunner.query(`
            DROP TYPE "user_role_enum_old";
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop foreign key constraint
        await queryRunner.dropForeignKey("user", "FK_user_institute_id");
        
        // Drop institute_id column
        await queryRunner.dropColumn("user", "institute_id");

        // Revert the role enum to original values
        await queryRunner.query(`
            ALTER TYPE "user_role_enum" RENAME TO "user_role_enum_old";
        `);
        
        await queryRunner.query(`
            CREATE TYPE "user_role_enum" AS ENUM('user', 'admin', 'student', 'teacher', 'parent');
        `);
        
        await queryRunner.query(`
            ALTER TABLE "user" ALTER COLUMN "role" TYPE "user_role_enum" USING "role"::"text"::"user_role_enum";
        `);
        
        await queryRunner.query(`
            DROP TYPE "user_role_enum_old";
        `);
    }
}
