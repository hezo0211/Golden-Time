import hashedPassword from 'src/utils/hashedPassword.util';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserProfile } from './userProfile.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  userId?: string;

  @Column({ length: 100, unique: true })
  username: string;

  @Column()
  password: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true, unique: true })
  phoneNumber?: string;

  @Column({ default: false })
  isActive?: boolean;

  @OneToOne((type) => UserProfile, { cascade: true })
  @JoinColumn()
  profile: UserProfile;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (!this.password.match(/^\$2[ayb]\$.{56}$/))
      this.password = await hashedPassword(this.password);
  }

  setPhoneNumber(phone: string) {
    this.phoneNumber = phone;
  }

  setUserId(userId: string) {
    this.userId = userId;
    return this;
  }
  setUserName(userName: string) {
    this.username = userName;
    return this;
  }
  setPassword(password: string) {
    this.password = password;
    return this;
  }
  setEmail(email: string) {
    this.email = email;
    return this;
  }
  setActive(active: boolean) {
    this.isActive = active;
    return this;
  }
  setProfile(profile: UserProfile) {
    this.profile = profile;
    return this;
  }
}
