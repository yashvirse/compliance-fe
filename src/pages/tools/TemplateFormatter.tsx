import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Typography,
  Paper,
  useTheme,
  alpha,
  Alert,
  Snackbar,
  Tooltip,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import type { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { Add as AddIcon, Edit as EditIcon } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { getTemplates } from "./TemplateFormaterSlice/TemplateFormater.slice";
import { selectTemplateFormaterTemplates } from "./TemplateFormaterSlice/TemaplateFormater.selector";
import type { AppDispatch } from "../../app/store";
import * as XLSX from "xlsx";
const TemplateFormatter: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const templates = useSelector(selectTemplateFormaterTemplates);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage] = useState("");
  const [snackbarType] = useState<"success" | "error">("success");
  useEffect(() => {
    dispatch(getTemplates());
  }, [dispatch]);

  const handleAdd = () => {
    navigate("/dashboard/add-template");
  };

  const handleEdit = (id: string) => {
    navigate(`/dashboard/template/edit/${id}`);
  };

  const handleCloseSnackbar = () => {
    setShowSnackbar(false);
  };
  const handleExport = () => {
    if (!templates || templates.length === 0) return;

    const data = templates.map((item: any, index: number) => ({
      "Sr. No.": index + 1,
      "Form Name": item.slipName,
      "Formate Type": item.format,
      "File Type": item.fileTye,
      "Applicable States": item.stateName,
      "Applicable Activity": item.activityActName,
      "Created On": item.createdOn
        ? new Date(item.createdOn).toLocaleDateString("en-GB")
        : "",
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Templates");

    XLSX.writeFile(workbook, "Template_List.xlsx");
  };
  const columns: GridColDef[] = [
    {
      field: "serialNumber",
      headerName: "Sr. No.",
      flex: 0.5,
      minWidth: 80,
      renderCell: (params: GridRenderCellParams) => {
        const index = templates.findIndex(
          (row) => row.slipID === params.row.slipID,
        );
        return index + 1;
      },
    },
    { field: "slipName", headerName: "Form Name", flex: 1.5, minWidth: 600 },
    { field: "format", headerName: "Formate Type", flex: 1.5, minWidth: 120 },
    { field: "fileTye", headerName: "File Type", flex: 1.5, minWidth: 120 },
    {
      field: "stateName",
      headerName: "Applicable States",
      flex: 1.5,
      minWidth: 150,
    },
    {
      field: "activityActName",
      headerName: "Applicable Activity",
      flex: 1.5,
      minWidth: 300,
    },
    {
      field: "createdOn",
      headerName: "Created On",
      flex: 1,
      minWidth: 100,
      renderCell: (params) => {
        if (!params.value) return "";
        const date = new Date(params.value as string);
        return date.toLocaleDateString("en-GB");
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 0.8,
      minWidth: 100,
      sortable: false,
      headerAlign: "center",
      align: "center",
      renderCell: (params: GridRenderCellParams) => (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            width: "100%",
            gap: 1,
          }}
        >
          <Tooltip title="Edit">
            <Button
              size="small"
              onClick={() => handleEdit(params.row.slipID)}
              sx={{
                minWidth: "auto",
                p: 0.5,
                color: theme.palette.primary.main,
                "&:hover": { bgcolor: alpha(theme.palette.primary.main, 0.1) },
              }}
            >
              <EditIcon fontSize="small" />
            </Button>
          </Tooltip>
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
            Template Formatter
          </Typography>
        </Box>

        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAdd}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              px: 3,
              boxShadow: `0 4px 15px ${alpha(theme.palette.primary.main, 0.3)}`,
              "&:hover": {
                boxShadow: `0 6px 20px ${alpha(theme.palette.primary.main, 0.4)}`,
              },
            }}
          >
            Add Template
          </Button>

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
          rows={templates}
          columns={columns}
          getRowId={(row) => row.slipID}
          initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
          pageSizeOptions={[5, 10, 25]}
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

      {/* Snackbar */}
      <Snackbar
        open={showSnackbar}
        autoHideDuration={5000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarType}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default TemplateFormatter;
