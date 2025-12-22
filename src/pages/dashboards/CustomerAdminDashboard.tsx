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
} from "@mui/icons-material";
import type { AppDispatch } from "../../app/store";
import { useDispatch, useSelector } from "react-redux";
import {
  selectAssignedTasks,
  selectCompletedTasks,
  selectCustomerAdminDashboardData,
  selectCustomerAdminError,
} from "./customeradminslice/CustomerAdmin.selector"; // सिर्फ़ ये वाले selectors
import {
  fetchAssignedTasks,
  fetchCompletedTasks,
  fetchCustomerAdminDashboard,
} from "./customeradminslice/CustomerAdmin.slice";
import { useNavigate } from "react-router-dom";

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
  const [showCompletedTable, setShowCompletedTable] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

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

  const handleBackToDashboard = () => {
    setShowCompletedTable(false);
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
  const maxActivity = Math.max(...actChartData.map((a) => a.total), 1);
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
      path: "/dashboard/master/task",
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
      path: "/dashboard/master/task",
    },
  ];

  useEffect(() => {
    dispatch(fetchCustomerAdminDashboard());
    dispatch(fetchAssignedTasks());
  }, [dispatch]);
  // Main Dashboard View
  if (!showCompletedTable) {
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
          {/* LEFT CARD – Compliance Status */}
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
              <CardContent
                sx={{
                  p: 4,
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  Act-wise Pillar Chart
                </Typography>
              </CardContent>
            </Card>
          </Grid>
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
                      height: 16,
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
                      height: 16,
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
                      height: 16,
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
        </Grid>

        {/* Act Wise Chart */}
        <Grid container spacing={3} sx={{ mt: 4 }}>
          {/* LEFT CARD – Compliance Status */}
          <Grid size={{ xs: 12, md: 6 }}>
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

                {/* GRAPH AREA */}
                <Box
                  sx={{
                    position: "relative",
                    height: 320,
                    mt: 2,
                  }}
                >
                  {/* Y AXIS */}
                  <Box
                    sx={{
                      position: "absolute",
                      left: 40,
                      top: 10,
                      bottom: 60,
                      width: "2px",
                      bgcolor: "#000",
                    }}
                  />

                  {/* X AXIS */}
                  <Box
                    sx={{
                      position: "absolute",
                      left: 40,
                      right: 20,
                      bottom: 60,
                      height: "2px",
                      bgcolor: "#000",
                    }}
                  />

                  {/* BARS AREA */}
                  <Box
                    sx={{
                      position: "absolute",
                      left: 60,
                      right: 20,
                      top: 10,
                      bottom: 60,
                      display: "flex",
                      alignItems: "flex-end",
                      gap: 28,
                      overflowX: "auto",
                    }}
                  >
                    {actChartData.map((act) => {
                      const barHeight = (act.total / maxActivity) * 220;

                      return (
                        <Box
                          key={act.actName}
                          sx={{
                            minWidth: 60,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "flex-end",
                          }}
                        >
                          {/* VALUE */}
                          <Typography
                            variant="body2"
                            fontWeight={600}
                            sx={{ mb: 0.5 }}
                          >
                            {act.total}
                          </Typography>

                          {/* BAR */}
                          <Box
                            sx={{
                              width: 28,
                              height: `${barHeight}px`,
                              background:
                                "linear-gradient(to top, #ff9800, #ffc107)",
                              border: "1px solid #e68900",
                            }}
                          />

                          {/* ACT NAME (ROTATED LIKE IMAGE) */}
                          <Typography
                            variant="caption"
                            sx={{
                              mt: 1.5,
                              transform: "rotate(-60deg)",
                              transformOrigin: "top right",
                              whiteSpace: "nowrap",
                              fontSize: "0.75rem",
                            }}
                          >
                            {act.actName}
                          </Typography>
                        </Box>
                      );
                    })}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

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
              <CardContent
                sx={{
                  p: 4,
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  Act-wise Pillar Chart
                </Typography>
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

  // Completed Tasks Table View
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
            Completed Tasks ({dashboardData?.totalCompletedTask ?? 0})
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
            <CheckCircle sx={{ fontSize: 80, color: "text.disabled", mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No completed tasks
            </Typography>
            <Typography variant="body2" color="text.secondary">
              There are no completed tasks available
            </Typography>
          </Box>
        ) : (
          <TableContainer
            sx={{
              overflowX: "auto",
            }}
          >
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
                      Reviwer
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
                        label={task.taskCurrentStatus || "Completed"}
                        size="small"
                        color="success"
                        sx={{ fontWeight: 600 }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Box>
  );
};

export default CustomerAdminDashboard;
