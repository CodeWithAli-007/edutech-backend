import {
    Entity,
    Column,
    ManyToOne,
    OneToMany,
    JoinColumn,
    PrimaryGeneratedColumn,
    BaseEntity,
} from "typeorm";
import { User } from "./User.entity";

@Entity("course")
export class Course extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    course_id: string;

    @Column({ type: "varchar", length: 100 })
    title: string;

    @Column({ type: "varchar", length: 200, nullable: true })
    description?: string;


    @Column({ name: "teacher_id", type: "uuid", nullable: true })
    teacherId?: string;

    @ManyToOne(() => User, user => user.user_id, { onDelete: "CASCADE" })
    @JoinColumn({ name: "teacher_id" })
    user: User;

    @Column({ name: "institute_id", type: "uuid", nullable: true })
    instituteId?: string;

    @Column({ name: "updated_by", type: "uuid", nullable: false })
    updatedBy?: string;

    @OneToMany("Lesson", "course")
    lessons: any[];

}
