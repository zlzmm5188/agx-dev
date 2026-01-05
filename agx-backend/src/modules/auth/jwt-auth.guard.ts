import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { BusinessException } from '../../common';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any) {
    if (err || !user) {
      throw BusinessException.unauthorized();
    }
    return user;
  }
}

/**
 * 管理员专用守卫
 */
@Injectable()
export class AdminGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any) {
    if (err || !user) {
      throw BusinessException.unauthorized();
    }
    if (user.type !== 'admin') {
      throw BusinessException.unauthorized('需要管理员权限');
    }
    return user;
  }
}
