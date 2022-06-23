import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

@Injectable()
export class ActiveGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const mustActive = this.reflector.get<boolean>(
      'mustActive',
      context.getHandler(),
    );
    if (!mustActive) return true;
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (!user.isActive) {
      throw new BadRequestException('Tài khoản người dùng chưa được kích hoạt');
    }
    return true;
  }
}
