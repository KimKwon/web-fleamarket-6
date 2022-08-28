import { IsNumber, IsString } from 'class-validator';

export class RegionType {
  @IsNumber()
  id: number;

  @IsString()
  name: string;
}

export class ChangedUserInfo {
  @IsNumber()
  userId: number;

  @IsNumber()
  regionId: number;
}
