import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
    JoinColumn,
    BaseEntity,
} from 'typeorm';
import { User } from './User.entity';
import { Institute } from './institute.entity';

export enum UserType {
    STUDENT = 'STUDENT',
    TEACHER = 'TEACHER',
    PARENT = 'PARENT',
    STAFF = 'STAFF',
}
export enum Gender {
    MALE = 'Male',
    FEMALE = 'Female',
    DIVERS = 'Divers',
    NOTSPECIFIED = 'Not Specified'
}

@Entity('user_details')
export class UserDetails extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    user_details_id: string;

    @Column({ name: "user_id", type: "char", nullable: false })
    userId: string;

    @ManyToOne(() => User, (user) => user.user_id)
    @JoinColumn({ name: "user_id" })
    user: User;

    @Column({ name: "institute_id", type: "char", nullable: true })
    instituteId?: string;

    @ManyToOne(() => Institute, (institute) => institute.institute_id)
    @JoinColumn({ name: "institute_id" })
    institute: Institute;

    // @Column({
    //     type: 'enum',
    //     enum: UserType,
    // })
    // userType: UserType;

    @Column({ name: "first_name", type: 'varchar', length: 200 })
    firstName: string;

    @Column({ name: "middle_name", type: 'varchar', length: 200 })
    middleName: string;

    @Column({ name: "last_name", type: 'varchar', length: 200 })
    lastName: string;

    @Column({
        type: 'enum',
        enum: Gender,
        default: Gender.NOTSPECIFIED
    })
    gender: Gender;

    @Column({ name: "date_of_joining", type: 'timestamp', nullable: true })
    joiningDate: Date;

    @Column({ name: "date_of_birth", type: 'timestamp', nullable: true })
    dateOfBirth: Date;

    @Column({ name: "house_no", type: 'varchar', length: 20, nullable: true })
    houseNo: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    street: string;

    @Column({ name: "postal_code", type: 'varchar', length: 20, nullable: true })
    postalCode: string;

    @Column({ type: 'varchar', length: 100, nullable: true })
    state: string;

    @Column({ type: 'varchar', length: 100, nullable: true })
    city: string;

    @Column({ type: 'varchar', length: 100, nullable: true })
    country: string; // ISO 3166-1 alpha-2 codes

    @Column({ name: "primary_contact_no", type: 'varchar', length: 20, nullable: true })
    primaryContactNo: string;

    @Column({ name: "secondary_contact_no", type: 'varchar', length: 20, nullable: true })
    secondaryContactNo: string;

    @CreateDateColumn({ name: "created_at", type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ name: "updated_at", type: 'timestamp' })
    updatedAt: Date;

    @Column({ name: "updated_by", type: "char", nullable: false })
    updatedBy?: string;
}
