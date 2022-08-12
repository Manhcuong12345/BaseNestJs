import { IsNotEmpty, IsNumber, IsString, Length } from 'class-validator';

export class ChangePassword {
    @IsString()
    @IsNotEmpty()
    password: string;

    @IsString()
    @Length(6, 40)
    @IsNotEmpty()
    newPassword: string;
}
