import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, BaseEntity } from "typeorm";
import { Exam } from "./exam.entity";
import { User } from "./User.entity";

@Entity()
export class Submission extends BaseEntity{
    @PrimaryColumn({ type: "char", length: 36 })
    submission_id: string;

    @ManyToOne(() => Exam, { onDelete: "CASCADE" })
    @JoinColumn({ name: "exam_id" })
    exam: Exam;

    @Column({ name: "exam_id", type: "char" })
    examId: string;

    @Column({ name:"user_id",type: "char" })
    userId: string;

    @ManyToOne(() => User, { onDelete: "CASCADE" })
    @JoinColumn({ name: "user_id" })
    user: User;

    @CreateDateColumn({ name: "submitted_at", type: "timestamp", default: () => "NOW()" })
    submittedAt: Date;

    @Column({ type: "decimal", nullable: true })
    score: number;


    @Column({ name: "updated_by", type: "char", nullable: false })
    updatedBy?: string;
}
