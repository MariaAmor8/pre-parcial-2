import { Module } from '@nestjs/common';
import { CountriesService } from './countries.service';
import { CountrySchema } from './schemas/country.schema';
import { TravelPlanSchema } from '../travel-plans/schemas/travel-plan.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { CountriesController } from './countries.controller';
import { HttpModule } from '@nestjs/axios';
import { CountriesApiProvider } from './countries-api-provider';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Country', schema: CountrySchema },
      { name: 'TravelPlan', schema: TravelPlanSchema },
    ]),
    HttpModule,
  ],
  controllers: [CountriesController],
  providers: [CountriesService, CountriesApiProvider],
  exports: [CountriesService],
})
export class CountriesModule {}
