import {
    Controller,
    Get,
    Post,
    Param,
    Body,
    Put,
    Delete,
    Res,
    Query,
    UseGuards,
    UsePipes,
    ValidationPipe,
    UseInterceptors,
    UploadedFile,
    HttpCode
} from '@nestjs/common';
import { UserService } from './users.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserDto, AvatarDto } from './dto/dto';
import { PagingPipe } from 'src/common/pipes/paging.pipe';
import { User } from 'src/common/decorators/user.decorator';
import { RoleGuard } from '../../common/guards/authorize.guard';
// import {
//     changePasswordSwagger,
//     createUserSwagger,
//     deleteUserSwagger,
//     getMeSwagger,
//     getUserByIdSwagger,
//     updateUserProfileSwagger,
//     updateUserSwagger,
//     UserSwagger
// } from './swagger';

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post()
    @HttpCode(200)
    async create(@Body() userData: UserDto) {
        return this.userService.create(userData);
    }

    @Get('/me')
    @UseGuards(new RoleGuard(['User']))
    async findMe(@User() user) {
        return this.userService.GetById(user._id);
    }

    @Get('')
    @UseGuards(new RoleGuard(['User']))
    async GetAllUsers(@Query(new PagingPipe()) query: { page?: number; limit?: number; search_string?: string }) {
        return this.userService.GetAll(query);
    }

    @Get('/:id')
    async GetUserById(@Param('id') id: string) {
        return this.userService.GetById(id);
    }

    // @Put('/me/change-password')
    // @UsePipes(new ValidationPipe())
    // async ChangePassword(@User() user, @Body() body: ChangePasswordDto) {
    //     return this.userService.changePassword(user._id, body.password, body.newPassword);
    // }

    @Put('/me')
    async changeUserInfo(@User() user, @Body() userData: UserDto) {
        return this.userService.update(user._id, userData);
    }

    @Put('upload')
    @UseInterceptors(FileInterceptor('avatar'))
    async UpdateFileAvater(@User() user, @UploadedFile() file) {
        return this.userService.updateFile(user._id, file);
    }

    // @Put('delete/file')
    // @UseInterceptors(FileInterceptor('avatar'))
    // async DeleteFileAvater(@User() user, @Body() avatar: AvatarDto) {
    //     return this.userService.deleteFile(user._id, avatar);
    // }

    @Put('/:id')
    async UpdateUser(@Param('id') id: string, @Body() userData: UserDto) {
        return this.userService.update(id, userData);
    }

    @Delete('/:id')
    async DeleteUser(@Param('id') id: string) {
        return this.userService.delete(id);
    }
}
