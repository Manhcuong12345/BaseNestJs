import { ConfigService } from 'src/config';
import { Injectable, HttpException } from '@nestjs/common';
import multer from 'multer';
import { Storage } from '@google-cloud/storage';

@Injectable()
export class UploadFileService {
    constructor(private readonly configService: ConfigService) {}

    math = [
        'jpg',
        'gif',
        'jpeg',
        'bmp',
        'tif',
        'tiff',
        'jfif',
        'png',
        'xps',
        'wmp',
        'ico',
        'mp4',
        'mp3',
        'mkv',
        'avi',
        'flv',
        'mpeg',
        'mov'
    ];

    //Function config link to cloud google storage
    storage: any = new Storage({
        projectId: this.configService.get('projectId'),
        credentials: {
            client_email: this.configService.get('clientEmail'),
            private_key: this.configService.get('privateKey')
        }
    });

    bucket = this.storage.bucket(this.configService.get('bucket'));

    //Function validateFile .file
    validateFile = (file: any) => {
        if (this.math.indexOf(file.originalname.substring(file.originalname.lastIndexOf('.') + 1)) === -1) {
            const errorMess = `The file ${file.originalname} is invalid. Only allowed to upload jpg,gif,jpeg,bmp,tif,tiff,jfif,png,xps,wmp,ico,mp4,mp3,mkv,avi,flv,mpeg,mov.`;
            return errorMess;
        }
    };

    //Function upload file to google cloud storage
    upload: any = async (file: any) => {
        if (this.validateFile(file))
            throw new HttpException({ error_code: '400', error_message: this.validateFile(file) }, 400);
        const { originalname, buffer } = file;
        const blob = this.bucket.file(originalname.replace(/ /g, '_'));
        const blobStream = await blob.createWriteStream({ resumable: false });
        return new Promise((resolve, reject) => {
            blobStream.on('error', async (err) => resolve({ error_code: '400', error_message: 'Upload Error' }));
            blobStream
                .on('finish', async () => {
                    const publicUrl = encodeURI(`https://storage.googleapis.com/${this.bucket.name}/${blob.name}`);
                    resolve(publicUrl);
                })
                .on('error', () => {
                    reject(`Unable to upload image, something went wrong`);
                })
                .end(buffer);
            // blobStream.end(file.buffer);
        });
    };

    //Function upload files to google storage cloud
    uploadManyFiles: any = async (files: any) => {
        return Promise.all(
            files.map((file: any) => {
                const { originalname, buffer } = file;
                const blob = this.bucket.file(originalname.replace(/ /g, '_'));
                const blobStream = blob.createWriteStream();
                const publicUrl = encodeURI(`https://storage.googleapis.com/${this.bucket.name}/${blob.name}`);
                return new Promise((resolve, reject) => {
                    blobStream.on('error', async (err) => resolve({ error_code: '01', error_message: 'Upload Error' }));
                    blobStream
                        .on('finish', async () => {
                            resolve(publicUrl);
                        })
                        // blobStream.end(file.buffer);
                        .end(buffer);
                });
            })
        );
    };
}
