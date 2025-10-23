import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from './user.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findAll() {
    const users = await this.usersRepository.find();
    return users;
  }

  async findOne(id: number) {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['profile'],
    });
    if (!user) throw new NotFoundException(`User with ID ${id} not found`);
    return user;
  }

  async createUser(user: CreateUserDto) {
    try {
      const newUser = await this.usersRepository.save(user);
      return newUser;
    } catch {
      throw new BadRequestException('Error creating user');
    }
  }

  async updateUser(id: number, changes: UpdateUserDto) {
    const user = await this.findOne(id);
    if (user) {
      const updateUser = this.usersRepository.merge(user, changes);
      const result = await this.usersRepository.save(updateUser);
      return result;
    }
    throw new NotFoundException(`User with ID ${id} not found`);
  }

  async deleteUser(id: number) {
    const user = await this.findOne(id);
    if (user) {
      await this.usersRepository.delete(user);
      return { message: `User ID ${id} deleted successfully`, status: 200 };
    }
    throw new NotFoundException(`User with ID ${id} not found`);
  }
}
