import { SetMetadata } from '@nestjs/common';

type UserRolesType = Array<'admin' | 'user'>;

export default function Roles(...roles: UserRolesType) {
  return SetMetadata('roles', roles);
}

export type { UserRolesType };
