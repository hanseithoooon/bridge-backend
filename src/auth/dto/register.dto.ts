import { IsString } from 'class-validator';

export class RegisterDto {
    username: string;
    password: string;
    phoneNumber: string;


}