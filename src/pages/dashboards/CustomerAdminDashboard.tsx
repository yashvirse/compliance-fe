import React, { useEffect, useState, useMemo } from "react";
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
  Popover,
} from "@mui/material";
import type { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
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
  selectCustomerAdminDashboardData,
  selectCustomerAdminError,
  selectSiteWiseTasks,
} from "./customeradminslice/CustomerAdmin.selector"; // सिर्फ़ ये वाले selectors
import {
  fetchAssignedTasks,
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
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

const CustomerAdminDashboard: React.FC = () => {
  const theme = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const error = useSelector(selectCustomerAdminError);
  const dashboardData = useSelector(selectCustomerAdminDashboardData);
  const assignedTasks = useSelector(selectAssignedTasks);
  const siteWiseTasks = useSelector(selectSiteWiseTasks);
  const isSameOrBefore = (d1: Date, d2: Date) => d1.getTime() <= d2.getTime();
  const assignedTasksResponse = useSelector(selectAssignedTasks);

  // Prevent double API calls in StrictMode (React 18+ development)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const open = Boolean(anchorEl);

  const [showSiteWiseTable, setShowSiteWiseTable] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [taskMovementDialogOpen, setTaskMovementDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any | null>(null);

  // Rejected tasks are now fetched from API and stored in selector
  const handleBackToDashboard = () => {
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

  const actChartData = React.useMemo(() => {
    const map: Record<
      string,
      {
        actName: string;
        total: number;
        pending: number;
        completed: number;
        rejected: number;
      }
    > = {};

    tasks.forEach((task: any) => {
      const act = task.actName?.trim() || "Unknown Act";
      const status = task.taskCurrentStatus;

      if (!map[act]) {
        map[act] = {
          actName: act,
          total: 0,
          pending: 0,
          completed: 0,
          rejected: 0,
        };
      }

      map[act].total += 1;

      if (status === "Pending") map[act].pending += 1;
      else if (status === "Completed") map[act].completed += 1;
      else if (status === "Rejected") map[act].rejected += 1;
    });

    return Object.values(map);
  }, [tasks]);
  const ColorDot = ({ color }: { color: string }) => (
    <Box
      sx={{
        width: 10,
        height: 10,
        backgroundColor: color,
        display: "inline-block",
        mr: 0.8,
        borderRadius: "2px", // square look
      }}
    />
  );
  // Max height ke liye sabse zyada tasks wale act ka count
  const ActWiseTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;

      return (
        <Box
          sx={{
            backgroundColor: "#fff",
            p: 1.5,
            borderRadius: 2,
            boxShadow: 3,
            border: "1px solid #e0e0e0",
            minWidth: 200,
          }}
        >
          <Typography fontWeight={700} fontSize={13}>
            {data.actName}
          </Typography>

          <Typography fontSize={12} sx={{ mt: 0.5 }}>
            Total Tasks: <b>{data.total}</b>
          </Typography>

          <Typography
            fontSize={12}
            color="warning.main"
            sx={{ display: "flex", alignItems: "center" }}
          >
            <ColorDot color="#ff9800" />
            Pending: {data.pending}
          </Typography>

          <Typography
            fontSize={12}
            color="success.main"
            sx={{ display: "flex", alignItems: "center" }}
          >
            <ColorDot color="#4caf50" />
            Completed: {data.completed}
          </Typography>

          <Typography
            fontSize={12}
            color="error.main"
            sx={{ display: "flex", alignItems: "center" }}
          >
            <ColorDot color="#f44336" />
            Rejected: {data.rejected}
          </Typography>
        </Box>
      );
    }

    return null;
  };

  // Task Movement Dialog
  const handleViewTaskMovement = (tblId: string) => {
    setSelectedTask(tblId);
    setTaskMovementDialogOpen(true);
  };

  const handleCloseTaskMovementDialog = () => {
    setTaskMovementDialogOpen(false);
    setSelectedTask(null);
  };
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
  // Column definitions for CommonDataTable
  const siteWiseTasksColumns: GridColDef[] = useMemo(
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
              bgcolor: alpha(theme.palette.info.main, 0.1),
              color: theme.palette.info.main,
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
        minWidth: 100,
        renderCell: (params) =>
          params.value ? new Date(params.value).toLocaleDateString() : "-",
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
            onClick={() => handleViewTaskMovement(params.row.tblId)}
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
  useEffect(() => {
    dispatch(fetchCustomerAdminDashboard());
  }, [dispatch]);

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
      onClick: () =>
        navigate("/dashboard/master/task", { state: { status: "Pending" } }),
    },
    {
      label: "Pending Tasks",
      value: dashboardData?.totalPendigTask ?? 0,
      icon: <HourglassTop />,
      color: theme.palette.warning.main,
      onClick: () =>
        navigate("/dashboard/master/task", { state: { status: "Pending" } }),
    },
    {
      label: "Completed Tasks",
      value: dashboardData?.totalCompletedTask ?? 0,
      icon: <CheckCircle />,
      color: theme.palette.success.main,
      onClick: () =>
        navigate("/dashboard/master/task", { state: { status: "Completed" } }),
    },
    {
      label: "Rejected Tasks",
      value: dashboardData?.totalRejectedTask ?? 0,
      icon: <Cancel />,
      color: theme.palette.error.main,
      onClick: () =>
        navigate("/dashboard/master/task", { state: { status: "Rejected" } }),
    },
  ];
  const getMonthLastDateISO = (date: Date) => {
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    return lastDay.toISOString();
  };

  useEffect(() => {
    const fromDate = getMonthLastDateISO(currentMonth);

    dispatch(
      fetchAssignedTasks({
        fromDate,
      }),
    );
  }, [dispatch, currentMonth]);
  // Main Dashboard View
  if (!showSiteWiseTable) {
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

                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography variant="body2" fontWeight={600}>
                      {dayjs(currentMonth).format("MMM YYYY")}
                    </Typography>

                    <IconButton
                      size="small"
                      onClick={(e) => setAnchorEl(e.currentTarget)}
                    >
                      <CalendarMonthIcon fontSize="small" />
                    </IconButton>
                  </Box>

                  {/* Month Picker Popup */}
                  <Popover
                    open={open}
                    anchorEl={anchorEl}
                    onClose={() => setAnchorEl(null)}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "right",
                    }}
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                  >
                    <Box sx={{ p: 2 }}>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          views={["year", "month"]}
                          value={dayjs(currentMonth)}
                          onChange={(newValue) => {
                            if (newValue) {
                              setCurrentMonth(newValue.toDate());
                              setAnchorEl(null); // select ke baad close
                            }
                          }}
                          slotProps={{
                            textField: {
                              size: "small",
                              fullWidth: true,
                            },
                          }}
                        />
                      </LocalizationProvider>
                    </Box>
                  </Popover>
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
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mb: 2,
                  }}
                >
                  {/* LEFT CORNER */}
                  <Typography variant="h6" fontWeight={700}>
                    Act Wise
                  </Typography>

                  {/* RIGHT CORNER */}
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography variant="body2" fontWeight={600}>
                      {dayjs(currentMonth).format("MMM YYYY")}
                    </Typography>

                    <IconButton
                      size="small"
                      onClick={(e) => setAnchorEl(e.currentTarget)}
                    >
                      <CalendarMonthIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>

                {/* Month Picker Popup */}
                <Popover
                  open={open}
                  anchorEl={anchorEl}
                  onClose={() => setAnchorEl(null)}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                >
                  <Box sx={{ p: 2 }}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        views={["year", "month"]}
                        value={dayjs(currentMonth)}
                        onChange={(newValue) => {
                          if (newValue) {
                            setCurrentMonth(newValue.toDate());
                            setAnchorEl(null);
                          }
                        }}
                        slotProps={{
                          textField: {
                            size: "small",
                            fullWidth: true,
                          },
                        }}
                      />
                    </LocalizationProvider>
                  </Box>
                </Popover>

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
                        content={<ActWiseTooltip />}
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
                      <Bar dataKey="pending" stackId="a" fill="#ff9800" />
                      <Bar dataKey="completed" stackId="a" fill="#4caf50" />
                      <Bar dataKey="rejected" stackId="a" fill="#f44336">
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

  if (showSiteWiseTable) {
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
              Site Wise Tasks
            </Typography>
            <Typography variant="body1" color="text.secondary">
              View all site wise tasks
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
          ) : selectSiteWiseTasks.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 12 }}>
              <CheckCircle
                sx={{ fontSize: 80, color: "text.disabled", mb: 2 }}
              />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No site wise tasks
              </Typography>
              <Typography variant="body2" color="text.secondary">
                There are no site wise tasks available
              </Typography>
            </Box>
          ) : (
            <CommonDataTable
              rows={siteWiseTasks}
              columns={siteWiseTasksColumns}
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
          tblId={selectedTask}
        />
      </Box>
    );
  }
};

export default CustomerAdminDashboard;
