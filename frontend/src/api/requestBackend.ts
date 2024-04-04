import { AxiosError, AxiosRequestConfig } from 'axios';
import axiosInstance from './axios/axiosInstance';
import {
  DEFAULT_ANALYZER_BACKEND_ERROR,
  AnalyzerBackendError,
  AnalyzerBackendErrorDetails,
} from '../@types/AnalyzerBackendError';

const handleRequestBackendError = (error: any) => {
  console.error(error);
  if (error instanceof AxiosError) {
    const e = error as AxiosError<AnalyzerBackendErrorDetails>;
    throw new AnalyzerBackendError(e.response?.data ?? DEFAULT_ANALYZER_BACKEND_ERROR);
  }
  throw new AnalyzerBackendError(DEFAULT_ANALYZER_BACKEND_ERROR);
};

export function requestBackend<T>(
  requestParams: AxiosRequestConfig,
) {
  return axiosInstance<T>(requestParams).catch(handleRequestBackendError);
}