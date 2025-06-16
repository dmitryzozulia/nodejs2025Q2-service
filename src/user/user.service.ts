import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findAll() {
    const users = await this.userRepository.find();
    return users.map(({ password, ...user }) => ({
      ...user,
      createdAt: Number(user.createdAt),
      updatedAt: Number(user.updatedAt),
    }));
  }

  async findById(id: string) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) return undefined;
    const { password, ...userWithoutPassword } = user;
    userWithoutPassword.createdAt = Number(userWithoutPassword.createdAt);
    userWithoutPassword.updatedAt = Number(userWithoutPassword.updatedAt);
    return userWithoutPassword;
  }

  async findByLogin(login: string) {
    return this.userRepository.findOne({ where: { login } });
  }

  async createUser(login: string, password: string) {
    const now = Date.now();
    const newUser = this.userRepository.create({
      login,
      password,
      version: 1,
      createdAt: now,
      updatedAt: now,
    });
    const savedUser = await this.userRepository.save(newUser);
    const { password: _, ...userWithoutPassword } = savedUser;
    userWithoutPassword.createdAt = Number(userWithoutPassword.createdAt);
    userWithoutPassword.updatedAt = Number(userWithoutPassword.updatedAt);
    return userWithoutPassword;
  }

  async updatePassword(id: string, oldPassword: string, newPassword: string) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) return 'not_found';
    if (user.password !== oldPassword) return 'forbidden';
    user.password = newPassword;
    user.version += 1;
    user.updatedAt = Date.now();
    const updatedUser = await this.userRepository.save(user);
    const { password, ...userWithoutPassword } = updatedUser;
    userWithoutPassword.createdAt = Number(userWithoutPassword.createdAt);
    userWithoutPassword.updatedAt = Number(userWithoutPassword.updatedAt);
    return userWithoutPassword;
  }

  async deleteUser(id: string) {
    const result = await this.userRepository.delete(id);
    return result.affected !== 0;
  }
}
