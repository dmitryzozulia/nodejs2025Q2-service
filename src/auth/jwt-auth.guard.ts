import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
//import { Reflector } from '@nestjs/core';
import { AuthService } from './auth.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const { url, method } = req;

    const publicRoutes = [
      { method: 'POST', url: '/auth/signup' },
      { method: 'POST', url: '/auth/login' },
      { method: 'POST', url: '/auth/refresh' },
      { method: 'GET', url: '/doc' },
      { method: 'GET', url: '/' },
    ];

    console.log('JwtAuthGuard:', method, url);
    console.log(
      'Is public:',
      publicRoutes.some((r) => r.method === method && url.startsWith(r.url)),
    );

    if (publicRoutes.some((r) => r.method === method && r.url === url)) {
      return true;
    }

    const auth = req.headers['authorization'];
    if (!auth || !auth.startsWith('Bearer ')) {
      throw new UnauthorizedException('No Bearer token');
    }
    const token = auth.split(' ')[1];
    try {
      req.user = await this.authService.verifyAccessToken(token);
      return true;
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
