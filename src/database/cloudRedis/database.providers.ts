import * as redis from 'redis';
import { DATABASE_CONNECTION_REDIS } from './database.constants';
import { ConfigService } from '../../config';

export const databaseProvidersRedis = [
    {
        provide: DATABASE_CONNECTION_REDIS,
        useFactory: async (ConfigService: ConfigService) => {
            //function config database redis cloud when deploy on server
            const redisClient = redis.createClient({
                url: `redis://${ConfigService.get('connectionUrlRedis')}:${ConfigService.get('portRedis')}`,
                password: ConfigService.get('passwordRedis')
            });

            redisClient.on('ready', () => {
                console.log('redis is connected');
            });

            redisClient.on('error', (err) => {
                console.log('redis is disconnected: ', err);
            });

            //function check log when start server in local
            (async () => {
                await redisClient.connect(); // if using node-redis client.

                const pingCommandResult = await redisClient.ping();
                console.log('Ping command result: ', pingCommandResult);

                const getCountResult = await redisClient.get('count');
                console.log('Get count result: ', getCountResult);

                const incrCountResult = await redisClient.incr('count');
                console.log('Increase count result: ', incrCountResult);

                const newGetCountResult = await redisClient.get('count');
                console.log('New get count result: ', newGetCountResult);

                await redisClient.set(
                    'object',
                    JSON.stringify({
                        name: 'Redis',
                        lastname: 'Client'
                    })
                );

                const getStringResult = await redisClient.get('object');
                console.log('Get string result: ', JSON.parse(getStringResult));
            })();
        },
        inject: [ConfigService]
    }
];
