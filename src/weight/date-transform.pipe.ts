import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common";
import { WeightDTO } from "./weight.dto";

@Injectable()
export class DateTransformPipe implements PipeTransform<any, WeightDTO> {
    public transform(body: any, metada: ArgumentMetadata): WeightDTO {
        const todoDTO: WeightDTO = new WeightDTO();
        todoDTO.id = body.id;
        todoDTO.date = new Date(body.date);
        todoDTO.value = body.value;
        return todoDTO;
    }
}