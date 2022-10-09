import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ResultDto } from './dto/result.dto';
import { ResultsService } from './results.service';

@Controller('results')
export class ResultsController {
    constructor(private readonly resultService: ResultsService) {}

}
