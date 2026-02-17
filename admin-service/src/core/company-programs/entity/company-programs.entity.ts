import {
    CreateDateColumn,
    DeleteDateColumn,
    Entity, ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from 'typeorm';
import {Company} from "../../companies/entity/companies.entity";
import {LoyaltyProgram} from "../../loyalty-programs/entity/loyalty-programs.entity";

@Entity()
export class CompanyProgram {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Company)
    company: Company;

    @ManyToOne(() => LoyaltyProgram)
    loyaltyProgram: LoyaltyProgram;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;
}