import { HttpException } from '@nestjs/common/exceptions/http.exception';
import { Injectable, NestMiddleware, Req, Res, Next } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { User } from '../users';
import { ConfigService } from '../../config';
import * as moment from 'moment';
import { TOKEN_EXPIRED, UNAUTHORIZED } from 'src/common/constants/err.constants';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    constructor(private readonly configService: ConfigService) {}

    async use(@Req() req, @Res() res, @Next() next) {
        const token = req.header('x-auth-token');
        if (!token) throw new HttpException(UNAUTHORIZED, 401);

        try {
            const payload: any = jwt.verify(token, this.configService.get('jwtKey')) as any;
            req.user = payload;
            req.body.user_created = req.body.user_updated = payload._id;
            req.body.created_time = req.body.updated_time = Date.now();

            const user = await User.findById(payload._id);
            if (!user) throw new HttpException(TOKEN_EXPIRED, 400);

            const now = moment();
            const tokenCreateTime = moment(payload.iat * 1000);

            if (now.diff(tokenCreateTime, 'minutes') > 43200) throw new HttpException(TOKEN_EXPIRED, 400);
            next();
        } catch (error) {
            throw new HttpException(UNAUTHORIZED, 401);
        }
    }
}
