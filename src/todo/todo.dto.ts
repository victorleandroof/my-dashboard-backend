import { IsDate, isNotEmpty, IsNotEmpty, IsPositive, IsString, isString } from "class-validator";


export class TodoDTO {
    @IsString()
    public id: string;
    @IsNotEmpty({message: "title is requeired"})
    public title: string;
    @IsNotEmpty({message: "message is requeired"})
    public message: string;
    @IsPositive({message: "status is number"})
    public status: number;
    @IsNotEmpty({message: "date is required"})
    public date: any;
}