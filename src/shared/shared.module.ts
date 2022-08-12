import { Global, Module } from '@nestjs/common';
import { ResponseService } from './services/response.service';
import { UploadFileService } from './services/upload_cloud.service';

const providers = [ResponseService, UploadFileService];

@Global()
@Module({
    providers,
    exports: providers
})
export class SharedModule {}
