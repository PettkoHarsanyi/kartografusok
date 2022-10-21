import { CardsService } from './cards.service';
import { Controller, Get, Post, Body } from "@nestjs/common";
import { CardDto } from './dto/card.dto';
import { Roles } from '../auth/roles';
import { UserRole } from '../users/entity/user';
import { AllowAnonymous } from '../auth/allow-anonymous';
import { HttpException, HttpStatus, Param, ParseIntPipe, Patch, Query, UseGuards, UseInterceptors, UploadedFile, Res } from "@nestjs/common";
import { Observable, of } from 'rxjs';
import { join } from 'path';


@Controller('cards')
export class CardsController {
    
    constructor(
        private cardsService: CardsService,
    ){}

    @Get('')
    async findAll(){
        return await this.cardsService.findAll();
    }

    @Get('explore')
    async getExploreCards(){
        return await this.cardsService.findExploreCards();
    }

    @Get('raid')
    async getRaidCards(){
        return await this.cardsService.findRaidCards();
    }

    @Roles(UserRole.Admin)
    @Roles(UserRole.Contributor)
    @Post('')
    async addCard(@Body() cardDto: CardDto){
        const newCard = await this.cardsService.create(cardDto);
        return new CardDto(newCard);
    }

    @AllowAnonymous()
    @Get(':id/cardimage')
    async findProfileImage(@Param('id', ParseIntPipe) cardId: number, @Res() res): Promise<Observable<Object>>{
        const card = await this.cardsService.find(cardId);
        return of(res.sendFile(join(process.cwd(), 'assets/cards/explorecards/' + card.picture)))
    }
}
