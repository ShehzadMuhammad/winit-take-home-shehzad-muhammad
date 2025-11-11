export class Config {
  // Application mode
  static readonly MODE: string = process.env.MODE || 'mock';

  // Server configuration
  static readonly PORT: number = parseInt(process.env.PORT || '3000', 10);

  // Santa Clara Court portal configuration
  static readonly COURT_PORTAL = {
    BASE_URL:
      process.env.COURT_PORTAL_BASE_URL ||
      'https://portal.scscourt.org/search/party',
    TIMEOUT_MS: parseInt(process.env.COURT_PORTAL_TIMEOUT_MS || '10000', 10),
    USER_AGENT:
      process.env.COURT_PORTAL_USER_AGENT ||
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15',
    ACCEPT_LANGUAGE:
      process.env.COURT_PORTAL_ACCEPT_LANGUAGE || 'en-US,en;q=0.9',
  };

  // CAPTCHA and access restriction detection
  static readonly CAPTCHA_INDICATORS = [
    'recaptcha',
    'Request unsuccessful',
    'Access Denied',
  ];

  // Rate limiting configuration
  static readonly THROTTLER = {
    TTL_SECONDS: parseInt(process.env.THROTTLER_TTL_SECONDS || '60', 10),
    LIMIT_MOCK: parseInt(process.env.THROTTLER_LIMIT_MOCK || '10', 10),
    LIMIT_LIVE: parseInt(process.env.THROTTLER_LIMIT_LIVE || '3', 10),
    getLimit(): number {
      return Config.MODE === 'live'
        ? Config.THROTTLER.LIMIT_LIVE
        : Config.THROTTLER.LIMIT_MOCK;
    },
  };

  // Fixtures configuration
  static readonly FIXTURES = {
    BASE_PATH: process.env.FIXTURES_BASE_PATH || 'fixtures',
  };

  // Helper methods
  static isMockMode(): boolean {
    return Config.MODE === 'mock';
  }

  static isLiveMode(): boolean {
    return Config.MODE === 'live';
  }
}
