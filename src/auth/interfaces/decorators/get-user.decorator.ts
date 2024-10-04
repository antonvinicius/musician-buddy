import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '@prisma/client';
import { AuthUser } from '../../../shared/dtos/auth-user.dto';

export const GetUser = createParamDecorator(
    (data: keyof AuthUser | undefined, ctx: ExecutionContext): AuthUser => {
        const request = ctx.switchToHttp().getRequest();
        const user = request.user;

        return data ? user?.[data] : user;
    },
);
