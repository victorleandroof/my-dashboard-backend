import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common";
import { TodoDTO } from "./todo.dto";

@Injectable()
export class DateTransformPipe implements PipeTransform<any, TodoDTO> {
    public transform(body: any, metada: ArgumentMetadata): TodoDTO {
        const todoDTO: TodoDTO = new TodoDTO();
        todoDTO.id = body.id;
        todoDTO.date = new Date(body.date);
        
        todoDTO.message = body.message;
        todoDTO.title = body.title;
        todoDTO.status = body.status;
        return todoDTO;
    }
}