import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity, ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from 'typeorm';
import {Profile} from "../../profiles/entity/profiles.entity";
import {User} from "../../users/entity/users.entity";

@Entity()
export class UserProfile {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    branchId: number;

    @ManyToOne(() => User, (user) => user.userProfiles)
    user: User;

    @ManyToOne(() => Profile)
    profile: Profile;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;
}