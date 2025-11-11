import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs/promises';
import * as path from 'path';
import { CaseSummary, parseCaseList } from './scraper/parsers/case-list.parser';

@Injectable()
export class SearchService {
  private readonly logger = new Logger(SearchService.name);

  async searchByName(
    firstName: string,
    lastName: string,
  ): Promise<CaseSummary[]> {
    const folderName = `${firstName}_${lastName}`;
    const filePath = path.join(
      process.cwd(),
      'fixtures',
      folderName,
      `search_${folderName}.html`,
    );

    try {
      const html = await fs.readFile(filePath, 'utf8');
      const cases = parseCaseList(html);

      this.logger.log(
        `Returning ${cases.length} cases for ${firstName} ${lastName}`,
      );
      return cases;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        this.logger.warn(`Fixture not found: ${filePath}`);
      } else {
        this.logger.error(`Error reading fixture: ${filePath}`, error);
      }
      return [];
    }
  }
}
