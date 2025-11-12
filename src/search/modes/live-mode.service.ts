import { Injectable, Logger } from '@nestjs/common';

import { CaseSummary } from '../../scraper/parsers/case-list.parser';
import { ScraperService } from '../../scraper/scraper.service';

/*
    Fetch live case data directly from the court portal.
    only returns real results if available,
    or an empty array if CAPTCHA or access restrictions are detected.
*/

@Injectable()
export class LiveModeService {
  private readonly logger = new Logger(LiveModeService.name);

  constructor(private readonly scraperService: ScraperService) {}

  async getCaseData(
    firstName: string,
    lastName: string,
  ): Promise<CaseSummary[]> {
    this.logger.log(`Fetching live case data for ${firstName} ${lastName}`);

    const cases = await this.scraperService.scrapeSearchResults(
      firstName,
      lastName,
    );

    if (!cases.length) {
      this.logger.warn(`No live results found for ${firstName} ${lastName}.`);
      return [];
    }

    this.logger.log(
      `Retrieved ${cases.length} live case(s) for ${firstName} ${lastName}`,
    );
    return cases;
  }
}
