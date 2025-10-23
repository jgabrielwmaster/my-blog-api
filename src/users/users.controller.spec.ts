import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto } from './dtos/user.dto';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  const mockUsersService = {
    findAll: jest.fn().mockResolvedValue([]),
    findOne: jest.fn().mockResolvedValue({}),
    getProfileByUserId: jest.fn().mockResolvedValue({}),
    createUser: jest.fn().mockResolvedValue({}),
    updateUser: jest.fn().mockResolvedValue({}),
    deleteUser: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getUsers', () => {
    it('should return an array of users', async () => {
      const result = [{ id: 1, email: 'test@test.com' }];
      mockUsersService.findAll.mockResolvedValue(result);

      expect(await controller.getUsers(1, 10)).toBe(result);
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(service.findAll).toHaveBeenCalledWith(1, 10);
    });
  });

  describe('getUserById', () => {
    it('should return a single user', async () => {
      const result = { id: 1, name: 'Test' };
      mockUsersService.findOne.mockResolvedValue(result);

      expect(await controller.getUserById(1)).toBe(result);
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(service.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('getProfileByUserId', () => {
    it('should return a profile', async () => {
      const result = { id: 1, bio: 'Test bio' };
      mockUsersService.getProfileByUserId.mockResolvedValue(result);

      expect(await controller.getProfileByUserId(1)).toBe(result);
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(service.getProfileByUserId).toHaveBeenCalledWith(1);
    });
  });

  describe('createUser', () => {
    it('should create a user', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@test.com',
        password: 'password',
        profile: { firstName: 'Test', lastName: 'User', avatar: 'avatar.png' },
      };
      const result = { id: 1, ...createUserDto };
      mockUsersService.createUser.mockResolvedValue(result);

      expect(await controller.createUser(createUserDto)).toBe(result);
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(service.createUser).toHaveBeenCalledWith(createUserDto);
    });
  });

  describe('updateUser', () => {
    it('should update a user', async () => {
      const updateUserDto: UpdateUserDto = {
        email: 'updated@test.com',
        profile: { firstName: 'Updated' },
      };
      const result = { id: 1, email: 'updated@test.com' };
      mockUsersService.updateUser.mockResolvedValue(result);

      expect(await controller.updateUser(1, updateUserDto)).toBe(result);
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(service.updateUser).toHaveBeenCalledWith(1, updateUserDto);
    });
  });

  describe('deleteUser', () => {
    it('should delete a user', async () => {
      mockUsersService.deleteUser.mockResolvedValue(undefined);

      await controller.deleteUser(1);
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(service.deleteUser).toHaveBeenCalledWith(1);
    });
  });
});
