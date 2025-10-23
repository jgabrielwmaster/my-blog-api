import { Test, TestingModule } from '@nestjs/testing';
import { PostsService } from './posts.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';

describe('PostsService', () => {
  let service: PostsService;

  const mockPostRepository = {
    findAndCount: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    merge: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostsService,
        {
          provide: getRepositoryToken(Post),
          useValue: mockPostRepository,
        },
      ],
    }).compile();

    service = module.get<PostsService>(PostsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should find all posts', async () => {
    const posts = [{ id: 1, title: 'Test' }];
    mockPostRepository.findAndCount.mockResolvedValue([posts, posts.length]);
    const result = await service.findAll(1, 10);
    expect(result.data).toEqual(posts);
    expect(result.meta.total).toBe(posts.length);
  });

  it('should find one post', async () => {
    const post = { id: 1, title: 'Test' };
    mockPostRepository.findOne.mockResolvedValue(post);
    const result = await service.findOne(1);
    expect(result).toEqual(post);
  });

  it('should create a post', async () => {
    const post = { title: 'Test', content: 'Test content' };
    mockPostRepository.create.mockReturnValue(post as any);
    mockPostRepository.save.mockResolvedValue({ id: 1, ...post });
    const result = await service.create(post);
    expect(result).toEqual({ id: 1, ...post });
  });

  it('should update a post', async () => {
    const post = { id: 1, title: 'Test' };
    const changes = { title: 'Updated Title' };
    mockPostRepository.findOne.mockResolvedValue(post);
    mockPostRepository.merge.mockReturnValue({ ...post, ...changes });
    mockPostRepository.save.mockResolvedValue({ ...post, ...changes });
    const result = await service.update(1, changes);
    expect(result.title).toBe('Updated Title');
  });

  it('should remove a post', async () => {
    mockPostRepository.delete.mockResolvedValue({ affected: 1 });
    const result = await service.remove(1);
    expect(result).toEqual({
      message: `Post ID 1 deleted successfully`,
      status: 200,
    });
  });
});
