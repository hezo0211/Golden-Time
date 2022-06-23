import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/entities/user.entity';
import * as dayjs from 'dayjs';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    username: string,
    pass: string,
    email?: string,
  ): Promise<any> {
    const user = await this.usersService.getOneUserWithOptions({
      username,
      email,
    });
    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: User) {
    const payload = {
      userId: user.userId,
      username: user.username,
      email: user.email,
      isActive: user.isActive,
      role: user.profile.role,
    };
    return {
      token: this.jwtService.sign(payload, { expiresIn: '15 minutes' }),
      refreshToken: this.jwtService.sign(payload, { expiresIn: '90 days' }),
    };
  }

  async refresh(token: string) {
    let user;
    if ((user = this.jwtService.decode(token))) {
      if (dayjs.unix(user.exp) > dayjs()) {
        const { iat, exp, ...token } = user;
        return {
          token: this.jwtService.sign(token, { expiresIn: '15 minutes' }),
          refreshToken: this.jwtService.sign(token, { expiresIn: '90 days' }),
        };
      }
    } else return null;
  }
}
