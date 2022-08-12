import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ErrorsInterceptor } from './common/interceptors/errors.interceptor';
import { LoggingInterceptor } from './common/interceptors/logger.interceptor';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { Request, Response, NextFunction } from 'express';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, { cors: true });

    app.use(function (req: Request, res: Response, next: NextFunction) {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', '*');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, x-auth-token');
        res.header('Access-Control-Expose-Headers', 'x-auth-token');
        next();
    });

    app.setGlobalPrefix('api');
    app.useGlobalInterceptors(new LoggingInterceptor());
    app.useGlobalInterceptors(new ErrorsInterceptor());

    const configSwagger = new DocumentBuilder()
        .setTitle('HOME_SERVICE API')
        .setDescription('THE PROJECT HS API')
        .setVersion('1.0')
        .build();
    const document = SwaggerModule.createDocument(app, configSwagger);
    SwaggerModule.setup('api/documents', app, document);

    const localPort = Number(process.env.PORT) || 3000;

    await app.listen(localPort, () => {
        console.log('listening on port:' + localPort);
    });
}
bootstrap();
