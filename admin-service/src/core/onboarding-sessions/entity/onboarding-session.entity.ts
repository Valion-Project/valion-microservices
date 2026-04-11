import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity, ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from 'typeorm';
import {Branch} from "../../branches/entity/branches.entity";
import {CompanyProgram} from "../../company-programs/entity/company-programs.entity";

export enum OnboardingStatus {
    CREATED = 'CREADO', LINKED = 'RELACIONADO', USED = 'USADO'
}

@Entity()
export class OnboardingSession {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    quantity: number;

    @Column({ type: 'enum', enum: OnboardingStatus })
    status: OnboardingStatus;

    @Column()
    operatorUserId: number;

    @ManyToOne(() => Branch)
    branch: Branch;

    @ManyToOne(() => CompanyProgram)
    companyProgram: CompanyProgram;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;
}