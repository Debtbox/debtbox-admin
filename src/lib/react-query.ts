/* eslint-disable @typescript-eslint/no-explicit-any */

import type { ApiError } from '@/types/ApiError';
import type {
  UseMutationOptions,
  UseQueryOptions,
} from '@tanstack/react-query';

declare module '@tanstack/react-query' {
  interface Register {
    defaultError: ApiError;
  }
}

export type ExtractFnReturnType<FnType extends (...args: any) => any> = Awaited<
  ReturnType<FnType>
>;

export type QueryConfig<QueryFnType extends (...args: any) => any> = Omit<
  UseQueryOptions<ExtractFnReturnType<QueryFnType>>,
  'queryKey' | 'queryFn'
>;

export type MutationConfig<MutationFnType extends (...args: any) => any> =
  UseMutationOptions<
    ExtractFnReturnType<MutationFnType>,
    ApiError,
    Parameters<MutationFnType>[0]
  >;
