import { Injectable, CanActivate, ExecutionContext, HttpException } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class RoleGuard implements CanActivate {
    constructor(private readonly roles?: string[]) {}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const req = context.switchToHttp().getRequest();
        const { user } = req;
        if (this.roles.includes(user.type)) {
            return true;
        }
        throw new HttpException({ error_code: '401', error_message: 'unauthorized' }, 401);
    }
}
