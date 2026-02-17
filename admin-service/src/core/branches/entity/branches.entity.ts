import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity, ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from 'typeorm';
import {Company} from "../../companies/entity/companies.entity";

@Entity()
export class Branch {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    address: string;

    @ManyToOne(() => Company)
    company: Company;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;
}