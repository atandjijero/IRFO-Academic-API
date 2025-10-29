import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';

@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true, // rend le module accessible partout sans réimportation
    }),
  ],
})
export class AppConfigModule {}
