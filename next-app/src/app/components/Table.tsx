import { ReactNode } from "react";

interface TableProps {
    children: ReactNode
}

export const Table: React.FC<TableProps> = ({ children }) => {
    return (
      <table className="table-auto w-full border-collapse border border-gray-300">
        {children}
      </table>
    );
};

export const TableHeader: React.FC<TableProps> = ({ children }) => {
    return (
      <thead className="bg-gray-200">
        <tr>
          {children}
        </tr>
      </thead>
    );
};

export const TableRow: React.FC<TableProps> = ({ children }) => {
    return (
      <tr className="hover:bg-gray-100">
        {children}
      </tr>
    );
}

export const TableHead: React.FC<TableProps> = ({ children }) => {
    return (
      <th className="px-4 py-2 text-left text-black">
        {children}
      </th>
    );
};

export const TableBody: React.FC<TableProps> = ({ children }) => {
    return (
      <tbody>
        {children}
      </tbody>
    );
};