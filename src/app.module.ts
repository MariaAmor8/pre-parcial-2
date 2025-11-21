import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { CountriesModule } from './countries/countries.module';
import { TravelPlansModule } from './travel-plans/travel-plans.module';
import { AccessLogMiddleware } from './common/middleware/access-log.middleware';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb://root:secret@localhost:27018/preparcial2?authSource=admin',
    ),
    CountriesModule,
    TravelPlansModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AccessLogMiddleware).forRoutes('*');
  }
}
