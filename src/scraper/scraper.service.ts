import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { Config } from '../common/constants/config';
import { CaseSummary, parseCaseList } from './parsers/case-list.parser';

@Injectable()
export class ScraperService {
  private readonly logger = new Logger(ScraperService.name);

  async scrapeSearchResults(
    firstName: string,
    lastName: string,
  ): Promise<CaseSummary[]> {
    try {
      const url = `${Config.COURT_PORTAL.BASE_URL}?firstName=${encodeURIComponent(firstName)}&lastName=${encodeURIComponent(lastName)}`;
      this.logger.log(`Fetching live results from: ${url}`);

      const response = await axios.get(url, {
        headers: {
          'User-Agent': Config.COURT_PORTAL.USER_AGENT,
          'Accept-Language': Config.COURT_PORTAL.ACCEPT_LANGUAGE,
        },
        timeout: Config.COURT_PORTAL.TIMEOUT_MS,
      });

      const html = response.data as string;

      // Detect CAPTCHA or blocking pages
      const hasCaptcha = Config.CAPTCHA_INDICATORS.some((indicator) =>
        html.includes(indicator),
      );

      if (hasCaptcha) {
        this.logger.warn(
          'CAPTCHA or access restriction detected. Returning empty results.',
        );
        return [];
      }

      const cases = parseCaseList(html);
      this.logger.log(
        `Scraped and parsed ${cases.length} case(s) for ${firstName} ${lastName}`,
      );
      return cases;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Scraper failed: ${errorMessage}`);
      return [];
    }
  }
}
