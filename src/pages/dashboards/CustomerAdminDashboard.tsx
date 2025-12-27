import React, { useEffect, useState } from "react";
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
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  Button,
  CircularProgress,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  Assignment,
  Business,
  Cancel,
  CheckCircle,
  Gavel,
  HourglassTop,
  ListAlt,
  People,
  Settings,
  Close as CloseIcon,
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
  selectCompletedTasks,
  selectCustomerAdminDashboardData,
  selectCustomerAdminError,
  selectSiteWiseTasks,
} from "./customeradminslice/CustomerAdmin.selector"; // सिर्फ़ ये वाले selectors
import {
  fetchAssignedTasks,
  fetchCompletedTasks,
  fetchCustomerAdminDashboard,
  fetchsiteWiseTasks,
} from "./customeradminslice/CustomerAdmin.slice";
import { useNavigate } from "react-router-dom";
import SiteMap from "../../components/SiteMap";

const CustomerAdminDashboard: React.FC = () => {
  const theme = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const error = useSelector(selectCustomerAdminError);
  const dashboardData = useSelector(selectCustomerAdminDashboardData);
  const completedTasks = useSelector(selectCompletedTasks);
  const assignedTasks = useSelector(selectAssignedTasks);
  const isSameOrBefore = (d1: Date, d2: Date) => d1.getTime() <= d2.getTime();
  const assignedTasksResponse = useSelector(selectAssignedTasks);
  const siteWiseTasks = useSelector(selectSiteWiseTasks);
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
      await dispatch(fetchAssignedTasks()).unwrap();
    } catch (err: any) {
      setFetchError(err.message || "Failed to load completed tasks");
    } finally {
      setLoading(false);
    }
  };
  const pendingTasks = assignedTasks.filter(
    (task) => task.taskCurrentStatus === "Pending"
  );
  const handleRejectedTasksClick = async () => {
    setLoading(true);
    setFetchError(null);
    setShowRejectedTable(true);

    try {
      await dispatch(fetchAssignedTasks()).unwrap();
    } catch (err: any) {
      setFetchError(err.message || "Failed to load completed tasks");
    } finally {
      setLoading(false);
    }
  };
  const rejectedTasks = assignedTasks.filter(
    (task) => task.taskCurrentStatus === "Rejected"
  );
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

  // Task movement Deatils
  const handleViewTaskMovement = (task: any) => {
    setSelectedTask(task);
    setTaskMovementDialogOpen(true);
  };

  const handleCloseTaskMovementDialog = () => {
    setTaskMovementDialogOpen(false);
    setSelectedTask(null);
  };
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
      path: "/dashboard/master/customeradminactivity",
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
                    0.08
                  )}`,
                  transition: "transform 0.2s, box-shadow 0.2s",
                  "&:hover":
                    stat.path || stat.onClick
                      ? {
                          transform: "translateY(-4px)",
                          boxShadow: `0 8px 30px ${alpha(
                            theme.palette.common.black,
                            0.12
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
                  0.08
                )}`,
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h6" fontWeight={700} gutterBottom>
                  Compliance Status
                </Typography>

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
                  0.08
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
                  0.08
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
                  <ResponsiveContainer width="100%" height={380}>
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
                            0.95
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

        <Card
          sx={{
            mt: 3,
            borderRadius: 3,
            boxShadow: `0 4px 20px ${alpha(theme.palette.common.black, 0.08)}`,
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
              <Settings
                sx={{ fontSize: 40, color: theme.palette.primary.main, mr: 2 }}
              />
              <Box>
                <Typography variant="h6" fontWeight={600}>
                  Customer Admin Role
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Organization management capabilities
                </Typography>
              </Box>
            </Box>
            <Typography variant="body1" paragraph>
              Manage your company's users, configure settings, and access
              organizational reports.
            </Typography>
            <Typography variant="body2" color="text.secondary">
              • Manage company users
              <br />
              • Configure company settings
              <br />• View company reports
            </Typography>
          </CardContent>
        </Card>
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
          <Button
            variant="outlined"
            startIcon={<CloseIcon />}
            onClick={handleBackToDashboard}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 600,
              px: 3,
            }}
          >
            Back to Dashboard
          </Button>
        </Box>

        <Paper
          sx={{
            borderRadius: 3,
            boxShadow: `0 4px 20px ${alpha(theme.palette.common.black, 0.08)}`,
            overflow: "hidden",
          }}
        >
          {loading ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: 400,
                flexDirection: "column",
                gap: 2,
              }}
            >
              <CircularProgress size={50} />
              <Typography variant="body1" color="text.secondary">
                Loading completed tasks...
              </Typography>
            </Box>
          ) : fetchError ? (
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
            <TableContainer sx={{ overflowX: "auto" }}>
              <Table sx={{ minWidth: 1400 }}>
                <TableHead>
                  <TableRow
                    sx={{ bgcolor: alpha(theme.palette.success.main, 0.05) }}
                  >
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight={600}>
                        Activity Name
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight={600}>
                        Act Name
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight={600}>
                        Department
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight={600}>
                        Site Name
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight={600}>
                        Due Date
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight={600}>
                        Maker
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight={600}>
                        Checker
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight={600}>
                        Reviewer
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight={600}>
                        Auditor
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight={600}>
                        Status
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="subtitle2" fontWeight={600}>
                        Actions
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {completedTasks.map((task, index) => (
                    <TableRow key={task.tblId || index} hover>
                      <TableCell>
                        <Typography variant="body2" fontWeight={500}>
                          {task.activityName}
                        </Typography>
                        {task.description && (
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ display: "block", mt: 0.5 }}
                          >
                            {task.description}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{task.actName}</Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={task.departmentName}
                          size="small"
                          sx={{
                            bgcolor: alpha(theme.palette.info.main, 0.1),
                            color: theme.palette.info.main,
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight={500}>
                          {task.siteName || "-"}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {task.dueDate
                            ? new Date(task.dueDate).toLocaleDateString()
                            : "-"}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight={500}>
                          {task.maker || "-"}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight={500}>
                          {task.checker || "-"}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight={500}>
                          {task.reviewer || "-"}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight={500}>
                          {task.auditer || "-"}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label="Completed"
                          size="small"
                          color="success"
                          sx={{ fontWeight: 600 }}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Button
                          size="small"
                          variant="text"
                          startIcon={<EyeIcon />}
                          onClick={() => handleViewTaskMovement(task)}
                          sx={{
                            color: theme.palette.primary.main,
                            textTransform: "none",
                            "&:hover": {
                              bgcolor: alpha(theme.palette.primary.main, 0.1),
                            },
                          }}
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
        {/* Task Movement Dialog */}
        <Dialog
          open={taskMovementDialogOpen}
          onClose={handleCloseTaskMovementDialog}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle sx={{ fontWeight: 600, fontSize: "1.3rem", pb: 1 }}>
            Task Movement Details
          </DialogTitle>
          <DialogContent sx={{ py: 2 }}>
            {selectedTask && (
              <Box>
                <Box
                  sx={{
                    mb: 3,
                    p: 2,
                    bgcolor: alpha(theme.palette.primary.main, 0.05),
                    borderRadius: 2,
                  }}
                >
                  <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                    Activity Information
                  </Typography>
                  <Grid container spacing={2} sx={{ mt: 0.5 }}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        display="block"
                      >
                        Activity Name
                      </Typography>
                      <Typography variant="body2" fontWeight={500}>
                        {selectedTask.activityName}
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        display="block"
                      >
                        Act Name
                      </Typography>
                      <Typography variant="body2" fontWeight={500}>
                        {selectedTask.actName}
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        display="block"
                      >
                        Department
                      </Typography>
                      <Typography variant="body2" fontWeight={500}>
                        {selectedTask.departmentName}
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        display="block"
                      >
                        Due Date
                      </Typography>
                      <Typography variant="body2" fontWeight={500}>
                        {selectedTask.dueDate
                          ? new Date(selectedTask.dueDate).toLocaleDateString()
                          : "-"}
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        display="block"
                      >
                        Site Name
                      </Typography>
                      <Typography variant="body2" fontWeight={500}>
                        {selectedTask.siteName || "-"}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>

                <Typography
                  variant="subtitle2"
                  fontWeight={600}
                  gutterBottom
                  sx={{ mt: 3, mb: 2 }}
                >
                  Task Movement History
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {selectedTask.details && selectedTask.details.length > 0 ? (
                    selectedTask.details.map((detail: any, index: number) => (
                      <Box
                        key={index}
                        sx={{
                          p: 2,
                          border: `1px solid ${theme.palette.divider}`,
                          borderRadius: 2,
                          bgcolor: alpha(
                            detail.status === "Approved"
                              ? theme.palette.success.main
                              : detail.status === "Rejected"
                              ? theme.palette.error.main
                              : theme.palette.warning.main,
                            0.05
                          ),
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "start",
                            mb: 1,
                          }}
                        >
                          <Box>
                            <Typography variant="subtitle2" fontWeight={600}>
                              {detail.userName}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {index === 0
                                ? "Maker"
                                : index === 1
                                ? "Checker"
                                : "Reviewer"}
                            </Typography>
                          </Box>
                          <Chip
                            label={detail.status}
                            size="small"
                            color={
                              detail.status === "Approved"
                                ? "success"
                                : detail.status === "Rejected"
                                ? "error"
                                : "warning"
                            }
                            variant="outlined"
                            sx={{ fontWeight: 600 }}
                          />
                        </Box>

                        <Box
                          sx={{
                            display: "grid",
                            gridTemplateColumns:
                              "repeat(auto-fit, minmax(150px, 1fr))",
                            gap: 2,
                            my: 2,
                          }}
                        >
                          <Box>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              display="block"
                              sx={{ mb: 0.5 }}
                            >
                              In Date
                            </Typography>
                            <Typography variant="body2" fontWeight={500}>
                              {detail.inDate &&
                              detail.inDate !== "0001-01-01T00:00:00Z"
                                ? new Date(detail.inDate).toLocaleDateString()
                                : "-"}
                            </Typography>
                          </Box>
                          <Box>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              display="block"
                              sx={{ mb: 0.5 }}
                            >
                              Out Date
                            </Typography>
                            <Typography variant="body2" fontWeight={500}>
                              {detail.outDate &&
                              detail.outDate !== "0001-01-01T00:00:00Z"
                                ? new Date(detail.outDate).toLocaleDateString()
                                : "-"}
                            </Typography>
                          </Box>
                          <Box>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              display="block"
                              sx={{ mb: 0.5 }}
                            >
                              P.TAT (Days)
                            </Typography>
                            <Typography variant="body2" fontWeight={500}>
                              {detail.pTat || 0}
                            </Typography>
                          </Box>
                          <Box>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              display="block"
                              sx={{ mb: 0.5 }}
                            >
                              A.TAT (Days)
                            </Typography>
                            <Typography variant="body2" fontWeight={500}>
                              {detail.aTat || 0}
                            </Typography>
                          </Box>
                        </Box>

                        {detail.remarks && (
                          <Box
                            sx={{
                              mt: 2,
                              pt: 2,
                              borderTop: `1px solid ${theme.palette.divider}`,
                            }}
                          >
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              display="block"
                              sx={{ mb: 0.5 }}
                            >
                              Remarks
                            </Typography>
                            <Typography variant="body2">
                              {detail.remarks}
                            </Typography>
                          </Box>
                        )}

                        {detail.rejectionRemark && (
                          <Box
                            sx={{
                              mt: 2,
                              pt: 2,
                              borderTop: `1px solid ${theme.palette.divider}`,
                            }}
                          >
                            <Typography
                              variant="caption"
                              color="error"
                              display="block"
                              sx={{ mb: 0.5, fontWeight: 600 }}
                            >
                              Rejection Remark
                            </Typography>
                            <Typography variant="body2" color="error">
                              {detail.rejectionRemark}
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    ))
                  ) : (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ textAlign: "center", py: 4 }}
                    >
                      No movement details available
                    </Typography>
                  )}
                </Box>
              </Box>
            )}
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={handleCloseTaskMovementDialog} variant="contained">
              Close
            </Button>
          </DialogActions>
        </Dialog>
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
          <Button
            variant="outlined"
            startIcon={<CloseIcon />}
            onClick={handleBackToDashboard}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 600,
              px: 3,
            }}
          >
            Back to Dashboard
          </Button>
        </Box>

        <Paper
          sx={{
            borderRadius: 3,
            boxShadow: `0 4px 20px ${alpha(theme.palette.common.black, 0.08)}`,
            overflow: "hidden",
          }}
        >
          {loading ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: 400,
                flexDirection: "column",
                gap: 2,
              }}
            >
              <CircularProgress size={50} />
              <Typography variant="body1" color="text.secondary">
                Loading pending tasks...
              </Typography>
            </Box>
          ) : fetchError ? (
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
            <TableContainer sx={{ overflowX: "auto" }}>
              <Table sx={{ minWidth: 1400 }}>
                <TableHead>
                  <TableRow
                    sx={{ bgcolor: alpha(theme.palette.warning.main, 0.05) }}
                  >
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight={600}>
                        Activity Name
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight={600}>
                        Act Name
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight={600}>
                        Department
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight={600}>
                        Site Name
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight={600}>
                        Due Date
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight={600}>
                        Maker
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight={600}>
                        Checker
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight={600}>
                        Reviewer
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight={600}>
                        Auditor
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight={600}>
                        Status
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="subtitle2" fontWeight={600}>
                        Actions
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {pendingTasks.map((task, index) => (
                    <TableRow key={task.tblId || index} hover>
                      <TableCell>
                        <Typography variant="body2" fontWeight={500}>
                          {task.activityName}
                        </Typography>
                        {task.description && (
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ display: "block", mt: 0.5 }}
                          >
                            {task.description}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{task.actName}</Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={task.departmentName}
                          size="small"
                          sx={{
                            bgcolor: alpha(theme.palette.info.main, 0.1),
                            color: theme.palette.info.main,
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight={500}>
                          {task.siteName || "-"}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {task.dueDate
                            ? new Date(task.dueDate).toLocaleDateString()
                            : "-"}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight={500}>
                          {task.maker || "-"}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight={500}>
                          {task.checker || "-"}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight={500}>
                          {task.reviewer || "-"}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight={500}>
                          {task.auditer || "-"}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label="Pending"
                          size="small"
                          color="warning"
                          sx={{ fontWeight: 600 }}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Button
                          size="small"
                          variant="text"
                          startIcon={<EyeIcon />}
                          onClick={() => handleViewTaskMovement(task)}
                          sx={{
                            color: theme.palette.primary.main,
                            textTransform: "none",
                            "&:hover": {
                              bgcolor: alpha(theme.palette.primary.main, 0.1),
                            },
                          }}
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
        {/* Task Movement Dialog */}
        <Dialog
          open={taskMovementDialogOpen}
          onClose={handleCloseTaskMovementDialog}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle sx={{ fontWeight: 600, fontSize: "1.3rem", pb: 1 }}>
            Task Movement Details
          </DialogTitle>
          <DialogContent sx={{ py: 2 }}>
            {selectedTask && (
              <Box>
                <Box
                  sx={{
                    mb: 3,
                    p: 2,
                    bgcolor: alpha(theme.palette.primary.main, 0.05),
                    borderRadius: 2,
                  }}
                >
                  <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                    Activity Information
                  </Typography>
                  <Grid container spacing={2} sx={{ mt: 0.5 }}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        display="block"
                      >
                        Activity Name
                      </Typography>
                      <Typography variant="body2" fontWeight={500}>
                        {selectedTask.activityName}
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        display="block"
                      >
                        Act Name
                      </Typography>
                      <Typography variant="body2" fontWeight={500}>
                        {selectedTask.actName}
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        display="block"
                      >
                        Department
                      </Typography>
                      <Typography variant="body2" fontWeight={500}>
                        {selectedTask.departmentName}
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        display="block"
                      >
                        Due Date
                      </Typography>
                      <Typography variant="body2" fontWeight={500}>
                        {selectedTask.dueDate
                          ? new Date(selectedTask.dueDate).toLocaleDateString()
                          : "-"}
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        display="block"
                      >
                        Site Name
                      </Typography>
                      <Typography variant="body2" fontWeight={500}>
                        {selectedTask.siteName || "-"}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>

                <Typography
                  variant="subtitle2"
                  fontWeight={600}
                  gutterBottom
                  sx={{ mt: 3, mb: 2 }}
                >
                  Task Movement History
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {selectedTask.details && selectedTask.details.length > 0 ? (
                    selectedTask.details.map((detail: any, index: number) => (
                      <Box
                        key={index}
                        sx={{
                          p: 2,
                          border: `1px solid ${theme.palette.divider}`,
                          borderRadius: 2,
                          bgcolor: alpha(
                            detail.status === "Approved"
                              ? theme.palette.success.main
                              : detail.status === "Pending"
                              ? theme.palette.warning.main
                              : detail.status === "Rejected"
                              ? theme.palette.error.main
                              : theme.palette.warning.main,
                            0.05
                          ),
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "start",
                            mb: 1,
                          }}
                        >
                          <Box>
                            <Typography variant="subtitle2" fontWeight={600}>
                              {detail.userName}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {index === 0
                                ? "Maker"
                                : index === 1
                                ? "Checker"
                                : "Reviewer"}
                            </Typography>
                          </Box>
                          <Chip
                            label={detail.status}
                            size="small"
                            color={
                              detail.status === "Approved"
                                ? "success"
                                : detail.status === "Rejected"
                                ? "error"
                                : "warning"
                            }
                            variant="outlined"
                            sx={{ fontWeight: 600 }}
                          />
                        </Box>

                        <Box
                          sx={{
                            display: "grid",
                            gridTemplateColumns:
                              "repeat(auto-fit, minmax(150px, 1fr))",
                            gap: 2,
                            my: 2,
                          }}
                        >
                          <Box>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              display="block"
                              sx={{ mb: 0.5 }}
                            >
                              In Date
                            </Typography>
                            <Typography variant="body2" fontWeight={500}>
                              {detail.inDate &&
                              detail.inDate !== "0001-01-01T00:00:00Z"
                                ? new Date(detail.inDate).toLocaleDateString()
                                : "-"}
                            </Typography>
                          </Box>
                          <Box>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              display="block"
                              sx={{ mb: 0.5 }}
                            >
                              Out Date
                            </Typography>
                            <Typography variant="body2" fontWeight={500}>
                              {detail.outDate &&
                              detail.outDate !== "0001-01-01T00:00:00Z"
                                ? new Date(detail.outDate).toLocaleDateString()
                                : "-"}
                            </Typography>
                          </Box>
                          <Box>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              display="block"
                              sx={{ mb: 0.5 }}
                            >
                              P.TAT (Days)
                            </Typography>
                            <Typography variant="body2" fontWeight={500}>
                              {detail.pTat || 0}
                            </Typography>
                          </Box>
                          <Box>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              display="block"
                              sx={{ mb: 0.5 }}
                            >
                              A.TAT (Days)
                            </Typography>
                            <Typography variant="body2" fontWeight={500}>
                              {detail.aTat || 0}
                            </Typography>
                          </Box>
                        </Box>

                        {detail.remarks && (
                          <Box
                            sx={{
                              mt: 2,
                              pt: 2,
                              borderTop: `1px solid ${theme.palette.divider}`,
                            }}
                          >
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              display="block"
                              sx={{ mb: 0.5 }}
                            >
                              Remarks
                            </Typography>
                            <Typography variant="body2">
                              {detail.remarks}
                            </Typography>
                          </Box>
                        )}

                        {detail.rejectionRemark && (
                          <Box
                            sx={{
                              mt: 2,
                              pt: 2,
                              borderTop: `1px solid ${theme.palette.divider}`,
                            }}
                          >
                            <Typography
                              variant="caption"
                              color="error"
                              display="block"
                              sx={{ mb: 0.5, fontWeight: 600 }}
                            >
                              Rejection Remark
                            </Typography>
                            <Typography variant="body2" color="error">
                              {detail.rejectionRemark}
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    ))
                  ) : (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ textAlign: "center", py: 4 }}
                    >
                      No movement details available
                    </Typography>
                  )}
                </Box>
              </Box>
            )}
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={handleCloseTaskMovementDialog} variant="contained">
              Close
            </Button>
          </DialogActions>
        </Dialog>
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
          <Button
            variant="outlined"
            startIcon={<CloseIcon />}
            onClick={handleBackToDashboard}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 600,
              px: 3,
            }}
          >
            Back to Dashboard
          </Button>
        </Box>

        <Paper
          sx={{
            borderRadius: 3,
            boxShadow: `0 4px 20px ${alpha(theme.palette.common.black, 0.08)}`,
            overflow: "hidden",
          }}
        >
          {loading ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: 400,
                flexDirection: "column",
                gap: 2,
              }}
            >
              <CircularProgress size={50} />
              <Typography variant="body1" color="text.secondary">
                Loading rejected tasks...
              </Typography>
            </Box>
          ) : fetchError ? (
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
            <TableContainer sx={{ overflowX: "auto" }}>
              <Table sx={{ minWidth: 1400 }}>
                <TableHead>
                  <TableRow
                    sx={{ bgcolor: alpha(theme.palette.error.main, 0.05) }}
                  >
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight={600}>
                        Activity Name
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight={600}>
                        Act Name
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight={600}>
                        Department
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight={600}>
                        Site Name
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight={600}>
                        Due Date
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight={600}>
                        Maker
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight={600}>
                        Checker
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight={600}>
                        Reviewer
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight={600}>
                        Auditor
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight={600}>
                        Status
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="subtitle2" fontWeight={600}>
                        Actions
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rejectedTasks.map((task, index) => (
                    <TableRow key={task.tblId || index} hover>
                      <TableCell>
                        <Typography variant="body2" fontWeight={500}>
                          {task.activityName}
                        </Typography>
                        {task.description && (
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ display: "block", mt: 0.5 }}
                          >
                            {task.description}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{task.actName}</Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={task.departmentName}
                          size="small"
                          sx={{
                            bgcolor: alpha(theme.palette.info.main, 0.1),
                            color: theme.palette.info.main,
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight={500}>
                          {task.siteName || "-"}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {task.dueDate
                            ? new Date(task.dueDate).toLocaleDateString()
                            : "-"}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight={500}>
                          {task.maker || "-"}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight={500}>
                          {task.checker || "-"}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight={500}>
                          {task.reviewer || "-"}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight={500}>
                          {task.auditer || "-"}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label="Rejected"
                          size="small"
                          color="error"
                          sx={{ fontWeight: 600 }}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Button
                          size="small"
                          variant="text"
                          startIcon={<EyeIcon />}
                          onClick={() => handleViewTaskMovement(task)}
                          sx={{
                            color: theme.palette.primary.main,
                            textTransform: "none",
                            "&:hover": {
                              bgcolor: alpha(theme.palette.primary.main, 0.1),
                            },
                          }}
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
        {/* Task Movement Dialog */}
        <Dialog
          open={taskMovementDialogOpen}
          onClose={handleCloseTaskMovementDialog}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle sx={{ fontWeight: 600, fontSize: "1.3rem", pb: 1 }}>
            Task Movement Details
          </DialogTitle>
          <DialogContent sx={{ py: 2 }}>
            {selectedTask && (
              <Box>
                <Box
                  sx={{
                    mb: 3,
                    p: 2,
                    bgcolor: alpha(theme.palette.primary.main, 0.05),
                    borderRadius: 2,
                  }}
                >
                  <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                    Activity Information
                  </Typography>
                  <Grid container spacing={2} sx={{ mt: 0.5 }}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        display="block"
                      >
                        Activity Name
                      </Typography>
                      <Typography variant="body2" fontWeight={500}>
                        {selectedTask.activityName}
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        display="block"
                      >
                        Act Name
                      </Typography>
                      <Typography variant="body2" fontWeight={500}>
                        {selectedTask.actName}
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        display="block"
                      >
                        Department
                      </Typography>
                      <Typography variant="body2" fontWeight={500}>
                        {selectedTask.departmentName}
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        display="block"
                      >
                        Due Date
                      </Typography>
                      <Typography variant="body2" fontWeight={500}>
                        {selectedTask.dueDate
                          ? new Date(selectedTask.dueDate).toLocaleDateString()
                          : "-"}
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        display="block"
                      >
                        Site Name
                      </Typography>
                      <Typography variant="body2" fontWeight={500}>
                        {selectedTask.siteName || "-"}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>

                <Typography
                  variant="subtitle2"
                  fontWeight={600}
                  gutterBottom
                  sx={{ mt: 3, mb: 2 }}
                >
                  Task Movement History
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {selectedTask.details && selectedTask.details.length > 0 ? (
                    selectedTask.details.map((detail: any, index: number) => (
                      <Box
                        key={index}
                        sx={{
                          p: 2,
                          border: `1px solid ${theme.palette.divider}`,
                          borderRadius: 2,
                          bgcolor: alpha(
                            detail.status === "Approved"
                              ? theme.palette.success.main
                              : detail.status === "Rejected"
                              ? theme.palette.error.main
                              : theme.palette.warning.main,
                            0.05
                          ),
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "start",
                            mb: 1,
                          }}
                        >
                          <Box>
                            <Typography variant="subtitle2" fontWeight={600}>
                              {detail.userName}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {index === 0
                                ? "Maker"
                                : index === 1
                                ? "Checker"
                                : "Reviewer"}
                            </Typography>
                          </Box>
                          <Chip
                            label={detail.status}
                            size="small"
                            color={
                              detail.status === "Approved"
                                ? "success"
                                : detail.status === "Rejected"
                                ? "error"
                                : "warning"
                            }
                            variant="outlined"
                            sx={{ fontWeight: 600 }}
                          />
                        </Box>

                        <Box
                          sx={{
                            display: "grid",
                            gridTemplateColumns:
                              "repeat(auto-fit, minmax(150px, 1fr))",
                            gap: 2,
                            my: 2,
                          }}
                        >
                          <Box>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              display="block"
                              sx={{ mb: 0.5 }}
                            >
                              In Date
                            </Typography>
                            <Typography variant="body2" fontWeight={500}>
                              {detail.inDate &&
                              detail.inDate !== "0001-01-01T00:00:00Z"
                                ? new Date(detail.inDate).toLocaleDateString()
                                : "-"}
                            </Typography>
                          </Box>
                          <Box>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              display="block"
                              sx={{ mb: 0.5 }}
                            >
                              Out Date
                            </Typography>
                            <Typography variant="body2" fontWeight={500}>
                              {detail.outDate &&
                              detail.outDate !== "0001-01-01T00:00:00Z"
                                ? new Date(detail.outDate).toLocaleDateString()
                                : "-"}
                            </Typography>
                          </Box>
                          <Box>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              display="block"
                              sx={{ mb: 0.5 }}
                            >
                              P.TAT (Days)
                            </Typography>
                            <Typography variant="body2" fontWeight={500}>
                              {detail.pTat || 0}
                            </Typography>
                          </Box>
                          <Box>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              display="block"
                              sx={{ mb: 0.5 }}
                            >
                              A.TAT (Days)
                            </Typography>
                            <Typography variant="body2" fontWeight={500}>
                              {detail.aTat || 0}
                            </Typography>
                          </Box>
                        </Box>

                        {detail.remarks && (
                          <Box
                            sx={{
                              mt: 2,
                              pt: 2,
                              borderTop: `1px solid ${theme.palette.divider}`,
                            }}
                          >
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              display="block"
                              sx={{ mb: 0.5 }}
                            >
                              Remarks
                            </Typography>
                            <Typography variant="body2">
                              {detail.remarks}
                            </Typography>
                          </Box>
                        )}

                        {detail.rejectionRemark && (
                          <Box
                            sx={{
                              mt: 2,
                              pt: 2,
                              borderTop: `1px solid ${theme.palette.divider}`,
                            }}
                          >
                            <Typography
                              variant="caption"
                              color="error"
                              display="block"
                              sx={{ mb: 0.5, fontWeight: 600 }}
                            >
                              Rejection Remark
                            </Typography>
                            <Typography variant="body2" color="error">
                              {detail.rejectionRemark}
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    ))
                  ) : (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ textAlign: "center", py: 4 }}
                    >
                      No movement details available
                    </Typography>
                  )}
                </Box>
              </Box>
            )}
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={handleCloseTaskMovementDialog} variant="contained">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    );
  }
  // SITE WISE TASKS TABLE VIEW
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
          <Button
            variant="outlined"
            startIcon={<CloseIcon />}
            onClick={handleBackToDashboard}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 600,
              px: 3,
            }}
          >
            Back to Dashboard
          </Button>
        </Box>

        <Paper
          sx={{
            borderRadius: 3,
            boxShadow: `0 4px 20px ${alpha(theme.palette.common.black, 0.08)}`,
            overflow: "hidden",
          }}
        >
          {loading ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: 400,
                flexDirection: "column",
                gap: 2,
              }}
            >
              <CircularProgress size={50} />
              <Typography variant="body1" color="text.secondary">
                Loading Site wise tasks...
              </Typography>
            </Box>
          ) : fetchError ? (
            <Box sx={{ p: 4 }}>
              <Alert severity="error">{fetchError}</Alert>
            </Box>
          ) : siteWiseTasks.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 12 }}>
              <CheckCircle
                sx={{ fontSize: 80, color: "text.disabled", mb: 2 }}
              />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No Site Wise tasks
              </Typography>
              <Typography variant="body2" color="text.secondary">
                There are no Site Wise tasks available
              </Typography>
            </Box>
          ) : (
            <TableContainer sx={{ overflowX: "auto" }}>
              <Table sx={{ minWidth: 1400 }}>
                <TableHead>
                  <TableRow
                    sx={{ bgcolor: alpha(theme.palette.success.main, 0.05) }}
                  >
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight={600}>
                        Site Name
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight={600}>
                        Activity Name
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight={600}>
                        Act Name
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight={600}>
                        Department
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Typography variant="subtitle2" fontWeight={600}>
                        Due Date
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight={600}>
                        Maker
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight={600}>
                        Checker
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight={600}>
                        Reviewer
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight={600}>
                        Auditor
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight={600}>
                        Status
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="subtitle2" fontWeight={600}>
                        Actions
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {siteWiseTasks.map((task, index) => (
                    <TableRow key={task.tblId || index} hover>
                      <TableCell>
                        <Typography variant="body2" fontWeight={500}>
                          {task.siteName || "-"}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight={500}>
                          {task.activityName}
                        </Typography>
                        {task.description && (
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ display: "block", mt: 0.5 }}
                          >
                            {task.description}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{task.actName}</Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={task.departmentName}
                          size="small"
                          sx={{
                            bgcolor: alpha(theme.palette.info.main, 0.1),
                            color: theme.palette.info.main,
                          }}
                        />
                      </TableCell>

                      <TableCell>
                        <Typography variant="body2">
                          {task.dueDate
                            ? new Date(task.dueDate).toLocaleDateString()
                            : "-"}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight={500}>
                          {task.maker || "-"}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight={500}>
                          {task.checker || "-"}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight={500}>
                          {task.reviewer || "-"}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight={500}>
                          {task.auditer || "-"}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={task.taskCurrentStatus}
                          size="small"
                          color={
                            task.taskCurrentStatus === "Completed"
                              ? "success"
                              : task.taskCurrentStatus === "Rejected"
                              ? "error"
                              : "warning"
                          }
                          sx={{ fontWeight: 600 }}
                        />
                      </TableCell>

                      <TableCell align="center">
                        <Button
                          size="small"
                          variant="text"
                          startIcon={<EyeIcon />}
                          onClick={() => handleViewTaskMovement(task)}
                          sx={{
                            color: theme.palette.primary.main,
                            textTransform: "none",
                            "&:hover": {
                              bgcolor: alpha(theme.palette.primary.main, 0.1),
                            },
                          }}
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
        {/* Task Movement Dialog */}
        <Dialog
          open={taskMovementDialogOpen}
          onClose={handleCloseTaskMovementDialog}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle sx={{ fontWeight: 600, fontSize: "1.3rem", pb: 1 }}>
            Task Movement Details
          </DialogTitle>
          <DialogContent sx={{ py: 2 }}>
            {selectedTask && (
              <Box>
                <Box
                  sx={{
                    mb: 3,
                    p: 2,
                    bgcolor: alpha(theme.palette.primary.main, 0.05),
                    borderRadius: 2,
                  }}
                >
                  <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                    Activity Information
                  </Typography>
                  <Grid container spacing={2} sx={{ mt: 0.5 }}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        display="block"
                      >
                        Activity Name
                      </Typography>
                      <Typography variant="body2" fontWeight={500}>
                        {selectedTask.activityName}
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        display="block"
                      >
                        Act Name
                      </Typography>
                      <Typography variant="body2" fontWeight={500}>
                        {selectedTask.actName}
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        display="block"
                      >
                        Department
                      </Typography>
                      <Typography variant="body2" fontWeight={500}>
                        {selectedTask.departmentName}
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        display="block"
                      >
                        Due Date
                      </Typography>
                      <Typography variant="body2" fontWeight={500}>
                        {selectedTask.dueDate
                          ? new Date(selectedTask.dueDate).toLocaleDateString()
                          : "-"}
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        display="block"
                      >
                        Site Name
                      </Typography>
                      <Typography variant="body2" fontWeight={500}>
                        {selectedTask.siteName || "-"}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>

                <Typography
                  variant="subtitle2"
                  fontWeight={600}
                  gutterBottom
                  sx={{ mt: 3, mb: 2 }}
                >
                  Task Movement History
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {selectedTask.details && selectedTask.details.length > 0 ? (
                    selectedTask.details.map((detail: any, index: number) => (
                      <Box
                        key={index}
                        sx={{
                          p: 2,
                          border: `1px solid ${theme.palette.divider}`,
                          borderRadius: 2,
                          bgcolor: alpha(
                            detail.status === "Approved"
                              ? theme.palette.success.main
                              : detail.status === "Rejected"
                              ? theme.palette.error.main
                              : theme.palette.warning.main,
                            0.05
                          ),
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "start",
                            mb: 1,
                          }}
                        >
                          <Box>
                            <Typography variant="subtitle2" fontWeight={600}>
                              {detail.userName}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {index === 0
                                ? "Maker"
                                : index === 1
                                ? "Checker"
                                : "Reviewer"}
                            </Typography>
                          </Box>
                          <Chip
                            label={detail.status}
                            size="small"
                            color={
                              detail.status === "Approved"
                                ? "success"
                                : detail.status === "Rejected"
                                ? "error"
                                : "warning"
                            }
                            variant="outlined"
                            sx={{ fontWeight: 600 }}
                          />
                        </Box>

                        <Box
                          sx={{
                            display: "grid",
                            gridTemplateColumns:
                              "repeat(auto-fit, minmax(150px, 1fr))",
                            gap: 2,
                            my: 2,
                          }}
                        >
                          <Box>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              display="block"
                              sx={{ mb: 0.5 }}
                            >
                              In Date
                            </Typography>
                            <Typography variant="body2" fontWeight={500}>
                              {detail.inDate &&
                              detail.inDate !== "0001-01-01T00:00:00Z"
                                ? new Date(detail.inDate).toLocaleDateString()
                                : "-"}
                            </Typography>
                          </Box>
                          <Box>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              display="block"
                              sx={{ mb: 0.5 }}
                            >
                              Out Date
                            </Typography>
                            <Typography variant="body2" fontWeight={500}>
                              {detail.outDate &&
                              detail.outDate !== "0001-01-01T00:00:00Z"
                                ? new Date(detail.outDate).toLocaleDateString()
                                : "-"}
                            </Typography>
                          </Box>
                          <Box>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              display="block"
                              sx={{ mb: 0.5 }}
                            >
                              P.TAT (Days)
                            </Typography>
                            <Typography variant="body2" fontWeight={500}>
                              {detail.pTat || 0}
                            </Typography>
                          </Box>
                          <Box>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              display="block"
                              sx={{ mb: 0.5 }}
                            >
                              A.TAT (Days)
                            </Typography>
                            <Typography variant="body2" fontWeight={500}>
                              {detail.aTat || 0}
                            </Typography>
                          </Box>
                        </Box>

                        {detail.remarks && (
                          <Box
                            sx={{
                              mt: 2,
                              pt: 2,
                              borderTop: `1px solid ${theme.palette.divider}`,
                            }}
                          >
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              display="block"
                              sx={{ mb: 0.5 }}
                            >
                              Remarks
                            </Typography>
                            <Typography variant="body2">
                              {detail.remarks}
                            </Typography>
                          </Box>
                        )}

                        {detail.rejectionRemark && (
                          <Box
                            sx={{
                              mt: 2,
                              pt: 2,
                              borderTop: `1px solid ${theme.palette.divider}`,
                            }}
                          >
                            <Typography
                              variant="caption"
                              color="error"
                              display="block"
                              sx={{ mb: 0.5, fontWeight: 600 }}
                            >
                              Rejection Remark
                            </Typography>
                            <Typography variant="body2" color="error">
                              {detail.rejectionRemark}
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    ))
                  ) : (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ textAlign: "center", py: 4 }}
                    >
                      No movement details available
                    </Typography>
                  )}
                </Box>
              </Box>
            )}
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={handleCloseTaskMovementDialog} variant="contained">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    );
  }
  // fallback (कभी नहीं आएगा, लेकिन safe रखने के लिए)
  return null;
};

export default CustomerAdminDashboard;
