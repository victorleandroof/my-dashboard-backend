import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { AuthGuard } from "src/auth/auth.guard";
import { DateTransformPipe } from "./date-transform.pipe";
import { ExpenseDTO } from "./expense.dto";
import { ExpenseService } from "./expense.service";

@ApiTags('Expenses')
@Controller('expense')
@UseGuards(AuthGuard)
export class ExpenseController {
    constructor(
        private readonly expenseService: ExpenseService
    ){}

    @Get()
    public findAll() {
        return this.expenseService.findAll();
    }
    
    @Get(':id')
    public findById(@Param('id') id: string) {
        return this.findById(id);
    }

    @Post()
    public createExpense(@Body(DateTransformPipe) expenseDTO: ExpenseDTO) {
        return this.expenseService.saveExpense(expenseDTO);
    }

    @Put(':id')
    public updatedExpense(@Body() expenseDTO: ExpenseDTO) {
        return this.expenseService.editExpense(expenseDTO);
    }

    @Delete(':id')
    public deleteTodo(@Param('id') id: string){
        return this.expenseService.deleteExpense(id);
    }
    
}