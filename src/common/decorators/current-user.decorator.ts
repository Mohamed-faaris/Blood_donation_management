import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// Usage: @CurrentUser() user: User  — injects the JWT payload from request
export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
