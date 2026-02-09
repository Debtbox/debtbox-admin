import type { AxiosResponse } from '@/lib/axios';

export interface ApiError {
  response: AxiosResponse;
  message: string;
  statusCode?: number;
  errors?: Record<string, string[]>;
}
