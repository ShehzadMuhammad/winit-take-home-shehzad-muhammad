import { Module } from '@nestjs/common';
import { ScraperModule } from '../scraper/scraper.module';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';

@Module({
  imports: [ScraperModule],
  controllers: [SearchController],
  providers: [SearchService],
})
export class SearchModule {}
