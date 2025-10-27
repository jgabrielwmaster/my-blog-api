import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from './dtos/user.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Post } from '../posts/entities/post.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findAll(
    page = 1,
    limit = 20,
  ): Promise<{
    data: User[];
    meta: { total: number; page: number; limit: number; lastPage: number };
  }> {
    const maxLimit = 100;
    const take = Math.min(limit, maxLimit);
    const skip = (page - 1) * take;

    const qb = this.usersRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.profile', 'profile')
      .select([
        'user.id',
        'user.email',
        'user.createAt',
        'user.updatedAt',
        'profile.firstName',
        'profile.lastName',
        'profile.avatar',
      ])
      .orderBy('user.id', 'ASC')
      .skip(skip)
      .take(take);

    const [users, total] = await qb.getManyAndCount();

    const data = users;

    return {
      data,
      meta: {
        total,
        page,
        limit: take,
        lastPage: Math.max(1, Math.ceil(total / take)),
      },
    };
  }

  async findOne(id: number) {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['profile'],
    });
    if (!user) throw new NotFoundException(`User with ID ${id} not found`);
    return user;
  }

  async getProfileByUserId(id: number) {
    const user = await this.findOne(id);
    if (!user) throw new NotFoundException(`User with ID ${id} not found`);
    return user.profile;
  }

  async getPostsByUserId(
    id: number,
    page = 1,
    limit = 20,
  ): Promise<{
    data: Post[];
    meta: { total: number; page: number; limit: number; lastPage: number };
  }> {
    const maxLimit = 100;
    const take = Math.min(limit, maxLimit);
    const skip = (page - 1) * take;

    // Busca el usuario y sus posts con categorías
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['posts', 'posts.categories'],
    });
    if (!user) throw new NotFoundException(`User with ID ${id} not found`);

    // Aplica paginación manual sobre los posts
    const total = user.posts.length;
    const paginatedPosts = user.posts.slice(skip, skip + take);

    return {
      data: paginatedPosts,
      meta: {
        total,
        page,
        limit: take,
        lastPage: Math.max(1, Math.ceil(total / take)),
      },
    };
  }

  async createUser(user: CreateUserDto) {
    try {
      const newUserEntity = this.usersRepository.create(user);
      const savedUser = await this.usersRepository.save(newUserEntity);
      return this.findOne(savedUser.id);
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : typeof error === 'string'
            ? error
            : 'Unknown error';

      throw new BadRequestException('Error creating user: ' + message);
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
    try {
      const userDeleted = await this.usersRepository.delete({ id });
      if (userDeleted.affected === 0) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      return { message: `User ID ${id} deleted successfully`, status: 200 };
    } catch {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }

  async getUserByEmail(email: string) {
    const user = await this.usersRepository.findOne({
      where: { email },
    });
    return user;
  }
}
