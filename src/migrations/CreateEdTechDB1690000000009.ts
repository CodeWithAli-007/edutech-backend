import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from "typeorm";

export class CreateEdTechDB1690000000009 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "user",
                columns: [
                    {
                        name: "user_id",
                        type: 'uuid',
                        default: 'uuid_generate_v4()',
                        isPrimary: true,
                    },
                    {
                        name: "user_name",
                        type: "varchar",
                        length: "50",
                        isUnique: true,
                        isNullable: false,
                    },
                    {
                        name: "password",
                        type: "varchar",
                        length: "255",
                        isNullable: false,
                    },
                    {
                        name: "role",
                        type: "enum",
                        enum: ["admin", "student", "teacher", "parent"],
                        isNullable: false,
                    },
                    {
                        name: "status",
                        type: "enum",
                        enum: ["active", "inactive"],
                        default: "'active'",
                    },
                    {
                        name: "verificationCode",
                        type: "varchar",
                        isNullable: false,
                    },
                    {
                        name: "email",
                        type: "character varying",
                        isNullable: false,
                    },
                    {
                        name: "verified",
                        type: "boolean",
                        isNullable: false,
                        default: false
                    },

                    {
                        name: "created_at",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP",
                    },
                    {
                        name: "updated_at",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP",
                    },
                ],
            }),
            true
        );
        await queryRunner.createIndex("user", new TableIndex({
            name: "verificationCode_index",
            columnNames: ["verificationCode"]
        }));
        await queryRunner.query(`CREATE INDEX "email_index" ON "user" ("email")`);

        //#########################
        await queryRunner.createTable(
            new Table({
                name: "institute",
                columns: [
                    {
                        name: "institute_id",
                        type: 'uuid',
                        default: 'uuid_generate_v4()',
                        isPrimary: true,
                    },
                    {
                        name: "name",
                        type: "varchar",
                        length: "200",
                        isNullable: false,
                    },
                    {
                        name: "house_no",
                        type: "varchar",
                        length: "20",
                        isNullable: true,
                    },
                    {
                        name: "street",
                        type: "varchar",
                        length: "255",
                        isNullable: true,
                    },
                    {
                        name: "postal_code",
                        type: "varchar",
                        length: "20",
                        isNullable: true,
                    },
                    {
                        name: "state",
                        type: "varchar",
                        length: "100",
                        isNullable: true,
                    },
                    {
                        name: "city",
                        type: "varchar",
                        length: "100",
                        isNullable: true,
                    },
                    {
                        name: "country",
                        type: "varchar",
                        length: "100",
                        isNullable: true,
                    },
                    {
                        name: "mobile_no1",
                        type: "varchar",
                        length: "20",
                        isNullable: true,
                    },
                    {
                        name: "mobile_no2",
                        type: "varchar",
                        length: "20",
                        isNullable: true,
                    },
                    {
                        name: "telephone1",
                        type: "varchar",
                        length: "20",
                        isNullable: true,
                    },
                    {
                        name: "telephone2",
                        type: "varchar",
                        length: "20",
                        isNullable: true,
                    },
                    {
                        name: "email",
                        type: "varchar",
                        length: "50",
                        isNullable: true,
                    },
                    {
                        name: "web",
                        type: "varchar",
                        length: "100",
                        isNullable: true,
                    },
                    {
                        name: "created_at",
                        type: "timestamp",
                        default: "now()",
                    },
                    {
                        name: "updated_at",
                        type: "timestamp",
                        default: "now()",
                    },
                    {
                        name: "updated_by",
                        type: "uuid",
                        isNullable: false,
                    },

                ],
            })
        );
        await queryRunner.createForeignKey(
            "institute",
            new TableForeignKey({
                columnNames: ["updated_by"],
                referencedColumnNames: ["user_id"],
                referencedTableName: "user",
                onDelete: "SET NULL",
            })
        );
        //#########################
        await queryRunner.createTable(
            new Table({
                name: "user_details",
                columns: [
                    {
                        name: "user_details_id",
                        type: 'uuid',
                        default: 'uuid_generate_v4()',
                        isPrimary: true,
                    },
                    {
                        name: "first_name",
                        type: "varchar",
                        length: "100",
                        isNullable: false,
                    },
                    {
                        name: "middle_name",
                        type: "varchar",
                        length: "100",
                        isNullable: true,
                    },
                    {
                        name: "last_name",
                        type: "varchar",
                        length: "100",
                        isNullable: false,
                    },
                    {
                        name: "house_no",
                        type: "varchar",
                        length: "20",
                        isNullable: true,
                    },
                    {
                        name: "street",
                        type: "varchar",
                        length: "255",
                        isNullable: true,
                    },
                    {
                        name: "postal_code",
                        type: "varchar",
                        length: "20",
                        isNullable: true,
                    },
                    {
                        name: "state",
                        type: "varchar",
                        length: "100",
                        isNullable: true,
                    },
                    {
                        name: "city",
                        type: "varchar",
                        length: "100",
                        isNullable: true,
                    },
                    {
                        name: "country",
                        type: "varchar",
                        length: "100",
                        isNullable: true,
                    },
                    {
                        name: "primary_contact_no",
                        type: "varchar",
                        length: "20",
                        isNullable: true,
                    },
                    {
                        name: "secondary_contact_no",
                        type: "varchar",
                        length: "20",
                        isNullable: true,
                    },
                    {
                        name: "gender",
                        type: "enum",
                        enum: ["Male", "Female", "Divers", "Not Specified"],
                        isNullable: false,
                        default: "'Not Specified'",
                    },
                    {
                        name: "date_of_birth",
                        type: "timestamp",
                        default: "now()",
                    },
                    {
                        name: "date_of_joining",
                        type: "timestamp",
                        default: "now()",
                    },
                    {
                        name: "user_id",
                        type: "uuid",
                        isNullable: false,
                    },
                    {
                        name: "institute_id",
                        type: "uuid",
                        isNullable: true,
                    },
                    {
                        name: "created_at",
                        type: "timestamp",
                        default: "now()",
                    },
                    {
                        name: "updated_at",
                        type: "timestamp",
                        default: "now()",
                    },
                    {
                        name: "updated_by",
                        type: "uuid",
                        isNullable: false,
                    },

                ],
            }),
            true
        );
        await queryRunner.createForeignKey(
            "user_details",
            new TableForeignKey({
                columnNames: ["updated_by"],
                referencedColumnNames: ["user_id"],
                referencedTableName: "user",
                onDelete: "SET NULL",
            })
        );
        await queryRunner.createForeignKey(
            "user_details",
            new TableForeignKey({
                columnNames: ["user_id"],
                referencedColumnNames: ["user_id"],
                referencedTableName: "user",
                onDelete: "SET NULL",
            })
        );
        await queryRunner.createForeignKey(
            "user_details",
            new TableForeignKey({
                columnNames: ["institute_id"],
                referencedColumnNames: ["institute_id"],
                referencedTableName: "institute",
                onDelete: "SET NULL",
            })
        );
        //#########################
        await queryRunner.createTable(
            new Table({
                name: "student_parents",
                columns: [
                    {
                        name: "student_parents_id",
                        type: 'uuid',
                        default: 'uuid_generate_v4()',
                        isPrimary: true,
                    },
                    {
                        name: "parents_id",
                        type: 'uuid',
                        default: 'uuid_generate_v4()',
                        isPrimary: false,
                    },
                    {
                        name: "student_id",
                        type: "uuid",
                        isNullable: false,
                    },
                    {
                        name: "created_at",
                        type: "timestamp",
                        default: "now()",
                    },
                    {
                        name: "updated_at",
                        type: "timestamp",
                        default: "now()",
                    },
                    {
                        name: "updated_by",
                        type: "uuid",
                        isNullable: false,
                    },

                ],
            }),
            true
        );
        await queryRunner.createForeignKey(
            "student_parents",
            new TableForeignKey({
                columnNames: ["updated_by"],
                referencedColumnNames: ["user_id"],
                referencedTableName: "user",
                onDelete: "SET NULL",
            })
        );
        await queryRunner.createForeignKey(
            "student_parents",
            new TableForeignKey({
                columnNames: ["parents_id"],
                referencedColumnNames: ["user_id"],
                referencedTableName: "user",
                onDelete: "SET NULL",
            })
        );
        await queryRunner.createForeignKey(
            "student_parents",
            new TableForeignKey({
                columnNames: ["student_id"],
                referencedColumnNames: ["user_id"],
                referencedTableName: "user",
                onDelete: "SET NULL",
            })
        );
        new TableForeignKey({
            columnNames: ["institute_id"],
            referencedColumnNames: ["institute_id"],
            referencedTableName: "institute",
            onDelete: "SET NULL",
        }),

            //#########################
            await queryRunner.createTable(
                new Table({
                    name: "course",
                    columns: [
                        {
                            name: "course_id",
                            type: 'uuid',
                            default: 'uuid_generate_v4()',
                            isPrimary: true,
                        },
                        {
                            name: "title",
                            type: "varchar",
                            length: "100",
                            isNullable: false,
                        },
                        {
                            name: "description",
                            type: "varchar",
                            length: "200",
                            isNullable: true,
                        },
                        {
                            name: "teacher_id",
                            type: "uuid",
                            isNullable: true,
                        },
                        {
                            name: "created_at",
                            type: "timestamp",
                            default: "now()",
                        },
                        {
                            name: "updated_at",
                            type: "timestamp",
                            default: "now()",
                        },
                        {
                            name: "updated_by",
                            type: "uuid",
                            isNullable: false,
                        },

                    ],
                }),
                true
            );
        await queryRunner.createForeignKey(
            "course",
            new TableForeignKey({
                columnNames: ["updated_by"],
                referencedColumnNames: ["user_id"],
                referencedTableName: "user",
                onDelete: "SET NULL",
            })
        );
        await queryRunner.createForeignKey(
            "course",
            new TableForeignKey({
                columnNames: ["teacher_id"],
                referencedColumnNames: ["user_id"],
                referencedTableName: "user",
                onDelete: "SET NULL",
            })
        );
        //#########################

        await queryRunner.createTable(
            new Table({
                name: "enrollment",
                columns: [
                    {
                        name: "enrollment_id",
                        type: 'uuid',
                        default: 'uuid_generate_v4()',
                        isPrimary: true,
                    },
                    {
                        name: "student_id",
                        type: "uuid",
                        isNullable: false,
                    },
                    {
                        name: "course_id",
                        type: "uuid",
                        isNullable: false,
                    },
                    {
                        name: "enrolled_at",
                        type: "timestamp",
                        default: "now()",
                    },
                    {
                        name: "updated_by",
                        type: "uuid",
                        isNullable: false,
                    },

                ],
                uniques: [
                    {
                        name: "UQ_student_course",
                        columnNames: ["student_id", "course_id"],
                    },
                ],
            }),
            true
        );
        await queryRunner.createForeignKey(
            "enrollment",
            new TableForeignKey({
                columnNames: ["updated_by"],
                referencedColumnNames: ["user_id"],
                referencedTableName: "user",
                onDelete: "SET NULL",
            })
        );

        await queryRunner.createForeignKeys("enrollment", [
            new TableForeignKey({
                columnNames: ["student_id"],
                referencedColumnNames: ["user_id"],
                referencedTableName: "user",
                onDelete: "CASCADE",
            }),
            new TableForeignKey({
                columnNames: ["course_id"],
                referencedColumnNames: ["course_id"],
                referencedTableName: "course",
                onDelete: "CASCADE",
            }),
        ]);
        //#########################
        await queryRunner.createTable(
            new Table({
                name: "lesson",
                columns: [
                    {
                        name: "lesson_id",
                        type: 'uuid',
                        default: 'uuid_generate_v4()',
                        isPrimary: true,
                    },
                    {
                        name: "course_id",
                        type: "uuid",
                        isNullable: false,
                    },
                    {
                        name: "title",
                        type: "varchar",
                        length: "100",
                        isNullable: false,
                    },
                    {
                        name: "lesson_type",
                        type: "varchar",
                        length: "20",
                        isNullable: false,
                    },
                    {
                        name: "lesson_url",
                        type: "varchar",
                        length: "200",
                        isNullable: false,
                    },
                    {
                        name: "status",
                        type: "enum",
                        enum: ["active", "inactive"],
                        default: "'active'",
                    },
                    {
                        name: "position",
                        type: "int",
                        isNullable: true,
                    },
                    {
                        name: "created_at",
                        type: "timestamp",
                        default: "now()",
                    },
                    {
                        name: "updated_at",
                        type: "timestamp",
                        default: "now()",
                    },
                    {
                        name: "updated_by",
                        type: "uuid",
                        isNullable: false,
                    },

                ],
            }),
            true
        );

        await queryRunner.createForeignKey(
            "lesson",
            new TableForeignKey({
                columnNames: ["updated_by"],
                referencedColumnNames: ["user_id"],
                referencedTableName: "user",
                onDelete: "SET NULL",
            })
        );
        await queryRunner.createForeignKey(
            "lesson",
            new TableForeignKey({
                columnNames: ["course_id"],
                referencedColumnNames: ["course_id"],
                referencedTableName: "course",
                onDelete: "CASCADE",
            })
        );
        //#########################
        await queryRunner.createTable(
            new Table({
                name: "exam",
                columns: [
                    {
                        name: "exam_id",
                        type: 'uuid',
                        default: 'uuid_generate_v4()',
                        isPrimary: true,
                    },
                    {
                        name: "course_id",
                        type: "uuid",
                        isNullable: false,
                    },
                    {
                        name: "lesson_id",
                        type: "uuid",
                        isNullable: true,
                    },
                    {
                        name: "title",
                        type: "varchar",
                        length: "200",
                        isNullable: false,
                    },
                    {
                        name: "exam_type",
                        type: "varchar",
                        length: "20",
                        isNullable: false,
                    },
                    {
                        name: "exam_total_marks",
                        type: "int",
                        isNullable: false,
                    },
                    {
                        name: "no_of_questions",
                        type: "int",
                        isNullable: true,
                    },
                    {
                        name: "threshold",
                        type: "decimal",
                        isNullable: true,
                    },
                    {
                        name: "question_format",
                        type: "json",
                        isNullable: true,
                    },
                    {
                        name: "scheduled_at",
                        type: "timestamp",
                        isNullable: true,
                    },
                    {
                        name: "updated_by",
                        type: "uuid",
                        isNullable: false,
                    },

                ],
                checks: [
                    {
                        name: "CHK_exam_type",
                        expression: `exam_type IN ('quiz', 'midterm', 'annual', 'assignment')`,
                    },
                ],
            }),
            true
        );
        await queryRunner.createForeignKey(
            "exam",
            new TableForeignKey({
                columnNames: ["updated_by"],
                referencedColumnNames: ["user_id"],
                referencedTableName: "user",
                onDelete: "SET NULL",
            })
        );
        await queryRunner.createForeignKeys("exam", [
            new TableForeignKey({
                columnNames: ["course_id"],
                referencedColumnNames: ["course_id"],
                referencedTableName: "course",
                onDelete: "CASCADE",
            }),
            new TableForeignKey({
                columnNames: ["lesson_id"],
                referencedColumnNames: ["lesson_id"],
                referencedTableName: "lesson",
                onDelete: "CASCADE",
            }),
        ]);
        //#########################
        await queryRunner.createTable(
            new Table({
                name: "submission",
                columns: [
                    {
                        name: "submission_id",
                        type: 'uuid',
                        default: 'uuid_generate_v4()',
                        isPrimary: true,
                    },
                    {
                        name: "exam_id",
                        type: "uuid",
                        isNullable: false,
                    },
                    {
                        name: "student_id",
                        type: "uuid",
                        isNullable: false,
                    },
                    {
                        name: "submitted_at",
                        type: "timestamp",
                        default: "now()",
                    },
                    {
                        name: "score",
                        type: "decimal",
                        isNullable: true,
                    },
                    {
                        name: "updated_by",
                        type: "uuid",
                        isNullable: false,
                    },
                ],
            }),
            true
        );
        await queryRunner.createForeignKey(
            "submission",
            new TableForeignKey({
                columnNames: ["updated_by"],
                referencedColumnNames: ["user_id"],
                referencedTableName: "user",
                onDelete: "SET NULL",
            })
        );
        await queryRunner.createForeignKeys("submission", [
            new TableForeignKey({
                columnNames: ["exam_id"],
                referencedTableName: "exam",
                referencedColumnNames: ["exam_id"],
                onDelete: "CASCADE",
            }),
            new TableForeignKey({
                columnNames: ["student_id"],
                referencedTableName: "user",
                referencedColumnNames: ["user_id"],
                onDelete: "CASCADE",
            }),
        ]);

        //#########################
        await queryRunner.createTable(
            new Table({
                name: "quiz_question",
                columns: [
                    {
                        name: "quiz_question_id",
                        type: 'uuid',
                        default: 'uuid_generate_v4()',
                        isPrimary: true,
                    },
                    {
                        name: "exam_id",
                        type: "uuid",
                        isNullable: false,
                    },
                    {
                        name: "quiz_question_text",
                        type: "varchar",
                        length: "500",
                        isNullable: false,
                    },
                    {
                        name: "options",
                        type: "jsonb", // Use "json" if not using Postgres
                        isNullable: true,
                    },
                    {
                        name: "correct_answer",
                        type: "varchar",
                        length: "5",
                        isNullable: true,
                    },
                    {
                        name: "updated_by",
                        type: "uuid",
                        isNullable: false,
                    },
                ],
            }),
            true
        );
        await queryRunner.createForeignKey(
            "quiz_question",
            new TableForeignKey({
                columnNames: ["updated_by"],
                referencedColumnNames: ["user_id"],
                referencedTableName: "user",
                onDelete: "SET NULL",
            })
        );
        await queryRunner.createForeignKey(
            "quiz_question",
            new TableForeignKey({
                columnNames: ["exam_id"],
                referencedColumnNames: ["exam_id"],
                referencedTableName: "exam",
                onDelete: "CASCADE",
            })
        );
        //#########################
        await queryRunner.createTable(
            new Table({
                name: "activity_log",
                columns: [
                    {
                        name: "activity_id",
                        type: 'uuid',
                        default: 'uuid_generate_v4()',
                        isPrimary: true,
                    },
                    {
                        name: "student_id",
                        type: "uuid",
                        isNullable: false,
                    },
                    {
                        name: "course_id",
                        type: "uuid",
                        isNullable: true,
                    },
                    {
                        name: "lesson_id",
                        type: "uuid",
                        isNullable: true,
                    },
                    {
                        name: "action",
                        type: "varchar",
                        length: "50",
                        isNullable: true,
                    },
                    {
                        name: "created_at",
                        type: "timestamp",
                        default: "now()",
                    },

                ],
            }),
            true
        );

        await queryRunner.createForeignKeys("activity_log", [
            new TableForeignKey({
                columnNames: ["student_id"],
                referencedColumnNames: ["user_id"],
                referencedTableName: "user",
                onDelete: "CASCADE",
            }),
            new TableForeignKey({
                columnNames: ["course_id"],
                referencedColumnNames: ["course_id"],
                referencedTableName: "course",
                onDelete: "SET NULL",
            }),
            new TableForeignKey({
                columnNames: ["lesson_id"],
                referencedColumnNames: ["lesson_id"],
                referencedTableName: "lesson",
                onDelete: "SET NULL",
            }),
        ]);
        //#########################
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("user");
        await queryRunner.dropTable("institute");
        await queryRunner.dropTable("user_details");
        await queryRunner.dropTable("student_parents");
        await queryRunner.dropTable("course");
        await queryRunner.dropTable("enrollment");
        await queryRunner.dropTable("lesson");
        await queryRunner.dropTable("exam");
        await queryRunner.dropTable("submission");
        await queryRunner.dropTable("quiz_question");
        await queryRunner.dropTable("activity_log");
    }

    // ########################

}
