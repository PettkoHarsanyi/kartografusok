import { Body, Controller, Get, Patch, Post } from '@nestjs/common';
import { DivisionsService } from './divisions.service';
import { DivisionDto } from './dto/division.dto';

@Controller('divisions')
export class DivisionsController {

    constructor(
        private divisionService: DivisionsService
    ){}

    @Post('')
    async create(@Body() divisionDto: DivisionDto){
        const newDivision = await this.divisionService.create(divisionDto);
        return new DivisionDto(newDivision);
    }

    @Get('')
    async findAll(){
        return await this.divisionService.findAll();
    }

}
