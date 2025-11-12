import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { parseCaseDetails } from './parsers/case-detail.parser';
import { CaseSummary, parseCaseList } from './parsers/case-list.parser';

@Injectable()
export class ScraperService {
  private readonly logger = new Logger(ScraperService.name);
  private readonly baseUrl =
    process.env.COURT_PORTAL_BASE_URL || 'https://portal.scscourt.org';

  async scrapeSearchResults(
    firstName: string,
    lastName: string,
  ): Promise<CaseSummary[]> {
    try {
      const searchUrl = `${this.baseUrl}/search/party?firstName=${encodeURIComponent(firstName)}&lastName=${encodeURIComponent(lastName)}`;
      this.logger.log(`Fetching live results from: ${searchUrl}`);

      const response = await axios.get(searchUrl, {
        headers: {
          'User-Agent':
            process.env.COURT_PORTAL_USER_AGENT ||
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15',
          'Accept-Language':
            process.env.COURT_PORTAL_ACCEPT_LANGUAGE || 'en-US,en;q=0.9',
        },
        timeout: parseInt(process.env.COURT_PORTAL_TIMEOUT_MS || '10000', 10),
      });

      const html = response.data as string;

      // Detect CAPTCHA or blocking pages
      const captchaIndicators = [
        'recaptcha',
        'Request unsuccessful',
        'Access Denied',
      ];
      const hasCaptcha = captchaIndicators.some((indicator) =>
        html.includes(indicator),
      );

      if (hasCaptcha) {
        this.logger.warn(
          'CAPTCHA or access restriction detected. Returning empty results.',
        );
        return [];
      }

      const summaries = parseCaseList(html);
      this.logger.log(
        `Scraped and parsed ${summaries.length} case summary(ies) for ${firstName} ${lastName}`,
      );

      // Fetch detail pages for each case
      const detailedCases: CaseSummary[] = [];
      for (const summary of summaries) {
        try {
          const detailUrl = `${this.baseUrl}${summary.detailLink}`;
          this.logger.log(
            `Fetching case details for ${summary.caseNumber} from: ${detailUrl}`,
          );

          const detailResponse = await axios.get(detailUrl, {
            headers: {
              'User-Agent':
                process.env.COURT_PORTAL_USER_AGENT ||
                'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15',
              'Accept-Language':
                process.env.COURT_PORTAL_ACCEPT_LANGUAGE || 'en-US,en;q=0.9',
            },
            timeout: parseInt(
              process.env.COURT_PORTAL_TIMEOUT_MS || '10000',
              10,
            ),
          });

          const detailHtml = detailResponse.data as string;

          // Check for CAPTCHA on detail page
          const hasDetailCaptcha = captchaIndicators.some((indicator) =>
            detailHtml.includes(indicator),
          );

          if (hasDetailCaptcha) {
            this.logger.warn(
              `CAPTCHA detected on detail page for ${summary.caseNumber}. Skipping details.`,
            );
            detailedCases.push({
              ...summary,
              source: {
                url: detailUrl,
                timestamp: new Date().toISOString(),
              },
            });
            continue;
          }

          const details = parseCaseDetails(detailHtml);
          detailedCases.push({
            ...summary,
            ...details,
            source: {
              url: detailUrl,
              timestamp: new Date().toISOString(),
            },
          });

          this.logger.log(
            `Successfully fetched details for ${summary.caseNumber}`,
          );
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : 'Unknown error';
          this.logger.warn(
            `Failed to fetch details for ${summary.caseNumber}: ${errorMessage}`,
          );
          // Include case with summary only if detail fetch fails
          const detailUrl = `${this.baseUrl}${summary.detailLink}`;
          detailedCases.push({
            ...summary,
            source: {
              url: detailUrl,
              timestamp: new Date().toISOString(),
            },
          });
        }
      }

      this.logger.log(
        `Completed scraping ${detailedCases.length} case(s) with details for ${firstName} ${lastName}`,
      );
      return detailedCases;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Scraper failed: ${errorMessage}`);
      return [];
    }
  }
}
