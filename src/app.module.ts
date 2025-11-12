import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { Config } from './common/constants/config';
import { SearchModule } from './search/search.module';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: parseInt(process.env.THROTTLER_TTL_SECONDS || '60', 10),
        limit:
          Config.MODE === 'live'
            ? parseInt(process.env.THROTTLER_LIMIT_LIVE || '3', 10)
            : parseInt(process.env.THROTTLER_LIMIT_MOCK || '10', 10),
      },
    ]),
    SearchModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
