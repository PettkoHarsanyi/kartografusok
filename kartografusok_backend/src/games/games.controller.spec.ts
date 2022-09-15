import { Test, TestingModule } from '@nestjs/testing';
import { GamesController } from './games.controller';
import { GamesService } from './games.service';

describe('GamesController', () => {
  let controller: GamesController;
  let gamesService: any;

  beforeEach(async () => {
    gamesService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
    }

    const module: TestingModule = await Test.createTestingModule({
      controllers: [GamesController],
      providers: [{
        provide: GamesService,
        useValue: gamesService,
      }],
    }).compile();

    controller = module.get<GamesController>(GamesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should give empty array when no games have been created',()=>{
    gamesService.findAll.mockReturnValue([]);
    expect(controller.findAll({})).resolves.toEqual([]);
  });
  
  it('should throw an error when requested game is missing',()=>{
    gamesService.findOne.mockReturnValue(undefined);
    expect(()=>controller.findOne(1)).rejects.toThrow();
  });
});
