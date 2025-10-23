import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should update only the name when given a partial update with name', () => {
    const original = service.findOne('1');
    const updated = service.updateUser('1', { name: 'Updated Name' });
    expect(updated.id).toBe(original.id);
    expect(updated.name).toBe('Updated Name');
    expect(updated.email).toBe(original.email);
  });

  it('should update only the email when given a partial update with email', () => {
    const original = service.findOne('2');
    const updated = service.updateUser('2', { email: 'new.email@example.com' });
    expect(updated.id).toBe(original.id);
    expect(updated.email).toBe('new.email@example.com');
    expect(updated.name).toBe(original.name);
  });
});
