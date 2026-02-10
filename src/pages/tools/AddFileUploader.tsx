import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Typography,
  Card,
  CardContent,
  useTheme,
  alpha,
  Snackbar,
  Alert,
} from "@mui/material";
import { ArrowBack, UploadFile } from "@mui/icons-material";
import { CustomDropdown, CustomTextField } from "../../components/common";
import {
  adduploaderFile,
  clearError,
  clearSuccess,
} from "./FileUploaderSlice/FileUploader.slice";
import { useAppDispatch } from "../../app/hooks";
import { useSelector } from "react-redux";
import {
  selectUploaderError,
  selectUploaderSuccess,
} from "./FileUploaderSlice/FileUploader.selector";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const AddFileUploader: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [showSnackbar, setShowSnackbar] = useState(false);
  const success = useSelector(selectUploaderSuccess);
  const error = useSelector(selectUploaderError);

  const [formData, setFormData] = useState({
    fileName: "",
    fileType: "",
    Month: "",
    Year: "",
    file: null as File | null,
  });

  // Add formErrors state for validation errors
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFormData({
        ...formData,
        file: e.target.files[0],
      });
    }
  };
  useEffect(() => {
    if (success) {
      setShowSnackbar(true);
      setTimeout(() => {
        dispatch(clearSuccess());
        navigate(-1);
      }, 1500);
    }
  }, [success, dispatch, navigate]);

  useEffect(() => {
    if (error) {
      setShowSnackbar(true);
    }
  }, [error]);

  const handleCloseSnackbar = () => {
    setShowSnackbar(false);
    if (error) dispatch(clearError());
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors({});

    const errors: Record<string, string> = {};

    // Validation
    if (!formData.fileName.trim()) {
      errors.fileName = "Please enter File Name";
    }
    if (!formData.fileType) {
      errors.fileType = "Please select File Type";
    }
    if (!formData.Month || !formData.Year) {
      errors.Month = "Please select Month and Year";
    }
    if (!formData.file) {
      errors.file = "Please upload a file";
    }

    // If errors exist, set them and stop submission
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    dispatch(
      adduploaderFile({
        CompanyId: "",
        CompanyDomain: "",
        FileName: formData.fileName,
        FileType: formData.fileType,
        Month: formData.Month,
        Year: formData.Year,
        UploadedOn: new Date().toISOString(),
        IsDeleted: false,
        Path: "",
        selectFile: formData.file as File,
      }),
    );
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate(-1)}
          sx={{
            textTransform: "none",
            mb: 2,
            color: theme.palette.text.secondary,
            "&:hover": {
              bgcolor: alpha(theme.palette.primary.main, 0.1),
            },
          }}
        >
          Back
        </Button>

        <Typography variant="h4" fontWeight={700} gutterBottom>
          Add File
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Upload muster roll or salary register file
        </Typography>
      </Box>

      {/* Form Card */}
      <Card
        sx={{
          borderRadius: 3,
          boxShadow: `0 4px 20px ${alpha(theme.palette.common.black, 0.08)}`,
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Box component="form" onSubmit={handleSubmit}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {/* Row 1 */}
              <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
                <Box sx={{ flex: "1 1 calc(50% - 12px)", minWidth: 250 }}>
                  <CustomTextField
                    label="File Name"
                    name="fileName"
                    value={formData.fileName}
                    onChange={handleChange}
                    error={!!formErrors.fileName}
                    helperText={formErrors.fileName}
                    placeholder="Enter file name"
                  />
                </Box>

                <Box sx={{ flex: "1 1 calc(50% - 12px)", minWidth: 250 }}>
                  <CustomDropdown
                    label="File Type"
                    name="fileType"
                    value={formData.fileType}
                    onChange={(e: { target: { value: string } }) =>
                      setFormData({
                        ...formData,
                        fileType: e.target.value as string,
                      })
                    }
                    options={[
                      { label: "Muster Roll", value: "Muster Roll" },
                      {
                        label: "Salary Register",
                        value: "Salary Register",
                      },
                    ]}
                    error={!!formErrors.fileType}
                    helperText={formErrors.fileType}
                  />
                </Box>
              </Box>

              {/* Row 2 */}
              <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
                <Box sx={{ flex: "1 1 calc(50% - 12px)", minWidth: 250 }}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      views={["year", "month"]}
                      label="Select Month"
                      value={
                        formData.Month && formData.Year
                          ? dayjs(`${formData.Year}-${formData.Month}-01`)
                          : null
                      }
                      onChange={(newValue) => {
                        setFormData({
                          ...formData,
                          Month: newValue ? newValue.format("MMMM") : "",
                          Year: newValue ? newValue.format("YYYY") : "",
                        });
                      }}
                      slotProps={{
                        textField: {
                          size: "medium",
                          fullWidth: true,
                          error: !!formErrors.Month,
                        },
                      }}
                    />
                  </LocalizationProvider>
                  {formErrors.Month && (
                    <Typography variant="caption" color="error">
                      {formErrors.Month}
                    </Typography>
                  )}
                </Box>

                <Box sx={{ flex: "1 1 calc(50% - 12px)", minWidth: 250 }}>
                  <Button
                    variant="outlined"
                    component="label"
                    fullWidth
                    aria-required="true"
                    startIcon={<UploadFile />}
                    sx={{
                      height: "56px",
                      textTransform: "none",
                      justifyContent: "flex-start",
                      pl: 2,
                    }}
                  >
                    {formData.file ? formData.file.name : "Upload File"}
                    <input type="file" hidden onChange={handleFileChange} />
                  </Button>
                  {formErrors.file && (
                    <Typography variant="caption" color="error">
                      {formErrors.file}
                    </Typography>
                  )}
                </Box>
              </Box>
            </Box>

            {/* Action Buttons */}
            <Box
              sx={{
                display: "flex",
                gap: 2,
                justifyContent: "flex-end",
                mt: 4,
                pt: 3,
                borderTop: `1px solid ${theme.palette.divider}`,
              }}
            >
              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate(-1)}
                sx={{ borderRadius: 2, textTransform: "none", px: 4 }}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                variant="contained"
                size="large"
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                  px: 4,
                  bgcolor: theme.palette.success.main,
                  boxShadow: `0 4px 15px ${alpha(
                    theme.palette.success.main,
                    0.4,
                  )}`,
                  "&:hover": {
                    bgcolor: theme.palette.success.dark,
                  },
                }}
              >
                Save File
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
      {/* Success/Error Snackbar */}
      <Snackbar
        open={showSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={success ? "success" : "error"}
          sx={{ width: "100%" }}
        >
          {success || error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AddFileUploader;
