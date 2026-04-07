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
  borderBottom: "2px solid #e0e0e0",
  padding: "12px",
  background: "#fafafa",
  fontWeight: 600,
  textAlign: "left",
  fontSize: "14px",
  color: "#333",
};

const tdStyle: React.CSSProperties = {
  borderBottom: "1px solid #f0f0f0",
  padding: "12px",
  fontSize: "14px",
  color: "#555",
};

const ReportDataTable: React.FC<ReportDataTableProps> = ({ columns, data }) => {
  return (
    <Box
      sx={{
        overflowX: "auto",
        borderRadius: "10px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        border: "1px solid #eee",
      }}
    >
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
            <tr
              key={i}
              style={{
                background: i % 2 === 0 ? "#ffffff" : "#fafafa",
                transition: "0.2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "#f1f7ff")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background =
                  i % 2 === 0 ? "#ffffff" : "#fafafa")
              }
            >
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
