import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { AuthGuard } from "src/auth/auth.guard";
import { DateTransformPipe } from "./date-transform.pipe";
import { TodoDTO } from "./todo.dto";
import { TodoService } from "./todo.service";

@ApiTags('Todos')
@Controller('todo')
@UseGuards(AuthGuard)
export class TodoController {
    constructor(
        private readonly todoService: TodoService
    ){}

    @Get()
    public findAll() {
        return this.todoService.findAll();
    }
    
    @Get(':id')
    public findById(@Param('id') id: string) {
        return this.findById(id);
    }

    @Post()
    public createTodo(@Body(DateTransformPipe) todoDTO: TodoDTO) {
        return this.todoService.saveTodo(todoDTO);
    }

    @Put(':id')
    public updatedTodo(@Body() todoDTO: TodoDTO) {
        return this.todoService.editTodo(todoDTO);
    }

    @Delete(':id')
    public deleteTodo(@Param('id') id: string){
        return this.todoService.deleteTodo(id);
    }
    
}