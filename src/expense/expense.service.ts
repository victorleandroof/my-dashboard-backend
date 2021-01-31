import { Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EmptyError, from, Observable, throwError } from "rxjs";
import { catchError, first, map, mergeMap } from 'rxjs/operators'
import { Repository } from "typeorm";
import { ExpenseDTO } from "./expense.dto";
import { ExpenseEntity } from "./expense.entity";
import { v4 as uuid } from "uuid";

@Injectable()
export class ExpenseService {

    constructor(
        @InjectRepository(ExpenseEntity) 
        private readonly expenseRepository: Repository<ExpenseEntity>
    ){}

    public findAll(): Observable<ExpenseDTO[]> {
        return from(this.expenseRepository.find()).pipe(
            map((expensesEntites:ExpenseEntity[]) => {
                return expensesEntites.map(this.mapEntityToDto)
            }),
            catchError(this.handlerException)
        );
    }

    public findById(id: string): Observable<ExpenseDTO> {
        return from(this.expenseRepository.findOne(id)).pipe(
            first<ExpenseEntity>(),
            map(this.mapEntityToDto),
            catchError(this.handlerException),
        )
    }

    public saveExpense(expenseDTO: ExpenseDTO): Observable<ExpenseDTO> {
        expenseDTO.id = uuid();
        const expenseEntity = this.mapDtoToEntity(expenseDTO);
        return from(this.expenseRepository.save(expenseEntity)).pipe(
            map(()=> expenseDTO),
            catchError(this.handlerException)
        );
    }

    public editExpense(expenseDTO: ExpenseDTO): Observable<ExpenseDTO> {
        return this.findById(expenseDTO.id).pipe(
            mergeMap((expenseEntity:ExpenseEntity) => {
                expenseEntity.value = expenseDTO.value;
                expenseEntity.title = expenseDTO.title;
                expenseEntity.status = expenseDTO.status;
                expenseEntity.date = new Date(expenseDTO.date);
                return from(this.expenseRepository.save(expenseEntity));
            }),
            map(() => expenseDTO),
            catchError(this.handlerException)
        );
    }

    public deleteExpense(id: string): Observable<ExpenseDTO> {
        return this.findById(id).pipe(
            mergeMap((expenseEntity:ExpenseEntity) => {
                return from(this.expenseRepository.remove(expenseEntity));
            }),
            map(this.mapEntityToDto),
            catchError(this.handlerException)
        );
    }

    private mapEntityToDto(expenseEntity:ExpenseEntity): ExpenseDTO{
        const expenseDTO = new ExpenseDTO();
        expenseDTO.id = expenseEntity.id;
        expenseDTO.title = expenseEntity.title;
        expenseDTO.value = expenseEntity.value;
        expenseDTO.status = expenseEntity.status;
        expenseDTO.date = expenseEntity.date;
        return expenseDTO;
    }

    private mapDtoToEntity(expenseDTO:ExpenseDTO): ExpenseEntity{
        const expenseEntity = new ExpenseEntity();
        expenseEntity.id = expenseDTO.id;
        expenseEntity.title = expenseDTO.title;
        expenseEntity.value = expenseDTO.value;
        expenseEntity.status = expenseDTO.status;
        expenseEntity.date = expenseDTO.date;
        
        return expenseEntity;
    }

    private handlerException(error) {
        if( error instanceof EmptyError){
           return throwError(new NotFoundException('expense does not exist'));
        }
        return throwError(new InternalServerErrorException(`error: ${JSON.stringify(error)}`));
    }

}