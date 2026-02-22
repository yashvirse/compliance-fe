import { useEffect, useState } from "react";
import {
  Box,
  Tabs,
  Tab,
  Typography,
  Switch,
  TextField,
  Paper,
  FormControlLabel,
  Divider,
  Button,
  Snackbar,
  Alert,
  Chip,
} from "@mui/material";
import { useSelector } from "react-redux";
import {
  selectMusterError,
  selectMusterLoading,
  selectMusterSuccess,
  selectSalaryError,
  selectSalaryLoading,
  selectSalarySuccess,
} from "./apiInteration.selector";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../../app/store";
import {
  executeMusterIntegration,
  executeSalaryIntegration,
} from "./apiIntegration.slice";

const ApiIntegration = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [musterEnabled, setMusterEnabled] = useState(false);
  const [salaryEnabled, setSalaryEnabled] = useState(false);
  const MusterURL = "https://api.ocmspro.com/api/ApiIntegration/muster-roll";
  const SalaryURL =
    "https://api.ocmspro.com/api/ApiIntegration/salary-register";
  const [musterApiUrl, setMusterApiUrl] = useState(MusterURL);
  const [musterApiKey, setMusterApiKey] = useState("");
  const [musterdescription, setMusterDescription] = useState("");
  const [registerApiUrl, setRegisterApiUrl] = useState(SalaryURL);
  const [registerApiKey, setRegisterApiKey] = useState("");
  const [registerDescription, setRegisterDescription] = useState("");
  const musterLoading = useSelector(selectMusterLoading);
  const salaryLoading = useSelector(selectSalaryLoading);
  const dispatch = useDispatch<AppDispatch>();
  const musterSuccess = useSelector(selectMusterSuccess);
  const musterError = useSelector(selectMusterError);
  const salarySuccess = useSelector(selectSalarySuccess);
  const salaryError = useSelector(selectSalaryError);
  const [musterErrors, setMusterErrors] = useState<any>({});
  const [salaryErrors, setSalaryErrors] = useState<any>({});
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarType, setSnackbarType] = useState<"success" | "error">(
    "success",
  );
  const API_Authentication_Key = "GZrGyb4JGz2v15PywgPcx9rHFwfrOQjgzITZEgWNg";

  const resetMusterForm = () => {
    setMusterEnabled(false);
    setMusterApiKey("");
    setMusterDescription("");
    setMusterErrors({});
    setMusterApiUrl(MusterURL);
  };

  const resetSalaryForm = () => {
    setSalaryEnabled(false);
    setRegisterApiKey("");
    setRegisterDescription("");
    setSalaryErrors({});
    setRegisterApiUrl(SalaryURL);
  };
  const validateMuster = () => {
    const errors: any = {};

    if (!musterApiKey.trim()) {
      errors.apiKey = "API Key is required";
    }

    if (!musterdescription.trim()) {
      errors.description = "Description JSON is required";
    } else {
      try {
        JSON.parse(musterdescription);
      } catch {
        errors.description = "Invalid JSON format";
      }
    }

    setMusterErrors(errors);
    return Object.keys(errors).length === 0;
  };
  const validateSalary = () => {
    const errors: any = {};

    if (!registerApiKey.trim()) {
      errors.apiKey = "API Key is required";
    }

    if (!registerDescription.trim()) {
      errors.description = "Description JSON is required";
    } else {
      try {
        JSON.parse(registerDescription);
      } catch {
        errors.description = "Invalid JSON format";
      }
    }

    setSalaryErrors(errors);
    return Object.keys(errors).length === 0;
  };
  useEffect(() => {
    if (musterSuccess) {
      setSnackbarMessage(musterSuccess.message);
      setSnackbarType("success");
      setShowSnackbar(true);
      resetMusterForm();
    }

    if (salarySuccess) {
      setSnackbarMessage(salarySuccess.message);
      setSnackbarType("success");
      setShowSnackbar(true);
      resetSalaryForm();
    }

    if (musterError) {
      setSnackbarMessage(musterError);
      setSnackbarType("error");
      setShowSnackbar(true);
    }

    if (salaryError) {
      setSnackbarMessage(salaryError);
      setSnackbarType("error");
      setShowSnackbar(true);
    }
  }, [musterSuccess, salarySuccess, musterError, salaryError]);

  const handleMusterCancel = () => {
    setMusterEnabled(false);
    setMusterApiKey("");
    setMusterDescription("");
    setMusterErrors({});
    setShowSnackbar(false);
    setMusterApiUrl(MusterURL);
  };
  const handleSalaryCancel = () => {
    setSalaryEnabled(false);
    setRegisterApiKey("");
    setRegisterDescription("");
    setSalaryErrors({});
    setShowSnackbar(false);
    setRegisterApiUrl(SalaryURL);
  };
  const executeMusterApi = async () => {
    if (!validateMuster()) return;

    const payload = {
      data: JSON.parse(musterdescription),
      apiKey: musterApiKey,
      apiUrl: musterApiUrl,
    };

    await dispatch(executeMusterIntegration(payload));
  };

  const executeSalaryApi = async () => {
    if (!validateSalary()) return;

    const payload = {
      data: JSON.parse(registerDescription),
      apiKey: registerApiKey,
      apiUrl: registerApiUrl,
    };

    await dispatch(executeSalaryIntegration(payload));
  };
  return (
    <Box>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h4" fontWeight={700}>
          Api Integration
        </Typography>
      </Box>
      <Paper sx={{ p: 3 }}>
        {/* ===== TABS HEADER ===== */}
        <Box
          sx={{
            borderBottom: "1px solid #ddd",
          }}
        >
          <Tabs
            value={tabIndex}
            onChange={(_, newValue) => setTabIndex(newValue)}
            variant="fullWidth"
            textColor="primary"
            indicatorColor="primary"
            sx={{
              "& .MuiTab-root": {
                textTransform: "none",
                fontWeight: 500,
                border: "1px solid #ddd",
                borderBottom: "none",
                borderTopLeftRadius: 6,
                borderTopRightRadius: 6,
                backgroundColor: "#f5f5f5",
                width: "50%",
              },
              "& .Mui-selected": {
                backgroundColor: "#fff",
                fontWeight: 600,
              },
            }}
          >
            <Tab label="Setup Muster Roll Integration" />
            <Tab label="Setup Salary Register Integration" />
          </Tabs>
        </Box>

        {/* ===== CONTENT BOX ===== */}
        <Box
          sx={{
            border: "1px solid #ddd",
            p: 3,
            backgroundColor: "#fff",
          }}
        >
          {/* ===== TAB 1 ===== */}
          {tabIndex === 0 && (
            <>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography variant="h6">Muster Roll API Setup</Typography>

                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                  }}
                >
                  <Chip
                    label={`API Authentication Key = ${API_Authentication_Key}`}
                    color="primary"
                  />
                </Typography>
              </Box>

              <Divider sx={{ mb: 2 }} />

              <FormControlLabel
                control={
                  <Switch
                    checked={musterEnabled}
                    onChange={(e) => setMusterEnabled(e.target.checked)}
                  />
                }
                label="Enable Muster Roll API"
              />

              {musterEnabled && (
                <Box
                  sx={{
                    mt: 2,
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                  }}
                >
                  <TextField
                    label="API Url"
                    fullWidth
                    value={musterApiUrl}
                    onChange={(e) => setMusterApiUrl(e.target.value)}
                  />
                  <TextField
                    label="API Authentication Key"
                    fullWidth
                    value={musterApiKey}
                    onChange={(e) => {
                      setMusterApiKey(e.target.value);
                      setMusterErrors({ ...musterErrors, apiKey: "" });
                    }}
                    error={!!musterErrors.apiKey}
                    helperText={musterErrors.apiKey}
                  />

                  <TextField
                    label="Description"
                    multiline
                    rows={8}
                    fullWidth
                    value={musterdescription}
                    placeholder={`
  {
  "month": 0,
  "year": 0,
  "musterRollRecords": [
    {
      "payDate": "2026-02-19T16:38:18.482Z",
      "company_Code": "string",
      "company_Name": "string",
      "site_Code": "string",
      "site_Name": "string",
      "emp_Code": "string",
      "emp_Name": "string",
      "gender": "string",
      "appointment_Date": "2026-02-19T16:38:18.482Z",
      "work_Nature": "string",
      "opening_Time": "string",
      "lunch_Time": "string",
      "closing_Time": "string",
      "noticeDate_UnderSection6": "2026-02-19T16:38:18.482Z",
      "descharge_Dismissal_Date": "2026-02-19T16:38:18.482Z",
      "delivery_Or_MiscarrageDate": "2026-02-19T16:38:18.482Z",
      "medical_Bonus_Ammount": 0,
      "maternaty_StartDate": "2026-02-19T16:38:18.482Z",
      "maternaty_EndDate": "2026-02-19T16:38:18.482Z",
      "day_1": "string",
      "day_2": "string",
      "day_3": "string",
      "day_4": "string",
      "day_5": "string",
      "day_6": "string",
      "day_7": "string",
      "day_8": "string",
      "day_9": "string",
      "day_10": "string",
      "day_11": "string",
      "day_12": "string",
      "day_13": "string",
      "day_14": "string",
      "day_15": "string",
      "day_16": "string",
      "day_17": "string",
      "day_18": "string",
      "day_19": "string",
      "day_20": "string",
      "day_21": "string",
      "day_22": "string",
      "day_23": "string",
      "day_24": "string",
      "day_25": "string",
      "day_26": "string",
      "day_27": "string",
      "day_28": "string",
      "day_29": "string",
      "day_30": "string",
      "day_31": "string"
    }
  ]
}`}
                    onChange={(e) => {
                      setMusterDescription(e.target.value);
                      setMusterErrors({ ...musterErrors, description: "" });
                    }}
                    error={!!musterErrors.description}
                    helperText={musterErrors.description}
                    sx={{
                      "& .MuiInputBase-root": {
                        backgroundColor: "black",
                        color: "white",
                      },
                      "& .MuiInputLabel-root": {
                        color: "white",
                      },
                      "& .MuiInputLabel-root.Mui-focused": {
                        color: "white",
                      },
                    }}
                  />
                  <Box
                    sx={{
                      mt: 4,
                      display: "flex",
                      justifyContent: "flex-end",
                      gap: 2,
                    }}
                  >
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={handleMusterCancel}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="contained"
                      onClick={executeMusterApi}
                      disabled={musterLoading}
                    >
                      {musterLoading ? "Executing..." : "Execute"}
                    </Button>{" "}
                  </Box>
                </Box>
              )}
            </>
          )}

          {/* ===== TAB 2 ===== */}
          {tabIndex === 1 && (
            <>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography variant="h6"> Salary Register API Setup</Typography>

                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                  }}
                >
                  <Chip
                    label={`API Authentication Key = ${API_Authentication_Key}`}
                    color="primary"
                  />
                </Typography>
              </Box>

              <Divider sx={{ mb: 2 }} />

              <FormControlLabel
                control={
                  <Switch
                    checked={salaryEnabled}
                    onChange={(e) => setSalaryEnabled(e.target.checked)}
                  />
                }
                label="Enable Salary Register API"
              />

              {salaryEnabled && (
                <Box
                  sx={{
                    mt: 2,
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                  }}
                >
                  <TextField
                    label="API Url"
                    fullWidth
                    value={registerApiUrl}
                    onChange={(e) => setRegisterApiUrl(e.target.value)}
                  />
                  <TextField
                    label="API Authentication Key"
                    fullWidth
                    value={registerApiKey}
                    onChange={(e) => {
                      setRegisterApiKey(e.target.value);
                      setSalaryErrors({ ...salaryErrors, apiKey: "" });
                    }}
                    error={!!salaryErrors.apiKey}
                    helperText={salaryErrors.apiKey}
                  />

                  <TextField
                    label="Description"
                    multiline
                    rows={8}
                    fullWidth
                    placeholder={`
  {
  "month": 0,
  "year": 0,
  "salaryRecords": [
    {
      "company_Name": "string",
      "site_Name": "string",
      "site_ID": "string",
      "site_Location": "string",
      "site_State": "string",
      "Emp_No.": "string",
      "emp_Name": "string",
      "emp_DOB": "2026-02-19T16:38:15.173Z",
      "emp_Joining_Dt": "2026-02-19T16:38:15.173Z",
      "group_DOJ": "2026-02-19T16:38:15.173Z",
      "emp_Leaving_Dt": "2026-02-19T16:38:15.173Z",
      "division": "string",
      "department": "string",
      "sub_Department": "string",
      "designation": "string",
      "bankName": "string",
      "Bank_Account_No.": "string",
      "ifsC_Code": "string",
      "payment_Mode": "string",
      "Pan_No.": "string",
      "pension_No": "string",
      "uan": "string",
      "email_Id": "string",
      "days": 0,
      "lop": 0,
      "basic": 0,
      "hra": 0,
      "supp_Allowence": 0,
      "bonus": 0,
      "ltA_Allowence": 0,
      "Books_&_Periodicals": 0,
      "Tel_&_Internet": 0,
      "attire": 0,
      "Petrol_&_Car": 0,
      "incentive": 0,
      "retention_Pay": 0,
      "fixed_Retention_Bonus": 0,
      "gross_Pay": 0,
      "income_Tax": 0,
      "pf": 0,
      "pF_Tax": 0,
      "esic": 0,
      "misc_Deduction": 0,
      "salary_Advance": 0,
      "gym_Fees": 0,
      "hols_Salary": 0,
      "pF_Misc": 0,
      "personal_Loan_Principal": 0,
      "personal_Loan_Interest": 0,
      "total_Deduction": 0,
      "net_Pay": 0
    }
  ]
}`}
                    value={registerDescription}
                    onChange={(e) => {
                      setRegisterDescription(e.target.value);
                      setSalaryErrors({ ...salaryErrors, description: "" });
                    }}
                    error={!!salaryErrors.description}
                    helperText={salaryErrors.description}
                    sx={{
                      "& .MuiInputBase-root": {
                        backgroundColor: "black",
                        color: "white",
                      },
                      "& .MuiInputLabel-root": {
                        color: "white",
                      },
                      "& .MuiInputLabel-root.Mui-focused": {
                        color: "white",
                      },
                    }}
                  />
                  <Box
                    sx={{
                      mt: 4,
                      display: "flex",
                      justifyContent: "flex-end",
                      gap: 2,
                    }}
                  >
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={handleSalaryCancel}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="contained"
                      onClick={executeSalaryApi}
                      disabled={salaryLoading}
                    >
                      {salaryLoading ? "Executing..." : "Execute"}
                    </Button>
                  </Box>
                </Box>
              )}
            </>
          )}
        </Box>
      </Paper>
      <Snackbar
        open={showSnackbar}
        autoHideDuration={4000}
        onClose={() => setShowSnackbar(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert severity={snackbarType}>{snackbarMessage}</Alert>
      </Snackbar>
    </Box>
  );
};

export default ApiIntegration;
