import {
  Body,
  Controller,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { CaseSummary } from '../scraper/parsers/case-list.parser';
import { SearchService } from './search.service';

@Controller('api/search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Post()
  @HttpCode(200)
  async search(
    @Body() body: { firstName: string; lastName: string },
  ): Promise<{ cases: CaseSummary[] }> {
    const { firstName, lastName } = body;

    if (!firstName || !lastName) {
      throw new HttpException(
        'Both firstName and lastName are required',
        HttpStatus.BAD_REQUEST,
      );
    }

    const cases = await this.searchService.searchByName(firstName, lastName);

    if (!cases || cases.length === 0) {
      throw new HttpException('No cases found', HttpStatus.NOT_FOUND);
    }

    return { cases };
  }
}
