import {
    Entity,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
    PrimaryGeneratedColumn,
    BaseEntity,
} from "typeorm";
import { Course } from "./course.entity";
import { User } from "./User.entity";

export type LessonType = 'transcript' | 'video' | 'text';
export type LessonStatus = 'active' | 'inactive';

@Entity("lesson")
export class Lesson extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    lesson_id: string;

    @Column({ name:"course_id", type: "uuid" })
    courseId: string;

    @ManyToOne(() => Course, (course) => course.course_id, {
        onDelete: "CASCADE",
    })
    @JoinColumn({ name: "course_id" })
    course: Course;

    @Column({ type: "varchar", length: 100 })
    title: string;

    @Column({ type: "varchar", length: 20 })
    lesson_type: LessonType;

    @Column({name:"lesson_url", type: "varchar", length: 200 })
    lessonUrl: string;

    @Column({ type: "enum", enum: ["active", "inactive"], default: "active" })
    status: LessonStatus;

    @Column({ type: "int", nullable: true })
    position?: number;

    @Column({ type: "boolean", nullable: true })
    hasExam?: boolean;

    @CreateDateColumn({ name: "created_at", type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    createdAt: Date;

    @UpdateDateColumn({ name: "updated_at", type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    updatedAt: Date;

    @Column({ name: "updated_by", type: "uuid", nullable: false })
    updatedBy?: string;

    @Column({ name: "user_id", type: "uuid", nullable: false })
    userId: string;

    @ManyToOne(() => User, (user) => user.user_id, { onDelete: "CASCADE" })
    @JoinColumn({ name: 'user_id' })
    public user: User;
}