import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserDto } from '../users/dto/user.dto';
import { User, UserRole } from '../users/entity/user';

export function getUserFromRequest(ctx: ExecutionContext) {
  const request = ctx.switchToHttp().getRequest();
  const user = request.user as UserDto;

  return user;
}

export const UserParam = createParamDecorator(
  (_: never, ctx: ExecutionContext) => {
    // const user = new User();
    // user.id = 1;
    // user.role = UserRole.Admin;
    // return user;
    return getUserFromRequest(ctx);
  },
);