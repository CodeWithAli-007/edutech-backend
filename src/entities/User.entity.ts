import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  Index, BeforeInsert, BeforeUpdate, OneToMany,
  ManyToOne,
  JoinColumn,
  BaseEntity,
  OneToOne
} from "typeorm";
import * as crypto from 'crypto';
import * as bcrypt from 'bcryptjs';
import { Institute } from './institute.entity';
import { UserDetails } from './userDetails.entity';

export type UserStatus = 'active' | 'inactive';
export enum RoleEnumType {
  USER = 'user',
  ADMIN = 'admin',
  STUDENT = 'student',
  TEACHER = 'teacher',
  PARENT = 'parent',
  INSTITUTE_ADMIN = 'institute_admin'
}

@Entity("user")
export class User extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  user_id: string;

  @Column({name:"user_name", type: "varchar", length: 50, unique: true })
  userName: string;

  @Column({ type: "varchar", length: 255 })
  password: string;

  /*  @Column({ type: "enum", enum: ["admin", "student", "teacher", "parent"] })
   role: UserRole; */

  @Column({
    type: 'enum',
    enum: RoleEnumType,
    default: RoleEnumType.ADMIN,
  })
  role: RoleEnumType;

  @Column({ type: "enum", enum: ["active", "inactive"], default: "active" })
  status: UserStatus;


  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at: Date;

  @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  updated_at: Date;

  @Index('email_index')
  @Column({
    unique: true,
  })
  email: string;

  @Column({
    default: false,
  })
  verified: boolean;

  @Index('verificationCode_index')
  @Column({
    type: 'text',
    nullable: true,
  })
  verificationCode!: string | null;

  @Column({ name: "institute_id", type: "uuid", nullable: true })
  instituteId?: string;

  @ManyToOne(() => Institute, (institute) => institute.institute_id)
  @JoinColumn({ name: "institute_id" })
  institute?: Institute;

  @OneToOne(() => UserDetails, (userDetails) => userDetails.user)
  userDetails?: UserDetails;

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 12);
  }

  @BeforeUpdate()
  async hashPasswordOnUpdate() {
    // Only hash if password has been modified
    if (this.password && !this.password.startsWith('$2a$')) {
      this.password = await bcrypt.hash(this.password, 12);
    }
  }

  static async comparePasswords(
    candidatePassword: string,
    hashedPassword: string
  ) {
    return await bcrypt.compare(candidatePassword, hashedPassword);
  }

  static createVerificationCode() {
    const verificationCode = crypto.randomBytes(32).toString('hex');

    const hashedVerificationCode = crypto
      .createHash('sha256')
      .update(verificationCode)
      .digest('hex');

    return { verificationCode, hashedVerificationCode };
  }

  toJSON() {
    return {
      ...this,
      password: undefined,
      verified: undefined,
      verificationCode: undefined,
    };
  }
}