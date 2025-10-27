import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from '../entities/post.entity';
import { CreatePostDto } from '../dto/create-post.dto';
import { UpdatePostDto } from '../dto/update-post.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
  ) {}

  async findAll(
    page = 1,
    limit = 20,
  ): Promise<{
    data: Post[];
    meta: { total: number; page: number; limit: number; lastPage: number };
  }> {
    const maxLimit = 100;
    const take = Math.min(limit, maxLimit);
    const skip = (page - 1) * take;

    const [posts, total] = await this.postsRepository.findAndCount({
      skip,
      take,
      order: { id: 'ASC' },
      relations: ['user.profile', 'categories'],
    });

    return {
      data: posts,
      meta: {
        total,
        page,
        limit: take,
        lastPage: Math.max(1, Math.ceil(total / take)),
      },
    };
  }

  async findOne(id: number): Promise<Post> {
    const post = await this.postsRepository.findOne({
      where: { id },
      relations: ['user.profile', 'categories'],
    });
    if (!post) throw new NotFoundException(`Post with id ${id} not found`);
    return post;
  }

  async create(createPostDto: CreatePostDto): Promise<Post> {
    try {
      const newPost = await this.postsRepository.save({
        ...createPostDto,
        user: { id: createPostDto.userId },
        categories: createPostDto.categoryIds?.map((catId) => ({ id: catId })),
      });
      return this.findOne(newPost.id);
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : typeof error === 'string'
            ? error
            : 'Unknown error';
      throw new BadRequestException('Error creating post: ' + message);
    }
  }

  async update(id: number, updatePostDto: UpdatePostDto): Promise<Post> {
    const post = await this.findOne(id);
    if (post) {
      const updated = this.postsRepository.merge(post, {
        ...updatePostDto,
        categories: updatePostDto.categoryIds?.map((catId) => ({ id: catId })),
      });
      return await this.postsRepository.save(updated);
    }
    throw new NotFoundException(`Post with id ${id} not found`);
  }

  async remove(id: number): Promise<{ message: string; status: number }> {
    try {
      const result = await this.postsRepository.delete({ id });
      if (result.affected === 0) {
        throw new NotFoundException(`Post with id ${id} not found`);
      }
      return { message: `Post ID ${id} deleted successfully`, status: 200 };
    } catch {
      throw new NotFoundException(`Post with id ${id} not found`);
    }
  }

  async getPostByCategoryId(categoryId: number): Promise<Post[]> {
    const posts = await this.postsRepository.find({
      relations: ['user.profile'],
      where: {
        categories: { id: categoryId },
      },
    });

    return posts;
  }
}
