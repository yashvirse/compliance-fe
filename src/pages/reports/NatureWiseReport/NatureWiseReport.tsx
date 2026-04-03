import React from "react";

import { Box, Button, Typography, Paper, useTheme, alpha } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import type { GridColDef } from "@mui/x-data-grid";

const NatureWiseReport: React.FC = () => {
  const theme = useTheme();

  const handleExport = () => {};

  const columns: GridColDef[] = [
    {
      field: "serialNumber",
      headerName: "Sr. No.",
      flex: 0.5,
      minWidth: 80,
    },
    {
      field: "actName",
      headerName: "Act Name",
      flex: 1.5,
      minWidth: 200,
    },
    {
      field: "depaermentName",
      headerName: "Department",
      flex: 1,
      minWidth: 150,
    },
    {
      field: "description",
      headerName: "Description",
      flex: 2,
      minWidth: 250,
    },
  ];

  return (
    <Box>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Box>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Compliance Nature Wise Report
          </Typography>
        </Box>

        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            variant="outlined"
            onClick={handleExport}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              px: 3,
            }}
          >
            Export to Excel
          </Button>
        </Box>
      </Box>

      {/* Data Grid */}
      <Paper
        sx={{
          borderRadius: 3,
          boxShadow: `0 4px 20px ${alpha(theme.palette.common.black, 0.08)}`,
          overflow: "hidden",
        }}
      >
        <DataGrid
          rows={[]}
          columns={columns}
          getRowId={(row) => row.actId}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 10 },
            },
          }}
          pageSizeOptions={[5, 10, 25, 50]}
          disableRowSelectionOnClick
          sx={{
            border: "none",
            "& .MuiDataGrid-cell": {
              borderBottom: `1px solid ${theme.palette.divider}`,
            },
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: alpha(theme.palette.primary.main, 0.05),
              borderBottom: `2px solid ${theme.palette.primary.main}`,
              fontWeight: 600,
            },
            "& .MuiDataGrid-row:hover": {
              backgroundColor: alpha(theme.palette.primary.main, 0.05),
            },
          }}
        />
      </Paper>
    </Box>
  );
};

export default NatureWiseReport;
