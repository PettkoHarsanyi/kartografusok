import { Loaded } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/sqlite';
import { Injectable } from '@nestjs/common';
import { CardDto } from './dto/card.dto';
import { Card, CardType, FieldType } from './entities/card';

@Injectable()
export class CardsService {
    constructor(
        @InjectRepository(Card)
        private cardRepository: EntityRepository<Card>,
    ){}

    async findAll() {
        return this.cardRepository.findAll();
    }

    async find(id: number) {
        return await this.cardRepository.findOne(({
            id: id,
        }))
    }

    async findExploreCards(){
        return this.cardRepository.find({
            $or: [{
                cardType: CardType.Explore,
            },{
                cardType: CardType.Ruin,
            }]
        })
    }

    async findRaidCards(){
        return this.cardRepository.find({
            cardType: CardType.Raid
        })
    }

    async remove(card: Loaded<Card, never>) {
        return this.cardRepository.remove(card).flush();
    }

    async create(cardDto: CardDto) {
        const card = new Card();

        card.name = cardDto.name;
        card.duration = cardDto.duration;
        card.blocks1 = cardDto.blocks1;
        card.blocks2 = cardDto.blocks2;
        card.cardType = cardDto.cardType;
        card.fieldType1 = cardDto.fieldType1;
        card.fieldType2 = cardDto.fieldType2;
        card.direction = cardDto.direction;
        card.picture = cardDto.picture;

        await this.cardRepository.persistAndFlush(card);

        return card;
    }
}
