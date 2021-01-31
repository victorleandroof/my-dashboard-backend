import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity('users')
export class UserEntity {

    @PrimaryColumn({name:'id', type: 'varchar', length: 36})
    id: string;
    @Column({name:'username', type: 'varchar', length: 255})
    username: string;
    @Column({name:'password', type: 'numeric'})
    password: number;

}