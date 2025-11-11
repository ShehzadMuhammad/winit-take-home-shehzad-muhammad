import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';
import { CaseSummary, parseCaseList } from './scraper/parsers/case-list.parser';

@Injectable()
export class SearchService {
  private readonly logger = new Logger(SearchService.name);
  private readonly baseUrl = 'https://portal.scscourt.org/search/party';

  async searchByName(
    firstName: string,
    lastName: string,
  ): Promise<CaseSummary[]> {
    const mode = process.env.MODE || 'mock';

    if (mode === 'mock') {
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
    const folderName = `${firstName}_${lastName}`;
    const filePath = path.join(
      process.cwd(),
      'fixtures',
      folderName,
      `search_${folderName}.html`,
    );

    if (!fs.existsSync(filePath)) {
      this.logger.warn(`Fixture not found: ${filePath}`);
      return [];
    }

    const html = fs.readFileSync(filePath, 'utf8');
    const cases = parseCaseList(html);
    this.logger.log(`Returning ${cases.length} cases from fixture.`);
    return cases;
  }

  private async searchLive(
    firstName: string,
    lastName: string,
  ): Promise<CaseSummary[]> {
    try {
      const url = `${this.baseUrl}?firstName=${encodeURIComponent(firstName)}&lastName=${encodeURIComponent(lastName)}`;

      const response = await axios.get(url, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15',
          'Accept-Language': 'en-US,en;q=0.9',
        },
        timeout: 10000,
      });

      const html = response.data as string;

      // Detect CAPTCHA or WAF block
      if (
        html.includes('recaptcha') ||
        html.includes('Request unsuccessful') ||
        html.includes('Access Denied')
      ) {
        this.logger.warn(
          'CAPTCHA or access restriction detected — switching to mock mode.',
        );
        return this.searchFromFixture(firstName, lastName);
      }

      const cases = parseCaseList(html);
      this.logger.log(`Fetched ${cases.length} cases live from portal.`);
      return cases;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Live fetch failed: ${errorMessage}`);
      this.logger.warn('Falling back to mock mode.');
      return this.searchFromFixture(firstName, lastName);
    }
  }
}
