import { useState, useEffect, useRef } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { SearchableSelect } from "./SearchableSelect";
import { getDebtsLookup } from "@/features/debtsManagement/api/getDebtsLookup";

const LIMIT = 20;

interface DebtSelectProps {
  value: string;
  onChange: (id: string) => void;
  label?: string;
  merchantId?: string;
  customerId?: string;
  required?: boolean;
  error?: string;
  placeholder?: string;
  disabled?: boolean;
}

export const DebtSelect = ({
  value,
  onChange,
  label,
  merchantId,
  customerId,
  required,
  error,
  placeholder,
  disabled,
}: DebtSelectProps) => {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [selectedLabel, setSelectedLabel] = useState("");
  const isFirstRender = useRef(true);

  const merchantIdNum = merchantId ? parseInt(merchantId, 10) : undefined;
  const customerIdNum = customerId ? parseInt(customerId, 10) : undefined;
  const validMerchantId = merchantIdNum && !isNaN(merchantIdNum) ? merchantIdNum : undefined;
  const validCustomerId = customerIdNum && !isNaN(customerIdNum) ? customerIdNum : undefined;
  const hasContext = !!(validMerchantId || validCustomerId);

  // Reset selected value when the merchant/customer filter changes (not on first render)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    onChange("");
    setSelectedLabel("");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [merchantId, customerId]);

  useEffect(() => {
    if (!value) setSelectedLabel("");
  }, [value]);

  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } = useInfiniteQuery({
    queryKey: ["debts-lookup", { merchantId: validMerchantId, customerId: validCustomerId }],
    queryFn: ({ pageParam }) =>
      getDebtsLookup({
        limit: LIMIT,
        page: pageParam as number,
        merchantId: validMerchantId,
        customerId: validCustomerId,
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      const { page, limit, total } = lastPage.data;
      const loaded = (page + 1) * limit;
      return loaded < total ? page + 1 : undefined;
    },
    enabled: hasContext,
  });

  const allItems = data?.pages.flatMap((p) => p.data.data) ?? [];

  const fetchedOptions = allItems.map((d) => ({
    value: String(d.debtId),
    label: `${d.title} — ${d.amount} SAR (ID: ${d.debtId})`,
  }));

  const options =
    value && !fetchedOptions.find((o) => o.value === value)
      ? [{ value, label: selectedLabel || `ID: ${value}` }, ...fetchedOptions]
      : fetchedOptions;

  const handleChange = (id: string) => {
    const found = options.find((o) => o.value === id);
    if (found) setSelectedLabel(found.label);
    onChange(id);
  };

  return (
    <SearchableSelect
      label={label ?? t("common.debt", "Debt")}
      value={value}
      onChange={handleChange}
      options={options}
      isLoading={isLoading}
      isLoadingMore={isFetchingNextPage}
      hasMore={hasNextPage}
      onLoadMore={() => void fetchNextPage()}
      searchValue={search}
      onSearchChange={setSearch}
      placeholder={
        hasContext
          ? (placeholder ?? t("common.selectDebt", "Select debt..."))
          : t("common.selectMerchantOrCustomerFirst", "Select a merchant or customer first")
      }
      noResultsText={t("common.noResults", "No debts found")}
      required={required}
      error={error}
      disabled={disabled || !hasContext}
    />
  );
};
