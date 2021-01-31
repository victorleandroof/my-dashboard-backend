import { Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EmptyError, from, Observable, throwError } from "rxjs";
import { catchError, first, map, mergeMap } from 'rxjs/operators'
import { Repository } from "typeorm";
import { TodoDTO } from "./todo.dto";
import { TodoEntity } from "./todo.entity";
import { v4 as uuid } from "uuid";

@Injectable()
export class TodoService {

    constructor(
        @InjectRepository(TodoEntity) 
        private readonly todoRepository: Repository<TodoEntity>
    ){}

    public findAll(): Observable<TodoDTO[]> {
        return from(this.todoRepository.find()).pipe(
            map((todosEntites:TodoEntity[]) => {
                return todosEntites.map(this.mapEntityToDto)
            }),
            catchError(this.handlerException)
        );
    }

    public findById(id: string): Observable<TodoDTO> {
        return from(this.todoRepository.findOne(id)).pipe(
            first<TodoEntity>(),
            map(this.mapEntityToDto),
            catchError(this.handlerException),
        )
    }

    public saveTodo(todoDTO: TodoDTO): Observable<TodoDTO> {
        todoDTO.id = uuid();
        const todoEntity = this.mapDtoToEntity(todoDTO);
        todoEntity.created = new Date();
        return from(this.todoRepository.save(todoEntity)).pipe(
            map(()=> todoDTO),
            catchError(this.handlerException)
        );
    }

    public editTodo(todoDTO: TodoDTO): Observable<TodoDTO> {
        return this.findById(todoDTO.id).pipe(
            mergeMap((todoEntity:TodoEntity) => {
                todoEntity.message = todoDTO.message;
                todoEntity.title = todoDTO.title;
                todoEntity.status = todoDTO.status;
                todoEntity.date = new Date(todoDTO.date);
                return from(this.todoRepository.save(todoEntity));
            }),
            map(() => todoDTO),
            catchError(this.handlerException)
        );
    }

    public deleteTodo(id: string): Observable<TodoDTO> {
        return this.findById(id).pipe(
            mergeMap((todoEntity:TodoEntity) => {
                return from(this.todoRepository.remove(todoEntity));
            }),
            map(this.mapEntityToDto),
            catchError(this.handlerException)
        );
    }

    private mapEntityToDto(todoEntity:TodoEntity): TodoDTO{
        const todoDTO = new TodoDTO();
        todoDTO.id = todoEntity.id;
        todoDTO.title = todoEntity.title;
        todoDTO.message = todoEntity.message;
        todoDTO.status = todoEntity.status;
        todoDTO.date = todoEntity.date;
        return todoDTO;
    }

    private mapDtoToEntity(todoDTO:TodoDTO): TodoEntity{
        const todoEntity = new TodoEntity();
        todoEntity.id = todoDTO.id;
        todoEntity.title = todoDTO.title;
        todoEntity.message = todoDTO.message;
        todoEntity.status = todoDTO.status;
        todoEntity.date = todoDTO.date;
        
        return todoEntity;
    }

    private handlerException(error) {
        if( error instanceof EmptyError){
           return throwError(new NotFoundException('todo does not exist'));
        }
        return throwError(new InternalServerErrorException(`error: ${JSON.stringify(error)}`));
    }

}