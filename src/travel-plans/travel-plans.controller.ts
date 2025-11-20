import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { TravelPlansService } from './travel-plans.service';
import { CreateTravelPlanDto } from './dto/create-travel-plan.dto';

@Controller('travel-plans')
export class TravelPlansController {
  constructor(private readonly travelPlansService: TravelPlansService) {}

  @Get()
  findAll() {
    return this.travelPlansService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.travelPlansService.findOne(id);
  }

  @Get(':planId/comments/:commentId')
  findComment(
    @Param('planId') planId: string,
    @Param('commentId') commentId: string,
  ) {
    return this.travelPlansService.findComment(planId, commentId);
  }

  @Post()
  create(@Body() createTravelPlanDto: CreateTravelPlanDto) {
    return this.travelPlansService.create(createTravelPlanDto);
  }
}
