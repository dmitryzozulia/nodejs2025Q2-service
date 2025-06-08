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
  getAllUsers() {
    return this.userService.findAll();
  }

  @Get(':id')
  getUserById(@Param('id') id: string, @Res() res: Response) {
    if (!isUUID(id)) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: 'Invalid userId' });
    }
    const user = this.userService.findById(id);
    if (!user) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ message: 'User not found' });
    }
    return res.status(HttpStatus.OK).json(user);
  }

  @Post()
  createUser(@Body() body: CreateUserDto, @Res() res: Response) {
    const { login, password } = body;
    if (!login || !password) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: 'login and password are required' });
    }
    const user = this.userService.createUser(login, password);
    return res.status(HttpStatus.CREATED).json(user);
  }

  @Put(':id')
  updatePassword(
    @Param('id') id: string,
    @Body() body: UpdatePasswordDto,
    @Res() res: Response,
  ) {
    if (!isUUID(id)) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: 'Invalid userId' });
    }
    const { oldPassword, newPassword } = body;
    if (!oldPassword || !newPassword) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: 'oldPassword and newPassword are required' });
    }
    const result = this.userService.updatePassword(
      id,
      oldPassword,
      newPassword,
    );
    if (result === 'not_found') {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ message: 'User not found' });
    }
    if (result === 'forbidden') {
      return res
        .status(HttpStatus.FORBIDDEN)
        .json({ message: 'Old password is wrong' });
    }
    return res.status(HttpStatus.OK).json(result);
  }

  @Delete(':id')
  deleteUser(@Param('id') id: string, @Res() res: Response) {
    if (!isUUID(id)) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: 'Invalid userId' });
    }
    const deleted = this.userService.deleteUser(id);
    if (!deleted) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ message: 'User not found' });
    }
    return res.status(HttpStatus.NO_CONTENT).send();
  }
}
