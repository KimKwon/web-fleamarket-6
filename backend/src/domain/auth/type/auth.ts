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

export class OAuthSignupInfo {
  @IsNumber()
  githubUserId: number;

  @IsNumber()
  regionId: number;

  @IsNumber()
  nickname: string;
}

export class UserInfo extends SigninInfo {
  @IsString()
  regionName: string;
}
