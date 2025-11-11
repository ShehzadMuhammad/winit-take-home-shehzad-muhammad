import { Module } from '@nestjs/common';
import { ScraperModule } from '../scraper/scraper.module';
import { MockModeService } from './mock-mode.service';
import { LiveModeService } from './modes/live-mode.service';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';

@Module({
  imports: [ScraperModule],
  controllers: [SearchController],
  providers: [SearchService, LiveModeService, MockModeService],
})
export class SearchModule {}
