import {
    Entity,
    PrimaryColumn,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    PrimaryGeneratedColumn,
} from "typeorm";
// import { Student } from "./student.entity"; // Removed - using User entity instead
import { Course } from "./course.entity";
import { Lesson } from "./lesson.entity";
import Model from "./model.entity";
import { User } from "./User.entity";

@Entity("activity_log")
export class ActivityLog extends Model {
    @PrimaryGeneratedColumn("uuid")
    activity_id: string;

    @Column({ name:"user_id",type: "char" })
    userId: string;

    @ManyToOne(() => User, { onDelete: "CASCADE" })
    @JoinColumn({ name: "user_id" })
    user: User;

    @Column({ name: "course_id", type: "char", nullable: true })
    courseId?: string;

    @ManyToOne(() => Course, { nullable: true, onDelete: "SET NULL" })
    @JoinColumn({ name: "course_id" })
    course?: Course;

    @Column({  name: "lesson_id",type: "char", nullable: true })
    lessonId?: string;

    @ManyToOne(() => Lesson, { nullable: true, onDelete: "SET NULL" })
    @JoinColumn({ name: "lesson_id" })
    lesson?: Lesson;

    @Column({ type: "varchar", length: 50, nullable: true })
    action?: string;

    @CreateDateColumn({ name: "created_at", type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    createdAt: Date;
}
