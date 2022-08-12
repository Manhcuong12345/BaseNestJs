import { IsNotEmpty } from 'class-validator';

export class UserDto {
    @IsNotEmpty()
    readonly fullname: string;

    @IsNotEmpty()
    readonly email: string;

    @IsNotEmpty()
    readonly password: string;

    @IsNotEmpty()
    readonly phone_number: string;

    readonly address: string;

    readonly avatar: string;

    readonly gender: string;

    readonly admin: boolean;

    readonly status: string;

    readonly roles: string[];

    readonly birthdate: number;
}

export class AvatarDto {
    readonly avatar: any;
}
