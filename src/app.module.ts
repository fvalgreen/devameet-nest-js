import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';


@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.DATABASE_URL),
    AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
