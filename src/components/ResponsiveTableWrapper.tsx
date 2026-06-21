import React, { useState, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface ResponsiveTableWrapperProps {
  children: React.ReactNode;
}

export function ResponsiveTableWrapper({ children }: ResponsiveTableWrapperProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [expandedRows, setExpandedRows] = useState<Record<number, boolean>>({});

  useEffect(() => {
    const handleResize = () => {
      // Collapse when display size decreases (tablet & mobile break points, < 1024px)
      setIsMobile(window.innerWidth < 1024);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleRow = (index: number) => {
    setExpandedRows((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  // If children is not a valid element, render as is
  if (!React.isValidElement(children)) {
    return <>{children}</>;
  }

  // Find the nested table element recursively
  let tableElement: React.ReactElement | null = null;

  if (children.type === "table") {
    tableElement = children as React.ReactElement;
  } else {
    const findTable = (node: React.ReactNode): React.ReactElement | null => {
      if (React.isValidElement(node)) {
        if (node.type === "table") {
          return node as React.ReactElement;
        }
        if (node.props && (node.props as any).children) {
          const childrenArray = React.Children.toArray((node.props as any).children);
          for (const child of childrenArray) {
            const found = findTable(child);
            if (found) return found;
          }
        }
      }
      return null;
    };
    tableElement = findTable(children);
  }

  if (!tableElement) {
    return <>{children}</>;
  }

  // Extract layers: thead, tbody
  const tableChildren = React.Children.toArray(tableElement.props.children);
  const theadElement = tableChildren.find(
    (c) => React.isValidElement(c) && (c.type === "thead" || (c.type as any).name === "thead")
  ) as React.ReactElement | undefined;
  
  const tbodyElement = tableChildren.find(
    (c) => React.isValidElement(c) && (c.type === "tbody" || (c.type as any).name === "tbody")
  ) as React.ReactElement | undefined;

  if (!theadElement || !tbodyElement) {
    return <div className="overflow-x-auto w-full">{children}</div>;
  }

  // Extract the header row
  const theadChildren = React.Children.toArray(theadElement.props.children);
  const headerTr = theadChildren.find(
    (c) => React.isValidElement(c) && (c.type === "tr" || (c.type as any).name === "tr")
  ) as React.ReactElement | undefined;

  if (!headerTr) {
    return <div className="overflow-x-auto w-full">{children}</div>;
  }

  // Extract individual headers (th elements)
  const allHeaders = React.Children.toArray(headerTr.props.children).filter(
    (c) => React.isValidElement(c) && (c.type === "th" || (c.type as any).name === "th")
  ) as React.ReactElement[];

  // Extract individual body rows (tr elements)
  const allRows = React.Children.toArray(tbodyElement.props.children).filter(
    (c) => React.isValidElement(c) && (c.type === "tr" || (c.type as any).name === "tr")
  ) as React.ReactElement[];

  const rowCount = allRows.length;
  // Apply responsive reduction ONLY if table has more than 3 rows AND we're on mobile/tablet viewport < 1024px
  const applyCollapse = isMobile && rowCount > 3;

  if (!applyCollapse) {
    return <div className="overflow-x-auto w-full">{children}</div>;
  }

  // Show only 3 columns as requested
  const visibleHeaders = allHeaders.slice(0, 3);
  const hiddenHeaders = allHeaders.slice(3);

  return (
    <div className="w-full overflow-hidden">
      <div className="overflow-x-auto w-full">
        <table className={tableElement.props.className || "w-full text-left border-collapse"}>
          <thead>
            <tr className={headerTr.props.className || "border-b border-slate-100 bg-slate-50/50"}>
              {visibleHeaders.map((header, idx) => (
                <th
                  key={idx}
                  className={header.props.className || "py-3.5 px-5 font-semibold text-slate-550"}
                  style={header.props.style}
                >
                  {header.props.children}
                </th>
              ))}
              <th className="py-3 px-4 text-center text-[10px] text-slate-400 font-mono font-bold w-14 shrink-0">
                Details
              </th>
            </tr>
          </thead>
          <tbody>
            {allRows.map((row, rIdx) => {
              // Extract cells
              const allCells = React.Children.toArray(row.props.children).filter(
                (c) => React.isValidElement(c) && (c.type === "td" || (c.type as any).name === "td")
              ) as React.ReactElement[];

              const visibleCells = allCells.slice(0, 3);
              const hiddenCells = allCells.slice(3);
              const isExpanded = !!expandedRows[rIdx];

              return (
                <React.Fragment key={rIdx}>
                  <tr
                    onClick={(e) => {
                      // Skip expand/collapse if user is interacting with form controls or buttons in the visible columns
                      const target = e.target as HTMLElement;
                      if (
                        target.closest("button") ||
                        target.closest("a") ||
                        target.closest("input") ||
                        target.closest("select") ||
                        target.closest('[role="button"]')
                      ) {
                        return;
                      }
                      toggleRow(rIdx);
                      if (row.props.onClick) {
                        row.props.onClick(e);
                      }
                    }}
                    className={`${row.props.className || ""} cursor-pointer`}
                    style={row.props.style}
                  >
                    {visibleCells.map((cell, idx) => (
                      <td
                        key={idx}
                        className={cell.props.className}
                        style={cell.props.style}
                      >
                        {cell.props.children}
                      </td>
                    ))}
                    <td className="py-3 px-4 text-center">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleRow(rIdx);
                        }}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-600 p-1 rounded-md transition-colors inline-flex items-center justify-center border border-slate-200"
                        title="Toggle parameters detail tray"
                      >
                        {isExpanded ? (
                          <ChevronUp className="h-3.5 w-3.5" />
                        ) : (
                          <ChevronDown className="h-3.5 w-3.5" />
                        )}
                      </button>
                    </td>
                  </tr>

                  {isExpanded && (
                    <tr className="bg-slate-50/65 border-b border-indigo-50">
                      <td colSpan={visibleCells.length + 1} className="px-5 py-4">
                        <div className="text-[9px] font-mono font-extrabold text-indigo-600 uppercase tracking-wider mb-2.5">
                          Additional Parameters Detail Panel
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {hiddenCells.map((cell, idx) => {
                            const matchingHeader = hiddenHeaders[idx];
                            
                            // Helper to extract clean header text from standard Header element
                            let headerTitle = "Attribute";
                            if (matchingHeader) {
                              const childrenStr = matchingHeader.props.children;
                              if (typeof childrenStr === "string") {
                                headerTitle = childrenStr;
                              } else if (React.isValidElement(childrenStr)) {
                                headerTitle = (childrenStr.props as any).children || matchingHeader.props.title || "Parameter";
                              } else {
                                headerTitle = matchingHeader.props.title || matchingHeader.props.children || "Param";
                              }
                            }

                            // Keep label string clean & uppercase-friendly
                            const displayLabel = String(headerTitle).replace(/:/g, "").trim();

                            return (
                              <div
                                key={idx}
                                className="bg-white p-3 rounded-xl border border-slate-150 flex flex-col gap-1 shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
                              >
                                <span className="text-[8px] uppercase font-bold text-slate-400 tracking-wider">
                                  {displayLabel}
                                </span>
                                <div className="text-xs font-semibold text-slate-800 break-words flex flex-wrap items-center gap-1">
                                  {cell.props.children}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
