import axios from 'axios';
import { ConfigService } from 'src/config';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FireBaseService {
    private readonly FirebaseUrl: string;
    private readonly FirebaseToken: string;

    constructor(private readonly configService: ConfigService) {
        this.FirebaseToken = this.configService.get('firebaseToken');
        this.FirebaseUrl = this.configService.get('firebaseURL');
    }

    //function config data to headers when send noti
    async sendRequest(url: string, data: any) {
        const response = await axios.request({
            method: 'POST',
            url,
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'key=' + this.FirebaseToken
            },
            data
        });
        return response.data;
    }

    //function send noti when have fcm token
    async sendNotifications(tokens: string[], data: any) {
        try {
            const result = await this.sendRequest(this.FirebaseUrl, {
                registration_ids: tokens,
                content_available: true,
                notification: data,
                priority: 'high',
                data: {
                    ...data,
                    url: 'https://www.google.com/',
                    img: 'https://media3.scdn.vn/img4/2020/04_16/1vz9YFtpDPe3LYkiryuA_simg_de2fe0_500x500_maxb.jpg'
                }
            });
            console.log(result);
        } catch (error) {
            console.log(error.message);
        }
    }

    //Function reload notification when send noti to fcm
    async sendBackgroundNotifications(tokens: string[], data: any) {
        try {
            const result = await this.sendRequest(this.FirebaseUrl, {
                registration_ids: tokens,
                content_available: true,
                'apns-priority': 5,
                notification: data,
                data: {
                    ...data,
                    url: 'https://www.google.com/',
                    img: 'https://media3.scdn.vn/img4/2020/04_16/1vz9YFtpDPe3LYkiryuA_simg_de2fe0_500x500_maxb.jpg'
                }
            });
            console.log(result);
        } catch (error) {
            console.log(error.message);
        }
    }
}
