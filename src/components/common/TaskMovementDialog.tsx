import React from "react";
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

interface TaskDetail {
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
  details: TaskDetail[];
}

interface TaskMovementDialogProps {
  open: boolean;
  onClose: () => void;
  task: Task | null;
}

const TaskMovementDialog: React.FC<TaskMovementDialogProps> = ({
  open,
  onClose,
  task,
}) => {
  const theme = useTheme();
  const handleDownloadFile = async (filePath: string) => {
    try {
      const baseUrl = "https://api.ocmspro.com/RemarkFile/";
      const finalPath = filePath.startsWith("~")
        ? filePath.replace("~", "")
        : filePath;

      const fileUrl = `${baseUrl}${finalPath}`;

      // 🔽 fetch file as blob
      const response = await fetch(fileUrl);
      if (!response.ok) {
        throw new Error("File download failed");
      }

      const blob = await response.blob();

      // 🔽 create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = finalPath.split("/").pop() || "file";
      document.body.appendChild(link);
      link.click();

      // cleanup
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("❌ Download error:", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ fontWeight: 600, fontSize: "1.3rem", pb: 1 }}>
        Task Movement Details
      </DialogTitle>
      <DialogContent sx={{ py: 2 }}>
        {task && (
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
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Typography variant="body2" fontWeight={500}>
                        {task.remarkFilePath.split("/").pop()}
                      </Typography>

                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => handleDownloadFile(task.remarkFilePath!)}
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
