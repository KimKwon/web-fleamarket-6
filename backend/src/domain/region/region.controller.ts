import { Body, Controller, Get, Patch } from '@nestjs/common';
import { RegionService } from './region.service';
import { ChangedUserInfo } from './types/region';

@Controller('region')
export class RegionController {
  constructor(private readonly regionService: RegionService) {}

  @Get()
  async getRegions() {
    return this.regionService.getRegions();
  }

  @Patch()
  async changeUserRegion(@Body() chagnedUserInfo: ChangedUserInfo) {
    return this.regionService.changeUserRegion(chagnedUserInfo);
  }
}
