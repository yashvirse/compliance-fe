/**
 * Grid Columns Utility - Reusable column definitions for DataGrid
 * Benefits: Consistency, easy maintenance, reduced duplication
 */

import type { GridColDef } from '@mui/x-data-grid';
import { Chip, Box, Button, alpha } from '@mui/material';
import React from 'react';

interface ColumnActionHandlers {
  onView?: (row: any) => void;
  onApprove?: (row: any) => void;
  onReject?: (row: any) => void;
  onEdit?: (row: any) => void;
  onDelete?: (row: any) => void;
}

/**
 * Create basic task columns (Activity, Act, Department, Site, Date)
 */
export const createBasicTaskColumns = (): GridColDef[] => [
  {
    field: 'activityName',
    headerName: 'Activity Name',
    flex: 1.2,
    minWidth: 150,
  },
  {
    field: 'actName',
    headerName: 'Act Name',
    flex: 1,
    minWidth: 100,
  },
  {
    field: 'departmentName',
    headerName: 'Department',
    flex: 1,
    minWidth: 120,
  },
  {
    field: 'siteName',
    headerName: 'Site Name',
    flex: 1,
    minWidth: 120,
  },
  {
    field: 'dueDate',
    headerName: 'Due Date',
    flex: 1,
    minWidth: 120,
    renderCell: (params) => {
      try {
        return new Date(params.value).toLocaleDateString();
      } catch {
        return params.value || '-';
      }
    },
  },
];

/**
 * Create department chip column with theme color
 */
export const createDepartmentChipColumn = (
  theme: any,
  variant: 'info' | 'success' | 'error' | 'warning' = 'info'
): GridColDef => ({
  field: 'departmentName',
  headerName: 'Department',
  flex: 1,
  minWidth: 120,
  renderCell: (params) => (
    <Chip
      label={params.value}
      size="small"
      sx={{
        bgcolor: alpha(theme.palette[variant].main, 0.1),
        color: theme.palette[variant].main,
        fontWeight: 500,
      }}
    />
  ),
});

/**
 * Create status badge column
 */
export const createStatusColumn = (theme: any): GridColDef => ({
  field: 'status',
  headerName: 'Status',
  flex: 0.8,
  minWidth: 100,
  renderCell: (params) => {
    const status = params.value?.toLowerCase();
    let color: 'success' | 'error' | 'warning' | 'info' = 'info';

    if (status === 'approved' || status === 'completed') color = 'success';
    else if (status === 'rejected' || status === 'failed') color = 'error';
    else if (status === 'pending' || status === 'in progress') color = 'warning';

    return (
      <Chip
        label={params.value}
        size="small"
        color={color}
        variant="outlined"
        sx={{ fontWeight: 500 }}
      />
    );
  },
});

/**
 * Create actions column with dynamic buttons
 */
export const createActionsColumn = (
  handlers: ColumnActionHandlers,
  theme: any
): GridColDef => ({
  field: 'actions',
  headerName: 'Actions',
  flex: 1.5,
  minWidth: 180,
  sortable: false,
  filterable: false,
  renderCell: (params) => (
    <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
      {handlers.onView && (
        <Button
          size="small"
          variant="text"
          color="info"
          onClick={() => handlers.onView?.(params.row)}
          sx={{ textTransform: 'none' }}
        >
          View
        </Button>
      )}
      {handlers.onApprove && (
        <Button
          size="small"
          variant="contained"
          color="success"
          onClick={() => handlers.onApprove?.(params.row)}
          sx={{ textTransform: 'none', px: 1.5 }}
        >
          Approve
        </Button>
      )}
      {handlers.onReject && (
        <Button
          size="small"
          variant="contained"
          color="error"
          onClick={() => handlers.onReject?.(params.row)}
          sx={{ textTransform: 'none', px: 1.5 }}
        >
          Reject
        </Button>
      )}
      {handlers.onEdit && (
        <Button
          size="small"
          variant="outlined"
          onClick={() => handlers.onEdit?.(params.row)}
          sx={{ textTransform: 'none' }}
        >
          Edit
        </Button>
      )}
      {handlers.onDelete && (
        <Button
          size="small"
          variant="outlined"
          color="error"
          onClick={() => handlers.onDelete?.(params.row)}
          sx={{ textTransform: 'none' }}
        >
          Delete
        </Button>
      )}
    </Box>
  ),
});

/**
 * Combine multiple columns
 */
export const combineColumns = (...columns: GridColDef[][]): GridColDef[] => {
  return columns.flat();
};
