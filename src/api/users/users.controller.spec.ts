/* eslint-disable @typescript-eslint/no-empty-function */
import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        UsersService,
        {
          provide: UsersService,
          useFactory: () => ({
            create: jest.fn(() => []),
            findAll: jest.fn(() => []),
            findOne: jest.fn(() => {}),
            findOneByEmail: jest.fn(() => {}),
            update: jest.fn(() => {}),
            remove: jest.fn(() => {}),
          }),
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  it('calling findAll method', () => {
    controller.findAll();
    expect(service.findAll).toHaveBeenCalled();
  });

  it('calling findOne method', () => {
    controller.findOne('1');
    expect(service.findOne).toHaveBeenCalled();
  });

  it('calling findOneByEmail method', () => {
    controller.findOneByEmail('mock@example.com');
    expect(service.findOneByEmail).toHaveBeenCalled();
  });

  it('calling save method', () => {
    const dto = new CreateUserDto();
    expect(controller.create(dto)).not.toEqual(null);
  });

  it('calling saveNotes method', () => {
    const dto = new CreateUserDto();
    controller.create(dto);
    expect(service.create).toHaveBeenCalled();
    expect(service.create).toHaveBeenCalledWith(dto);
  });

  it('calling update method', () => {
    const dto = new CreateUserDto();
    expect(controller.update('1', dto)).not.toEqual(null);
  });

  it('calling delete method', () => {
    controller.remove('1');
    expect(service.remove).toHaveBeenCalled();
  });
});
