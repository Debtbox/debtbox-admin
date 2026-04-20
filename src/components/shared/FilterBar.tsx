import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, SlidersHorizontal, X, ChevronDown, ChevronUp, Calendar } from 'lucide-react';
import { cn } from '@/utils/cn';

export interface FilterOption {
  value: string;
  label: string;
}

export interface FilterGroupDef {
  key: string;
  label: string;
  options: FilterOption[];
}

export interface DateRangeDef {
  fromKey: string;
  toKey: string;
  label?: string;
  fromLabel?: string;
  toLabel?: string;
}

export interface FilterBarProps {
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  filterGroups?: FilterGroupDef[];
  dateRange?: DateRangeDef;
  values: Record<string, string | string[]>;
  onChange: (key: string, value: string | string[]) => void;
  onClearAll: () => void;
  className?: string;
}

function getActiveCount(
  filterGroups: FilterGroupDef[],
  dateRange: DateRangeDef | undefined,
  values: Record<string, string | string[]>,
): number {
  let count = 0;
  for (const group of filterGroups) {
    const v = values[group.key];
    if (Array.isArray(v)) count += v.length;
  }
  if (dateRange) {
    if (values[dateRange.fromKey]) count++;
    if (values[dateRange.toKey]) count++;
  }
  return count;
}

export const FilterBar = ({
  searchPlaceholder = 'Search...',
  searchValue = '',
  onSearchChange,
  filterGroups = [],
  dateRange,
  values,
  onChange,
  onClearAll,
  className,
}: FilterBarProps) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(filterGroups.map((g) => [g.key, true])),
  );
  const dropdownRef = useRef<HTMLDivElement>(null);

  const activeCount = getActiveCount(filterGroups, dateRange, values);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const toggleGroup = (key: string) => {
    setExpandedGroups((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleMultiSelectToggle = (groupKey: string, optionValue: string) => {
    const current = (values[groupKey] as string[]) || [];
    const updated = current.includes(optionValue)
      ? current.filter((v) => v !== optionValue)
      : [...current, optionValue];
    onChange(groupKey, updated);
  };

  const removeChip = (groupKey: string, optionValue?: string) => {
    if (optionValue !== undefined) {
      const current = (values[groupKey] as string[]) || [];
      onChange(groupKey, current.filter((v) => v !== optionValue));
    } else {
      onChange(groupKey, '');
    }
  };

  const chips: { key: string; optionValue?: string; label: string }[] = [];
  for (const group of filterGroups) {
    const selected = (values[group.key] as string[]) || [];
    for (const v of selected) {
      const option = group.options.find((o) => o.value === v);
      if (option) chips.push({ key: group.key, optionValue: v, label: option.label });
    }
  }
  if (dateRange) {
    const from = values[dateRange.fromKey] as string | undefined;
    const to = values[dateRange.toKey] as string | undefined;
    if (from) chips.push({ key: dateRange.fromKey, label: `${dateRange.fromLabel || t('common.from', 'From')}: ${from}` });
    if (to) chips.push({ key: dateRange.toKey, label: `${dateRange.toLabel || t('common.to', 'To')}: ${to}` });
  }

  return (
    <div className={cn('space-y-3', className)}>
      {/* Bar */}
      <div className="flex items-center gap-3">
        {/* Search */}
        {onSearchChange && (
          <div className="relative flex-1">
            <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <input
              type="text"
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full h-10 ps-9 pe-9 text-sm border border-gray-200 rounded-lg bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
            {searchValue && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute end-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}

        {/* Filter toggle */}
        {(filterGroups.length > 0 || dateRange) && (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsOpen((v) => !v)}
              className={cn(
                'inline-flex items-center gap-2 h-10 px-4 text-sm font-medium rounded-lg border transition-all',
                activeCount > 0
                  ? 'bg-blue-50 border-blue-300 text-blue-700 hover:bg-blue-100'
                  : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300',
                isOpen && 'ring-2 ring-blue-500 ring-offset-1',
              )}
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>{t('common.filters', 'Filters')}</span>
              {activeCount > 0 && (
                <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-semibold rounded-full bg-blue-600 text-white">
                  {activeCount}
                </span>
              )}
            </button>

            {/* Dropdown panel — end-0 keeps it inside viewport in both LTR and RTL */}
            {isOpen && (
              <div className="absolute end-0 top-full mt-2 w-72 bg-white rounded-xl border border-gray-200 shadow-xl z-50 overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                  <span className="text-sm font-semibold text-gray-800">{t('common.filters', 'Filters')}</span>
                  {activeCount > 0 && (
                    <button
                      onClick={() => { onClearAll(); }}
                      className="text-xs font-medium text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      {t('common.clearAll', 'Clear All')}
                    </button>
                  )}
                </div>

                {/* Scrollable body */}
                <div className="max-h-[420px] overflow-y-auto divide-y divide-gray-100">
                  {/* Multi-select groups */}
                  {filterGroups.map((group) => {
                    const selected = (values[group.key] as string[]) || [];
                    const isExpanded = expandedGroups[group.key] !== false;

                    return (
                      <div key={group.key} className="px-4 py-3">
                        <button
                          onClick={() => toggleGroup(group.key)}
                          className="flex items-center justify-between w-full mb-2 group"
                        >
                          <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 group-hover:text-gray-700 transition-colors">
                            {group.label}
                          </span>
                          <div className="flex items-center gap-1.5">
                            {selected.length > 0 && (
                              <span className="text-xs font-medium text-blue-600">
                                {selected.length} {t('common.selected', 'selected')}
                              </span>
                            )}
                            {isExpanded ? (
                              <ChevronUp className="w-3.5 h-3.5 text-gray-400" />
                            ) : (
                              <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                            )}
                          </div>
                        </button>

                        {isExpanded && (
                          <div className="space-y-1">
                            {group.options.map((option) => {
                              const checked = selected.includes(option.value);
                              return (
                                <label
                                  key={option.value}
                                  className={cn(
                                    'flex items-center gap-2.5 px-2 py-1.5 rounded-lg cursor-pointer transition-colors',
                                    checked
                                      ? 'bg-blue-50 text-blue-800'
                                      : 'hover:bg-gray-50 text-gray-700',
                                  )}
                                >
                                  <div
                                    className={cn(
                                      'flex-shrink-0 w-4 h-4 rounded border-2 flex items-center justify-center transition-colors',
                                      checked
                                        ? 'bg-blue-600 border-blue-600'
                                        : 'border-gray-300 bg-white',
                                    )}
                                    onClick={() => handleMultiSelectToggle(group.key, option.value)}
                                  >
                                    {checked && (
                                      <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 10 10" fill="none">
                                        <path d="M1.5 5l2.5 2.5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                      </svg>
                                    )}
                                  </div>
                                  <input
                                    type="checkbox"
                                    className="sr-only"
                                    checked={checked}
                                    onChange={() => handleMultiSelectToggle(group.key, option.value)}
                                  />
                                  <span className="text-sm">{option.label}</span>
                                </label>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {/* Date range */}
                  {dateRange && (
                    <div className="px-4 py-3">
                      <div className="flex items-center gap-1.5 mb-3">
                        <Calendar className="w-3.5 h-3.5 text-gray-400" />
                        <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                          {dateRange.label || t('common.dateRange', 'Date Range')}
                        </span>
                      </div>
                      <div className="space-y-2">
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">
                            {dateRange.fromLabel || t('common.from', 'From')}
                          </label>
                          <input
                            type="date"
                            value={(values[dateRange.fromKey] as string) || ''}
                            onChange={(e) => onChange(dateRange.fromKey, e.target.value)}
                            max={(values[dateRange.toKey] as string) || undefined}
                            className="w-full h-8 px-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">
                            {dateRange.toLabel || t('common.to', 'To')}
                          </label>
                          <input
                            type="date"
                            value={(values[dateRange.toKey] as string) || ''}
                            onChange={(e) => onChange(dateRange.toKey, e.target.value)}
                            min={(values[dateRange.fromKey] as string) || undefined}
                            className="w-full h-8 px-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Active filter chips */}
      {chips.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-gray-500 font-medium">{t('common.activeFilters', 'Active')}:</span>
          {chips.map((chip, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1 ps-2.5 pe-1.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200"
            >
              {chip.label}
              <button
                onClick={() => removeChip(chip.key, chip.optionValue)}
                className="ms-0.5 flex-shrink-0 w-4 h-4 flex items-center justify-center rounded-full hover:bg-blue-200 transition-colors"
              >
                <X className="w-2.5 h-2.5" />
              </button>
            </span>
          ))}
          <button
            onClick={onClearAll}
            className="text-xs text-gray-400 hover:text-gray-600 underline transition-colors"
          >
            {t('common.clearAll', 'Clear All')}
          </button>
        </div>
      )}
    </div>
  );
};
