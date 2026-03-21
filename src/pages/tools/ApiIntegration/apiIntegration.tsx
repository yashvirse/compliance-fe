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
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
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
import { useAuth } from "../../../context/AuthContext"; // path adjust karo
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
  const { user } = useAuth();
  const [openMusterFormat, setOpenMusterFormat] = useState(false);
  const [formatData, setFormatData] = useState("");
  const [openSalaryFormat, setOpenSalaryFormat] = useState(false);
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
  const musterFormatExample = {
    month: 2,
    year: 2026,
    musterRollRecords: [
      {
        payDate: "2026-02-01T00:00:00.000Z",
        company_Code: "CMP001",
        company_Name: "ABC Pvt Ltd",
        site_Code: "SITE01",
        site_Name: "Mumbai Site",
        emp_Code: "EMP001",
        emp_Name: "Rahul Sharma",
        gender: "Male",
        appointment_Date: "2025-06-15T00:00:00.000Z",
        work_Nature: "Supervisor",
        opening_Time: "09:00",
        lunch_Time: "13:00",
        closing_Time: "18:00",
        noticeDate_UnderSection6: "2026-01-15T00:00:00.000Z",
        descharge_Dismissal_Date: "2026-01-31T00:00:00.000Z",
        delivery_Or_MiscarrageDate: "2026-01-10T00:00:00.000Z",
        medical_Bonus_Ammount: 0,
        maternaty_StartDate: "2026-01-01T00:00:00.000Z",
        maternaty_EndDate: "2026-03-01T00:00:00.000Z",
        day_1: "P",
        day_2: "P",
        day_3: "P",
        day_4: "P",
        day_5: "P",
        day_6: "A",
        day_7: "W",
        day_8: "P",
        day_9: "P",
        day_10: "P",
        day_11: "P",
        day_12: "A",
        day_13: "P",
        day_14: "W",
        day_15: "P",
        day_16: "P",
        day_17: "P",
        day_18: "P",
        day_19: "A",
        day_20: "P",
        day_21: "W",
        day_22: "P",
        day_23: "P",
        day_24: "P",
        day_25: "P",
        day_26: "P",
        day_27: "A",
        day_28: "P",
        day_29: "",
        day_30: "",
        day_31: "",
      },
      {
        payDate: "2026-02-01T00:00:00.000Z",
        company_Code: "CMP001",
        company_Name: "ABC Pvt Ltd",
        site_Code: "SITE02",
        site_Name: "Delhi Site",
        emp_Code: "EMP002",
        emp_Name: "Priya Singh",
        gender: "Female",
        appointment_Date: "2024-03-10T00:00:00.000Z",
        work_Nature: "Accountant",
        opening_Time: "10:00",
        lunch_Time: "14:00",
        closing_Time: "19:00",
        noticeDate_UnderSection6: "2026-01-10T00:00:00.000Z",
        descharge_Dismissal_Date: "2026-01-20T00:00:00.000Z",
        delivery_Or_MiscarrageDate: "2026-01-05T00:00:00.000Z",
        medical_Bonus_Ammount: 5000,
        maternaty_StartDate: "2026-01-01T00:00:00.000Z",
        maternaty_EndDate: "2026-04-01T00:00:00.000Z",
        day_1: "P",
        day_2: "P",
        day_3: "P",
        day_4: "P",
        day_5: "P",
        day_6: "P",
        day_7: "W",
        day_8: "P",
        day_9: "A",
        day_10: "P",
        day_11: "P",
        day_12: "P",
        day_13: "W",
        day_14: "P",
        day_15: "P",
        day_16: "P",
        day_17: "A",
        day_18: "P",
        day_19: "P",
        day_20: "W",
        day_21: "P",
        day_22: "P",
        day_23: "P",
        day_24: "A",
        day_25: "P",
        day_26: "P",
        day_27: "P",
        day_28: "W",
        day_29: "",
        day_30: "",
        day_31: "",
      },
      {
        payDate: "2026-02-01T00:00:00.000Z",
        company_Code: "CMP002",
        company_Name: "XYZ Industries",
        site_Code: "SITE03",
        site_Name: "Pune Plant",
        emp_Code: "EMP003",
        emp_Name: "Amit Verma",
        gender: "Male",
        appointment_Date: "2023-09-01T00:00:00.000Z",
        work_Nature: "Machine Operator",
        opening_Time: "08:00",
        lunch_Time: "12:30",
        closing_Time: "17:00",
        noticeDate_UnderSection6: "2026-01-12T00:00:00.000Z",
        descharge_Dismissal_Date: "2026-01-28T00:00:00.000Z",
        delivery_Or_MiscarrageDate: "2026-01-08T00:00:00.000Z",
        medical_Bonus_Ammount: 0,
        maternaty_StartDate: "2026-01-01T00:00:00.000Z",
        maternaty_EndDate: "2026-02-28T00:00:00.000Z",
        day_1: "P",
        day_2: "P",
        day_3: "A",
        day_4: "P",
        day_5: "P",
        day_6: "W",
        day_7: "P",
        day_8: "P",
        day_9: "P",
        day_10: "P",
        day_11: "A",
        day_12: "P",
        day_13: "P",
        day_14: "W",
        day_15: "P",
        day_16: "P",
        day_17: "P",
        day_18: "A",
        day_19: "P",
        day_20: "P",
        day_21: "W",
        day_22: "P",
        day_23: "P",
        day_24: "P",
        day_25: "A",
        day_26: "P",
        day_27: "P",
        day_28: "W",
        day_29: "",
        day_30: "",
        day_31: "",
      },
    ],
  };
  const salaryFormatExample = {
    month: 2,
    year: 2026,
    salaryRecords: [
      {
        company_Name: "ABC Pvt Ltd",
        site_Name: "Mumbai Site",
        site_ID: "SITE01",
        site_Location: "Mumbai",
        site_State: "Maharashtra",
        "Emp_No.": "EMP001",
        emp_Name: "Rahul Sharma",
        emp_DOB: "1995-05-10T00:00:00.000Z",
        emp_Joining_Dt: "2022-01-15T00:00:00.000Z",
        group_DOJ: "2022-01-15T00:00:00.000Z",
        emp_Leaving_Dt: null,
        division: "Operations",
        department: "Production",
        sub_Department: "Assembly",
        designation: "Supervisor",
        bankName: "HDFC Bank",
        "Bank_Account_No.": "50200012345678",
        ifsC_Code: "HDFC0001234",
        payment_Mode: "Bank Transfer",
        "Pan_No.": "ABCDE1234F",
        pension_No: "PEN001",
        uan: "100200300400",
        email_Id: "rahul.sharma@example.com",
        days: 28,
        lop: 2,
        basic: 25000,
        hra: 10000,
        supp_Allowence: 3000,
        bonus: 2000,
        ltA_Allowence: 1500,
        "Books_&_Periodicals": 500,
        "Tel_&_Internet": 800,
        attire: 1000,
        "Petrol_&_Car": 2500,
        incentive: 3000,
        retention_Pay: 0,
        fixed_Retention_Bonus: 0,
        gross_Pay: 49300,
        income_Tax: 2500,
        pf: 3000,
        pF_Tax: 200,
        esic: 500,
        misc_Deduction: 0,
        salary_Advance: 0,
        gym_Fees: 0,
        hols_Salary: 0,
        pF_Misc: 0,
        personal_Loan_Principal: 0,
        personal_Loan_Interest: 0,
        total_Deduction: 6200,
        net_Pay: 43100,
      },
      {
        company_Name: "ABC Pvt Ltd",
        site_Name: "Delhi Site",
        site_ID: "SITE02",
        site_Location: "Delhi",
        site_State: "Delhi",
        "Emp_No.": "EMP002",
        emp_Name: "Priya Singh",
        emp_DOB: "1992-09-20T00:00:00.000Z",
        emp_Joining_Dt: "2021-03-01T00:00:00.000Z",
        group_DOJ: "2021-03-01T00:00:00.000Z",
        emp_Leaving_Dt: null,
        division: "Finance",
        department: "Accounts",
        sub_Department: "Payroll",
        designation: "Accountant",
        bankName: "ICICI Bank",
        "Bank_Account_No.": "123456789012",
        ifsC_Code: "ICIC0004567",
        payment_Mode: "Bank Transfer",
        "Pan_No.": "PQRSX5678L",
        pension_No: "PEN002",
        uan: "200300400500",
        email_Id: "priya.singh@example.com",
        days: 30,
        lop: 0,
        basic: 30000,
        hra: 12000,
        supp_Allowence: 4000,
        bonus: 5000,
        ltA_Allowence: 2000,
        "Books_&_Periodicals": 1000,
        "Tel_&_Internet": 1000,
        attire: 1500,
        "Petrol_&_Car": 0,
        incentive: 4000,
        retention_Pay: 2000,
        fixed_Retention_Bonus: 0,
        gross_Pay: 62500,
        income_Tax: 4000,
        pf: 3600,
        pF_Tax: 300,
        esic: 600,
        misc_Deduction: 0,
        salary_Advance: 2000,
        gym_Fees: 500,
        hols_Salary: 0,
        pF_Misc: 0,
        personal_Loan_Principal: 0,
        personal_Loan_Interest: 0,
        total_Deduction: 11000,
        net_Pay: 51500,
      },
      {
        company_Name: "XYZ Industries",
        site_Name: "Pune Plant",
        site_ID: "SITE03",
        site_Location: "Pune",
        site_State: "Maharashtra",
        "Emp_No.": "EMP003",
        emp_Name: "Amit Verma",
        emp_DOB: "1990-12-05T00:00:00.000Z",
        emp_Joining_Dt: "2020-07-10T00:00:00.000Z",
        group_DOJ: "2020-07-10T00:00:00.000Z",
        emp_Leaving_Dt: null,
        division: "Manufacturing",
        department: "Operations",
        sub_Department: "Machine Unit",
        designation: "Machine Operator",
        bankName: "State Bank of India",
        "Bank_Account_No.": "987654321098",
        ifsC_Code: "SBIN0007890",
        payment_Mode: "Bank Transfer",
        "Pan_No.": "LMNOP9876K",
        pension_No: "PEN003",
        uan: "300400500600",
        email_Id: "amit.verma@example.com",
        days: 27,
        lop: 3,
        basic: 22000,
        hra: 9000,
        supp_Allowence: 2500,
        bonus: 1500,
        ltA_Allowence: 1000,
        "Books_&_Periodicals": 0,
        "Tel_&_Internet": 500,
        attire: 800,
        "Petrol_&_Car": 2000,
        incentive: 2500,
        retention_Pay: 0,
        fixed_Retention_Bonus: 0,
        gross_Pay: 41800,
        income_Tax: 2000,
        pf: 2640,
        pF_Tax: 200,
        esic: 400,
        misc_Deduction: 0,
        salary_Advance: 1000,
        gym_Fees: 0,
        hols_Salary: 0,
        pF_Misc: 0,
        personal_Loan_Principal: 2000,
        personal_Loan_Interest: 300,
        total_Deduction: 8540,
        net_Pay: 33260,
      },
    ],
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
                  {user?.role === "CustomerAdmin" && (
                    <Chip
                      label={`API Authentication Key = ${user?.apiKey}`}
                      color="primary"
                    />
                  )}
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
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => {
                      setFormatData(
                        JSON.stringify(musterFormatExample, null, 2),
                      );
                      setOpenMusterFormat(true);
                    }}
                  >
                    View Description Format
                  </Button>
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
                  {user?.role === "CustomerAdmin" && (
                    <Chip
                      label={`API Authentication Key = ${user?.apiKey}`}
                      color="primary"
                    />
                  )}
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
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => {
                      setFormatData(
                        JSON.stringify(salaryFormatExample, null, 2),
                      );
                      setOpenSalaryFormat(true);
                    }}
                  >
                    View Description Format
                  </Button>
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
      <Dialog
        open={openMusterFormat}
        onClose={() => setOpenMusterFormat(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Description Format Example</DialogTitle>

        <DialogContent>
          <TextField
            multiline
            rows={18}
            fullWidth
            value={formatData}
            onChange={(e) => setFormatData(e.target.value)}
            variant="outlined"
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpenMusterFormat(false)}>Close</Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openSalaryFormat}
        onClose={() => setOpenSalaryFormat(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Description Format Example</DialogTitle>

        <DialogContent>
          <TextField
            multiline
            rows={18}
            fullWidth
            value={formatData}
            onChange={(e) => setFormatData(e.target.value)}
            variant="outlined"
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpenSalaryFormat(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ApiIntegration;
