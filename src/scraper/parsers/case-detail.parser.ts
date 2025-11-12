import * as cheerio from 'cheerio';
import {
  extractCleanText,
  normalizeText,
} from '../../common/utils/html-helpers';
import { CaseDetail } from './types/case.types';

export type { CaseDetail } from './types/case.types';

/**
 * Parses case detail HTML and extracts structured data.
 */
export function parseCaseDetails(html: string): CaseDetail {
  const $ = cheerio.load(html);

  const caseType = normalizeText(extractCleanText($, 'Case Type'));
  const filingDate = normalizeText(extractCleanText($, 'Filing Date'));
  const caseStatus = normalizeText(extractCleanText($, 'Case Status'));
  const courtLocation = normalizeText(extractCleanText($, 'Court Location'));

  // Extract Parties from the parties tab
  const parties: Array<{ name: string; role: string; details?: string }> = [];
  const partiesTab = $('#parties');
  if (partiesTab.length) {
    const partiesTable = partiesTab.find('table tbody tr');
    partiesTable.each((_, row) => {
      const $row = $(row);
      const cells = $row.find('td');
      if (cells.length >= 4) {
        const role = normalizeText($(cells[0]).text());
        const firstName = normalizeText($(cells[1]).text());
        const middleName = normalizeText($(cells[2]).text());
        const lastName = normalizeText($(cells[3]).text());

        // Combine name parts, handling cases where name might be in last name cell
        let name = '';
        if (lastName && !firstName && !middleName) {
          // Name might be entirely in last name field
          name = lastName;
        } else {
          // Combine first, middle, last
          const nameParts = [firstName, middleName, lastName].filter(
            (part) => part,
          );
          name = nameParts.join(' ').trim();
        }

        if (name && role) {
          parties.push({
            name,
            role,
          });
        }
      }
    });
  }

  // Extract Hearings from the hearings tab
  const hearings: Array<{
    date: string;
    type: string;
    department?: string;
    judge?: string;
    result?: string;
  }> = [];
  const hearingsTab = $('#hearings');
  if (hearingsTab.length) {
    const hearingsTable = hearingsTab.find('table tbody tr');
    hearingsTable.each((_, row) => {
      const $row = $(row);
      const cells = $row.find('td');
      if (cells.length >= 2) {
        const date = normalizeText($(cells[0]).text());
        const type = normalizeText($(cells[1]).text());
        const department =
          cells.length > 2 ? normalizeText($(cells[2]).text()) : undefined;
        const judge =
          cells.length > 3 ? normalizeText($(cells[3]).text()) : undefined;
        const hearingResult =
          cells.length > 4 ? normalizeText($(cells[4]).text()) : undefined;

        if (date || type) {
          hearings.push({
            date: date || '',
            type: type || '',
            department,
            judge,
            result: hearingResult,
          });
        }
      }
    });
  }

  // Extract Financials (if present)
  const financials: {
    fines?: string;
    fees?: string;
    balance?: string;
  } = {};

  const fines = normalizeText(extractCleanText($, 'Fines'));
  const fees = normalizeText(extractCleanText($, 'Fees'));
  const balance = normalizeText(extractCleanText($, 'Balance'));

  if (fines || fees || balance) {
    if (fines) financials.fines = fines;
    if (fees) financials.fees = fees;
    if (balance) financials.balance = balance;
  }

  return {
    caseType,
    filingDate,
    caseStatus,
    courtLocation,
    parties,
    hearings,
    financials: Object.keys(financials).length > 0 ? financials : undefined,
  };
}
