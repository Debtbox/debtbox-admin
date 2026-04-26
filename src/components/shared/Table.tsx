import clsx from "clsx";
import { type ReactNode, useState, Fragment } from "react";
import { ChevronUp, ChevronDown, MoreHorizontal } from "lucide-react";
import { useTranslation } from "react-i18next";
import CustomPagination from "./CustomPagination";

export interface TableColumn<T = object> {
  key: string;
  title: string;
  dataIndex: string;
  width?: string;
  align?: "left" | "center" | "right";
  sortable?: boolean;
  render?: (value: unknown, record: T, index: number) => ReactNode;
  className?: string;
}

export interface TableProps<T = object> {
  columns: TableColumn<T>[];
  data: T[];
  loading?: boolean;
  emptyText?: ReactNode;
  className?: string;
  rowKey?: string | ((record: T) => string);
  onRowClick?: (record: T, index: number) => void;
  rowClassName?: (record: T, index: number) => string;
  // Optional renderer for an additional full-width row under each data row
  rowExtra?: (record: T, index: number) => ReactNode | null;
  pagination?: {
    current: number;
    pageSize: number;
    total: number;
    onChange: (page: number, pageSize?: number) => void;
    onViewAll?: () => void;
  };
  sortConfig?: {
    key: string;
    direction: "asc" | "desc";
    onChange: (key: string, direction: "asc" | "desc") => void;
  };
  actions?: (record: T, index: number) => ReactNode;
  showActions?: boolean;
}

const Table = <T extends object>({
  columns,
  data,
  loading = false,
  emptyText,
  className,
  rowKey = "id",
  onRowClick,
  rowClassName,
  rowExtra,
  pagination,
  sortConfig,
  actions,
  showActions = false,
}: TableProps<T>) => {
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const { t } = useTranslation();
  const getRowKey = (record: T, index: number): string => {
    if (typeof rowKey === "function") {
      return rowKey(record);
    }
    const candidate = (record as Record<string, unknown>)[rowKey];
    return typeof candidate === "string" && candidate.length > 0
      ? candidate
      : index.toString();
  };

  const handleSort = (column: TableColumn<T>) => {
    if (!column.sortable || !sortConfig) return;

    const newDirection =
      sortConfig.key === column.dataIndex && sortConfig.direction === "asc"
        ? "desc"
        : "asc";

    sortConfig.onChange(column.dataIndex, newDirection);
  };

  const renderCell = (column: TableColumn<T>, record: T, index: number) => {
    const value = (record as unknown as { [key: string]: unknown })[
      column.dataIndex
    ] as unknown;

    if (column.render) {
      return column.render(value, record, index);
    }

    return value as ReactNode;
  };

  const renderPagination = () => {
    if (!pagination) return null;

    const { current, pageSize, total, onChange, onViewAll } = pagination;

    return (
      <div className="bg-white">
        <CustomPagination
          current={current}
          pageSize={pageSize}
          total={total}
          onChange={onChange}
          onViewAll={onViewAll}
        />
      </div>
    );
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl overflow-hidden">
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-gray-500">{t("common.loading")}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={clsx(
        "bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm [&_table]:min-w-[920px] [&_td]:whitespace-nowrap [&_th]:whitespace-nowrap",
        className,
      )}
    >
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={clsx(
                    "px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
                    column.width && `w-${column.width}`,
                    column.align === "center" && "text-center",
                    column.align === "right" && "text-right",
                    column.sortable && "cursor-pointer hover:bg-gray-100",
                    column.className,
                  )}
                  onClick={() => column.sortable && handleSort(column)}
                >
                  <div className="flex items-center gap-2">
                    <span>{column.title}</span>
                    {column.sortable && sortConfig && (
                      <div className="flex flex-col">
                        <ChevronUp
                          className={clsx(
                            "w-3 h-3",
                            sortConfig.key === column.dataIndex &&
                              sortConfig.direction === "asc"
                              ? "text-primary"
                              : "text-gray-400",
                          )}
                        />
                        <ChevronDown
                          className={clsx(
                            "w-3 h-3 -mt-1",
                            sortConfig.key === column.dataIndex &&
                              sortConfig.direction === "desc"
                              ? "text-primary"
                              : "text-gray-400",
                          )}
                        />
                      </div>
                    )}
                  </div>
                </th>
              ))}
              {showActions && (
                <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
                  {t("common.actions")}
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (showActions ? 1 : 0)}
                  className="px-6 py-12 text-center text-gray-500"
                >
                  {emptyText}
                </td>
              </tr>
            ) : (
              data.map((record, index) => {
                const key = getRowKey(record, index);
                const extraContent = rowExtra ? rowExtra(record, index) : null;
                const showExtra =
                  extraContent !== null && extraContent !== undefined;

                const isHovered = hoveredRow === index;

                return (
                  <Fragment key={key}>
                    <tr
                      className={clsx(
                        "transition-colors duration-150",
                        onRowClick && "cursor-pointer",
                        showExtra && "border-b-0!",
                        isHovered && "bg-gray-50",
                        !isHovered && "hover:bg-gray-50",
                        rowClassName && rowClassName(record, index),
                      )}
                      onClick={() => onRowClick?.(record, index)}
                      onMouseEnter={() => setHoveredRow(index)}
                      onMouseLeave={() => setHoveredRow(null)}
                    >
                      {columns.map((column) => (
                        <td
                          key={column.key}
                          className={clsx(
                            "px-6 py-4 text-sm text-gray-900",
                            column.align === "center" && "text-center",
                            column.align === "right" && "text-right",
                            column.className,
                          )}
                        >
                          {renderCell(column, record, index)}
                        </td>
                      ))}
                      {showActions && (
                        <td className="px-6 py-4 text-right">
                          {actions ? (
                            actions(record, index)
                          ) : (
                            <button className="p-1 hover:bg-gray-100 rounded-full">
                              <MoreHorizontal className="w-4 h-4 text-gray-400" />
                            </button>
                          )}
                        </td>
                      )}
                    </tr>
                    {showExtra && (
                      <tr
                        className={clsx(
                          "border-t-0! transition-colors duration-150",
                          isHovered && "bg-gray-50",
                        )}
                        onMouseEnter={() => setHoveredRow(index)}
                        onMouseLeave={() => setHoveredRow(null)}
                      >
                        <td
                          className="px-6 py-3 text-sm"
                          colSpan={columns.length + (showActions ? 1 : 0)}
                        >
                          {extraContent}
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      {renderPagination()}
    </div>
  );
};

export default Table;
