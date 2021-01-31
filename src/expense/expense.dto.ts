import { IsDate, isNotEmpty, IsNotEmpty, IsNumber, IsPositive, IsString, isString } from "class-validator";


export class ExpenseDTO {
    @IsString()
    public id: string;
    @IsNotEmpty({message: "title is requeired"})
    public title: string;
    @IsPositive({message: "value is requeired"})
    public value: number;
    @IsPositive({message: "status is number"})
    public status: number;
    @IsNotEmpty({message: "date is required"})
    public date: any;
}