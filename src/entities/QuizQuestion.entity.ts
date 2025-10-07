import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
  BaseEntity,
} from "typeorm";
import { Exam } from "./exam.entity";
import { User } from "./User.entity";

@Entity("quiz_question")
export class QuizQuestion extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  quiz_question_id: string;

  @Column({ type: "char" })
  exam_id: string;

  @ManyToOne(() => Exam, { onDelete: "CASCADE" })
  @JoinColumn({ name: "exam_id" })
  exam: Exam;

  @Column({name: "question_text",  type: "varchar", length: 500 })
  questionText: string;

  @Column({ type: "jsonb", nullable: true })
  options: Record<string, string>;  // e.g., { A: "Option 1", B: "Option 2" }

  @Column({name: "correct_answer",  type: "varchar", length: 5, nullable: true })
  correctAnswer?: string;  // e.g., "A", "A,B"

  @ManyToOne(type => User, user => user.user_id)
  @JoinColumn({ name: 'user_id' })
  public user: User;
}
