import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from 'typeorm';
import {EventType} from "../../event-types/entity/event-types.entity";
import {Reward} from "../../rewards/entity/rewards.entity";
import {Card} from "../../cards/entity/cards.entity";

@Entity()
export class Event {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    points: number;

    @Column({ nullable: true })
    visits: number;

    @Column()
    operatorUserId: number;

    @Column()
    branchId: number;

    @ManyToOne(() => Card)
    card: Card;

    @ManyToOne(() => Reward, { nullable: true })
    reward: Reward;

    @ManyToOne(() => EventType)
    eventType: EventType;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;
}