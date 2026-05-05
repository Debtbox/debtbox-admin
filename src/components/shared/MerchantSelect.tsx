import { useState, useEffect } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { SearchableSelect } from "./SearchableSelect";
import { getMerchantsDropdown } from "@/features/merchants/api/getMerchantsDropdown";

const LIMIT = 20;

interface MerchantSelectProps {
  value: string;
  onChange: (id: string) => void;
  label?: string;
  required?: boolean;
  error?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export const MerchantSelect = ({
  value,
  onChange,
  label,
  required,
  error,
  placeholder,
  disabled,
  className,
}: MerchantSelectProps) => {
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

  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useInfiniteQuery({
      queryKey: ["merchants-dropdown", { search: debouncedSearch }],
      queryFn: ({ pageParam }) =>
        getMerchantsDropdown({
          search: debouncedSearch,
          limit: LIMIT,
          page: pageParam as number,
        }),
      initialPageParam: 0,
      getNextPageParam: (lastPage) => {
        const { page, limit, total } = lastPage.data;
        const loaded = (page + 1) * limit;
        return loaded < total ? page + 1 : undefined;
      },
    });

  const allItems = data?.pages.flatMap((p) => p.data.data) ?? [];

  const fetchedOptions = allItems.map((m) => ({
    value: String(m.id),
    label: m.full_name_en ? `${m.full_name_en} (ID: ${m.id})` : `ID: ${m.id}`,
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
      label={label ?? t("common.merchant", "Merchant")}
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
        placeholder ?? t("common.selectMerchant", "Select merchant...")
      }
      noResultsText={t("common.noResults", "No merchants found")}
      required={required}
      error={error}
      disabled={disabled}
      className={className}
    />
  );
};
