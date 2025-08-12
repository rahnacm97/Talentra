import React from 'react';

interface Column {
  key: string;
  label: string;
  render?: (value: any, item?: any) => React.ReactNode;
}

interface Item {
  _id: string;
  [key: string]: any;
}

interface TableProps<T extends Item> {
  data: T[];
  columns: Column[];
  renderActions: (item: T) => React.ReactNode;
  indexOffset: number;
}

const Table = <T extends Item>({ data, columns, renderActions, indexOffset }: TableProps<T>) => {
  if (!Array.isArray(data)) {
    console.error('Table component received non-array data:', data);
    return <p className="p-4 text-center text-red-500">Invalid data format</p>;
  }

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <table className="w-full text-left">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-3">Sl. No.</th>
            {columns.map((col) => (
              <th key={col.key} className="p-3">
                {col.label}
              </th>
            ))}
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={item._id} className="border-b hover:bg-gray-100">
              <td className="p-3">{indexOffset + index + 1}</td>
              {columns.map((col) => (
                <td key={`${item._id}-${col.key}`} className="p-3">
                  {col.render ? col.render(item[col.key],item): (item[col.key] ?? 'N/A')}
                </td>
              ))}
              <td className="p-3">{renderActions(item)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {data.length === 0 && <p className="p-4 text-center text-gray-500">No items found.</p>}
    </div>
  );
};

export default Table;