import React from 'react';

const DataTable = ({ columns, data, keyField = "id" }) => {
  return (
    <div className="overflow-x-auto w-full">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-50/80 border-b border-slate-200">
            {columns.map((col, idx) => (
              <th 
                key={idx} 
                className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white">
          {data.length > 0 ? (
            data.map((row) => (
              <tr key={row[keyField]} className="hover:bg-slate-50/80 transition-colors duration-150">
                {columns.map((col, idx) => (
                  <td key={idx} className="py-4 px-6 align-middle text-sm text-slate-700 font-medium">
                    {col.render ? col.render(row) : row[col.accessor]}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className="py-12 text-center text-slate-400 text-sm font-medium">
                No records found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
