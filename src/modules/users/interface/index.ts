import { Document, Schema, QueryOptions } from 'mongoose';

//tach IFUserDoc ra de dunf cho phan rieng
export interface IFUser extends Document, IFUserDoc {
    _id: string;
    avatar: string;
    name: string;
    email: string;
    phone_number: string;
    password: string;
    address: string;
    roles: string[];
    admin: boolean;
    birthdate: number;
    gender: string;
    status: string;
    authType: string;
    authGoogleId: string;
    authFacebookId: string;
    created_time: number;
    fcm_token: string[];
}

export interface IFUserDoc {
    hashPassword(): void;
    comparePassword(password: string): boolean;
    generateToken(): string;
}
