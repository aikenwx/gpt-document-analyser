export type AnalyzerBackendErrorDetails = {
  detail: string;
};

export class AnalyzerBackendError extends Error {
  details: AnalyzerBackendErrorDetails;
  constructor(details: AnalyzerBackendErrorDetails) {
    super(details.detail);
    this.details = details;
  }
}

export const DEFAULT_ANALYZER_BACKEND_ERROR = {
  detail: 'Something went wrong',
};
