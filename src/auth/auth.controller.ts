import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { LoginUserDto } from './dto/login-user.dto';
import { AuthService } from './auth.service';
import { RefreshAuthDto } from './dto/refresh-auth.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto) {
    const user = await this.authService.validateUser(
      loginUserDto.username,
      loginUserDto.password,
      loginUserDto.email,
    );
    if (user) {
      const { password, ...rest } = user;
      return await this.authService.login(user);
    } else throw new BadRequestException('Sai tên đăng nhập hoặc mật khẩu');
  }

  @Post('refresh')
  async refresh(@Body() refreshAuthDto: RefreshAuthDto) {
    const data = await this.authService.refresh(refreshAuthDto.refreshToken);
    if (!data) throw new BadRequestException('Token đã hết hạn');
    return data;
  }
}
