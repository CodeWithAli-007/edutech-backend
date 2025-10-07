import {
    Entity,
    Column,
    ManyToOne,
    JoinColumn,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    BaseEntity,
} from "typeorm";
import { Course } from "./course.entity";
import { Lesson } from "./lesson.entity";
import { User } from "./User.entity";

export type ExamType = 'quiz' | 'midterm' | 'annual' | 'assignment';

export interface MCQQuestion {
    question: string;
    options: {
        A: string;
        B: string;
        C: string;
        D: string;
    };
    correctAnswer: 'A' | 'B' | 'C' | 'D';
    points: number;
}

@Entity("exam")
export class Exam extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    exam_id: string;

    @Column({ name: "course_id", type: "uuid" })
    courseId: string;

    @ManyToOne(() => Course, { onDelete: "CASCADE" })
    @JoinColumn({ name: "course_id" })
    course: Course;

    @Column({ name: "lesson_id", type: "uuid", nullable: true })
    lessonId?: string;

    @ManyToOne(() => Lesson, { onDelete: "CASCADE" })
    @JoinColumn({ name: "lesson_id" })
    lesson?: Lesson;

    @Column({ type: "varchar", length: 200 })
    title: string;

    @Column({ name: "exam_type", type: "varchar", length: 20 })
    examType: ExamType;

    @Column({ name: "exam_total_marks", type: "int" })
    examTotalMarks: number;

    @Column({ name: "no_of_questions", type: "int" })
    noOfQuestions: number;

    @Column({ name: "threshold", type: "int" })
    threshold: number;

    @Column({ name: "question_format", type: "json" })
    questionFormat: MCQQuestion[];

    @Column({ name: "scheduled_at", type: "timestamp", nullable: true })
    scheduledAt?: Date;

    @Column({ name: "updated_by", type: "uuid", nullable: false })
    updatedBy?: string;

    @Column({ name: "user_id", type: "uuid", nullable: false })
    userId: string;

    @ManyToOne(() => User, (user) => user.user_id, { onDelete: "CASCADE" })
    @JoinColumn({ name: 'user_id' })
    public user: User;

    @CreateDateColumn({ name: "created_at", type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    createdAt: Date;

    @UpdateDateColumn({ name: "updated_at", type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    updatedAt: Date;
}