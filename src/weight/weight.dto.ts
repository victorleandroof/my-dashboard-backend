import { IsNotEmpty, IsPositive, IsString } from "class-validator";


export class WeightDTO {
    @IsString()
    public id: string;
    @IsPositive({message: "title is requeired"})
    public value: number;
    @IsNotEmpty({message: "date is required"})
    public date: any;
}