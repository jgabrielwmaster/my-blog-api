import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from './user.dto';

export interface User {
  id: string;
  name: string;
  email: string;
}

@Injectable()
export class UsersService {
  private users: User[] = [
    { id: '1', name: 'John Doe', email: 'john.doe@example.com' },
    { id: '2', name: 'Jane Smith', email: 'jane.smith@example.com' },
    { id: '3', name: 'Alice Johnson Mc', email: 'alice.johnson@example.com' },
    { id: '4', name: 'Bob Brown', email: 'bob.brown@example.com' },
  ];

  findAll() {
    return this.users;
  }

  findOne(id: string) {
    const user = this.users.find((user) => user.id === id);
    if (!user) throw new NotFoundException(`User with ID ${id} not found`);
    return user;
  }

  createUser(user: CreateUserDto) {
    const newUser = { ...user, id: (this.users.length + 1).toString() };
    this.users.push(newUser);
    return newUser;
  }

  updateUser(id: string, user: UpdateUserDto) {
    const userIndex = this.users.findIndex((user) => user.id === id);
    if (userIndex !== -1) {
      this.users[userIndex] = { ...this.users[userIndex], ...user };
      return this.users[userIndex];
    }
    throw new NotFoundException(`User with ID ${id} not found`);
  }

  deleteUser(id: string) {
    const user = this.findOne(id);
    if (user && 'id' in user) {
      this.users = this.users.filter((u) => u.id !== id);
      return user;
    }
    throw new NotFoundException(`User with ID ${id} not found`);
  }
}
