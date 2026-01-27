import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "../../app/store";
import {
  Box,
  Typography,
  Paper,
  IconButton,
  useTheme,
  alpha,
  Button,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import {
  DataGrid,
  type GridColDef,
  type GridRenderCellParams,
} from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import WarningIcon from "@mui/icons-material/Warning";
import AddIcon from "@mui/icons-material/Add";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import DownloadIcon from "@mui/icons-material/Download";
import { selectFileList } from "./FileUploaderSlice/FileUploader.selector";
import {
  deleteFile,
  fetchFileList,
  processSalaryMusterRoll,
} from "./FileUploaderSlice/FileUploader.slice";
import { useNavigate } from "react-router-dom";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { apiService } from "../../services/api";

const FileUploader: React.FC = () => {
  const theme = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const files = useSelector(selectFileList);
  /* ---------- Delete State ---------- */
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<{
    fileId: string;
    fileName: string;
  } | null>(null);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState<Dayjs | null>(dayjs());
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success",
  );
  const handleAdd = () => {
    navigate("/dashboard/tools/add-file-uploader");
  };
  /* ---------- Fetch List ---------- */
  useEffect(() => {
    dispatch(fetchFileList());
  }, [dispatch]);

  const handleProcessClick = async (fileId: string) => {
    const blob = await dispatch(processSalaryMusterRoll(fileId)).unwrap();

    const url = window.URL.createObjectURL(
      new Blob([blob], { type: "application/pdf" }),
    );

    const link = document.createElement("a");
    link.href = url;
    link.download = "SalaryRegister.pdf";
    document.body.appendChild(link);
    link.click();

    link.remove();
    window.URL.revokeObjectURL(url);
  };

  /* ---------- Delete Handlers ---------- */
  const handleDeleteClick = (fileId: string, fileName: string) => {
    setSelectedFile({ fileId, fileName });
    setDeleteDialogOpen(true);
  };

  const filteredFiles = React.useMemo(() => {
    if (!selectedMonth) return files;

    const selectedYear = selectedMonth.year();
    const selectedMonthName = selectedMonth.format("MMMM");

    return files.filter((file: any) => {
      return (
        file.year === selectedYear.toString() &&
        file.month === selectedMonthName
      );
    });
  }, [files, selectedMonth]);

  const handleConfirmDelete = async () => {
    if (selectedFile) {
      await dispatch(deleteFile(selectedFile.fileId));
      setDeleteDialogOpen(false);
      setSelectedFile(null);
      setShowSnackbar(true);
      dispatch(fetchFileList());
    }
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setSelectedFile(null);
  };

  const handleCloseSnackbar = () => {
    setShowSnackbar(false);
  };
  const handleDownloadTemplate = async () => {
    try {
      await apiService.download(
        "SalaryMusterRoll/salaryRegisterSample",
        "SalaryRegister.csv",
      );
      setSnackbarMessage("Salary Register downloaded successful");
      setShowSnackbar(true);
    } catch (err) {
      setSnackbarMessage("Failed to download selery register");
      setSnackbarSeverity("error");
      setShowSnackbar(true);
    }
  };
  /* ---------- Columns ---------- */
  const columns: GridColDef[] = [
    {
      field: "sno",
      headerName: "S.No.",
      width: 80,
      sortable: false,
      renderCell: (params: GridRenderCellParams) =>
        params.api.getRowIndexRelativeToVisibleRows(params.id) + 1,
    },
    {
      field: "fileName",
      headerName: "File Name",
      flex: 1,
      minWidth: 150,
    },
    {
      field: "fileType",
      headerName: "Type",
      width: 150,
    },
    {
      field: "month",
      headerName: "Month",
      width: 150,
      renderCell: (params) => {
        const month = params.row.month;
        const year = params.row.year;

        if (!month || !year) return "-";
        return `${month} ${year}`;
      },
    },
    {
      field: "uploadedOn",
      headerName: "Uploaded On",
      width: 150,
      renderCell: (params) => {
        if (!params.value) return "";
        const date = new Date(params.value as string);
        return date.toLocaleDateString("en-GB");
      },
    },
    {
      field: "status",
      headerName: "Status",
      width: 160,
      renderCell: () => (
        <span style={{ color: "#f57c00", fontWeight: 500 }}>Pending</span>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => (
        <Box sx={{ display: "flex", alignItems: "center", height: "100%" }}>
          <IconButton
            size="small"
            color="primary"
            onClick={() => handleProcessClick(params.row.fileId)}
          >
            <PlayArrowIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            color="error"
            onClick={() =>
              handleDeleteClick(params.row.fileId, params.row.fileName)
            }
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <Box>
      {/* ---------- Header ---------- */}
      <Box
        sx={{
          mb: 3,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 2,
        }}
      >
        {/* Left side */}
        <Box>
          <Typography variant="h4" fontWeight={700}>
            File Uploader
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Upload & manage files
          </Typography>
        </Box>

        {/* Right side (Month picker + Add button) */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              views={["year", "month"]}
              label="Select Month"
              value={selectedMonth}
              onChange={(newValue) => {
                setSelectedMonth(newValue);
              }}
              slotProps={{
                textField: {
                  size: "small",
                  sx: { minWidth: 160 },
                },
              }}
            />
          </LocalizationProvider>
          <Button
            variant="contained"
            startIcon={<DownloadIcon />}
            onClick={handleDownloadTemplate}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              px: 3,
              boxShadow: `0 4px 15px ${alpha(theme.palette.primary.main, 0.3)}`,
              "&:hover": {
                boxShadow: `0 6px 20px ${alpha(
                  theme.palette.primary.main,
                  0.4,
                )}`,
              },
            }}
          >
            Download Salary Sample
          </Button>
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
                boxShadow: `0 6px 20px ${alpha(
                  theme.palette.primary.main,
                  0.4,
                )}`,
              },
            }}
          >
            Add File
          </Button>
        </Box>
      </Box>

      {/* ---------- Grid ---------- */}
      <Paper sx={{ borderRadius: 2, overflow: "hidden" }}>
        <Box sx={{ height: 420 }}>
          <DataGrid
            rows={filteredFiles}
            getRowId={(row) => row.fileId}
            columns={columns}
            pageSizeOptions={[5, 10]}
            initialState={{
              pagination: {
                paginationModel: { pageSize: 10 },
              },
            }}
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
        </Box>
      </Paper>

      {/* ---------- Snackbar ---------- */}
      <Snackbar
        open={showSnackbar}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>

      {/* ---------- Delete Dialog ---------- */}
      <Dialog open={deleteDialogOpen} onClose={handleCancelDelete}>
        <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <WarningIcon color="warning" />
          Confirm Deletion
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete{" "}
            <strong>{selectedFile?.fileName}</strong>? <br />
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} variant="outlined">
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            variant="contained"
            color="error"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FileUploader;
