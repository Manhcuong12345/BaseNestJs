import { Controller, Post, Body, Res, UsePipes, HttpCode, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, LoginGoogle, LoginFacebook } from './dto/dto';
import { ApiOkResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';

@Controller('login')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('/users')
    @ApiOkResponse({ description: 'User Login' })
    @ApiUnauthorizedResponse({ description: 'Invail email or password' })
    @HttpCode(200)
    @UsePipes(new ValidationPipe())
    async login(@Body() LoginData: LoginDto, @Res() res) {
        return this.authService.login(LoginData, res);
    }

    @Post('/google')
    @HttpCode(200)
    async loginGoogle(@Body() LoginDataGG: LoginGoogle, @Res() res) {
        return this.authService.getUserByGGToken(LoginDataGG, res);
    }

    @Post('/facebook')
    @HttpCode(200)
    async loginFacebook(@Body() LoginDataFB: LoginFacebook, @Res() res) {
        return this.authService.getUserByFBToken(LoginDataFB, res);
    }
}
