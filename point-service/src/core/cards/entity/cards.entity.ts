import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from 'typeorm';
import {Client} from "../../clients/entity/clients.entity";

@Entity()
export class Card {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    points: number;

    @Column({ nullable: true })
    visits: number;

    @Column()
    companyId: number;

    @Column()
    levelId: number;

    @Column()
    companyProgramId: number;

    @ManyToOne(() => Client)
    client: Client;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;
}