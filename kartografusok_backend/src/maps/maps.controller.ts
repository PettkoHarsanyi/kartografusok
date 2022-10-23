import { AllowAnonymous } from "../auth/allow-anonymous";
import { Roles } from '../auth/roles';
import { UserRole } from '../users/entity/user';
import { MapDto } from './dto/map.dto';
import { MapsService } from './maps.service';
import { HttpException, HttpStatus, Param, ParseIntPipe, Patch, Query, UseGuards, UseInterceptors, UploadedFile, Res, Controller, Get, Post, Body, Delete } from "@nestjs/common";
import { Observable, of } from "rxjs";
import { join } from "path";

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

    @AllowAnonymous()
    @Get(':id/mapImage')
    async findMapImage(@Param('id', ParseIntPipe) mapId: number, @Res() res): Promise<Observable<Object>>{
        const map = await this.mapsService.find(mapId);
        return of(res.sendFile(join(process.cwd(), 'assets/maps/' + map.picture)))
    }

    @AllowAnonymous()
    @Delete(':id')
    async deleteMap(@Param('id', ParseIntPipe) mapId: number){
        const map = await this.mapsService.find(mapId);
        return this.mapsService.remove(map);
    }
}
