import { faker } from '@faker-js/faker';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { createUserMock } from './mock/create-user.mock';
import { UsersService } from './users.service';

const mockUserDto = new createUserMock();
const mockUserSingle = new createUserMock(
  `${faker.name.fullName()}`,
  `${faker.internet.email()}`,
  `${faker.internet.password()}`,
);
const mockUserArray = [mockUserDto, mockUserSingle];

const apiRepo = {
  find: jest.fn(),
  findOne: jest.fn(),
  findOneBy: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

describe('UsersService', () => {
  let service: UsersService;
  let repo: Repository<User>; //typeof mappingRepo;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: { apiRepo },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repo = module.get(getRepositoryToken(User));
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repo).toBeDefined();
  });
  describe('findAll', () => {
    it('should return an array of users', async () => {
      repo.find = jest.fn().mockResolvedValue(mockUserArray);
      const users = await service.findAll();
      expect(users).toEqual(mockUserArray);
      expect(repo.find).toBeCalledTimes(1);
    });
  });
  describe('findOne', () => {
    it('should return a single user', async () => {
      repo.findOne = jest.fn().mockResolvedValue(mockUserSingle);
      expect(service.findOne(1)).resolves.toEqual(mockUserSingle);
      expect(repo.findOne).toBeCalledWith({ where: { id: 1 } });
    });
  });
  describe('findOneByEmail', () => {
    it('should return a single user', async () => {
      repo.findOne = jest.fn().mockResolvedValue(mockUserSingle);
      expect(service.findOneByEmail('mock@example.com')).resolves.toEqual(
        mockUserSingle,
      );
      expect(repo.findOne).toBeCalledWith({ where: { id: 1 } });
    });
  });
  describe('create', () => {
    it('should successfully insert a user', async () => {
      repo.findOneBy = jest.fn().mockReturnValue(null);
      repo.create = jest.fn().mockResolvedValue(mockUserDto);
      repo.save = jest.fn().mockReturnValue(true);
      expect(mockUserDto).resolves.toEqual(mockUserDto);
      repo.findOneBy = jest.fn().mockReturnValue(mockUserDto);
      expect(service.create(mockUserDto)).resolves.toBeInstanceOf(
        ConflictException,
      );
    });
  });
  describe('update', () => {
    it('should successfully update a user', async () => {
      repo.findOneBy = jest.fn().mockReturnValue(mockUserDto);
      repo.update = jest.fn().mockResolvedValue(mockUserDto);
      expect(service.update(1, mockUserDto)).resolves.toEqual(mockUserDto);
      repo.findOneBy = jest.fn().mockReturnValue(null);
      await expect(service.update(0, mockUserDto)).resolves.toBeInstanceOf(
        NotFoundException,
      );
    });
  });
  describe('remove', () => {
    it('should successfully remove a user', async () => {
      repo.findOneBy = jest.fn().mockReturnValue(mockUserDto);
      repo.delete = jest.fn().mockResolvedValue(mockUserDto);
      expect(service.remove(1)).resolves.toEqual(mockUserDto);
      repo.findOneBy = jest.fn().mockReturnValue(null);
      await expect(service.remove(1)).resolves.toBeInstanceOf(
        NotFoundException,
      );
    });
  });
});
