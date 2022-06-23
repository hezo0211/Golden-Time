import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserRolesType } from './roles.decorator';

type AuthParams = {
  userId: string;
  username: string;
  email: string;
  isActive: boolean;
  role: UserRolesType;
  iat: number;
  exp: number;
};

const Auth = createParamDecorator((data, ctx: ExecutionContext) => {
  return ctx.switchToHttp().getRequest().user;
});

export default Auth;
export type { AuthParams };
