import { Injectable, Logger } from '@nestjs/common';
import { HtmlLoader } from '../../common/utils/html-loader';
import { parseCaseDetails } from '../../scraper/parsers/case-detail.parser';
import {
  CaseSummary,
  parseCaseList,
} from '../../scraper/parsers/case-list.parser';

/*
  This service is responsible for loading mock case data from fixtures.
  It uses the HtmlLoader to load the fixture and parse the case list and details.
*/

@Injectable()
export class MockModeService {
  private readonly logger = new Logger(MockModeService.name);

  getCaseData(firstName: string, lastName: string): CaseSummary[] {
    this.logger.log(`Loading mock case data for ${firstName} ${lastName}`);

    try {
      const html = HtmlLoader.loadSearchFixture(firstName, lastName);

      if (!html) {
        this.logger.warn(`Fixture not found for ${firstName} ${lastName}`);
        return [];
      }

      const summaries = parseCaseList(html);
      this.logger.log(
        `Loaded ${summaries.length} case summary(ies) from fixture for ${firstName} ${lastName}`,
      );

      // Load case details from fixtures
      const detailedCases: CaseSummary[] = [];
      for (const summary of summaries) {
        try {
          const detailHtml = HtmlLoader.loadCaseDetailFixture(
            firstName,
            lastName,
            summary.caseNumber,
          );

          if (detailHtml) {
            const details = parseCaseDetails(detailHtml);
            detailedCases.push({
              ...summary,
              ...details,
              source: {
                url: `mock://fixture/${firstName}_${lastName}/${summary.caseNumber}`,
                timestamp: new Date().toISOString(),
              },
            });
            this.logger.log(
              `Loaded case details for ${summary.caseNumber} from fixture`,
            );
          } else {
            // Include case with summary only if detail fixture not found
            this.logger.warn(
              `Case detail fixture not found for ${summary.caseNumber}`,
            );
            detailedCases.push({
              ...summary,
              source: {
                url: `mock://fixture/${firstName}_${lastName}/${summary.caseNumber}`,
                timestamp: new Date().toISOString(),
              },
            });
          }
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : 'Unknown error';
          this.logger.warn(
            `Failed to load case details for ${summary.caseNumber}: ${errorMessage}`,
          );
          // Include case with summary only if detail load fails
          detailedCases.push({
            ...summary,
            source: {
              url: `mock://fixture/${firstName}_${lastName}/${summary.caseNumber}`,
              timestamp: new Date().toISOString(),
            },
          });
        }
      }

      this.logger.log(
        `Loaded ${detailedCases.length} case(s) with details from fixtures for ${firstName} ${lastName}`,
      );
      return detailedCases;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(
        `Failed to load or parse fixture for ${firstName} ${lastName}: ${errorMessage}`,
      );
      return [];
    }
  }
}
