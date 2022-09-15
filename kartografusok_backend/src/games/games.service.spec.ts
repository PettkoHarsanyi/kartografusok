import { Test, TestingModule } from '@nestjs/testing';
import { Game } from './entities/game';
import { GamesService } from './games.service';
import {getRepositoryToken } from '@mikro-orm/nestjs'

describe('GamesService', () => {
  let service: GamesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GamesService, {provide: getRepositoryToken(Game), useValue:{}}],
    }).compile();

    service = module.get<GamesService>(GamesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
