import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  BadRequestException,
  UseGuards,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import { RegisterUserDto } from './dto/register-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { plainToInstance } from 'class-transformer';
import { User } from './entities/user.entity';
import { UserProfile } from './entities/userProfile.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwtAuth.guard';
import Roles from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { CheckUserExistsDto } from './dto/check-user-exists.dto';
import Auth, { AuthParams } from 'src/auth/decorators/auth.decorator';
import { UpdateCurrentUserDto } from './dto/update-current-user.dto';
import { ActiveGuard } from 'src/auth/guards/active.guard';
import MustActive from 'src/auth/decorators/mustActive.decorator';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  //================ Public ==============================

  @Get('exists')
  async checkUserExsits(@Query() checkUserExsitsDto: CheckUserExistsDto) {
    const result = { exists: false };
    if (Object.keys(checkUserExsitsDto).length > 0) {
      result.exists =
        (await this.usersService.getOneUserWithOptions({
          username: checkUserExsitsDto.username,
          email: checkUserExsitsDto.email,
          phoneNumber: checkUserExsitsDto.phoneNumber,
        })) !== null;
    }
    return result;
  }

  @Post('register')
  async register(@Body() registerUserDto: RegisterUserDto) {
    const { profile, ...userDto } = registerUserDto;

    let user = await this.usersService.getOneUserWithOptions({
      username: registerUserDto.username,
      phoneNumber: registerUserDto.phoneNumber,
      email: registerUserDto.email,
    });
    if (user) throw new BadRequestException('T??i kho???n ???? t???n t???i');

    user = plainToInstance(User, userDto).setPassword(registerUserDto.password);

    const userProfile = plainToInstance(UserProfile, profile).setRole('user');

    user.setProfile(userProfile);

    await this.usersService.create(user);
  }

  //==============  User  =========================
  @ApiOperation({ description: 'Xem th??ng tin ng?????i d??ng hi???n t???i' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard, ActiveGuard)
  @MustActive()
  @Roles('user', 'admin')
  @Get('profile')
  async getCurrentUser(@Auth() auth: AuthParams) {
    const user = await this.usersService.getByUserId(auth.userId);
    if (!user) throw new BadRequestException('Ng?????i d??ng kh??ng t???n t???i');

    const { password, ...rest } = user;
    return rest;
  }

  @ApiOperation({ description: 'S???a th??ng tin ng?????i d??ng hi???n t???i' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard, ActiveGuard)
  @MustActive()
  @Roles('user', 'admin')
  @Put('profile')
  async updateCurrentUser(
    @Auth() auth: AuthParams,
    @Body() updateCurrentUserDto: UpdateCurrentUserDto,
  ) {
    const user = await this.usersService.getByUserId(auth.userId);
    if (!user) throw new BadRequestException('Ng?????i d??ng kh??ng t???n t???i');

    const { profile, ...rest } = updateCurrentUserDto;

    const newUser = plainToInstance(User, { ...user, ...rest });
    const newProfile = plainToInstance(UserProfile, {
      ...user.profile,
      ...profile,
    });

    newUser.setProfile(newProfile);

    await this.usersService.updateUser(newUser);
  }

  @ApiOperation({ description: 'Xo?? th??ng tin ng?????i d??ng hi???n t???i' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard, ActiveGuard)
  @MustActive()
  @Roles('user', 'admin')
  @Delete('profile')
  async deleteCurrentUser(@Auth() auth: AuthParams) {
    const user = await this.usersService.getByUserId(auth.userId);
    if (!user) throw new BadRequestException('Ng?????i d??ng kh??ng t???n t???i');
    this.usersService.deleteUser(user.userId);
  }

  //==============  Admin  =========================

  @ApiOperation({ description: 'L???y t???t c??? th??ng tin ng?????i d??ng' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get()
  getAll() {
    return this.usersService.getAllUser();
  }

  @ApiOperation({ description: 'T???o m???i th??ng tin ng?????i d??ng' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post('create')
  async create(@Body() createUserDto: CreateUserDto) {
    const { profile, ...userDto } = createUserDto;

    const user = plainToInstance(User, userDto);
    const userProfile = plainToInstance(UserProfile, profile);

    user.setProfile(userProfile);

    if (
      await this.usersService.getOneUserWithOptions({
        phoneNumber: user.phoneNumber,
      })
    )
      throw new BadRequestException('S??? ??i???n tho???i ???? ???????c s??? d???ng');
    await this.usersService.create(user);
  }

  @ApiOperation({ description: 'S???a th??ng tin ng?????i d??ng' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Put(':id/update')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    let user = await this.usersService.getByUserId(id);

    if (!user) throw new BadRequestException('Ng?????i d??ng kh??ng t???n t???i');

    const { profile, ...rest } = updateUserDto;

    const userWrapper = plainToInstance(User, rest);
    const userProfile = plainToInstance(UserProfile, profile);

    userWrapper.setProfile(
      plainToInstance(UserProfile, { ...user.profile, ...userProfile }),
    );

    user = plainToInstance(User, { ...user, ...userWrapper });

    if (
      await this.usersService.getOneUserWithOptions({
        phoneNumber: user.phoneNumber,
      })
    )
      throw new BadRequestException('S??? ??i???n tho???i ???? ???????c s??? d???ng');

    await this.usersService.updateUser(user);
  }

  @ApiOperation({ description: 'Xo?? th??ng tin ng?????i d??ng' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete(':id')
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    this.usersService.deleteUser(id);
  }
}
