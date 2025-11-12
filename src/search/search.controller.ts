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

/*
  This controller is responsible for handling the search request and returning the cases.
  It uses the CaseSummary type from the scraper module to return the cases.
  Also handles validation for request body ie whether both firstName and lastName are provided.
  and if no cases are found, it returns a 404 error.
*/

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
