import React, { useState, useRef } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Alert,
  useTheme,
  alpha,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
} from "@mui/material";
import { CloudUpload, CheckCircle, Error as ErrorIcon } from "@mui/icons-material";
// import { useAppSelector } from "../app/hooks";
// import { selectUser } from "./login/slice/Login.selector";

interface CSVRecord {
  [key: string]: string;
}

interface ProcessingStatus {
  rowIndex: number;
  record: CSVRecord;
  status: "pending" | "processing" | "success" | "failed";
  message?: string;
}

const UtilPage: React.FC = () => {
  const theme = useTheme();
  // const user = useAppSelector(selectUser);
  const shouldStopRef = useRef(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [stopButtonVisible, setStopButtonVisible] = useState(false);
  const [uploadMessage, setUploadMessage] = useState<{
    type: "success" | "error" | "info";
    text: string;
  } | null>(null);
  const [processStatuses, setProcessStatuses] = useState<ProcessingStatus[]>([]);
  const [summary, setSummary] = useState<{
    total: number;
    success: number;
    failed: number;
  } | null>(null);

  // Get auth token from localStorage
  const getAuthToken = (): string | null => {
    return localStorage.getItem("authToken");
  };

  const validateRecord = (record: CSVRecord): string | null => {
    const requiredFields = [
      "actName",
      "departmentName",
      "activityName",
      "frequency",
      "dueDay",
    ];

    for (const field of requiredFields) {
      if (!record[field] || !String(record[field]).trim()) {
        return `Missing required field: ${field}`;
      }
    }

    // Validate numeric fields
    const numericFields = ["dueDay", "gracePeriodDay", "reminderDay"];
    for (const field of numericFields) {
      if (record[field] && isNaN(Number(record[field]))) {
        return `Field "${field}" must be a number`;
      }
    }

    return null;
  };

  const parseCSV = (file: File): Promise<CSVRecord[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (event) => {
        try {
          const csv = event.target?.result as string;
          const lines = csv.split("\n").filter((line) => line.trim());

          if (lines.length < 2) {
            reject(new Error("CSV file must have at least a header row and one data row"));
            return;
          }

          const headers = lines[0].split(",").map((h) => h.trim());
          const records: CSVRecord[] = [];

          for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(",").map((v) => v.trim());

            // Skip empty rows
            if (values.every((v) => !v)) {
              continue;
            }

            const record: CSVRecord = {};
            headers.forEach((header, index) => {
              record[header] = values[index] || "";
            });

            // Skip records with all empty values
            if (Object.values(record).some((val) => val)) {
              records.push(record);
            }
          }

          resolve(records);
        } catch (error) {
          reject(error);
        }
      };

      reader.onerror = () => {
        reject(new Error("Failed to read file"));
      };

      reader.readAsText(file);
    });
  };

  const callAddActMasterAPI = async (record: CSVRecord): Promise<void> => {
    const token = getAuthToken();

    if (!token) {
      throw new Error("Authentication token not found. Please login again.");
    }

    // Add activityId as empty string if not present
    const payload = {
      activityId: "",
      ...record,
    };

    const response = await fetch("https://api.ocmspro.com/api/Master/addSupAdmActMast", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "*/*",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      let errorMessage = `API returned status ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch {
        const errorText = await response.text();
        errorMessage = errorText || errorMessage;
      }
      throw new Error(errorMessage);
    }

    const responseData = await response.json();

    // Check if API returned success flag
    if (!responseData.isSuccess) {
      throw new Error(responseData.message || "API call failed");
    }

    return responseData;
  };

  const processRecordsSequentially = async (records: CSVRecord[]) => {
    const statuses: ProcessingStatus[] = records.map((record, index) => ({
      rowIndex: index + 2, // +2 because row 1 is header, and we start from 0
      record,
      status: "pending",
    }));

    setProcessStatuses(statuses);
    shouldStopRef.current = false;
    let successCount = 0;
    let failedCount = 0;

    for (let i = 0; i < records.length; i++) {
      // Check if stop was requested
      if (shouldStopRef.current) {
        setUploadMessage({
          type: "error",
          text: `Processing stopped by user. Processed: ${i} records (Success: ${successCount}, Failed: ${failedCount})`,
        });
        setSummary({
          total: records.length,
          success: successCount,
          failed: failedCount,
        });
        setUploading(false);
        setStopButtonVisible(false);
        return;
      }

      // Validate record first
      const validationError = validateRecord(records[i]);
      if (validationError) {
        setProcessStatuses((prev) =>
          prev.map((status, idx) =>
            idx === i
              ? { ...status, status: "failed", message: validationError }
              : status
          )
        );
        failedCount++;
        continue;
      }

      // Update status to processing
      setProcessStatuses((prev) =>
        prev.map((status, idx) =>
          idx === i ? { ...status, status: "processing" } : status
        )
      );

      try {
        await callAddActMasterAPI(records[i]);

        // Update status to success
        setProcessStatuses((prev) =>
          prev.map((status, idx) =>
            idx === i
              ? { ...status, status: "success", message: "Successfully processed" }
              : status
          )
        );
        successCount++;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";

        // Update status to failed
        setProcessStatuses((prev) =>
          prev.map((status, idx) =>
            idx === i
              ? { ...status, status: "failed", message: errorMessage }
              : status
          )
        );
        failedCount++;
      }

      // Small delay to ensure UI updates
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    // Set final summary
    setSummary({
      total: records.length,
      success: successCount,
      failed: failedCount,
    });

    setUploadMessage({
      type: failedCount === 0 ? "success" : "error",
      text:
        failedCount === 0
          ? `All ${successCount} records processed successfully!`
          : `Processing complete. Success: ${successCount}, Failed: ${failedCount}`,
    });

    setUploading(false);
    setStopButtonVisible(false);
  };

  const handleActivityCSVUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.name.endsWith(".csv")) {
      setUploadMessage({
        type: "error",
        text: "Please upload a CSV file",
      });
      return;
    }

    setUploadLoading(true);
    setProcessStatuses([]);
    setSummary(null);
    setUploadMessage(null);
    shouldStopRef.current = false;
    setStopButtonVisible(false);

    try {
      const records = await parseCSV(file);

      if (records.length === 0) {
        setUploadMessage({
          type: "error",
          text: "No valid records found in CSV file",
        });
        setUploadLoading(false);
        return;
      }

      setUploadMessage({
        type: "info",
        text: `CSV parsed successfully. Found ${records.length} records. Starting processing...`,
      });

      setUploadLoading(false);
      setUploading(true);
      setStopButtonVisible(true);

      // Reset file input
      event.target.value = "";

      // Start processing records
      await processRecordsSequentially(records);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Unknown error";
      setUploadMessage({
        type: "error",
        text: `Error parsing CSV: ${errorMsg}`,
      });
      setUploadLoading(false);
    }
  };

  const getStatusColor = (status: ProcessingStatus["status"]) => {
    switch (status) {
      case "success":
        return "success";
      case "failed":
        return "error";
      case "processing":
        return "info";
      default:
        return "default";
    }
  };

  const getStatusIcon = (status: ProcessingStatus["status"]) => {
    switch (status) {
      case "success":
        return <CheckCircle />;
      case "failed":
        return <ErrorIcon />;
      case "processing":
        return <Typography variant="caption">⏳</Typography>;
      default:
        return <Typography variant="caption">⧐</Typography>;
    }
  };

  const processedCount = processStatuses.filter(
    (s) => s.status === "success" || s.status === "failed"
  ).length;
  const progressPercent =
    processStatuses.length > 0
      ? (processedCount / processStatuses.length) * 100
      : 0;

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Utility
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Import and manage data
        </Typography>
      </Box>

      <Card
        sx={{
          borderRadius: 3,
          boxShadow: `0 4px 20px ${alpha(theme.palette.common.black, 0.08)}`,
          mb: 3,
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
            <CloudUpload
              sx={{ fontSize: 40, color: theme.palette.primary.main, mr: 2 }}
            />
            <Box>
              <Typography variant="h6" fontWeight={600}>
                Import Activity Master Data
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Upload CSV file to import activities. Records will be processed
                sequentially.
              </Typography>
            </Box>
          </Box>

          {uploadMessage && (
            <Alert severity={uploadMessage.type} sx={{ mb: 2 }}>
              {uploadMessage.text}
            </Alert>
          )}

          <Box sx={{ display: "flex", gap: 2, alignItems: "center", mb: 3 }}>
            <input
              type="file"
              accept=".csv"
              onChange={handleActivityCSVUpload}
              disabled={uploadLoading || uploading}
              id="csv-upload"
              style={{ display: "none" }}
            />
            <Button
              variant="contained"
              component="label"
              htmlFor="csv-upload"
              startIcon={<CloudUpload />}
              disabled={uploadLoading || uploading}
            >
              {uploadLoading
                ? "Parsing..."
                : uploading
                  ? "Processing..."
                  : "Upload CSV"}
            </Button>
            {stopButtonVisible && (
              <Button
                variant="outlined"
                color="error"
                onClick={() => {
                  shouldStopRef.current = true;
                }}
              >
                Stop
              </Button>
            )}
            <Typography variant="body2" color="text.secondary">
              Supported format: CSV
            </Typography>
          </Box>

          {processStatuses.length > 0 && (
            <Box sx={{ mt: 3 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                <Typography variant="body2" fontWeight={600}>
                  Processing Progress
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {processedCount} / {processStatuses.length} records
                </Typography>
              </Box>
              <LinearProgress variant="determinate" value={progressPercent} />
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Processing Status Table */}
      {processStatuses.length > 0 && (
        <Card
          sx={{
            borderRadius: 3,
            boxShadow: `0 4px 20px ${alpha(theme.palette.common.black, 0.08)}`,
            mb: 3,
          }}
        >
          <CardContent sx={{ p: 0 }}>
            <TableContainer component={Paper} sx={{ boxShadow: "none" }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1) }}>
                    <TableCell sx={{ fontWeight: 600 }}>Row</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Message</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Details</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {processStatuses.map((status, index) => (
                    <TableRow key={index}>
                      <TableCell>{status.rowIndex}</TableCell>
                      <TableCell>
                        <Chip
                          label={status.status.toUpperCase()}
                          color={getStatusColor(status.status)}
                          size="small"
                          icon={getStatusIcon(status.status)}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {status.message || "-"}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="caption" color="text.secondary">
                          {Object.entries(status.record)
                            .slice(0, 2)
                            .map(([key, value]) => `${key}: ${value}`)
                            .join(" | ")}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}

      {/* Summary Card */}
      {summary && (
        <Card
          sx={{
            borderRadius: 3,
            boxShadow: `0 4px 20px ${alpha(theme.palette.common.black, 0.08)}`,
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>
              Processing Summary
            </Typography>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(3, 1fr)",
                },
                gap: 2,
              }}
            >
              <Box sx={{ p: 2, bgcolor: alpha("#2196F3", 0.1), borderRadius: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Total Records
                </Typography>
                <Typography variant="h5" fontWeight={700} sx={{ mt: 1 }}>
                  {summary.total}
                </Typography>
              </Box>

              <Box sx={{ p: 2, bgcolor: alpha("#4CAF50", 0.1), borderRadius: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Successfully Processed
                </Typography>
                <Typography
                  variant="h5"
                  fontWeight={700}
                  sx={{ mt: 1, color: "#4CAF50" }}
                >
                  {summary.success}
                </Typography>
              </Box>

              <Box sx={{ p: 2, bgcolor: alpha("#F44336", 0.1), borderRadius: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Failed
                </Typography>
                <Typography
                  variant="h5"
                  fontWeight={700}
                  sx={{ mt: 1, color: "#F44336" }}
                >
                  {summary.failed}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ mt: 3, p: 2, bgcolor: alpha(theme.palette.primary.main, 0.1), borderRadius: 2 }}>
              <Typography variant="body2">
                {summary.failed === 0
                  ? "✓ All records processed successfully!"
                  : `⚠ Processing complete with ${summary.failed} error(s). Please review the failed records above.`}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default UtilPage;
