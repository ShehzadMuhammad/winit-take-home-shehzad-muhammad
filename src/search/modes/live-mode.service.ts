import { Injectable, Logger } from '@nestjs/common';
import { CaseSummary } from '../../scraper/parsers/case-list.parser';
import { ScraperService } from '../../scraper/scraper.service';

@Injectable()
export class LiveModeService {
  private readonly logger = new Logger(LiveModeService.name);

  constructor(private readonly scraperService: ScraperService) {}

  async getCaseData(firstName: string, lastName: string): Promise<CaseSummary[]> {
    this.logger.log(`Fetching live case data for ${firstName} ${lastName}`);

    try {
      const cases = await this.scraperService.scrapeSearchResults(firstName, lastName);

      if (!cases || cases.length === 0) {
        this.logger.warn(
          `No live cases found or CAPTCHA detected for ${firstName} ${lastName}`,
        );
        return [];
      }

      this.logger.log(
        `Retrieved ${cases.length} live case(s) for ${firstName} ${lastName}`,
      );
      return cases;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Error fetching live case data: ${errorMessage}`);
      return [];
    }
  }
}

