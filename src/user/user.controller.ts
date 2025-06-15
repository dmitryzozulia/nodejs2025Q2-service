import {
  Controller,
  Get,
  Param,
  Res,
  HttpStatus,
  Post,
  Body,
  Put,
  Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import { isUUID } from 'class-validator';
import { Response } from 'express';
import { CreateUserDto } from './dto/CreateUser.dto';
import { UpdatePasswordDto } from './dto/UpdatePassword.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getAllUsers(@Res() res: Response) {
    try {
      const users = await this.userService.findAll();
      return res.status(HttpStatus.OK).json(users);
    } catch (err) {
      console.error(err);
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: 'Internal server error' });
    }
  }

  @Get(':id')
  async getUserById(@Param('id') id: string, @Res() res: Response) {
    try {
      if (!isUUID(id)) {
        return res.status(400).json({ message: 'Invalid userId' });
      }
      const user = await this.userService.findById(id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      return res.status(200).json(user);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  @Post()
  async createUser(@Body() body: CreateUserDto, @Res() res: Response) {
    try {
      const { login, password } = body;
      if (
        !login ||
        !password ||
        typeof login !== 'string' ||
        typeof password !== 'string'
      ) {
        return res
          .status(400)
          .json({ message: 'login and password are required' });
      }
      const user = await this.userService.createUser(login, password);
      return res.status(201).json(user);
    } catch (err: any) {
      if (err.code === '23505') {
        return res
          .status(400)
          .json({ message: 'User with this login already exists' });
      }
      console.error(err);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
  @Put(':id')
  async updatePassword(
    @Param('id') id: string,
    @Body() body: UpdatePasswordDto,
    @Res() res: Response,
  ) {
    try {
      if (!isUUID(id)) {
        return res.status(400).json({ message: 'Invalid userId' });
      }
      const { oldPassword, newPassword } = body;
      if (
        !oldPassword ||
        !newPassword ||
        typeof oldPassword !== 'string' ||
        typeof newPassword !== 'string'
      ) {
        return res
          .status(400)
          .json({ message: 'oldPassword and newPassword are required' });
      }
      const result = await this.userService.updatePassword(
        id,
        oldPassword,
        newPassword,
      );
      if (result === 'not_found') {
        return res.status(404).json({ message: 'User not found' });
      }
      if (result === 'forbidden') {
        return res.status(403).json({ message: 'Old password is wrong' });
      }
      return res.status(200).json(result);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
  @Delete(':id')
  async deleteUser(@Param('id') id: string, @Res() res: Response) {
    try {
      if (!isUUID(id)) {
        return res.status(400).json({ message: 'Invalid userId' });
      }
      const deleted = await this.userService.deleteUser(id);
      if (!deleted) {
        return res.status(404).json({ message: 'User not found' });
      }
      return res.status(204).send();
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
}
