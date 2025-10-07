import {
    Entity,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    Unique,
    PrimaryGeneratedColumn,
    BaseEntity,
} from "typeorm";
import { Course } from "./course.entity";
import { User } from "./User.entity";

@Entity("enrollment")
@Unique(["user", "course"])
export class Enrollment extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    enrollment_id: string;

    @Column({ name: "student_id", type: "uuid" })
    studentId: string;

    @ManyToOne(() => User, (user) => user.user_id, { onDelete: "CASCADE" })
    @JoinColumn({ name: "student_id" })
    user: User;

    @Column({ name: "course_id", type: "uuid" })
    courseId: string;

    @ManyToOne(() => Course, { onDelete: "CASCADE" })
    @JoinColumn({ name: "course_id" })
    course: Course;

    @CreateDateColumn({ name: "enrolled_at", type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    enrolledAt: Date;

    @Column({ name: "updated_by", type: "uuid", nullable: false })
    updatedBy?: string;
}
