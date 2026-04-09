import { useQuery, type UseQueryOptions, type UseQueryResult } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';

export type UseQueryWithCallbackOptions<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends readonly unknown[] = readonly unknown[],
> = Omit<UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>, 'onSuccess'> & {
  onSuccess?: (data: TData) => void;
};

/**
 * A wrapper around useQuery that supports onSuccess callbacks
 * React Query v5 removed onSuccess from useQuery, so this hook provides that functionality
 */
export const useQueryWithCallback = <
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends readonly unknown[] = readonly unknown[],
>({
  onSuccess,
  ...queryOptions
}: UseQueryWithCallbackOptions<TQueryFnData, TError, TData, TQueryKey>): UseQueryResult<
  TData,
  TError
> => {
  const queryResult = useQuery<TQueryFnData, TError, TData, TQueryKey>(queryOptions);

  const onSuccessRef = useRef(onSuccess);
  const dataRef = useRef<TData | undefined>(undefined);
  onSuccessRef.current = onSuccess;

  useEffect(() => {
    if (
      queryResult.isSuccess &&
      queryResult.data !== undefined &&
      queryResult.data !== dataRef.current &&
      onSuccessRef.current
    ) {
      dataRef.current = queryResult.data;
      onSuccessRef.current(queryResult.data);
    }
  }, [queryResult.isSuccess, queryResult.data]);

  return queryResult;
};
