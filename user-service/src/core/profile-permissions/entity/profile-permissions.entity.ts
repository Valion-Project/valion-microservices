import {
    CreateDateColumn,
    DeleteDateColumn,
    Entity, ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from 'typeorm';
import {Permission} from "../../permissions/entity/permissions.entity";
import {Profile} from "../../profiles/entity/profiles.entity";

@Entity()
export class ProfilePermission {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Profile)
    profileId: Profile;

    @ManyToOne(() => Permission)
    permissionId: Permission;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;
}