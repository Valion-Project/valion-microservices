import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity, ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from 'typeorm';
import {Reward} from "../../rewards/entity/rewards.entity";

@Entity()
export class RewardBranch {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    isAvailable: boolean;

    @Column()
    branchId: number;

    @ManyToOne(() => Reward)
    reward: Reward;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;
}