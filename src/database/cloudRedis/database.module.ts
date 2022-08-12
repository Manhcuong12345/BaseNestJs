import { Module } from '@nestjs/common';
import { databaseProvidersRedis } from '../cloudRedis/database.providers';

@Module({
    imports: [],
    providers: [...databaseProvidersRedis],
    exports: [...databaseProvidersRedis]
})
export class DatabaseRedisModule {}
