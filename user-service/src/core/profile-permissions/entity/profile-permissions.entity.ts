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

    @ManyToOne(() => Profile, (profile) => profile.profilePermissions)
    profile: Profile;

    @ManyToOne(() => Permission)
    permission: Permission;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;
}