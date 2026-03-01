import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity, OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from 'typeorm';
import {ProfilePermission} from "../../profile-permissions/entity/profile-permissions.entity";

export enum ProfileDomain {
    OPERATOR = 'OPERATOR', ADMIN = 'ADMIN'
}

@Entity()
export class Profile {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    companyId: number;

    @Column({ type: 'enum', enum: ProfileDomain, nullable: true })
    domain: ProfileDomain;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;

    @OneToMany(() => ProfilePermission, (profilePermission) => profilePermission.profile)
    profilePermissions: ProfilePermission[];
}