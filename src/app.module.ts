import { Module, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerMiddleware } from './common/middlewares/logger.middleware';
import { ConfigModule } from './config';
import { DatabaseModule } from './database';
import { DatabaseRedisModule } from './database';
import { UsersModule } from './modules/users';
import { AuthModule } from './modules/auth';

@Module({
    imports: [ConfigModule, DatabaseModule, DatabaseRedisModule, UsersModule, AuthModule],
    controllers: [AppController],
    providers: [AppService]
})
export class AppModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(LoggerMiddleware).forRoutes('*');
    }
}
