import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "../../app/store";
import {
  Box,
  Button,
  Typography,
  Paper,
  IconButton,
  useTheme,
  alpha,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
} from "@mui/icons-material";
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

  const handleAdd = () => {
    console.log("Add User");
  };

  const handleEdit = (id: string) => {
    console.log("Edit User:", id);
  };

  const handleDelete = (id: string) => {
    console.log("Delete User:", id);
  };

  const handleView = (id: string) => {
    console.log("View User:", id);
  };

  // ✅ Dynamic rows binding (ONLY CHANGE)
  const rows = users.map((user) => ({
    id: user.userID,
    name: user.userName,
    email: user.userEmail,
    role: user.userRole,
    status: user.isActive ? "Active" : "Inactive",
  }));

  const columns: GridColDef[] = [
    { field: "name", headerName: "Name", width: 200 },
    { field: "email", headerName: "Email", width: 250 },
    { field: "role", headerName: "Role", width: 150 },
    { field: "status", headerName: "Status", width: 130 },
    {
      field: "actions",
      headerName: "Actions",
      width: 180,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
            height: "100%", // 🔑 IMPORTANT
            width: "100%",
            gap: 1,
          }}
        >
          <IconButton
            size="small"
            onClick={() => handleView(params.row.id)}
            sx={{
              color: theme.palette.info.main,
              "&:hover": {
                bgcolor: alpha(theme.palette.info.main, 0.1),
              },
            }}
          >
            <ViewIcon fontSize="small" />
          </IconButton>

          <IconButton
            size="small"
            onClick={() => handleEdit(params.row.id)}
            sx={{
              color: theme.palette.primary.main,
              "&:hover": {
                bgcolor: alpha(theme.palette.primary.main, 0.1),
              },
            }}
          >
            <EditIcon fontSize="small" />
          </IconButton>

          <IconButton
            size="small"
            onClick={() => handleDelete(params.row.id)}
            sx={{
              color: theme.palette.error.main,
              "&:hover": {
                bgcolor: alpha(theme.palette.error.main, 0.1),
              },
            }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      ),
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
            User Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage all users in the system
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAdd}
          sx={{
            borderRadius: 2,
            textTransform: "none",
            px: 3,
            py: 1.5,
            fontWeight: 600,
            boxShadow: `0 4px 15px ${alpha(theme.palette.primary.main, 0.4)}`,
            "&:hover": {
              boxShadow: `0 6px 20px ${alpha(theme.palette.primary.main, 0.5)}`,
            },
          }}
        >
          Add User
        </Button>
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
