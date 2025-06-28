import { useState, useMemo } from "react";

export function PaginatedTable<T>({
  columns,
  data,
  renderRow,
  searchPlaceholder = "Search...",
}: {
  columns: { label: string; key: string }[];
  data: T[];
  renderRow: (row: T) => React.ReactNode;
  searchPlaceholder?: string;
}) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const pageSize = 10;

  const filtered = useMemo(() => {
    if (!search) return data;
    const lower = search.toLowerCase();
    return data.filter(row =>
      columns.some(col =>
        String((row as any)[col.key] ?? "").toLowerCase().includes(lower)
      )
    );
  }, [search, data, columns]);

  const pageCount = Math.ceil(filtered.length / pageSize);
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <input
          className="border rounded px-2 py-1 w-64"
          placeholder={searchPlaceholder}
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
        />
        <div className="flex gap-2 items-center">
          <button
            className="btn"
            disabled={page === 1}
            onClick={() => setPage(p => Math.max(1, p - 1))}
          >Prev</button>
          <span className="text-sm">Page {page} of {pageCount || 1}</span>
          <button
            className="btn"
            disabled={page === pageCount || pageCount === 0}
            onClick={() => setPage(p => Math.min(pageCount, p + 1))}
          >Next</button>
        </div>
      </div>
      <table className="min-w-full bg-white rounded shadow">
        <thead>
          <tr>
            {columns.map(col => (
              <th key={col.key} className="px-4 py-2 text-left">{col.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {paged.length === 0 ? (
            <tr><td colSpan={columns.length} className="text-center py-8 text-gray-400">No results</td></tr>
          ) : (
            paged.map(renderRow)
          )}
        </tbody>
      </table>
      {pageCount > 1 && (
        <div className="flex justify-end mt-2 gap-2">
          <button
            className="btn"
            disabled={page === 1}
            onClick={() => setPage(p => Math.max(1, p - 1))}
          >Prev</button>
          <span className="text-sm">Page {page} of {pageCount}</span>
          <button
            className="btn"
            disabled={page === pageCount}
            onClick={() => setPage(p => Math.min(pageCount, p + 1))}
          >Next</button>
        </div>
      )}
    </div>
  );
} 