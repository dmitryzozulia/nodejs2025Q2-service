import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UserService {
  private users: User[] = [
    {
      id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
      login: 'user1',
      password: 'password1',
      version: 1,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
    {
      id: 'b2c3d4e5-f6a7-8901-bcde-fa2345678901',
      login: 'user2',
      password: 'password2',
      version: 1,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
  ];

  findAll() {
    const users = this.users.map((user) => {
      const userWithoutPassword = { ...user };
      delete userWithoutPassword.password;
      return userWithoutPassword;
    });
    return users;
  }

  findById(id: string) {
    const user = this.users.find((user) => user.id === id);
    if (!user) {
      return undefined;
    }
    const userWithoutPassword = { ...user };
    delete userWithoutPassword.password;
    return userWithoutPassword;
  }

  createUser(login: string, password: string) {
    const now = Date.now();
    const newUser = {
      id: uuidv4(),
      login,
      password,
      version: 1,
      createdAt: now,
      updatedAt: now,
    };
    this.users.push(newUser);
    const userWithoutPassword = { ...newUser };
    delete userWithoutPassword.password;
    return userWithoutPassword;
  }

  updatePassword(id: string, oldPassword: string, newPassword: string) {
    const user = this.users.find((u) => u.id === id);
    if (!user) {
      return 'not_found';
    }
    if (user.password !== oldPassword) {
      return 'forbidden';
    }
    user.password = newPassword;
    user.version += 1;
    user.updatedAt = Date.now();
    const userWithoutPassword = { ...user };
    delete userWithoutPassword.password;
    return userWithoutPassword;
  }

  deleteUser(id: string) {
    const index = this.users.findIndex((user) => user.id === id);
    if (index === -1) {
      return false;
    }
    this.users.splice(index, 1);
    return true;
  }
}
