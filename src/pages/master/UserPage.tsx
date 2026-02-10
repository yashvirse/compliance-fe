import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "../../app/store";
import { Box, Typography, Paper, useTheme, alpha } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import type { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";

import { fetchUserList } from "./UserPage.slice";
import { selectUserList, selectUserLoading } from "./UserPage.selector";

const UserPage: React.FC = () => {
  const theme = useTheme();
  const dispatch = useDispatch<AppDispatch>();

  const users = useSelector(selectUserList);
  const loading = useSelector(selectUserLoading);

  useEffect(() => {
    dispatch(fetchUserList());
  }, [dispatch]);

  // ✅ Dynamic rows binding (ONLY CHANGE)
  const rows = users.map((user) => ({
    id: user.userID,
    name: user.userName,
    email: user.userEmail,
    role: user.userRole,
    status: user.isActive ? "Active" : "Inactive",
  }));

  const columns: GridColDef[] = [
    {
      field: "serialNumber",
      headerName: "Sr. No.",
      flex: 0.5,
      minWidth: 80,
      renderCell: (params: GridRenderCellParams) => {
        const index = users.findIndex((row) => row.userID === params.row.id);
        return index + 1;
      },
    },
    { field: "name", headerName: "Name", width: 300 },
    { field: "email", headerName: "Email", width: 250 },
    { field: "role", headerName: "Role", width: 150 },
    { field: "status", headerName: "Status", width: 130 },
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
            User Management
          </Typography>
        </Box>
      </Box>

      {/* Table */}
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
          loading={loading}
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

export default UserPage;
