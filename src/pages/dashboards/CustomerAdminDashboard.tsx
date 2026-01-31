import React, { useEffect, useState, useMemo, useRef } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  useTheme,
  alpha,
  Alert,
  Paper,
  Chip,
  Button,
  LinearProgress,
  IconButton,
} from "@mui/material";
import type { GridColDef } from "@mui/x-data-grid";
import {
  Assignment,
  Business,
  Cancel,
  CheckCircle,
  Gavel,
  HourglassTop,
  ListAlt,
  People,
  Visibility as EyeIcon,
  FilterList as FilterListIcon,
} from "@mui/icons-material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from "recharts";
import type { AppDispatch } from "../../app/store";
import { useDispatch, useSelector } from "react-redux";
import {
  selectAssignedTasks,
  selectCompletedTasks,
  selectRejectedTasks,
  selectPendingTasks,
  selectCustomerAdminDashboardData,
  selectCustomerAdminError,
} from "./customeradminslice/CustomerAdmin.selector"; // सिर्फ़ ये वाले selectors
import {
  fetchAssignedTasks,
  fetchCompletedTasks,
  fetchRejectedTasks,
  fetchPendingTasks,
  fetchCustomerAdminDashboard,
  fetchsiteWiseTasks,
} from "./customeradminslice/CustomerAdmin.slice";
import { useNavigate } from "react-router-dom";
import SiteMap from "../../components/SiteMap";
import TaskMovementDialog from "../../components/common/TaskMovementDialog";
import CommonDataTable from "../../components/common/CommonDataTable";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const CustomerAdminDashboard: React.FC = () => {
  const theme = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const error = useSelector(selectCustomerAdminError);
  const dashboardData = useSelector(selectCustomerAdminDashboardData);
  const completedTasks = useSelector(selectCompletedTasks);
  const rejectedTasks = useSelector(selectRejectedTasks);
  const pendingTasks = useSelector(selectPendingTasks);
  const assignedTasks = useSelector(selectAssignedTasks);
  const isSameOrBefore = (d1: Date, d2: Date) => d1.getTime() <= d2.getTime();
  const assignedTasksResponse = useSelector(selectAssignedTasks);
  
  // Prevent double API calls in StrictMode (React 18+ development)
  const initializationRef = useRef(false);
  
  const [showCompletedTable, setShowCompletedTable] = useState(false);
  const [showSiteWiseTable, setShowSiteWiseTable] = useState(false);
  const [showPendingTable, setShowPendingTable] = useState(false);
  const [showRejectedTable, setShowRejectedTable] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [taskMovementDialogOpen, setTaskMovementDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any | null>(null);

  const handleCompletedTasksClick = async () => {
    setLoading(true);
    setFetchError(null);
    setShowCompletedTable(true);

    try {
      await dispatch(fetchCompletedTasks()).unwrap();
    } catch (err: any) {
      setFetchError(err.message || "Failed to load completed tasks");
    } finally {
      setLoading(false);
    }
  };
  const handlePendingTasksClick = async () => {
    setLoading(true);
    setFetchError(null);
    setShowPendingTable(true);

    try {
      await dispatch(fetchPendingTasks()).unwrap();
    } catch (err: any) {
      setFetchError(err.message || "Failed to load pending tasks");
    } finally {
      setLoading(false);
    }
  };
  // Pending tasks are now fetched from API and stored in selector
  const handleRejectedTasksClick = async () => {
    setLoading(true);
    setFetchError(null);
    setShowRejectedTable(true);

    try {
      await dispatch(fetchRejectedTasks()).unwrap();
    } catch (err: any) {
      setFetchError(err.message || "Failed to load rejected tasks");
    } finally {
      setLoading(false);
    }
  };
  // Rejected tasks are now fetched from API and stored in selector
  const handleBackToDashboard = () => {
    setShowCompletedTable(false);
    setShowPendingTable(false);
    setShowRejectedTable(false);
    setShowSiteWiseTable(false);
    setLoading(false);
    setFetchError(null);
    dispatch(fetchCustomerAdminDashboard()); // optional: refresh counts
  };

  // compliance Calculation
  const today = new Date();
  const complianceTasks = assignedTasks.filter((task) => {
    if (task.taskCurrentStatus !== "Completed") return false;
    if (!task.dueDate) return false;
    if (!task.details || task.details.length === 0) return false;
    const dueDate = new Date(task.dueDate);
    // last user ki outDate
    const lastDetail = task.details[task.details.length - 1];
    if (!lastDetail.outDate) return false;
    const outDate = new Date(lastDetail.outDate);
    // outDate dueDate ke din ya pehle ho
    return isSameOrBefore(outDate, dueDate);
  });
  const complianceCount = complianceTasks.length;

  // NON-COMPLIANCE COUNT
  const nonComplianceTasks = assignedTasks.filter((task) => {
    if (task.taskCurrentStatus !== "Pending") return false;
    if (!task.dueDate) return false;
    const dueDate = new Date(task.dueDate);
    // dueDate nikal chuki hai
    return today > dueDate;
  });
  const nonComplianceCount = nonComplianceTasks.length;

  // IN-PROGRESS
  const inProgressTasks = assignedTasks.filter((task) => {
    if (task.taskCurrentStatus !== "Pending") return false;
    if (!task.dueDate) return false;

    const dueDate = new Date(task.dueDate);

    // dueDate abhi aani baaki hai
    return today <= dueDate;
  });

  const inProgressCount = inProgressTasks.length;
  const total = complianceCount + nonComplianceCount + inProgressCount;
  const compliancePercent = total
    ? Math.round((complianceCount / total) * 100)
    : 0;
  const nonCompliancePercent = total
    ? Math.round((nonComplianceCount / total) * 100)
    : 0;
  const inProgressPercent = total
    ? Math.round((inProgressCount / total) * 100)
    : 0;

  // Piller chart calculation
  // IMPORTANT: Actual tasks array nikaalo
  const tasks = assignedTasksResponse || [];

  // Act-wise total count calculation (simple)
  const actChartData = React.useMemo(() => {
    const map: Record<string, { actName: string; total: number }> = {};

    tasks.forEach((task: any) => {
      const act = task.actName?.trim() || "Unknown Act";

      if (!map[act]) {
        map[act] = { actName: act, total: 0 };
      }

      map[act].total += 1;
    });

    return Object.values(map);
  }, [tasks]);
  // Max height ke liye sabse zyada tasks wale act ka count

  // Task Movement Dialog
  const handleViewTaskMovement = (task: any) => {
    setSelectedTask(task);
    setTaskMovementDialogOpen(true);
  };

  const handleCloseTaskMovementDialog = () => {
    setTaskMovementDialogOpen(false);
    setSelectedTask(null);
  };

  // Column definitions for CommonDataTable
  const completedTasksColumns: GridColDef[] = useMemo(
    () => [
      {
        field: "sno",
        headerName: "S.No.",
        width: 70,
        sortable: false,
        renderCell: (params) => {
          const page = params.api.state.pagination.paginationModel.page;
          const pageSize = params.api.state.pagination.paginationModel.pageSize;
          const rowIndex = params.api.getRowIndexRelativeToVisibleRows(
            params.id,
          );

          return page * pageSize + rowIndex + 1;
        },
      },
      { field: "siteName", headerName: "Site Name", flex: 1, minWidth: 160 },
      {
        field: "activityName",
        headerName: "Activity Name",
        flex: 1.2,
        minWidth: 400,
      },
      { field: "actName", headerName: "Act Name", flex: 1, minWidth: 180 },
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
              bgcolor: alpha(theme.palette.info.main, 0.1),
              color: theme.palette.info.main,
            }}
          />
        ),
      },
      {
        field: "dueDate",
        headerName: "Due Date",
        flex: 1,
        minWidth: 100,
        renderCell: (params) =>
          params.value ? new Date(params.value).toLocaleDateString() : "-",
      },
      {
        field: "status",
        headerName: "Status",
        flex: 0.8,
        minWidth: 120,
        renderCell: () => (
          <Chip
            label="Completed"
            size="small"
            color="success"
            sx={{ fontWeight: 600 }}
          />
        ),
      },
      {
        field: "actions",
        headerName: "Actions",
        flex: 0.8,
        minWidth: 100,
        sortable: false,
        renderCell: (params) => (
          <Button
            size="small"
            variant="text"
            startIcon={<EyeIcon />}
            onClick={() => handleViewTaskMovement(params.row)}
            sx={{
              color: theme.palette.primary.main,
              textTransform: "none",
              "&:hover": {
                bgcolor: alpha(theme.palette.primary.main, 0.1),
              },
            }}
          ></Button>
        ),
      },
    ],
    [theme],
  );

  const pendingTasksColumns: GridColDef[] = useMemo(
    () => [
      {
        field: "sno",
        headerName: "S.No.",
        width: 70,
        sortable: false,
        renderCell: (params) => {
          const page = params.api.state.pagination.paginationModel.page;
          const pageSize = params.api.state.pagination.paginationModel.pageSize;
          const rowIndex = params.api.getRowIndexRelativeToVisibleRows(
            params.id,
          );

          return page * pageSize + rowIndex + 1;
        },
      },
      { field: "siteName", headerName: "Site Name", flex: 1, minWidth: 160 },
      {
        field: "activityName",
        headerName: "Activity Name",
        flex: 1.2,
        minWidth: 400,
      },
      { field: "actName", headerName: "Act Name", flex: 1, minWidth: 180 },
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
              bgcolor: alpha(theme.palette.info.main, 0.1),
              color: theme.palette.info.main,
            }}
          />
        ),
      },
      {
        field: "dueDate",
        headerName: "Due Date",
        flex: 1,
        minWidth: 100,
        renderCell: (params) =>
          params.value ? new Date(params.value).toLocaleDateString() : "-",
      },
      {
        field: "status",
        headerName: "Status",
        flex: 0.8,
        minWidth: 120,
        renderCell: () => (
          <Chip
            label="Pending"
            size="small"
            color="warning"
            sx={{ fontWeight: 600 }}
          />
        ),
      },
      {
        field: "actions",
        headerName: "Actions",
        flex: 0.8,
        minWidth: 100,
        sortable: false,
        renderCell: (params) => (
          <Button
            size="small"
            variant="text"
            startIcon={<EyeIcon />}
            onClick={() => handleViewTaskMovement(params.row)}
            sx={{
              color: theme.palette.primary.main,
              textTransform: "none",
              "&:hover": {
                bgcolor: alpha(theme.palette.primary.main, 0.1),
              },
            }}
          ></Button>
        ),
      },
    ],
    [theme],
  );

  const rejectedTasksColumns: GridColDef[] = useMemo(
    () => [
      {
        field: "sno",
        headerName: "S.No.",
        width: 70,
        sortable: false,
        renderCell: (params) => {
          const page = params.api.state.pagination.paginationModel.page;
          const pageSize = params.api.state.pagination.paginationModel.pageSize;
          const rowIndex = params.api.getRowIndexRelativeToVisibleRows(
            params.id,
          );

          return page * pageSize + rowIndex + 1;
        },
      },
      { field: "siteName", headerName: "Site Name", flex: 1, minWidth: 160 },
      {
        field: "activityName",
        headerName: "Activity Name",
        flex: 1.2,
        minWidth: 400,
      },
      { field: "actName", headerName: "Act Name", flex: 1, minWidth: 180 },
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
              bgcolor: alpha(theme.palette.info.main, 0.1),
              color: theme.palette.info.main,
            }}
          />
        ),
      },
      {
        field: "dueDate",
        headerName: "Due Date",
        flex: 1,
        minWidth: 100,
        renderCell: (params) =>
          params.value ? new Date(params.value).toLocaleDateString() : "-",
      },
      {
        field: "status",
        headerName: "Status",
        flex: 0.8,
        minWidth: 120,
        renderCell: () => (
          <Chip
            label="Rejected"
            size="small"
            color="error"
            sx={{ fontWeight: 600 }}
          />
        ),
      },
      {
        field: "actions",
        headerName: "Actions",
        flex: 0.8,
        minWidth: 100,
        sortable: false,
        renderCell: (params) => (
          <Button
            size="small"
            variant="text"
            startIcon={<EyeIcon />}
            onClick={() => handleViewTaskMovement(params.row)}
            sx={{
              color: theme.palette.primary.main,
              textTransform: "none",
              "&:hover": {
                bgcolor: alpha(theme.palette.primary.main, 0.1),
              },
            }}
          ></Button>
        ),
      },
    ],
    [theme],
  );

  const stats = [
    {
      label: "Total Users",
      value: dashboardData?.totalUser ?? 0,
      icon: <People />,
      color: theme.palette.primary.main,
      path: "/dashboard/master/customeradminuser",
    },
    {
      label: "Total Sites",
      value: dashboardData?.totalSite ?? 0,
      icon: <Business />,
      color: theme.palette.success.main,
      path: "/dashboard/master/site",
    },
    {
      label: "Total Act",
      value: dashboardData?.totalAct ?? 0,
      icon: <Gavel />,
      color: theme.palette.info.main,
      path: "/dashboard/master/task",
    },
    {
      label: "Total Activity",
      value: dashboardData?.totalActivity ?? 0,
      icon: <ListAlt />,
      color: theme.palette.secondary.main,
      path: "/dashboard/master/customeradminactivity",
    },
    {
      label: "Total Tasks",
      value: dashboardData?.totalTotalTask ?? 0,
      icon: <Assignment />,
      color: theme.palette.primary.main,
      path: "/dashboard/master/task",
    },
    {
      label: "Pending Tasks",
      value: dashboardData?.totalPendigTask ?? 0,
      icon: <HourglassTop />,
      color: theme.palette.warning.main,
      onClick: handlePendingTasksClick,
    },
    {
      label: "Completed Tasks",
      value: dashboardData?.totalCompletedTask ?? 0,
      icon: <CheckCircle />,
      color: theme.palette.success.main,
      onClick: handleCompletedTasksClick,
    },
    {
      label: "Rejected Tasks",
      value: dashboardData?.totalRejectedTask ?? 0,
      icon: <Cancel />,
      color: theme.palette.error.main,
      onClick: handleRejectedTasksClick,
    },
  ];

  useEffect(() => {
    // Prevent double effect execution in StrictMode during development
    if (initializationRef.current) {
      return;
    }
    initializationRef.current = true;
    
    dispatch(fetchCustomerAdminDashboard());
    dispatch(fetchAssignedTasks());
  }, [dispatch]);
  // Main Dashboard View
  if (
    !showCompletedTable &&
    !showPendingTable &&
    !showRejectedTable &&
    !showSiteWiseTable
  ) {
    return (
      <Box>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Customer Admin Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your organization and users
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={3}>
          {stats.map((stat, index) => (
            <Grid key={index} size={{ xs: 12, sm: 6, md: 3 }}>
              <Card
                onClick={() => {
                  if (stat.onClick) stat.onClick();
                  else if (stat.path) navigate(stat.path);
                }}
                sx={{
                  cursor: stat.path || stat.onClick ? "pointer" : "default",
                  borderRadius: 3,
                  boxShadow: `0 4px 20px ${alpha(
                    theme.palette.common.black,
                    0.08,
                  )}`,
                  transition: "transform 0.2s, box-shadow 0.2s",
                  "&:hover":
                    stat.path || stat.onClick
                      ? {
                          transform: "translateY(-4px)",
                          boxShadow: `0 8px 30px ${alpha(
                            theme.palette.common.black,
                            0.12,
                          )}`,
                        }
                      : {},
                }}
              >
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Box
                      sx={{
                        p: 1.5,
                        borderRadius: 2,
                        bgcolor: alpha(stat.color, 0.1),
                        color: stat.color,
                        mr: 2,
                      }}
                    >
                      {stat.icon}
                    </Box>
                    <Box>
                      <Typography variant="h4" fontWeight={700}>
                        {stat.value}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {stat.label}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        {/* Compliance Status Chart */}
        <Grid container spacing={3} sx={{ mt: 4 }}>
          {/* RIGHT CARD – Pillar Chart */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Card
              sx={{
                height: "100%",
                borderRadius: 3,
                boxShadow: `0 4px 20px ${alpha(
                  theme.palette.common.black,
                  0.08,
                )}`,
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mb: 2,
                  }}
                >
                  <Typography variant="h6" fontWeight={700}>
                    Compliance Status
                  </Typography>

                  <IconButton size="small">
                    <FilterListIcon fontSize="small" />
                  </IconButton>
                </Box>
                {/* Compliance */}
                <Typography variant="body2" fontWeight={600} gutterBottom>
                  Compliance
                </Typography>
                <Box sx={{ position: "relative", mb: 2 }}>
                  <LinearProgress
                    variant="determinate"
                    value={compliancePercent}
                    sx={{
                      height: 26,
                      borderRadius: 8,
                      backgroundColor: alpha(theme.palette.success.main, 0.15),
                      "& .MuiLinearProgress-bar": {
                        backgroundColor: theme.palette.success.main,
                      },
                    }}
                  />
                  <Typography
                    sx={{
                      position: "absolute",
                      right: 8,
                      top: "50%",
                      transform: "translateY(-50%)",
                      fontSize: 12,
                      fontWeight: 700,
                      color: "#fff",
                    }}
                  >
                    {compliancePercent}%
                  </Typography>
                </Box>

                {/* Non Compliance */}
                <Typography variant="body2" fontWeight={600} gutterBottom>
                  Non Compliance
                </Typography>
                <Box sx={{ position: "relative", mb: 2 }}>
                  <LinearProgress
                    variant="determinate"
                    value={nonCompliancePercent}
                    sx={{
                      height: 26,
                      borderRadius: 8,
                      backgroundColor: alpha(theme.palette.error.main, 0.15),
                      "& .MuiLinearProgress-bar": {
                        backgroundColor: theme.palette.error.main,
                      },
                    }}
                  />
                  <Typography
                    sx={{
                      position: "absolute",
                      right: 8,
                      top: "50%",
                      transform: "translateY(-50%)",
                      fontSize: 12,
                      fontWeight: 700,
                      color: "#fff",
                    }}
                  >
                    {nonCompliancePercent}%
                  </Typography>
                </Box>

                {/* In Progress */}
                <Typography variant="body2" fontWeight={600} gutterBottom>
                  In Progress
                </Typography>
                <Box sx={{ position: "relative" }}>
                  <LinearProgress
                    variant="determinate"
                    value={inProgressPercent}
                    sx={{
                      height: 26,
                      borderRadius: 8,
                      backgroundColor: alpha(theme.palette.warning.main, 0.15),
                      "& .MuiLinearProgress-bar": {
                        backgroundColor: theme.palette.warning.main,
                      },
                    }}
                  />
                  <Typography
                    sx={{
                      position: "absolute",
                      right: 8,
                      top: "50%",
                      transform: "translateY(-50%)",
                      fontSize: 12,
                      fontWeight: 700,
                      color: "#fff",
                    }}
                  >
                    {inProgressPercent}%
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          {/* Site Map */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Card
              sx={{
                height: "100%",
                borderRadius: 3,
                overflow: "hidden",
                boxShadow: `0 4px 20px ${alpha(
                  theme.palette.common.black,
                  0.08,
                )}`,
              }}
            >
              <CardContent sx={{ p: 0, height: 500 }}>
                <SiteMap
                  height={500}
                  onMarkerClick={(siteId) => {
                    dispatch(fetchsiteWiseTasks(siteId));
                    setShowSiteWiseTable(true);
                  }}
                />
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Bar chart act wise */}
        <Grid container spacing={3} sx={{ mt: 4 }}>
          {/* RIGHT CARD – Pillar Chart */}
          <Grid size={{ xs: 12, md: 12 }}>
            <Card
              sx={{
                height: "100%",
                borderRadius: 3,
                backgroundColor: "#ffffff",
                boxShadow: `0 4px 20px ${alpha(
                  theme.palette.common.black,
                  0.08,
                )}`,
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight={700} gutterBottom>
                  Act Wise
                </Typography>

                {actChartData.length === 0 ? (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      height: 280,
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      No data available
                    </Typography>
                  </Box>
                ) : (
                  <ResponsiveContainer width="100%" height={480}>
                    <BarChart
                      data={actChartData}
                      margin={{ top: 30, right: 30, left: 0, bottom: 5 }}
                    >
                      <CartesianGrid
                        strokeDasharray="0"
                        stroke={alpha(theme.palette.divider, 0.2)}
                        vertical={false}
                      />
                      <XAxis
                        dataKey="actName"
                        tick={{
                          fontSize: 11,
                          fill: theme.palette.text.secondary,
                        }}
                        // axisLine={{ stroke: theme.palette.divider }}
                        angle={30}
                        textAnchor="start"
                        height={80}
                        axisLine={{ stroke: theme.palette.divider }}
                      />
                      <YAxis
                        tick={{
                          fontSize: 11,
                          fill: theme.palette.text.secondary,
                        }}
                        axisLine={{ stroke: theme.palette.divider }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: alpha(
                            theme.palette.background.paper,
                            0.95,
                          ),
                          border: `1px solid ${theme.palette.divider}`,
                          borderRadius: "8px",
                          boxShadow: theme.shadows[3],
                        }}
                        labelStyle={{ color: theme.palette.text.primary }}
                        cursor={{
                          fill: alpha(theme.palette.primary.main, 0.05),
                        }}
                        formatter={(value, _name, props) => [
                          `${value} Tasks`,
                          props.payload.actName,
                        ]}
                      />
                      <Bar
                        dataKey="total"
                        fill="#ff9800"
                        radius={[12, 12, 0, 0]}
                        isAnimationActive={true}
                      >
                        {/* <LabelList
                          dataKey="actName"
                          position="center"
                          fill="#fff"
                          fontSize={10}
                          fontWeight={600}
                          angle={-90}
                          textAnchor="middle"
                        /> */}
                        <LabelList
                          dataKey="total"
                          position="top"
                          fill={theme.palette.text.primary}
                          fontSize={12}
                          fontWeight={600}
                        />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    );
  }

  // COMPLETED TASKS TABLE VIEW
  if (showCompletedTable) {
    return (
      <Box>
        <Box
          sx={{
            mb: 3,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <Box>
            <Typography variant="h4" fontWeight={700} gutterBottom>
              Completed Tasks
            </Typography>
            <Typography variant="body1" color="text.secondary">
              View all completed tasks
            </Typography>
          </Box>
          <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                views={["year", "month"]}
                label="Select Month"
                value={dayjs()}
                // onChange={(newValue) => {
                //   if (newValue) {
                //     setCurrentMonth(newValue.toDate());
                //   }
                // }}
                slotProps={{
                  textField: {
                    size: "small",
                  },
                }}
              />
            </LocalizationProvider>
            <Button
              variant="contained"
              startIcon={<ArrowBackIcon />}
              onClick={handleBackToDashboard}
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
              Back
            </Button>
          </Box>
        </Box>

        <Paper
          sx={{
            borderRadius: 3,
            boxShadow: `0 4px 20px ${alpha(theme.palette.common.black, 0.08)}`,
            overflow: "hidden",
          }}
        >
          {fetchError ? (
            <Box sx={{ p: 4 }}>
              <Alert severity="error">{fetchError}</Alert>
            </Box>
          ) : completedTasks.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 12 }}>
              <CheckCircle
                sx={{ fontSize: 80, color: "text.disabled", mb: 2 }}
              />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No completed tasks
              </Typography>
              <Typography variant="body2" color="text.secondary">
                There are no completed tasks available
              </Typography>
            </Box>
          ) : (
            <CommonDataTable
              rows={completedTasks}
              columns={completedTasksColumns}
              loading={loading}
              getRowId={(row) => row.tblId}
              autoHeight={true}
            />
          )}
        </Paper>
        {/* Task Movement Dialog */}
        <TaskMovementDialog
          open={taskMovementDialogOpen}
          onClose={handleCloseTaskMovementDialog}
          task={selectedTask}
        />
      </Box>
    );
  }

  // PENDING TASKS TABLE VIEW
  if (showPendingTable) {
    return (
      <Box>
        <Box
          sx={{
            mb: 3,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <Box>
            <Typography variant="h4" fontWeight={700} gutterBottom>
              Pending Tasks
            </Typography>
            <Typography variant="body1" color="text.secondary">
              View all pending tasks
            </Typography>
          </Box>
          <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                views={["year", "month"]}
                label="Select Month"
                value={dayjs()}
                // onChange={(newValue) => {
                //   if (newValue) {
                //     setCurrentMonth(newValue.toDate());
                //   }
                // }}
                slotProps={{
                  textField: {
                    size: "small",
                  },
                }}
              />
            </LocalizationProvider>

            <Button
              variant="contained"
              startIcon={<ArrowBackIcon />}
              onClick={handleBackToDashboard}
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
              Back
            </Button>
          </Box>
        </Box>

        <Paper
          sx={{
            borderRadius: 3,
            boxShadow: `0 4px 20px ${alpha(theme.palette.common.black, 0.08)}`,
            overflow: "hidden",
          }}
        >
          {fetchError ? (
            <Box sx={{ p: 4 }}>
              <Alert severity="error">{fetchError}</Alert>
            </Box>
          ) : pendingTasks.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 12 }}>
              <HourglassTop
                sx={{ fontSize: 80, color: "text.disabled", mb: 2 }}
              />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No pending tasks
              </Typography>
              <Typography variant="body2" color="text.secondary">
                There are no pending tasks available
              </Typography>
            </Box>
          ) : (
            <CommonDataTable
              rows={pendingTasks}
              columns={pendingTasksColumns}
              loading={loading}
              getRowId={(row) => row.tblId}
              autoHeight={true}
            />
          )}
        </Paper>
        {/* Task Movement Dialog */}
        <TaskMovementDialog
          open={taskMovementDialogOpen}
          onClose={handleCloseTaskMovementDialog}
          task={selectedTask}
        />
      </Box>
    );
  }

  // REJECTED TASKS TABLE VIEW
  if (showRejectedTable) {
    return (
      <Box>
        <Box
          sx={{
            mb: 3,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <Box>
            <Typography variant="h4" fontWeight={700} gutterBottom>
              Rejected Tasks
            </Typography>
            <Typography variant="body1" color="text.secondary">
              View all rejected tasks
            </Typography>
          </Box>
          <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                views={["year", "month"]}
                label="Select Month"
                value={dayjs()}
                // onChange={(newValue) => {
                //   if (newValue) {
                //     setCurrentMonth(newValue.toDate());
                //   }
                // }}
                slotProps={{
                  textField: {
                    size: "small",
                  },
                }}
              />
            </LocalizationProvider>

            <Button
              variant="contained"
              startIcon={<ArrowBackIcon />}
              onClick={handleBackToDashboard}
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
              Back
            </Button>
          </Box>
        </Box>

        <Paper
          sx={{
            borderRadius: 3,
            boxShadow: `0 4px 20px ${alpha(theme.palette.common.black, 0.08)}`,
            overflow: "hidden",
          }}
        >
          {fetchError ? (
            <Box sx={{ p: 4 }}>
              <Alert severity="error">{fetchError}</Alert>
            </Box>
          ) : rejectedTasks.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 12 }}>
              <Cancel sx={{ fontSize: 80, color: "text.disabled", mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No rejected tasks
              </Typography>
              <Typography variant="body2" color="text.secondary">
                There are no rejected tasks available
              </Typography>
            </Box>
          ) : (
            <CommonDataTable
              rows={rejectedTasks}
              columns={rejectedTasksColumns}
              loading={loading}
              getRowId={(row) => row.tblId}
              autoHeight={true}
            />
          )}
        </Paper>
        {/* Task Movement Dialog */}
        <TaskMovementDialog
          open={taskMovementDialogOpen}
          onClose={handleCloseTaskMovementDialog}
          task={selectedTask}
        />
      </Box>
    );
  }
  return null;
};

export default CustomerAdminDashboard;
