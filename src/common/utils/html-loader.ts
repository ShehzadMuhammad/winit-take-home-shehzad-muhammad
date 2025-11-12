import * as fs from 'fs';
import * as path from 'path';
import { Config } from '../constants/config';

/*

  This class is responsible for loading the HTML fixtures for the search and case detail.
*/

export class HtmlLoader {
  private static getFixtureBase(): string {
    return process.env.FIXTURES_BASE_PATH || Config.FIXTURES.BASE_PATH;
  }

  static loadSearchFixture(firstName: string, lastName: string): string | null {
    const folderName = `${firstName}_${lastName}`;
    const filePath = path.join(
      process.cwd(),
      HtmlLoader.getFixtureBase(),
      folderName,
      `search_${folderName}.html`,
    );

    if (!fs.existsSync(filePath)) {
      return null;
    }

    try {
      return fs.readFileSync(filePath, 'utf8');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      throw new Error(
        `Failed to read search fixture at ${filePath}: ${errorMessage}`,
      );
    }
  }

  static loadCaseDetailFixture(
    firstName: string,
    lastName: string,
    caseNumber: string,
  ): string | null {
    const folderName = `${firstName}_${lastName}`;
    const folderPath = path.join(
      process.cwd(),
      HtmlLoader.getFixtureBase(),
      folderName,
    );

    if (!fs.existsSync(folderPath)) {
      return null;
    }

    const normalizedCaseNumber = caseNumber.replace(/[^\w-]/g, '');

    let files: string[];
    try {
      files = fs.readdirSync(folderPath);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      throw new Error(
        `Failed to read directory at ${folderPath}: ${errorMessage}`,
      );
    }

    const caseDetailFile = files.find(
      (file) =>
        file.startsWith('case_detail_') &&
        file.includes(normalizedCaseNumber) &&
        file.endsWith('.html'),
    );

    if (!caseDetailFile) {
      return null;
    }

    const filePath = path.join(folderPath, caseDetailFile);

    try {
      return fs.readFileSync(filePath, 'utf8');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      throw new Error(
        `Failed to read case detail fixture at ${filePath}: ${errorMessage}`,
      );
    }
  }

  static searchFixtureExists(firstName: string, lastName: string): boolean {
    const folderName = `${firstName}_${lastName}`;
    const filePath = path.join(
      process.cwd(),
      HtmlLoader.getFixtureBase(),
      folderName,
      `search_${folderName}.html`,
    );

    return fs.existsSync(filePath);
  }
}
