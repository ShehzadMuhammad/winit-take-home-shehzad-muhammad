import { Module } from '@nestjs/common';
import { ScraperModule } from '../scraper/scraper.module';
import { LiveModeService, MockModeService } from './modes';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';

@Module({
  imports: [ScraperModule],
  controllers: [SearchController],
  providers: [SearchService, LiveModeService, MockModeService],
})
export class SearchModule {}
