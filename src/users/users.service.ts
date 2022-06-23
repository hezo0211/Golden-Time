import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UserProfile } from './entities/userProfile.entity';

type UserOptions = {
  username?: string;
  email?: string;
  phoneNumber?: string;
};

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(UserProfile)
    private userProfileRepository: Repository<UserProfile>,
  ) {}

  /**
   * Trả về người dùng với 1 id bất kỳ
   * @param userId
   * @returns
   */
  async getByUserId(userId: string): Promise<User> {
    return await this.userRepository.findOne({
      where: { userId: userId },
      relations: {
        profile: true,
      },
    });
  }

  /**
   * Kiểm tra xem người dùng có tồn tại không
   * @param user
   */
  async getOneUserWithOptions(options: UserOptions) {
    const { username, email, phoneNumber } = options;

    return await this.userRepository.findOne({
      where: [{ username }, { email }, { phoneNumber }],
      relations: { profile: true },
    });
  }
  /**
   * Trả về tất cả danh sách các người dùng
   * @returns
   */
  async getAllUser(): Promise<User[]> {
    return this.userRepository.find({ relations: { profile: true } });
  }

  /**
   * Cập nhật thông tin người dùng
   * @param user
   * @returns
   */
  async updateUser(user: User): Promise<void> {
    await this.userRepository.save(user);
  }

  /**
   * Xoá tài khoản người dùng
   * @param userId
   * @returns
   */
  async deleteUser(userId: string): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { userId: userId },
      relations: {
        profile: true,
      },
    });

    await this.userRepository.delete(userId);
    await this.userProfileRepository.delete(user.profile.userProfileId);
  }

  /**
   * Tạo tài khoản người dùng
   * @param user
   * @returns
   */
  async create(user: User): Promise<void> {
    this.userRepository.save(user);
  }

  /**
   * Kích hoạt tài khoản người dùng
   * @param userId
   * @returns
   */
  async activeUser(userId: string): Promise<void> {
    await this.userRepository.update({ userId: userId }, { isActive: true });
  }
}
