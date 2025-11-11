import { Body, Controller, Post } from '@nestjs/common';
import { SearchService } from './search.service';
import { SearchRequestDto } from './dto/search-request.dto';

@Controller('api/search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Post()
  async search(@Body() body: SearchRequestDto) {
    const { firstName, lastName } = body;
    const results = await this.searchService.searchByName(firstName, lastName);

    if (results.length === 0) {
      return { message: 'No cases found' };
    }

    return { cases: results };
  }
}
