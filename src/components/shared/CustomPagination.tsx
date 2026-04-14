import { useTranslation } from 'react-i18next';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

interface CustomPaginationProps {
  current: number;
  pageSize: number;
  total: number;
  onChange: (page: number, pageSize?: number) => void;
  onViewAll?: () => void;
  showSizeChanger?: boolean;
  pageSizeOptions?: number[];
  showQuickJumper?: boolean;
  showTotal?: boolean;
}

const CustomPagination = ({
  current,
  pageSize,
  total,
  onChange,
  onViewAll,
  showSizeChanger = false,
  pageSizeOptions = [10, 20, 50, 100],
  showQuickJumper = false,
  showTotal = true,
}: CustomPaginationProps) => {
  const { t, i18n } = useTranslation();
  const totalPages = Math.ceil(total / pageSize);

  if (totalPages <= 1 && !showTotal) return null;

  const getVisiblePages = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 7;

    if (totalPages <= maxVisible) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (current > 4) {
        pages.push('...');
      }

      // Show pages around current page
      const start = Math.max(2, current - 2);
      const end = Math.min(totalPages - 1, current + 2);

      for (let i = start; i <= end; i++) {
        if (i !== 1 && i !== totalPages) {
          pages.push(i);
        }
      }

      if (current < totalPages - 3) {
        pages.push('...');
      }

      // Always show last page
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const visiblePages = getVisiblePages();
  const startItem = (current - 1) * pageSize + 1;
  const endItem = Math.min(current * pageSize, total);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 px-6 bg-white border-t border-gray-200">
      {/* Total and Page Size Info */}
      <div className="flex items-center gap-4 text-sm text-gray-600">
        {showTotal && (
          <span>
            {t('common.pagination.showing', 'Showing {start}-{end} of {total}', {
              start: startItem,
              end: endItem,
              total,
            })}
          </span>
        )}

        {showSizeChanger && (
          <div className="flex items-center gap-2">
            <span>{t('common.pagination.perPage', 'Per page')}:</span>
            <select
              value={pageSize}
              onChange={(e) => onChange(1, Number(e.target.value))}
              className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {pageSizeOptions.map(size => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center gap-1">
        {/* First Page Button */}
        <button
          onClick={() => onChange(1, pageSize)}
          disabled={current <= 1}
          className="flex items-center justify-center w-8 h-8 border border-gray-300 rounded-lg bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label={t('common.pagination.firstPage', 'First page')}
        >
          <ChevronsLeft className="w-4 h-4" />
        </button>

        {/* Previous Button */}
        <button
          onClick={() => onChange(current - 1, pageSize)}
          disabled={current <= 1}
          className="flex items-center justify-center w-8 h-8 border border-gray-300 rounded-lg bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label={t('common.pagination.previousPage', 'Previous page')}
        >
          {i18n.language === 'ar' ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>

        {/* Page Numbers */}
        <div className="flex items-center gap-1 mx-2">
          {visiblePages.map((page, index) => {
            if (page === '...') {
              return (
                <span key={`ellipsis-${index}`} className="px-3 py-2 text-gray-500">
                  ...
                </span>
              );
            }

            const pageNumber = page as number;
            const isCurrentPage = pageNumber === current;

            return (
              <button
                key={pageNumber}
                onClick={() => onChange(pageNumber, pageSize)}
                className={`flex items-center justify-center w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                  isCurrentPage
                    ? 'bg-blue-600 text-white border border-blue-600'
                    : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-400'
                }`}
                aria-label={t('common.pagination.goToPage', 'Go to page {{page}}', { page: pageNumber })}
                aria-current={isCurrentPage ? 'page' : undefined}
              >
                {pageNumber}
              </button>
            );
          })}
        </div>

        {/* Next Button */}
        <button
          onClick={() => onChange(current + 1, pageSize)}
          disabled={current >= totalPages}
          className="flex items-center justify-center w-8 h-8 border border-gray-300 rounded-lg bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label={t('common.pagination.nextPage', 'Next page')}
        >
          {i18n.language === 'ar' ? (
            <ChevronLeft className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
        </button>

        {/* Last Page Button */}
        <button
          onClick={() => onChange(totalPages, pageSize)}
          disabled={current >= totalPages}
          className="flex items-center justify-center w-8 h-8 border border-gray-300 rounded-lg bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label={t('common.pagination.lastPage', 'Last page')}
        >
          <ChevronsRight className="w-4 h-4" />
        </button>
      </div>

      {/* Quick Jumper */}
      {showQuickJumper && (
        <div className="flex items-center gap-2 text-sm">
          <span>{t('common.pagination.goTo', 'Go to')}:</span>
          <input
            type="number"
            min={1}
            max={totalPages}
            className="w-16 px-2 py-1 border border-gray-300 rounded text-center text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                const page = Number((e.target as HTMLInputElement).value);
                if (page >= 1 && page <= totalPages) {
                  onChange(page, pageSize);
                }
              }
            }}
          />
        </div>
      )}

      {/* View All Button */}
      {onViewAll && (
        <button
          onClick={onViewAll}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
        >
          {t('common.buttons.viewAll', 'View All')}
        </button>
      )}
    </div>
  );
};

export default CustomPagination;