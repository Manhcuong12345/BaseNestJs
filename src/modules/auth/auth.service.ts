import { Injectable } from '@nestjs/common';
import { pick } from 'lodash';
import { User } from '../users';
import { IFUser } from '../users/interface';
import { LoginDto, LoginGoogle, LoginFacebook } from './dto/dto';
import { HttpException } from '@nestjs/common';
import { Response } from 'express';
import axios from 'axios';

@Injectable()
export class AuthService {
    async login({ email, password }: LoginDto, res: Response) {
        const user: IFUser = await User.findOne({ email });
        if (!user) throw new HttpException({ error_code: '01', error_message: 'Invalid email or password' }, 400);

        const InvalidPassword = await user.comparePassword(password);
        if (!InvalidPassword)
            throw new HttpException({ error_code: '01', error_message: 'Invalid email or password' }, 400);

        const response = pick(user, ['_id', 'email']);
        const token = user.generateToken();

        return res.header('x-auth-token', token).send(response);
    }

    /**
     * Function login facebook data
     * @param accessToken
     * @param res
     * @returns
     */

    async getUserByFBToken({ accessToken }: LoginFacebook, res: Response) {
        const PATH = 'https://graph.facebook.com/me';

        // Get user profile by Facebook access token
        const resp = await axios.get(PATH, {
            params: {
                fields: 'id,name,email,picture',
                access_token: accessToken
            }
        });

        const profile = resp.data;
        console.log(profile);

        // Get user by profile have just got
        // If user profile did not exist in database, then it will be created
        const user = await this.getUserByFbProfile(profile);
        const token = user.generateToken();
        const response = {
            user: pick(user, ['_id', 'email', 'name', 'authType', 'avatar'])
        };

        return res.header('x-auth-token', token).send(response);
    }

    /**
     * Get user by facebook profile
     * If user profile did not exist in database, then it will be created
     * @param profile facebook profile
     * @returns
     */
    async getUserByFbProfile(profile: any): Promise<IFUser> {
        const user = await User.findOne({ email: profile.email, authType: 'facebook' });

        if (user) return user;
        else {
            //if new account
            const newUser = new User({
                authType: 'facebook',
                authGoogleId: profile.id,
                email: profile.email,
                name: profile.name,
                avatar: profile.picture.data.url
            });
            await newUser.save();

            return newUser;
        }
    }

    /**
     * Function login google user
     * @param accessToken
     * @param res
     * @returns
     */
    async getUserByGGToken({ accessToken }: LoginGoogle, res: Response) {
        const PATH = 'https://www.googleapis.com/oauth2/v2/userinfo';

        // Get user profile by Google access token
        const resp = await axios.get(PATH, {
            params: {
                field: 'id,name,email,picture',
                access_token: accessToken
            }
        });

        const profile = resp.data;
        console.log(profile);

        // Get user by profile have just got
        // If user profile did not exist in database, then it will be created
        const user = await this.getUserByGGProfile(profile);
        const token = user.generateToken();
        const response = {
            user: pick(user, ['_id', 'email', 'name', 'authType', 'avatar'])
        };

        return res.header('x-auth-token', token).send(response);
    }

    /**
     * Get user by google profile
     * If user profile did not exist in database, then it will be created
     * @param profile google profile
     * @returns
     */
    async getUserByGGProfile(profile: any): Promise<IFUser> {
        const user = await User.findOne({ email: profile.email, authType: 'google' });

        if (user) return user;
        else {
            //if new account
            const newUser = new User({
                authType: 'google',
                authGoogleId: profile.id,
                email: profile.email,
                name: profile.name,
                avatar: profile.picture,
                is_active: profile.is_active
            });
            await newUser.save();

            return newUser;
        }
    }
}
