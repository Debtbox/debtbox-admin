import { useState, useEffect } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { SearchableSelect } from "./SearchableSelect";
import { getCustomersDropdown } from "@/features/customers/api/getCustomersDropdown";

const LIMIT = 20;

interface CustomerSelectProps {
  value: string;
  onChange: (id: string) => void;
  label?: string;
  required?: boolean;
  error?: string;
  placeholder?: string;
  disabled?: boolean;
}

export const CustomerSelect = ({
  value,
  onChange,
  label,
  required,
  error,
  placeholder,
  disabled,
}: CustomerSelectProps) => {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedLabel, setSelectedLabel] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    if (!value) setSelectedLabel("");
  }, [value]);

  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } = useInfiniteQuery({
    queryKey: ["customers-dropdown", { search: debouncedSearch }],
    queryFn: ({ pageParam }) =>
      getCustomersDropdown({ search: debouncedSearch, limit: LIMIT, page: pageParam as number }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      const { page, limit, total } = lastPage.data;
      const loaded = (page + 1) * limit;
      return loaded < total ? page + 1 : undefined;
    },
  });

  const allItems = data?.pages.flatMap((p) => p.data.data) ?? [];

  const fetchedOptions = allItems.map((c) => ({
    value: String(c.id),
    label: c.full_name_en ? `${c.full_name_en} (ID: ${c.id})` : `ID: ${c.id}`,
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
      label={label ?? t("common.customer", "Customer")}
      value={value}
      onChange={handleChange}
      options={options}
      isLoading={isLoading}
      isLoadingMore={isFetchingNextPage}
      hasMore={hasNextPage}
      onLoadMore={() => void fetchNextPage()}
      searchValue={search}
      onSearchChange={setSearch}
      placeholder={placeholder ?? t("common.selectCustomer", "Select customer...")}
      noResultsText={t("common.noResults", "No customers found")}
      required={required}
      error={error}
      disabled={disabled}
    />
  );
};
