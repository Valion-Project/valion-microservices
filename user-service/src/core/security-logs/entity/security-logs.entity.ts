import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity, ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from 'typeorm';
import {User} from "../../users/entity/users.entity";
import {SecurityEvent} from "../../security-events/entity/security-events.entity";

@Entity()
export class SecurityLog {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    data: string;

    @Column({ nullable: true })
    used: boolean;

    @ManyToOne(() => User)
    userId: User;

    @ManyToOne(() => SecurityEvent)
    securityEventId: SecurityEvent;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;
}