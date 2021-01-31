import { Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EmptyError, from, Observable, throwError } from "rxjs";
import { catchError, first, map, mergeMap } from 'rxjs/operators'
import { Repository } from "typeorm";
import { WeightDTO } from "./weight.dto";
import { WeightEntity } from "./weight.entity";
import { v4 as uuid } from "uuid";

@Injectable()
export class WeightService {

    constructor(
        @InjectRepository(WeightEntity) 
        private readonly weightRepository: Repository<WeightEntity>
    ){}

    public findAll(): Observable<WeightDTO[]> {
        return from(this.weightRepository.find()).pipe(
            map((weightsEntites:WeightEntity[]) => {
                return weightsEntites.map(this.mapEntityToDto)
            }),
            catchError(this.handlerException)
        );
    }

    public findById(id: string): Observable<WeightDTO> {
        return from(this.weightRepository.findOne(id)).pipe(
            first<WeightEntity>(),
            map(this.mapEntityToDto),
            catchError(this.handlerException),
        )
    }

    public saveWeight(weightDTO: WeightDTO): Observable<WeightDTO> {
        weightDTO.id = uuid();
        const weightEntity = this.mapDtoToEntity(weightDTO);
        return from(this.weightRepository.save(weightEntity)).pipe(
            map(()=> weightDTO),
            catchError(this.handlerException)
        );
    }

    public editWeight(weightDTO: WeightDTO): Observable<WeightDTO> {
        return this.findById(weightDTO.id).pipe(
            mergeMap((weightEntity:WeightEntity) => {
                weightEntity.value = weightDTO.value;
                weightEntity.date = new Date(weightDTO.date);
                return from(this.weightRepository.save(weightEntity));
            }),
            map(() => weightDTO),
            catchError(this.handlerException)
        );
    }

    public deleteWeight(id: string): Observable<WeightDTO> {
        return this.findById(id).pipe(
            mergeMap((weightEntity:WeightEntity) => {
                return from(this.weightRepository.remove(weightEntity));
            }),
            map(this.mapEntityToDto),
            catchError(this.handlerException)
        );
    }

    private mapEntityToDto(weightEntity:WeightEntity): WeightDTO{
        const weightDTO = new WeightDTO();
        weightDTO.id = weightEntity.id;
        weightDTO.date = weightEntity.date;
        weightDTO.value = weightEntity.value;
        return weightDTO;
    }

    private mapDtoToEntity(weightDTO:WeightDTO): WeightEntity{
        const weightEntity = new WeightEntity();
        weightEntity.id = weightDTO.id;
        weightEntity.date = weightDTO.date;
        weightEntity.value = weightDTO.value;
        return weightEntity;
    }

    private handlerException(error) {
        if( error instanceof EmptyError){
           return throwError(new NotFoundException('weight does not exist'));
        }
        return throwError(new InternalServerErrorException(`error: ${JSON.stringify(error)}`));
    }

}