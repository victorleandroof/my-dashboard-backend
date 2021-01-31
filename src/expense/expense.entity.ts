import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity('expense')
export class ExpenseEntity{
    @PrimaryColumn({name:'id', type: 'varchar', length: 36})
    id: string;
    @Column({name:'title', type: 'varchar', length: 255})
    title: string;
    @Column({name:'value', type: 'numeric'})
    value: number;
    @Column({name:'status', type: 'int'})
    status: number;
    @Column({name:'date', type: 'date'})
    date: Date;
}