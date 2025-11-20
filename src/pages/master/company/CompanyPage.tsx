import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Typography,
  Paper,
  IconButton,
  useTheme,
  alpha
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon
} from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';
import type { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';

interface Company {
  id: number;
  name: string;
  industry: string;
  location: string;
  employees: number;
  status: string;
}

const CompanyPage: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [rows] = useState<Company[]>([
    { id: 1, name: 'Tech Corp', industry: 'Technology', location: 'USA', employees: 500, status: 'Active' },
    { id: 2, name: 'Finance Ltd', industry: 'Finance', location: 'UK', employees: 250, status: 'Active' },
    { id: 3, name: 'Retail Inc', industry: 'Retail', location: 'Canada', employees: 1000, status: 'Active' },
    { id: 4, name: 'Health Plus', industry: 'Healthcare', location: 'Australia', employees: 300, status: 'Inactive' },
    { id: 5, name: 'Edu Systems', industry: 'Education', location: 'USA', employees: 150, status: 'Active' },
  ]);

  const handleAdd = () => {
    navigate('/dashboard/master/company/add');
  };

  const handleEdit = (id: number) => {
    console.log('Edit Company:', id);
  };

  const handleDelete = (id: number) => {
    console.log('Delete Company:', id);
  };

  const handleView = (id: number) => {
    console.log('View Company:', id);
  };

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'Company Name', width: 200 },
    { field: 'industry', headerName: 'Industry', width: 150 },
    { field: 'location', headerName: 'Location', width: 150 },
    { field: 'employees', headerName: 'Employees', width: 130, type: 'number' },
    { field: 'status', headerName: 'Status', width: 130 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 180,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton
            size="small"
            onClick={() => handleView(params.row.id)}
            sx={{
              color: theme.palette.info.main,
              '&:hover': { bgcolor: alpha(theme.palette.info.main, 0.1) }
            }}
          >
            <ViewIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => handleEdit(params.row.id)}
            sx={{
              color: theme.palette.primary.main,
              '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.1) }
            }}
          >
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => handleDelete(params.row.id)}
            sx={{
              color: theme.palette.error.main,
              '&:hover': { bgcolor: alpha(theme.palette.error.main, 0.1) }
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Company Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage all companies in the system
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAdd}
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            px: 3,
            py: 1.5,
            fontWeight: 600,
            boxShadow: `0 4px 15px ${alpha(theme.palette.primary.main, 0.4)}`,
            '&:hover': {
              boxShadow: `0 6px 20px ${alpha(theme.palette.primary.main, 0.5)}`
            }
          }}
        >
          Add Company
        </Button>
      </Box>

      <Paper
        sx={{
          borderRadius: 3,
          boxShadow: `0 4px 20px ${alpha(theme.palette.common.black, 0.08)}`,
          overflow: 'hidden'
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
            border: 'none',
            '& .MuiDataGrid-cell': {
              borderColor: theme.palette.grey[200]
            },
            '& .MuiDataGrid-columnHeaders': {
              bgcolor: theme.palette.grey[50],
              fontWeight: 600
            }
          }}
        />
      </Paper>
    </Box>
  );
};

export default CompanyPage;
