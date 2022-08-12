import { IsNotEmpty, IsEmail } from 'class-validator';

export class LoginDto {
    @IsNotEmpty()
    @IsEmail()
    readonly email: string;

    @IsNotEmpty()
    readonly password: string;
}

export class LoginGoogle {
    @IsNotEmpty()
    readonly accessToken: any;
}

export class LoginFacebook {
    @IsNotEmpty()
    readonly accessToken: any;
}
