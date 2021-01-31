import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common";
import { ExpenseDTO } from "./expense.dto";

@Injectable()
export class DateTransformPipe implements PipeTransform<any, ExpenseDTO> {
    public transform(body: any, metada: ArgumentMetadata): ExpenseDTO {
        const todoDTO: ExpenseDTO = new ExpenseDTO();
        todoDTO.id = body.id;
        todoDTO.date = new Date(body.date);
        todoDTO.value = body.value;
        todoDTO.title = body.title;
        todoDTO.status = body.status;
        return todoDTO;
    }
}