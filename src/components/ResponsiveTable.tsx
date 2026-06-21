import React, { useState, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export interface Column<T> {
  id: string;
  header: React.ReactNode;
  cell: (row: T) => React.ReactNode;
  headerClassName?: string;
  className?: string;
}

interface ResponsiveTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T, index: number) => string;
  onRowClick?: (item: T) => void;
  rowClassName?: string;
  className?: string;
}

export function ResponsiveTable<T>({
  columns,
  data,
  keyExtractor,
  onRowClick,
  rowClassName = "",
  className = "",
}: ResponsiveTableProps<T>) {
  const [isMobile, setIsMobile] = useState(false);
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const checkResize = () => {
      // True if screen < 1024px (tablet/mobile breakpoint where wide tables scroll/overflow)
      setIsMobile(window.innerWidth < 1024);
    };
    checkResize();
    window.addEventListener("resize", checkResize);
    return () => window.removeEventListener("resize", checkResize);
  }, []);

  const hasManyRows = data.length > 3;
  // Apply responsive reduction ONLY if table has more than 3 rows & screen width is collapsed < 1024px
  const applyResponsiveCollapse = isMobile && hasManyRows;

  // Header display is sliced to show only 3 columns if responsive-collapsed
  const visibleColumns = applyResponsiveCollapse ? columns.slice(0, 3) : columns;
  const hiddenColumns = applyResponsiveCollapse ? columns.slice(3) : [];

  const toggleRow = (rowId: string) => {
    setExpandedRows((prev) => ({
      ...prev,
      [rowId]: !prev[rowId],
    }));
  };

  return (
    <div className={`w-full overflow-hidden ${className}`}>
      <div className="overflow-x-auto w-full">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/50 text-[10px] font-mono uppercase tracking-wider text-slate-500">
              {visibleColumns.map((col) => (
                <th
                  key={col.id}
                  className={`py-3 px-4 sm:px-6 font-semibold ${col.headerClassName || ""}`}
                >
                  {col.header}
                </th>
              ))}
              {applyResponsiveCollapse && (
                <th className="py-3 px-4 w-12 text-center text-[10px] text-slate-400 font-mono font-semibold">
                  Details
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={visibleColumns.length + (applyResponsiveCollapse ? 1 : 0)}
                  className="py-12 text-center text-slate-400 text-sm"
                >
                  No matching records found.
                </td>
              </tr>
            ) : (
              data.map((row, rIdx) => {
                const rowId = keyExtractor(row, rIdx);
                const isExpanded = !!expandedRows[rowId];

                return (
                  <React.Fragment key={rowId}>
                    <tr
                      onClick={(e) => {
                        // Prevent click propagation to expand/collapse if clicking inline elements that are interactive, but default click is safe
                        const target = e.target as HTMLElement;
                        if (
                          target.closest("button") || 
                          target.closest("a") || 
                          target.closest("input") || 
                          target.closest("select")
                        ) {
                          return;
                        }
                        if (applyResponsiveCollapse) {
                          toggleRow(rowId);
                        }
                        if (onRowClick) {
                          onRowClick(row);
                        }
                      }}
                      className={`border-b last:border-0 border-slate-100 hover:bg-slate-50/20 text-xs text-slate-600 transition-colors ${
                        applyResponsiveCollapse ? "cursor-pointer" : ""
                      } ${rowClassName}`}
                    >
                      {visibleColumns.map((col) => (
                        <td
                          key={col.id}
                          className={`py-3 px-4 sm:px-6 font-medium ${col.className || ""}`}
                        >
                          {col.cell(row)}
                        </td>
                      ))}
                      {applyResponsiveCollapse && (
                        <td className="py-3 px-4 text-center">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleRow(rowId);
                            }}
                            className="bg-slate-100 hover:bg-slate-200 text-slate-600 p-1 rounded transition-colors"
                            title="Expand additional details"
                          >
                            {isExpanded ? (
                              <ChevronUp className="h-3.5 w-3.5" />
                            ) : (
                              <ChevronDown className="h-3.5 w-3.5" />
                            )}
                          </button>
                        </td>
                      )}
                    </tr>

                    {/* Collapsed Hidden Columns panel shown below */}
                    {applyResponsiveCollapse && isExpanded && (
                      <tr className="bg-slate-50/50 border-b border-indigo-50">
                        <td
                          colSpan={visibleColumns.length + 1}
                          className="px-4 py-3.5 space-y-2.5"
                        >
                          <div className="text-[9px] font-mono font-extrabold text-indigo-600 uppercase tracking-wider mb-1.5">
                            Expanded Attributes & Controls
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            {hiddenColumns.map((col) => (
                              <div
                                key={col.id}
                                className="bg-white p-2.5 rounded-xl border border-slate-150 flex flex-col gap-1 shadow-3xs"
                              >
                                <span className="text-[8px] uppercase font-bold text-slate-400 tracking-wider">
                                  {typeof col.header === "string" || React.isValidElement(col.header) ? col.header : col.id}
                                </span>
                                <div className="text-xs text-slate-800">
                                  {col.cell(row)}
                                </div>
                              </div>
                            ))}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
