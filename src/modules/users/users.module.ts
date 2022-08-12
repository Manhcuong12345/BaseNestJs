import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { UserService } from './users.service';
import { UserController } from './users.controller';
import { UserRepository } from './users.repository';
import { SharedModule } from '../../shared/shared.module';
import { AuthMiddleware } from '../auth/auth.middleware';

@Module({
    imports: [SharedModule],
    controllers: [UserController],
    providers: [UserService, UserRepository],
    exports: [UserService, UserRepository]
})
export class UsersModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(AuthMiddleware).forRoutes(UserController);
    }
}
