import { Injectable, Logger } from '@nestjs/common';
import { Config } from '../common/constants/config';
import { CaseSummary } from '../scraper/parsers/case-list.parser';
import { LiveModeService, MockModeService } from './modes';

@Injectable()
export class SearchService {
  private readonly logger = new Logger(SearchService.name);

  constructor(
    private readonly liveModeService: LiveModeService,
    private readonly mockModeService: MockModeService,
  ) {}

  async searchByName(
    firstName: string,
    lastName: string,
  ): Promise<CaseSummary[]> {
    if (Config.isMockMode()) {
      this.logger.log(`Running in MOCK mode for ${firstName} ${lastName}`);
      return this.mockModeService.getCaseData(firstName, lastName);
    }

    this.logger.log(`Running in LIVE mode for ${firstName} ${lastName}`);
    return this.liveModeService.getCaseData(firstName, lastName);
  }
}
