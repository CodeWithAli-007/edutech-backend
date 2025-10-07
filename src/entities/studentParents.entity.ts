import {
  Entity,
  ManyToOne,
  JoinColumn,
  PrimaryColumn,
  Column,
  UpdateDateColumn,
  BaseEntity,
  CreateDateColumn,
} from 'typeorm';
import { User } from './User.entity';

@Entity('student_parents')
export class StudentParents extends BaseEntity {
  @PrimaryColumn({ name: "student_parents_id", type: 'char' })
  studentParentsId: string;

  @Column({ name: "parents_id", type: 'char' })
  parentsId: string;

  @Column({ name: "student_id", type: 'char' })
  studentId: string;

  @ManyToOne(type => User, user => user.user_id)
  @JoinColumn({ name: 'parents_id' })
  parent: User;

  @ManyToOne(type => User, user => user.user_id)
  @JoinColumn({ name: 'student_id' })
  student: User;

  @CreateDateColumn({ name: "created_at", type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at", type: 'timestamp' })
  updatedAt: Date;

  @Column({ name: "updated_by", type: 'varchar', nullable: true })
  updatedBy: string;
}