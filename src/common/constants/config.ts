import * as path from 'path';

export class Config {
  /**
   * Port the NestJS app runs on.
   * Defaults to 3000 if not provided.
   */
  static get PORT(): number {
    return parseInt(process.env.PORT || '3000', 10);
  }

  /**
   * Returns the current mode (mock or live).
   * Defaults to 'mock' if not explicitly set.
   */
  static get MODE(): string {
    return (process.env.MODE || 'mock').toLowerCase();
  }

  /**
   * Returns true if the app is running in mock mode.
   */
  static isMockMode(): boolean {
    return this.MODE === 'mock';
  }

  /**
   * Returns true if the app is running in live mode.
   */
  static isLiveMode(): boolean {
    return this.MODE === 'live';
  }

  /**
   * Base paths and configuration for local fixture files.
   */
  static readonly FIXTURES = {
    BASE_PATH: path.join('fixtures'),
  };
}
