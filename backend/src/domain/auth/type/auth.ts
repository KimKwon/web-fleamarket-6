import { IsNumber, IsString } from 'class-validator';

export class Code {
  @IsString()
  code: string;
}

export class SigninInfo {
  @IsString()
  nickname: string;
  @IsString()
  password: string;
}

export class SignupInfo extends SigninInfo {
  @IsNumber()
  regionId: number;
}

export class UserInfo extends SigninInfo {
  @IsString()
  regionName: string;
}
