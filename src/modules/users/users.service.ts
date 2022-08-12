import { Injectable } from '@nestjs/common';
import { HttpException, Response } from '@nestjs/common';
import { UserDto, AvatarDto } from './dto/dto';
import { UserRepository } from './users.repository';
import { IFUser } from './interface';
import { User } from './model';
import { EMAIL_ALREADY_EXIST, PHONENUMBER_ALREADY_EXIST, USER_NOT_FOUND } from 'src/common/constants/err.constants';
import { UploadFileService } from 'src/shared';

@Injectable()
export class UserService {
    constructor(private readonly userRepo: UserRepository, private readonly uploadFileScrvice: UploadFileService) {}

    async checkingBeforeCreate(userData: UserDto) {
        let existedUser = await this.userRepo.findOne({ email: userData.email });
        if (existedUser) throw new HttpException(EMAIL_ALREADY_EXIST, 400);

        existedUser = await this.userRepo.findOne({ phone_number: userData.phone_number });
        if (existedUser) throw new HttpException(PHONENUMBER_ALREADY_EXIST, 400);
    }

    async checkingBeforeUpdate(id: string, userData: UserDto) {
        let existedUser = await this.userRepo.findOne({ email: userData.email, _id: { $ne: id } });
        if (existedUser) throw new HttpException(EMAIL_ALREADY_EXIST, 400);

        existedUser = await this.userRepo.findOne({ phone_number: userData.phone_number, _id: { $ne: id } });
        if (existedUser) throw new HttpException(PHONENUMBER_ALREADY_EXIST, 400);
    }

    async create(userData: UserDto) {
        await this.checkingBeforeCreate(userData);

        return this.userRepo.create(userData);
    }

    async GetAll({ page, limit, search_string }: { page?: number; limit?: number; search_string?: string }) {
        const filter: any = {};
        if (!page || page <= 0) {
            page = 1;
        }
        if (!limit) {
            limit = 20;
        }

        if (search_string) {
            filter.$or = [
                { fullname: { $regex: search_string } },
                { email: { $regex: search_string } },
                { phone_number: { $regex: search_string } }
            ];
        }

        return this.userRepo.findAllAndPaging(
            {
                page,
                limit,
                sort: { created_time: -1 }
            },
            filter
        );
    }

    async GetById(id: string) {
        return await this.userRepo.findById(id);
    }

    async update(id: string, userData: UserDto) {
        await this.checkingBeforeUpdate(id, userData);
        const user = await User.findByIdAndUpdate(id, userData, { new: true });

        return user;
    }

    async updateFile(id: string, userData: any) {
        try {
            const uploadFile = await this.uploadFileScrvice.upload(userData);
            if (!uploadFile) throw new HttpException({ error_code: '400', error_message: '' }, 400);

            userData.avatar = uploadFile;

            const user = await User.findByIdAndUpdate(id, userData, { new: true });
            if (!user) throw new HttpException(USER_NOT_FOUND, 404);

            return user;
        } catch (err) {
            console.log(err.message);
            throw new HttpException(USER_NOT_FOUND, 404);
        }
    }

    async delete(id: string) {
        return this.userRepo.deleteById(id);
    }
}
