import { Controller, Get, Post, Body } from "@nestjs/common";
import { Roles } from '../auth/roles';
import { UserRole } from '../users/entity/user';
import { MapDto } from './dto/map.dto';
import { MapsService } from './maps.service';

@Controller('maps')
export class MapsController {
    constructor(
        private mapsService: MapsService,
    ){}

    @Get('')
    async findAll(){
        return await this.mapsService.findAll();
    }

    @Roles(UserRole.Admin)
    @Roles(UserRole.Contributor)
    @Post('')
    async addMap(@Body() mapDto: MapDto){
        return await this.mapsService.create(mapDto);
    }
}
