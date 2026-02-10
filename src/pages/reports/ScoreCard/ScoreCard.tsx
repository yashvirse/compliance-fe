import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  MenuItem,
  Button,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import ReportDataTable from "../../../components/common/ReportDataTable";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchDepartmentList,
  fetchScoreCardReport,
  fetchSiteList,
} from "./ScroreCard.slice";
import {
  selectScoreCardData,
  selectScoreCardLoading,
  selectScoreCardError,
  selectDepartments,
  selectSites,
} from "./ScoreCard.selector";
import { CircularProgress, Alert } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { TaskMovementDialog } from "../../../components/common";
import * as XLSX from "xlsx";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import Checkbox from "@mui/material/Checkbox";
import ListItemText from "@mui/material/ListItemText";

const ScoreCard: React.FC = () => {
  const dispatch = useDispatch();
  const departments = useSelector(selectDepartments);
  const sites = useSelector(selectSites);
  const report = useSelector(selectScoreCardData);
  const loading = useSelector(selectScoreCardLoading);
  const error = useSelector(selectScoreCardError);
  const [taskMovementDialogOpen, setTaskMovementDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any | null>(null);
  const [expandedSites, setExpandedSites] = useState<Record<string, boolean>>(
    {},
  );
  const [expandedActs, setExpandedActs] = useState<Record<string, boolean>>({});
  const [formData, setFormData] = useState({
    sites: [] as string[], // multiple siteId
    departments: [] as string[], // multiple departmentName
    monthYear: null as any,
  });
  const [showGrid, setShowGrid] = useState(false);
  // Change this line:
  const [currentMonth, setCurrentMonth] = useState<dayjs.Dayjs | null>(dayjs());
  const [errors, setErrors] = useState({
    sites: "",
    departments: "",
    monthYear: "",
  });

  const columns = [
    { key: "site", label: "Site", width: "20%" },
    { key: "act", label: "Act", width: "20%" },
    { key: "activity", label: "Activity", width: "200%" },
    { key: "percent", label: "%" },
    { key: "dueDate", label: "Due Date" },
    {
      key: "action",
      label: "Action",
      render: (row: any) => {
        return (
          <Button
            size="small"
            onClick={() => handleViewTaskMovement(row.tblId)}
          >
            <VisibilityIcon fontSize="small" />
          </Button>
        );
      },
    },
  ];
  const formattedDate = currentMonth
    ? currentMonth.startOf("month").format("YYYY-MM-DDTHH:mm:ss")
    : "";

  useEffect(() => {
    dispatch(fetchSiteList() as any);
    dispatch(fetchDepartmentList() as any);
  }, [dispatch]);

  const handleViewTaskMovement = (tblId: string) => {
    setSelectedTask(tblId);
    setTaskMovementDialogOpen(true);
  };

  const handleCloseTaskMovementDialog = () => {
    setTaskMovementDialogOpen(false);
    setSelectedTask(null);
  };
  const handleExpandAll = () => {
    const siteExpanded: Record<string, boolean> = {};
    const actExpanded: Record<string, boolean> = {};

    if (report?.sites) {
      report.sites.forEach((site: any) => {
        const siteKey = site.siteId || site.siteName;
        siteExpanded[siteKey] = true;

        site.acts?.forEach((act: any, idx: number) => {
          const actKey = `${siteKey}-${act.actName || idx}`;
          actExpanded[actKey] = true;
        });
      });
    }

    setExpandedSites(siteExpanded);
    setExpandedActs(actExpanded);
  };

  const handleCollapseAll = () => {
    setExpandedSites({});
    setExpandedActs({});
  };

  const handleExportExcel = () => {
    if (!report?.sites?.length) return;
    const rows: any[] = [];
    // 🔹 Header row
    rows.push(["", "", "", "Site", "Act", "Activity", "PE", "%", "Due Date"]);
    // 🔹 Company row
    rows.push([
      `${report.companyName} : (Average : ${report.average.toFixed(2)}%)`,
    ]);
    report.sites.forEach((site: any) => {
      // 🔹 Site row (1 column right)
      rows.push([
        "",
        `${site.siteName} : (Average : ${site.average.toFixed(2)}%)`,
      ]);
      site.acts?.forEach((act: any) => {
        // 🔹 Act row (2 columns right)
        rows.push([
          "",
          "",
          `${act.actName} : (Average : ${act.average.toFixed(2)}%)`,
        ]);
        act.activities?.forEach((activity: any) => {
          // 🔹 Activity data row
          rows.push([
            "",
            "",
            "",
            site.siteName,
            act.actName,
            activity.activityName,
            activity.status || "Not Performed",
            activity.percentage,
            new Date(activity.dueDate).toLocaleDateString("en-GB"),
          ]);
        });
      });
    });
    const worksheet = XLSX.utils.aoa_to_sheet(rows);
    /* 🔹 FIXED MERGES */
    const merges: any[] = [];
    // Company row → text column A me hai
    merges.push({
      s: { r: 1, c: 0 },
      e: { r: 1, c: 8 },
    });
    let rowIndex = 2;
    report.sites.forEach((site: any) => {
      // Site row → text column B me hai
      merges.push({
        s: { r: rowIndex, c: 1 },
        e: { r: rowIndex, c: 8 },
      });
      rowIndex++;
      site.acts?.forEach((act: any) => {
        // Act row → text column C me hai
        merges.push({
          s: { r: rowIndex, c: 2 },
          e: { r: rowIndex, c: 8 },
        });
        rowIndex++;
        // skip activity rows
        rowIndex += act.activities?.length || 0;
      });
    });

    worksheet["!merges"] = merges;

    /* existing filter */
    worksheet["!autofilter"] = { ref: "D1:I1" };
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Score Card");
    XLSX.writeFile(workbook, "Score_Card_Report.xlsx");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({ sites: "", departments: "", monthYear: "" });
    // Validation
    let hasError = false;

    if (!formData.sites.length) {
      setErrors((prev) => ({
        ...prev,
        sites: "At least one site is required",
      }));
      hasError = true;
    }
    if (!formData.departments.length) {
      setErrors((prev) => ({
        ...prev,
        departments: "At least one department is required",
      }));
      hasError = true;
    }
    if (!currentMonth) {
      setErrors((prev) => ({ ...prev, monthYear: "Please select Month" }));
      hasError = true;
    }
    if (hasError) return;
    // Dispatch the API if validation passes
    dispatch(
      fetchScoreCardReport({
        sites: formData.sites,
        departments: formData.departments,
        monthYear: formattedDate,
      }) as any,
    );

    setShowGrid(true);
  };

  const toggleSite = (siteKey: string) => {
    setExpandedSites((prev) => ({
      ...prev,
      [siteKey]: !prev[siteKey],
    }));
  };

  const toggleAct = (actKey: string) => {
    setExpandedActs((prev) => ({
      ...prev,
      [actKey]: !prev[actKey],
    }));
  };
  return (
    <Box>
      {/* HEADER */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight={700}>
          Score Card
        </Typography>
      </Box>

      {/* FILTER */}
      <Paper sx={{ p: 4, borderRadius: 2 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 3 }}>
              <Box sx={{ display: "flex", gap: 1 }}>
                <TextField
                  fullWidth
                  label="Site"
                  select
                  SelectProps={{
                    multiple: true,
                    renderValue: (selected) =>
                      sites
                        .filter((s) =>
                          (selected as string[]).includes(s.siteId),
                        )
                        .map((s) => s.siteName)
                        .join(", "),
                  }}
                  name="sites"
                  value={formData.sites}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      sites: e.target.value as unknown as string[],
                    }))
                  }
                  error={!!errors.sites}
                >
                  {sites.map((site) => (
                    <MenuItem key={site.siteId} value={site.siteId}>
                      <Checkbox
                        checked={formData.sites.includes(site.siteId)}
                      />
                      <ListItemText primary={site.siteName} />
                    </MenuItem>
                  ))}
                </TextField>
              </Box>
              {errors.sites && (
                <Typography variant="caption" color="error">
                  {errors.sites}
                </Typography>
              )}
            </Grid>

            <Grid size={{ xs: 12, md: 3 }}>
              <Box sx={{ display: "flex", gap: 1 }}>
                <TextField
                  fullWidth
                  select
                  label="Department"
                  SelectProps={{
                    multiple: true,
                    renderValue: (selected) =>
                      (selected as string[]).join(", "),
                  }}
                  name="departments"
                  value={formData.departments}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      departments: e.target.value as unknown as string[],
                    }))
                  }
                  error={!!errors.departments}
                >
                  {departments.map((dept) => (
                    <MenuItem key={dept.deptId} value={dept.departmentName}>
                      <Checkbox
                        checked={formData.departments.includes(
                          dept.departmentName,
                        )}
                      />
                      <ListItemText primary={dept.departmentName} />
                    </MenuItem>
                  ))}
                </TextField>
              </Box>
              {errors.departments && (
                <Typography variant="caption" color="error">
                  {errors.departments}
                </Typography>
              )}
            </Grid>

            <Grid size={{ xs: 12, md: 3 }}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  views={["year", "month"]}
                  label="Select Month"
                  value={currentMonth}
                  onChange={(newValue) => {
                    setCurrentMonth(newValue);
                  }}
                  slotProps={{
                    textField: { size: "medium", error: !!errors.monthYear },
                  }}
                />
                {errors.monthYear && (
                  <Typography variant="caption" color="error">
                    {errors.monthYear}
                  </Typography>
                )}
              </LocalizationProvider>
            </Grid>

            <Grid
              sx={{ display: "flex", alignItems: "center" }}
              size={{ xs: 12, md: 3 }}
            >
              <Button type="submit" variant="contained">
                Apply Filter
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>

      {/* ================= RESULT GRID ================= */}
      {showGrid && (
        <>
          {/* LOADING STATE */}
          {loading && (
            <Paper sx={{ mt: 2, p: 4, textAlign: "center" }}>
              <CircularProgress />
              <Typography mt={2}>Loading score card...</Typography>
            </Paper>
          )}

          {/* ERROR STATE */}
          {!loading && error && (
            <Paper sx={{ mt: 2, p: 2 }}>
              <Alert severity="error">
                {typeof error === "string"
                  ? error
                  : "Something went wrong while loading score card"}
              </Alert>
            </Paper>
          )}

          {/* SUCCESS STATE */}
          {!loading && !error && report && (
            <Paper sx={{ mt: 2, p: 2 }}>
              {/* TABLE HEADER */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  mb: 2,
                }}
              >
                {/* LEFT */}
                <Typography variant="h6" fontWeight={700}>
                  Score Card Report
                </Typography>

                {/* RIGHT */}
                <Box sx={{ display: "flex", gap: 1 }}>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={handleCollapseAll}
                  >
                    Collapse All
                  </Button>

                  <Button
                    variant="outlined"
                    size="small"
                    onClick={handleExpandAll}
                  >
                    Expand All
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={handleExportExcel}
                  >
                    Export to Excel
                  </Button>
                </Box>
              </Box>

              {/* COMPANY */}
              <Box sx={{ background: "#ececec", p: 1, fontWeight: 500 }}>
                {report.companyName} : (Average : {report.average.toFixed(2)}%)
              </Box>

              {report.sites?.length === 0 && (
                <Typography sx={{ p: 2 }} color="text.secondary">
                  No data available
                </Typography>
              )}

              {report.sites?.map((site: any) => {
                const siteKey = site.siteId || site.siteName;

                return (
                  <Box key={siteKey} sx={{ ml: 2, mt: 1 }}>
                    {/* SITE ROW */}
                    <Box
                      onClick={() => toggleSite(siteKey)}
                      sx={{
                        background: "#f5f5f5",
                        p: 1,
                        fontWeight: 400,
                        cursor: "pointer",
                        userSelect: "none",
                        "&:hover": { background: "#e8e8e8" },
                      }}
                    >
                      {expandedSites[siteKey] ? "▼" : "▶"} {site.siteName} :
                      (Average : {site.average.toFixed(2)}%)
                    </Box>

                    {/* ACTS */}
                    {expandedSites[siteKey] &&
                      site.acts?.map((act: any, idx: number) => {
                        const actKey = `${siteKey}-${act.actName || idx}`;

                        return (
                          <Box key={actKey} sx={{ ml: 3, mt: 1 }}>
                            {/* ACT ROW */}
                            <Box
                              onClick={() => toggleAct(actKey)}
                              sx={{
                                background: "#fafafa",
                                p: 1,
                                fontWeight: 400,
                                cursor: "pointer",
                                userSelect: "none",
                                "&:hover": { background: "#f0f0f0" },
                              }}
                            >
                              {expandedActs[actKey] ? "▼" : "▶"} {act.actName} :
                              (Average : {act.average.toFixed(2)}%)
                            </Box>

                            {/* TABLE */}
                            {expandedActs[actKey] && (
                              <Box sx={{ mt: 1 }}>
                                <ReportDataTable
                                  columns={columns}
                                  data={act.activities?.map((a: any) => ({
                                    tblId: a.tblId,
                                    site: a.siteName,
                                    act: a.actName,
                                    activity: a.activityName,
                                    percent: a.percentage,
                                    dueDate: new Date(
                                      a.dueDate,
                                    ).toLocaleDateString("en-GB"),
                                  }))}
                                />
                              </Box>
                            )}
                          </Box>
                        );
                      })}
                  </Box>
                );
              })}
            </Paper>
          )}
        </>
      )}
      <TaskMovementDialog
        open={taskMovementDialogOpen}
        onClose={handleCloseTaskMovementDialog}
        tblId={selectedTask}
      />
    </Box>
  );
};

export default ScoreCard;
