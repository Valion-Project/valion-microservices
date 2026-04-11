import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity, OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from 'typeorm';
import {UserProfile} from "../../user-profiles/entity/user-profiles.entity";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    lastName: string;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column()
    tokenVersion: number;

    @Column()
    isSuperAdmin: boolean;

    @Column({ default: false })
    isPending: boolean;

    @Column({ nullable: true })
    onboardingSessionId: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;

    @OneToMany(() => UserProfile, (userProfile) => userProfile.user)
    userProfiles: UserProfile[];
}