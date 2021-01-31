import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity('todo')
export class WeightEntity{
    @PrimaryColumn({name:'id', type: 'varchar', length: 36})
    id: string;
    @Column({name:'value', type: 'numeric'})
    value: number
    @Column({name:'date', type: 'timestamp'})
    date: Date;
}