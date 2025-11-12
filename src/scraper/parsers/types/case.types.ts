export interface CaseDetail {
  caseType?: string;
  filingDate?: string;
  caseStatus?: string;
  courtLocation?: string;
  parties: Array<{ name: string; role: string; details?: string }>;
  hearings: Array<{
    date: string;
    type: string;
    department?: string;
    judge?: string;
    result?: string;
  }>;
  financials?: {
    fines?: string;
    fees?: string;
    balance?: string;
  };
}

export interface CaseSummary {
  caseNumber: string;
  caseStyle: string;
  caseType: string;
  caseStatus: string;
  filingDate: string;
  detailLink: string;
  courtLocation?: string;
  parties?: Array<{ name: string; role: string; details?: string }>;
  hearings?: Array<{
    date: string;
    type: string;
    department?: string;
    judge?: string;
    result?: string;
  }>;
  financials?: {
    fines?: string;
    fees?: string;
    balance?: string;
  };
  source?: {
    url: string;
    timestamp: string;
  };
}

