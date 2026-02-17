import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from 'typeorm';

export enum PermissionDomain {
    OPERATOR = 'OPERATOR', ADMIN = 'ADMIN', BRANCH = 'BRANCH'
}

@Entity()
export class Permission {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    description: string;

    @Column({ type: 'enum', enum: PermissionDomain })
    domain: PermissionDomain;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;
}