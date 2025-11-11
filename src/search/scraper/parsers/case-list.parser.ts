import * as cheerio from 'cheerio';

export interface CaseSummary {
  caseNumber: string;
  caseStyle: string;
  caseType: string;
  caseStatus: string;
  filingDate: string;
  detailLink: string;
}

export function parseCaseList(html: string): CaseSummary[] {
  try {
    const $ = cheerio.load(html);
    const cases: CaseSummary[] = [];

    // Locate the search results table
    const table = $('#tblPartySearchResults');
    if (!table.length) {
      console.warn('No table with id "tblPartySearchResults" found in HTML');
      return [];
    }

    // Find all tbody rows (skip header row in thead)
    const rows = table.find('tbody tr');
    if (!rows.length) {
      console.warn('No data rows found in table');
      return [];
    }

    // Loop through each row
    rows.each((index, element) => {
      try {
        const $row = $(element);
        const cells = $row.find('td');

        // Skip rows that don't have enough cells
        if (cells.length < 6) {
          return; // Skip this row
        }

        // Extract the detail link from the first cell (View Case button)
        const detailLink = $row.find('td:first-child a').attr('href') || '';
        const trimmedDetailLink = detailLink.trim();

        // Extract data from each column (skip first column which is the View button)
        // Column order: View (0), Case Number (1), Case Style (2), Case Status (3), Case Type (4), Filing Date (5)
        const caseNumber = $(cells[1]).text().trim();
        const caseStyle = $(cells[2]).text().trim();
        const caseStatus = $(cells[3]).text().trim();
        const caseType = $(cells[4]).text().trim();
        const filingDate = $(cells[5]).text().trim();

        // Skip empty or malformed rows
        if (!caseNumber || !trimmedDetailLink) {
          return; // Skip this row if essential data is missing
        }

        // Push parsed row into array
        cases.push({
          caseNumber,
          caseStyle,
          caseType,
          caseStatus,
          filingDate,
          detailLink: trimmedDetailLink,
        });
      } catch (rowError) {
        // Ignore malformed rows gracefully
        console.warn(`Error parsing row ${index}:`, rowError);
      }
    });

    // Log results
    console.log(`Found ${cases.length} cases in fixture`);

    return cases;
  } catch (error) {
    console.error('Error parsing case list HTML:', error);
    return [];
  }
}
