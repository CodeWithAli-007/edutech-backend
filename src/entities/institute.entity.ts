import {
    Entity,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    PrimaryGeneratedColumn,
    ManyToOne,
    JoinColumn,
    BaseEntity,
} from "typeorm";
import { User } from "./User.entity";
import Model from './model.entity';

@Entity("institute")
export class Institute extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    //@PrimaryColumn({ type: "char", length: 36 })
    institute_id: string;

    @Column({ type: "varchar", length: 200 })
    name: string;

    @Column({ name: "house_no", type: "varchar", length: 20, nullable: true })
    houseNo?: string;

    @Column({ type: "varchar", length: 255, nullable: true })
    street?: string;

    @Column({ name: "postal_code", type: "varchar", length: 20, nullable: true })
    postalCode?: string;

    @Column({ type: "varchar", length: 100, nullable: true })
    state?: string;

    @Column({ type: "varchar", length: 100, nullable: true })
    city?: string;

    @Column({ type: "varchar", length: 100, nullable: true }) // or use length: 2 for strict ISO code
    country?: string;

    @Column({ name: "mobile_no1", type: "varchar", length: 20, nullable: true })
    mobileNo1?: string;

    @Column({ name: "mobile_no2", type: "varchar", length: 20, nullable: true })
    mobileNo2?: string;

    @Column({ type: "varchar", length: 20, nullable: true })
    telephone1?: string;

    @Column({ type: "varchar", length: 20, nullable: true })
    telephone2?: string;

    @Column({ type: "varchar", length: 50, nullable: true })
    email?: string;

    @Column({ type: "varchar", length: 100, nullable: true })
    web?: string;

    @CreateDateColumn({ name: "created_at", type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    createdAt: Date;

    @UpdateDateColumn({ name: "updated_at", type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    updatedAt: Date;

    @Column({ name: "updated_by", type: "char", nullable: false })
    updatedBy?: string;

    @ManyToOne(type => User, user => user)
    @JoinColumn({ name: 'updated_by' })
    public user: User;

}
