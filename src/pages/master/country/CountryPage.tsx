import React, { useEffect } from "react";
import { Box, Typography, Paper, useTheme, alpha } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import type { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";

import { fetchCountryList } from "./CountryPage.slice";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";

interface CountryRow {
  id: string;
  countryId: string;
  countryName: string;
}

const CountryPage: React.FC = () => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const { countries } = useAppSelector((state) => state.country);

  useEffect(() => {
    dispatch(fetchCountryList());
  }, [dispatch]);

  const rows: CountryRow[] = countries.map((country) => ({
    id: country.countryId,
    countryId: country.countryId,
    countryName: country.countryName,
  }));

  const columns: GridColDef[] = [
    {
      field: "serialNumber",
      headerName: "Sr. No.",
      flex: 0.5,
      minWidth: 80,
      renderCell: (params: GridRenderCellParams) => {
        const index = countries.findIndex(
          (row) => row.countryId === params.row.id
        );
        return index + 1;
      },
    },
    { field: "countryId", headerName: "Country Code", width: 400 },
    { field: "countryName", headerName: "Country Name", width: 400 },
  ];

  return (
    <Box>
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
            Country Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage all countries in the system
          </Typography>
        </Box>
      </Box>

      <Paper
        sx={{
          borderRadius: 3,
          boxShadow: `0 4px 20px ${alpha(theme.palette.common.black, 0.08)}`,
          overflow: "hidden",
        }}
      >
        <DataGrid
          rows={rows}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 10 },
            },
          }}
          pageSizeOptions={[5, 10, 25]}
          checkboxSelection
          disableRowSelectionOnClick
          sx={{
            border: "none",
            "& .MuiDataGrid-cell": {
              borderColor: theme.palette.grey[200],
            },
            "& .MuiDataGrid-columnHeaders": {
              bgcolor: theme.palette.grey[50],
              fontWeight: 600,
            },
          }}
        />
      </Paper>
    </Box>
  );
};

export default CountryPage;
