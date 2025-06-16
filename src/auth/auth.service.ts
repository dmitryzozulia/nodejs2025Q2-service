import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { AuthDto } from './dto/auth.dto';
import { RefreshDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { TokenExpiredError } from 'jsonwebtoken';

export interface Payload {
  userId: string;
  login: string;
}

export interface Auth {
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async generateTokens(payload: Payload): Promise<[string, string]> {
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET || 'secret123123',
      expiresIn: process.env.JWT_EXPIRES_IN || '15m',
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_REFRESH_SECRET || 'secret123123',
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
    });

    return [accessToken, refreshToken];
  }

  async verifyAccessToken(token: string): Promise<Payload> {
    return await this.jwtService.verifyAsync<Payload>(token, {
      secret: process.env.JWT_SECRET || 'secret123123',
    });
  }

  async verifyRefreshToken(token: string): Promise<[string, string]> {
    const { userId, login } = await this.jwtService.verifyAsync<Payload>(
      token,
      {
        secret: process.env.JWT_REFRESH_SECRET || 'secret123123',
      },
    );
    return this.generateTokens({ userId, login });
  }

  async signup(authDto: AuthDto) {
    const isUserLoginExist = await this.userService.findByLogin(authDto.login);

    if (isUserLoginExist) {
      throw new HttpException(
        'User login already exists',
        HttpStatus.FORBIDDEN,
      );
    }

    const hashedPassword = await bcrypt.hash(authDto.password, 10);

    return await this.userService.createUser(authDto.login, hashedPassword);
  }

  async login(authDto: AuthDto): Promise<Auth> {
    const user = await this.userService.findByLogin(authDto.login);
    if (!user || !(await bcrypt.compare(authDto.password, user.password))) {
      throw new HttpException('Wrong login or password', HttpStatus.FORBIDDEN);
    }
    const [accessToken, refreshToken] = await this.generateTokens({
      userId: user.id,
      login: user.login,
    });
    return { accessToken, refreshToken };
  }

  async refresh(refreshDto: RefreshDto): Promise<Auth> {
    const token = refreshDto.refreshToken;
    if (!token) {
      throw new HttpException('No refresh token', HttpStatus.UNAUTHORIZED);
    }
    try {
      const [accessToken, refreshToken] = await this.verifyRefreshToken(token);
      return { accessToken, refreshToken };
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new HttpException('Refresh token expired', HttpStatus.FORBIDDEN);
      }
      throw new HttpException('Invalid refresh token', HttpStatus.FORBIDDEN);
    }
  }
}
