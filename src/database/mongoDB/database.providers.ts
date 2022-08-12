import * as mongoose from 'mongoose';
import { DATABASE_CONNECTION } from './database.constants';
import { ConfigService } from '../../config';

export const databaseProviders = [
    {
        provide: DATABASE_CONNECTION,
        useFactory: async (configService: ConfigService) => {
            try {
                const connectionString = configService.get('connectionString');

                await mongoose.connect(connectionString);
                console.log('connect successful to', configService.get('connectionString'));
                const db = mongoose.connection;

                // When the mongodb server goes down, the driver emits a 'close' event
                db.on('close', () => {
                    console.log('-> lost connection');
                });
                // The driver tries to automatically reconnect by default, so when the
                // server starts the driver will reconnect and emit a 'reconnect' event.
                db.on('reconnect', () => {
                    console.log('-> reconnected');
                });
                db.on('error', () => {
                    console.log('-> error connection');
                });
                db.on('reconnectFailed', async () => {
                    console.log('-> gave up reconnecting');
                });
            } catch (err) {
                console.log('connect unsucessful!!!!', err);
            }
        },
        inject: [ConfigService]
    }
];
