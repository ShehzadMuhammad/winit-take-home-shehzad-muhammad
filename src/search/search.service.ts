import { Injectable, Logger } from '@nestjs/common';
import { Config } from '../common/constants/config';
import { HtmlLoader } from '../common/utils/html-loader';
import {
  CaseSummary,
  parseCaseList,
} from '../scraper/parsers/case-list.parser';
import { ScraperService } from '../scraper/scraper.service';

@Injectable()
export class SearchService {
  private readonly logger = new Logger(SearchService.name);

  constructor(private readonly scraperService: ScraperService) {}

  async searchByName(
    firstName: string,
    lastName: string,
  ): Promise<CaseSummary[]> {
    if (Config.isMockMode()) {
      this.logger.log(`Running in MOCK mode for ${firstName} ${lastName}`);
      return this.searchFromFixture(firstName, lastName);
    }

    this.logger.log(`Running in LIVE mode for ${firstName} ${lastName}`);
    return this.searchLive(firstName, lastName);
  }

  private searchFromFixture(
    firstName: string,
    lastName: string,
  ): CaseSummary[] {
    const html = HtmlLoader.loadSearchFixture(firstName, lastName);

    if (!html) {
      this.logger.warn(`Fixture not found for ${firstName} ${lastName}`);
      return [];
    }

    const cases = parseCaseList(html);
    this.logger.log(`Returning ${cases.length} cases from fixture.`);
    return cases;
  }

  private async searchLive(
    firstName: string,
    lastName: string,
  ): Promise<CaseSummary[]> {
    const cases = await this.scraperService.scrapeSearchResults(
      firstName,
      lastName,
    );

    // If scraper returns empty results (CAPTCHA or error), fall back to mock mode
    if (cases.length === 0) {
      this.logger.warn(
        'Live scraping returned no results. Falling back to mock mode.',
      );
      return this.searchFromFixture(firstName, lastName);
    }

    return cases;
  }
}
