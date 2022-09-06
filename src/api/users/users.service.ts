import {
  ConflictException,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  // @InjectRepository(User)
  // private readonly repository: Repository<User>;
  constructor(
    @InjectRepository(User)
    private repository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User | Error> {
    const email = createUserDto.email;
    const existUser: User = await this.repository.findOneBy({ email });
    if (existUser) {
      return new ConflictException(
        `Email ${createUserDto.email} already exists`,
      );
      // return new Error(`Email ${createUserDto.email} already exists`);
    }
    const user = await this.repository.create(createUserDto);
    // const user: User = new User();
    // user.name = createUserDto.name;
    // user.email = createUserDto.email;
    // user.password = createUserDto.password;

    await this.repository.save(user);
    return user;
  }

  async findAll(): Promise<User[]> {
    return await this.repository.find();
  }

  async findOne(id: number): Promise<User | Error> {
    const user: User = await this.repository.findOne({ where: { id } });
    if (!user) {
      return new NotFoundException(`User ${id} does not exists`);
      // return new Error(`User ${id} does not exists`);
    }
    return user;
  }

  async findOneByEmail(email: string): Promise<User | Error> {
    const user: User = await this.repository.findOne({ where: { email } });
    if (!user) {
      return new NotFoundException(`User ${email} does not exists`);
      // return new Error(`User ${id} does not exists`);
    }
    return user;
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<User | Error> {
    const user: User = await this.repository.findOneBy({ id });
    if (!user) {
      return new NotFoundException(`User ${id} does not exists`);
      // return new Error(`User ${id} does not exists`);
    }
    user.name = updateUserDto.name ? updateUserDto.name : user.name;
    user.email = updateUserDto.email ? updateUserDto.email : user.email;
    user.password = updateUserDto.password
      ? updateUserDto.password
      : user.password;

    await this.repository.update(id, updateUserDto);
    // await this.repository.save(user);
    return user;
  }

  async remove(id: number): Promise<User | Error> {
    const user: User = await this.repository.findOneBy({ id });
    if (!user) {
      return new NotFoundException(`User ${id} does not exists`);
      // return new Error(`User ${id} does not exists`);
    }
    await this.repository.delete(id);
    return user;
  }
}
