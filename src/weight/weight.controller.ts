import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { AuthGuard } from "src/auth/auth.guard";
import { DateTransformPipe } from "./date-transform.pipe";
import { WeightDTO } from "./weight.dto";
import { WeightService } from "./weight.service";

@ApiTags('Weights')
@Controller('weight')
@UseGuards(AuthGuard)
export class WeightController {
    constructor(
        private readonly weightService: WeightService
    ){}

    @Get()
    public findAll() {
        return this.weightService.findAll();
    }
    
    @Get(':id')
    public findById(@Param('id') id: string) {
        return this.findById(id);
    }

    @Post()
    public createWeight(@Body(DateTransformPipe) weightDTO: WeightDTO) {
        return this.weightService.saveWeight(weightDTO);
    }

    @Put(':id')
    public updatedWeight(@Body() weightDTO: WeightDTO) {
        return this.weightService.editWeight(weightDTO);
    }

    @Delete(':id')
    public deleteWeight(@Param('id') id: string){
        return this.weightService.deleteWeight(id);
    }
    
}