import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

type UserRole = 'superuser' | 'admin' | 'user';

@Entity()
export class UserProfile {
  @PrimaryGeneratedColumn('uuid')
  userProfileId?: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  role: UserRole;

  setUserProfileId(userProfileId: string) {
    this.userProfileId = userProfileId;
    return this;
  }

  setFirstName(firstName: string) {
    this.firstName = firstName;
    return this;
  }
  setLastName(lastName: string) {
    this.lastName = lastName;
    return this;
  }
  setRole(role: UserRole) {
    this.role = role;
    return this;
  }
}

export type { UserRole };
