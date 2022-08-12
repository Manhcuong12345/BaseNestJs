import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { USER_NOT_FOUND } from 'src/common/constants/err.constants';
import { User } from './model';
import { IFUser } from './interface';
import { UserDto } from './dto/dto';
import { IFResponse, ResponseService } from 'src/shared';
import { UploadFileService } from 'src/shared';

@Injectable()
export class UserRepository {
    constructor(private readonly responseService: ResponseService) {}

    fromEntity(data: any): IFUser {
        return data;
    }

    async create(userData: UserDto): Promise<IFUser> {
        const user = new User(userData);
        await user.hashPassword();
        await user.save();

        return user;
    }

    async findAllAndPaging(
        { page, limit, sort }: { page: number; limit: number; sort?: any },
        filter?: any
    ): Promise<IFResponse<IFUser>> {
        let skip = 0;
        skip = (page - 1) * limit;

        const users: IFUser[] = await User.find(filter)
            .skip(skip)
            .limit(limit)
            .sort(sort)
            .select('-password')
            .select('-fcm_token');
        const totalRecords: number = await User.countDocuments(filter);

        return this.responseService.getResponse<IFUser>(users, totalRecords, page, limit);
    }

    async findAll(filter?: any): Promise<IFUser[]> {
        const users = await User.find(filter);
        return users;
    }

    async findOne(filter?: any): Promise<IFUser> {
        const user = await User.findOne(filter);
        return user;
    }

    async findById(id: string): Promise<IFUser> {
        try {
            const user: IFUser = await User.findById(id);
            if (!user) throw new HttpException(USER_NOT_FOUND, 404);

            return user;
        } catch (err) {
            throw new HttpException(USER_NOT_FOUND, 404);
        }
    }

    async updateMany(filter: any, userData: any) {
        const result = await User.updateMany(userData);
        return result;
    }

    async updateById(id: string, userData: UserDto, options: any): Promise<IFUser> {
        try {
            const user = await User.findByIdAndUpdate(id, userData, options);
            if (!user) throw new HttpException(USER_NOT_FOUND, 404);

            return this.fromEntity(user);
        } catch (err) {
            console.log(err.message);
            throw new HttpException(USER_NOT_FOUND, 404);
        }
    }

    async deleteById(id: string): Promise<IFUser> {
        try {
            const user: IFUser = await User.findByIdAndDelete(id);
            if (!user) throw new HttpException(USER_NOT_FOUND, 404);

            return user;
        } catch (err) {
            throw new HttpException(USER_NOT_FOUND, 404);
        }
    }
}
