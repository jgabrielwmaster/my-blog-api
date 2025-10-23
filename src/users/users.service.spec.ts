import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Profile } from './entities/profile.entity';
import { UpdateUserDto } from './dtos/user.dto';
import { User } from './entities/user.entity';
import { DeleteResult, Repository, SelectQueryBuilder } from 'typeorm';

describe('UsersService', () => {
  let service: UsersService;

  // Mock simplificado para SelectQueryBuilder<User>, solo métodos usados
  const mockQueryBuilder = {
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    getManyAndCount: jest.fn(),
  } as unknown as jest.Mocked<SelectQueryBuilder<User>>;

  // Mock para Repository<User>, agregado findOneBy
  const mockUserRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    findOneBy: jest.fn(), // Agregado para compatibilidad con TypeORM
    save: jest.fn(),
    merge: jest.fn(),
    delete: jest.fn(),
    createQueryBuilder: jest.fn(() => mockQueryBuilder),
  } as unknown as Repository<User>;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should find all users', async () => {
    const users: User[] = [
      {
        id: 1,
        email: 'test@test.com',
        password: 'dummyPassword',
        profile: {
          id: 1,
          firstName: 'Test',
          lastName: 'User',
          avatar: 'avatar.png',
          createAt: new Date(),
          updatedAt: new Date(),
        } as Profile,
        createAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    (mockQueryBuilder.getManyAndCount as jest.Mock).mockResolvedValue([
      users,
      users.length,
    ]);
    const result = await service.findAll(1, 10);
    expect(result.data).toEqual(users);
    expect(result.meta.total).toBe(users.length);
  });

  it('should find one user', async () => {
    const mockProfile: Profile = {
      id: 1,
      avatar: 'avatar.png',
      firstName: 'Test',
      lastName: 'User',
      createAt: new Date(),
      updatedAt: new Date(),
    };
    const user: User = {
      id: 1,
      email: 'test@test.com',
      password: 'dummyPassword',
      profile: mockProfile,
      createAt: new Date(),
      updatedAt: new Date(),
    };
    (mockUserRepository.findOne as jest.Mock).mockResolvedValue(user); // Cambiado a findOne
    const result = await service.findOne(1);
    expect(result).toEqual(user);
  });

  it('should create a user', async () => {
    const userInput = {
      email: 'test@test.com',
      password: 'password',
      profile: { firstName: 'Test', lastName: 'User', avatar: 'avatar.png' },
    };
    const createdUser: User = {
      id: 1,
      email: userInput.email,
      password: userInput.password,
      profile: {
        id: 1,
        firstName: userInput.profile.firstName,
        lastName: userInput.profile.lastName,
        avatar: userInput.profile.avatar,
        createAt: new Date(),
        updatedAt: new Date(),
      },
      createAt: new Date(),
      updatedAt: new Date(),
    };
    (mockUserRepository.save as jest.Mock).mockResolvedValue(createdUser);

    const result = await service.createUser(userInput);
    expect(result).toEqual({
      id: 1,
      ...userInput,
      createAt: createdUser.createAt,
      updatedAt: createdUser.updatedAt,
      profile: {
        id: 1,
        ...userInput.profile,
        createAt: createdUser.profile.createAt,
        updatedAt: createdUser.profile.updatedAt,
      },
    });
  });

  it('should update a user', async () => {
    const user: User = {
      id: 1,
      email: 'test@test.com',
      password: 'dummyPassword',
      profile: {
        id: 1,
        firstName: 'Test',
        lastName: 'User',
        avatar: 'avatar.png',
        createAt: new Date(),
        updatedAt: new Date(),
      },
      createAt: new Date(),
      updatedAt: new Date(),
    };
    const changes: UpdateUserDto = {
      email: 'updated@test.com',
      profile: { firstName: 'Updated', lastName: 'User' },
    };
    (mockUserRepository.findOne as jest.Mock).mockResolvedValue(user); // Cambiado a findOne
    const mergedUser: User = {
      ...user,
      email: changes.email ?? user.email,
      profile: {
        ...user.profile,
        ...(changes.profile as Partial<Profile>),
      },
    };
    (mockUserRepository.merge as jest.Mock).mockReturnValue(mergedUser);
    (mockUserRepository.save as jest.Mock).mockResolvedValue(mergedUser);
    const result = await service.updateUser(1, changes);
    expect(result.email).toBe('updated@test.com');
  });

  it('should delete a user', async () => {
    (mockUserRepository.delete as jest.Mock).mockResolvedValue({
      affected: 1,
      raw: [],
    } as DeleteResult);
    const result = await service.deleteUser(1);
    expect(result).toEqual({
      message: `User ID 1 deleted successfully`,
      status: 200,
    });
  });
});
