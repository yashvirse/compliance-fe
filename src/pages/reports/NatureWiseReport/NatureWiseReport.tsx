import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
  Paper,
  useTheme,
  alpha,
  Chip,
  Tooltip,
} from "@mui/material";
import type { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "../../../app/store";
import {
  selectNatureWiseReportList,
  selectNatureWiseReportLoading,
} from "./NatureWiseReport.selector";
import { fetchAssignedTasks } from "./NatureWiseReport.slice";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import {
  CommonDataTable,
  TaskMovementDialog,
} from "../../../components/common";
import * as XLSX from "xlsx";
import TvIcon from "@mui/icons-material/Tv"; // Display
import AppRegistrationIcon from "@mui/icons-material/AppRegistration"; // Registration
import AssignmentReturnIcon from "@mui/icons-material/AssignmentReturn"; // Return
import MenuBookIcon from "@mui/icons-material/MenuBook"; // Register
import AccountBalanceIcon from "@mui/icons-material/AccountBalance"; // Remittance

const NatureWiseReport: React.FC = () => {
  const theme = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const [taskMovementDialogOpen, setTaskMovementDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any | null>(null);
  const data = useSelector(selectNatureWiseReportList);
  const loading = useSelector(selectNatureWiseReportLoading);

  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedFilter, setSelectedFilter] = useState<any>(null);
  const getFrequencyColor = (frequency: string) => {
    switch (frequency) {
      case "Weekly":
        return "primary";
      case "Fortnightly":
        return "secondary";
      case "Monthly":
        return "success";
      case "Half Yearly":
        return "warning";
      case "Annually":
        return "error";
      case "As Needed":
        return "default";
      default:
        return "default";
    }
  };

  const getFromDateISO = (date: Date) => {
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    return lastDay.toISOString();
  };

  useEffect(() => {
    const fromDate = getFromDateISO(currentMonth);

    dispatch(
      fetchAssignedTasks({
        fromDate,
      }),
    );
  }, [dispatch, currentMonth]);
  const handleViewTaskMovement = (tblId: string) => {
    setSelectedTask(tblId);
    setTaskMovementDialogOpen(true);
  };

  const handleCloseTaskMovementDialog = () => {
    setTaskMovementDialogOpen(false);
    setSelectedTask(null);
  };
  const NATURE_LIST = [
    "Display",
    "Registration",
    "Return",
    "Register",
    "Remittance",
  ];
  const getNatureIcon = (name: string) => {
    switch (name) {
      case "Display":
        return <TvIcon fontSize="small" />;
      case "Registration":
        return <AppRegistrationIcon fontSize="small" />;
      case "Return":
        return <AssignmentReturnIcon fontSize="small" />;
      case "Register":
        return <MenuBookIcon fontSize="small" />;
      case "Remittance":
        return <AccountBalanceIcon fontSize="small" />;
      default:
        return null;
    }
  };
  const getNatureWiseStats = () => {
    const today = new Date();

    const grouped: any = {};

    NATURE_LIST.forEach((nature) => {
      grouped[nature] = {
        name: nature,
        all: 0,
        compliant: 0,
        nonCompliant: 0,
        inProgress: 0,
      };
    });

    if (!data) return Object.values(grouped);

    data.forEach((task: any) => {
      // ✅ normalize API value
      let nature = task.natureOfActivity?.trim();

      // ❌ empty/null skip
      if (!nature) return;

      // ✅ match with list (case insensitive)
      const matchedNature = NATURE_LIST.find(
        (n) => n.toLowerCase() === nature.toLowerCase(),
      );

      if (!matchedNature) return;

      grouped[matchedNature].all++;

      const dueDate = task.dueDate ? new Date(task.dueDate) : null;
      let completedDate: Date | null = null;

      if (
        task.taskCompletionDate &&
        task.taskCompletionDate !== "0001-01-01T00:00:00"
      ) {
        completedDate = new Date(task.taskCompletionDate);
      }

      // ✅ COMPLIANT
      if (task.taskCurrentStatus === "Completed" && dueDate && completedDate) {
        const due = new Date(dueDate);
        const comp = new Date(completedDate);

        // ✅ remove time (important)
        due.setHours(0, 0, 0, 0);
        comp.setHours(0, 0, 0, 0);

        if (comp <= due) {
          grouped[matchedNature].compliant++;
        }
      }

      // ❌ NON-COMPLIANT
      else if (
        (task.taskCurrentStatus === "Completed" &&
          dueDate &&
          completedDate &&
          completedDate > dueDate) ||
        (task.taskCurrentStatus !== "Completed" && dueDate && today > dueDate)
      ) {
        grouped[matchedNature].nonCompliant++;
      }

      // ⏳ IN PROGRESS
      else {
        grouped[matchedNature].inProgress++;
      }
    });

    return Object.values(grouped);
  };
  const natureStats = getNatureWiseStats();

  const getFilteredData = () => {
    if (!selectedFilter) return data;

    const today = new Date();

    return data.filter((task: any) => {
      let nature = task.natureOfActivity?.trim();
      if (!nature) return false;

      const matchedNature = NATURE_LIST.find(
        (n) => n.toLowerCase() === nature.toLowerCase(),
      );

      if (matchedNature !== selectedFilter.nature) return false;

      const dueDate = task.dueDate ? new Date(task.dueDate) : null;

      let completedDate: Date | null = null;
      if (
        task.taskCompletionDate &&
        task.taskCompletionDate !== "0001-01-01T00:00:00"
      ) {
        completedDate = new Date(task.taskCompletionDate);
      }

      if (selectedFilter.type === "all") return true;

      if (
        selectedFilter.type === "compliant" &&
        task.taskCurrentStatus === "Completed" &&
        dueDate &&
        completedDate &&
        completedDate <= dueDate
      )
        return true;

      if (
        selectedFilter.type === "nonCompliant" &&
        ((task.taskCurrentStatus === "Completed" &&
          dueDate &&
          completedDate &&
          completedDate > dueDate) ||
          (task.taskCurrentStatus !== "Completed" &&
            dueDate &&
            today > dueDate))
      )
        return true;

      if (
        selectedFilter.type === "inProgress" &&
        !(
          task.taskCurrentStatus === "Completed" ||
          (dueDate && today > dueDate)
        )
      )
        return true;

      return false;
    });
  };

  const handleExportExcel = () => {
    const tasks = getFilteredData();

    if (!tasks || tasks.length === 0) return;

    const formattedData = tasks.map((row: any, index: number) => ({
      "S.No.": index + 1,
      "Site Name": row.siteName,
      "Activity Name": row.actName
        ? `${row.actName} - ${row.activityName}`
        : row.activityName,
      Department: row.departmentName,
      Frequency: row.frequency,
      "Due Date": row.dueDate
        ? new Date(row.dueDate).toLocaleDateString("en-GB")
        : "",
      Status: row.taskCurrentStatus,
    }));

    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Tasks");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");

    a.href = url;
    a.download = `NatureWiseReport_${dayjs().format("MMM_YYYY")}.xlsx`;

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    window.URL.revokeObjectURL(url);
  };
  /* ================= COLUMNS ================= */
  const columns: GridColDef[] = [
    {
      field: "sno",
      headerName: "S.No.",
      width: 70,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => {
        const index = data.findIndex((data) => data.tblId === params.row.tblId);
        return index + 1;
      },
    },
    { field: "siteName", headerName: "Site Name", width: 160 },
    {
      field: "activityName",
      headerName: "Activity Name",
      flex: 1,
      minWidth: 600,
      valueGetter: (_value, row) => {
        if (!row.actName) return row.activityName;
        return `${row.actName} - ${row.activityName}`;
      },
      sortable: true,
      filterable: true,
    },
    {
      field: "departmentName",
      headerName: "Department",
      flex: 1,
      minWidth: 150,
      renderCell: (params) => (
        <Chip
          label={params.value}
          size="small"
          sx={{
            bgcolor: alpha(theme.palette.success.main, 0.1),
            color: theme.palette.success.main,
          }}
        />
      ),
    },
    {
      field: "frequency",
      headerName: "Frequency",
      flex: 1,
      minWidth: 130,
      renderCell: (params: GridRenderCellParams) => (
        <Chip
          label={params.value}
          color={getFrequencyColor(params.value as string) as any}
          size="small"
        />
      ),
    },
    {
      field: "dueDate",
      headerName: "Due Date",
      flex: 1,
      minWidth: 120,
      renderCell: (params: GridRenderCellParams) => {
        if (!params.value) return "-";
        return new Date(params.value as string).toLocaleDateString("en-GB");
      },
    },
    {
      field: "taskCurrentStatus",
      headerName: "Status",
      width: 120,
      renderCell: (params: GridRenderCellParams) => (
        <Chip
          label={params.value}
          size="small"
          color={
            params.value === "Completed"
              ? "success"
              : params.value === "Rejected"
                ? "error"
                : "warning"
          }
        />
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 100,
      renderCell: (params: any) => (
        <Tooltip title="View Task">
          <Button
            size="small"
            startIcon={<RemoveRedEyeIcon />}
            onClick={() => handleViewTaskMovement(params.row.tblId)}
          ></Button>
        </Tooltip>
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
          flexWrap: "wrap",
        }}
      >
        <Typography variant="h4" fontWeight={700}>
          Compliance Nature Wise Report
        </Typography>

        <Box sx={{ display: "flex", gap: 1 }}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              views={["year", "month"]}
              label="Select Month"
              value={dayjs(currentMonth)}
              onChange={(newValue) =>
                newValue && setCurrentMonth(newValue.toDate())
              }
              slotProps={{ textField: { size: "small" } }}
            />
          </LocalizationProvider>
          <Button variant="contained" size="small" onClick={handleExportExcel}>
            Export To Excel
          </Button>
        </Box>
      </Box>

      {/* 🔥 NATURE BOXES */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          gap: 2,
          mb: 3,
        }}
      >
        {natureStats.map((item: any, i: number) => (
          <Paper
            key={i}
            sx={{
              p: 1.5,
              borderRadius: 3,
              boxShadow: 3,
              transition: "0.3s",
              "&:hover": {
                transform: "translateY(-3px)",
                boxShadow: 6,
              },
            }}
          >
            {/* Title */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                borderBottom: "2px solid #ccc",
                pb: 0.5,
                mb: 1.5,
              }}
            >
              {getNatureIcon(item.name)}

              <Typography fontWeight={700}>{item.name}</Typography>
            </Box>

            {/* Rows */}
            <Box display="flex" flexDirection="column" gap={1.2}>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography variant="body2">All</Typography>
                <Chip
                  label={item.all}
                  size="small"
                  onClick={() =>
                    setSelectedFilter({ nature: item.name, type: "all" })
                  }
                />
              </Box>

              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography variant="body2">Compliant</Typography>
                <Chip
                  label={item.compliant}
                  size="small"
                  color="success"
                  onClick={() =>
                    setSelectedFilter({ nature: item.name, type: "compliant" })
                  }
                />
              </Box>

              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography variant="body2">Non-Compliant</Typography>
                <Chip
                  label={item.nonCompliant}
                  size="small"
                  color="error"
                  onClick={() =>
                    setSelectedFilter({
                      nature: item.name,
                      type: "nonCompliant",
                    })
                  }
                />{" "}
              </Box>

              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography variant="body2">In-Progress</Typography>
                <Chip
                  label={item.inProgress}
                  size="small"
                  color="warning"
                  onClick={() =>
                    setSelectedFilter({ nature: item.name, type: "inProgress" })
                  }
                />
              </Box>
            </Box>
          </Paper>
        ))}
      </Box>

      {/* Table */}
      <Paper sx={{ borderRadius: 3 }}>
        <CommonDataTable
          rows={getFilteredData()}
          columns={columns}
          getRowId={(row) => row.tblId}
          loading={loading}
        />
      </Paper>
      <TaskMovementDialog
        open={taskMovementDialogOpen}
        onClose={handleCloseTaskMovementDialog}
        tblId={selectedTask}
      />
    </Box>
  );
};

export default NatureWiseReport;
