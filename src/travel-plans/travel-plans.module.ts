import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TravelPlan, TravelPlanSchema } from './schemas/travel-plan.schema';
import { TravelPlansService } from './travel-plans.service';
import { TravelPlansController } from './travel-plans.controller';
import { CountriesModule } from 'src/countries/countries.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TravelPlan.name, schema: TravelPlanSchema },
    ]),
    CountriesModule,
  ],
  providers: [TravelPlansService],
  controllers: [TravelPlansController],
})
export class TravelPlansModule {}
