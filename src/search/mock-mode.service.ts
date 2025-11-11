import { Injectable, Logger } from '@nestjs/common';
import { HtmlLoader } from '../common/utils/html-loader';
import {
  CaseSummary,
  parseCaseList,
} from '../scraper/parsers/case-list.parser';

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

      const cases = parseCaseList(html);
      this.logger.log(
        `Loaded ${cases.length} case(s) from fixture for ${firstName} ${lastName}`,
      );
      return cases;
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
