import React, { useState } from 'react';
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

interface Country {
  id: number;
  name: string;
  code: string;
  capital: string;
  population: number;
  currency: string;
}

const CountryPage: React.FC = () => {
  const theme = useTheme();
  const [rows] = useState<Country[]>([
    { id: 1, name: 'United States', code: 'US', capital: 'Washington D.C.', population: 331000000, currency: 'USD' },
    { id: 2, name: 'United Kingdom', code: 'UK', capital: 'London', population: 67000000, currency: 'GBP' },
    { id: 3, name: 'Canada', code: 'CA', capital: 'Ottawa', population: 38000000, currency: 'CAD' },
    { id: 4, name: 'Australia', code: 'AU', capital: 'Canberra', population: 26000000, currency: 'AUD' },
    { id: 5, name: 'Germany', code: 'DE', capital: 'Berlin', population: 83000000, currency: 'EUR' },
  ]);

  const handleAdd = () => {
    console.log('Add Country');
  };

  const handleEdit = (id: number) => {
    console.log('Edit Country:', id);
  };

  const handleDelete = (id: number) => {
    console.log('Delete Country:', id);
  };

  const handleView = (id: number) => {
    console.log('View Country:', id);
  };

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'Country Name', width: 200 },
    { field: 'code', headerName: 'Code', width: 100 },
    { field: 'capital', headerName: 'Capital', width: 180 },
    { 
      field: 'population', 
      headerName: 'Population', 
      width: 150, 
      type: 'number',
      valueFormatter: (value) => {
        if (!value) return '';
        return new Intl.NumberFormat('en-US').format(value as number);
      }
    },
    { field: 'currency', headerName: 'Currency', width: 130 },
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
            Country Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage all countries in the system
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
          Add Country
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

export default CountryPage;
