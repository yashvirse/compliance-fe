import React from "react";
import { Box } from "@mui/material";

export interface Column {
  key: string;
  label: string;
  width?: string;
  render?: (row: any) => React.ReactNode;
}

interface ReportDataTableProps {
  columns: Column[];
  data: any[];
}

const thStyle: React.CSSProperties = {
  border: "1px solid #ccc",
  padding: "8px",
  background: "#f5f5f5",
  fontWeight: 600,
};

const tdStyle: React.CSSProperties = {
  border: "1px solid #ddd",
  padding: "8px",
  fontSize: "14px",
};

const ReportDataTable: React.FC<ReportDataTableProps> = ({ columns, data }) => {
  return (
    <Box sx={{ overflowX: "auto", mt: 1 }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key} style={{ ...thStyle, width: col.width }}>
                {col.label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.map((row, i) => (
            <tr key={i}>
              {columns.map((col) => (
                <td key={col.key} style={tdStyle}>
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </Box>
  );
};

export default ReportDataTable;
