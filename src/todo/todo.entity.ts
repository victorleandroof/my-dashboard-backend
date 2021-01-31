import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity('todo')
export class TodoEntity{
    @PrimaryColumn({name:'id', type: 'varchar', length: 36})
    id: string;
    @Column({name:'title', type: 'varchar', length: 255})
    title: string;
    @Column({name:'message', type: 'varchar', length: 255})
    message: string;
    @Column({name:'status', type: 'int'})
    status: number;
    @Column({name:'date', type: 'date'})
    date: Date;
    @Column({name:'created', type: 'timestamp'})
    created: Date;
}