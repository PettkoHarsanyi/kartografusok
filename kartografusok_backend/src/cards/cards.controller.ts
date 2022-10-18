import { CardsService } from './cards.service';
import { Controller, Get, Post, Body } from "@nestjs/common";
import { CardDto } from './dto/card.dto';
import { Roles } from '../auth/roles';
import { UserRole } from '../users/entity/user';


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
}
