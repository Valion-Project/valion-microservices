import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from 'typeorm';

@Entity()
export class Reward {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: number;

    @Column()
    description: string;

    @Column()
    pointCost: number;

    @Column()
    visitCost: number;

    @Column()
    companyId: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;
}