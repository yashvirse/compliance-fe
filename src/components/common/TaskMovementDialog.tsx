import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Grid,
  Chip,
  useTheme,
  alpha,
} from "@mui/material";
import { apiService } from "../../services/api";

interface details {
  userName: string;
  status: "Approved" | "Rejected" | "Pending";
  inDate: string;
  outDate: string;
  pTat: number;
  aTat: number;
  remarks?: string;
  rejectionRemark?: string;
}

interface Task {
  activityName: string;
  actName: string;
  departmentName: string;
  dueDate: string;
  siteName?: string;
  remarkFilePath?: string;
  details: details[];
}

interface TaskMovementDialogProps {
  open: boolean;
  onClose: () => void;
  tblId: string | null;
}

const TaskMovementDialog: React.FC<TaskMovementDialogProps> = ({
  open,
  onClose,
  tblId,
}) => {
  const theme = useTheme();

  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!open || !tblId) {
      setTask(null);
      setErrorMsg(null);
      return;
    }

    const fetchTaskDetail = async () => {
      setLoading(true);
      setErrorMsg(null);

      try {
        // tumhare project ka apiService style
        const response = await apiService.get<any>(
          `Dashboard/getTaskDtl?taskID=${tblId}`,
        );
        if (!response.isSuccess) {
          throw new Error(response.message || "Task detail fetch failed");
        }
        const result = response.result;
        // API → component ke interface mein mapping
        const mappedTask: Task = {
          activityName: result.activityName || "",
          actName: result.actName || "",
          departmentName: result.departmentName || "",
          dueDate: result.dueDate || "",
          siteName: result.siteName || undefined,
          remarkFilePath: result.remarkFilePath || undefined,
          details: (result.details || []).map((item: any) => ({
            userName: item.userName || "Unknown",
            status: item.status || "Pending",
            inDate: item.inDate || "",
            outDate: item.outDate || "",
            pTat: Number(item.pTat) || 0,
            aTat: Number(item.aTat) || 0,
            remarks: item.remarks || undefined,
            rejectionRemark: item.rejectionRemark || undefined,
          })),
        };

        setTask(mappedTask);
      } catch (err: any) {
        console.error("Task detail fetch error:", err);
        setErrorMsg(err.message || "Failed to load task details");
      } finally {
        setLoading(false);
      }
    };

    fetchTaskDetail();
  }, [open, tblId]);

  const downloadFileDirect = (filePath: string) => {
    const baseUrl = "https://api.ocmspro.com/RemarkFiles/";

    // "~" remove karo agar start me ho
    const cleanedPath = filePath.startsWith("~")
      ? filePath.replace("~", "")
      : filePath;

    const fileUrl = `${baseUrl}${cleanedPath}`;

    // direct browser download
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = cleanedPath.split("/").pop() || "file";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ fontWeight: 600, fontSize: "1.3rem", pb: 1 }}>
        Task Movement Details
      </DialogTitle>
      <DialogContent sx={{ py: 2 }}>
        {loading ? (
          <Typography align="center" sx={{ py: 6 }}>
            Loading...
          </Typography>
        ) : errorMsg ? (
          <Typography color="error" align="center" sx={{ py: 4 }}>
            {errorMsg}
          </Typography>
        ) : (
          task && (
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
                      {task.activityName}
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
                      {task.actName}
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
                      {task.departmentName}
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
                      {task.dueDate
                        ? new Date(task.dueDate).toLocaleDateString()
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
                      {task.siteName || "-"}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      display="block"
                    >
                      Remark File Name
                    </Typography>
                    {task.remarkFilePath ? (
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Typography variant="body2" fontWeight={500}>
                          {task.remarkFilePath.split("/").pop()}
                        </Typography>

                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() =>
                            downloadFileDirect(task.remarkFilePath!)
                          }
                        >
                          Download
                        </Button>
                      </Box>
                    ) : (
                      <Typography variant="body2">-</Typography>
                    )}
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
                {task.details && task.details.length > 0 ? (
                  task.details.map((detail, index) => (
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
                          0.05,
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
                          <Typography variant="caption" color="text.secondary">
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
          )
        )}
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} variant="contained">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TaskMovementDialog;
