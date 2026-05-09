import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { ChevronDown, Search, X, Loader2 } from "lucide-react";
import { cn } from "@/utils/cn";

export interface SelectOption {
  value: string;
  label: string;
}

export interface SearchableSelectProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  isLoading?: boolean;
  isLoadingMore?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
  searchValue: string;
  onSearchChange: (search: string) => void;
  placeholder?: string;
  noResultsText?: string;
  loadMoreText?: string;
  required?: boolean;
  error?: string;
  disabled?: boolean;
  className?: string;
}

export const SearchableSelect = ({
  label,
  value,
  onChange,
  options,
  isLoading,
  isLoadingMore,
  hasMore,
  onLoadMore,
  searchValue,
  onSearchChange,
  placeholder = "Select...",
  noResultsText = "No results",
  loadMoreText = "Load more",
  required,
  error,
  disabled,
  className,
}: SearchableSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((o) => o.value === value);

  const filteredOptions = searchValue
    ? options.filter((o) =>
        o.label.toLowerCase().includes(searchValue.toLowerCase()),
      )
    : options;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node) &&
        (!dropdownRef.current || !dropdownRef.current.contains(e.target as Node))
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    if (isOpen) document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleScroll = (e: Event) => {
      if (dropdownRef.current?.contains(e.target as Node)) return;
      setIsOpen(false);
    };
    window.addEventListener("scroll", handleScroll, true);
    return () => window.removeEventListener("scroll", handleScroll, true);
  }, [isOpen]);

  const handleOpen = () => {
    if (!disabled) {
      if (!isOpen && buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        setDropdownStyle({
          top: rect.bottom + 4,
          left: rect.left,
          width: rect.width,
        });
      }
      setIsOpen(!isOpen);
    }
  };

  const handleSelect = (option: SelectOption) => {
    onChange(option.value);
    setIsOpen(false);
    onSearchChange("");
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange("");
    onSearchChange("");
  };

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}

      <button
        ref={buttonRef}
        type="button"
        disabled={disabled}
        onClick={handleOpen}
        className={cn(
          "w-full flex items-center justify-between px-3 py-2 text-sm border rounded-lg bg-white text-left focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors",
          error ? "border-red-300" : "border-gray-300",
          disabled
            ? "bg-gray-50 cursor-not-allowed opacity-60"
            : "hover:border-gray-400 cursor-pointer",
        )}
      >
        <span
          className={
            selectedOption ? "text-gray-900 truncate" : "text-gray-400"
          }
        >
          {selectedOption?.label ?? placeholder}
        </span>
        <div className="flex items-center gap-1 shrink-0 ml-2">
          {value && !disabled && (
            <span
              role="button"
              onClick={handleClear}
              className="p-0.5 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </span>
          )}
          <ChevronDown
            className={cn(
              "w-4 h-4 text-gray-400 transition-transform duration-150",
              isOpen && "rotate-180",
            )}
          />
        </div>
      </button>

      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}

      {isOpen &&
        createPortal(
          <div
            ref={dropdownRef}
            style={{ position: "fixed", zIndex: 9999, ...dropdownStyle }}
            className="bg-white border border-gray-200 rounded-lg shadow-lg"
          >
            <div className="p-2 border-b border-gray-100">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                <input
                  autoFocus
                  type="text"
                  value={searchValue}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder="Search..."
                  className="w-full pl-8 pr-3 py-1.5 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="max-h-52 overflow-y-auto">
              {isLoading ? (
                <div className="flex justify-center py-4">
                  <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                </div>
              ) : filteredOptions.length === 0 ? (
                <p className="px-3 py-4 text-sm text-gray-500 text-center">
                  {noResultsText}
                </p>
              ) : (
                <>
                  {filteredOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleSelect(option)}
                      className={cn(
                        "w-full text-left px-3 py-2 text-sm hover:bg-blue-50 transition-colors",
                        option.value === value &&
                          "bg-blue-50 text-blue-700 font-medium",
                      )}
                    >
                      {option.label}
                    </button>
                  ))}
                  {hasMore && (
                    <button
                      type="button"
                      onClick={onLoadMore}
                      disabled={isLoadingMore}
                      className="w-full flex items-center justify-center gap-1.5 px-3 py-2 text-xs text-blue-600 hover:bg-blue-50 border-t border-gray-100 transition-colors disabled:opacity-50"
                    >
                      {isLoadingMore && (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      )}
                      {loadMoreText}
                    </button>
                  )}
                </>
              )}
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
};
