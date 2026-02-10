import { useState } from "react";
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
} from "@mui/material";

const ApiIntegration = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [musterEnabled, setMusterEnabled] = useState(false);
  const [salaryEnabled, setSalaryEnabled] = useState(false);

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
            variant="fullWidth" // 👈 full row
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
                width: "50%", // 👈 half-half
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
              <Typography variant="h6" mb={2}>
                Muster Roll API Setup
              </Typography>

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
                <Box sx={{ mt: 2, display: "flex", gap: 2 }}>
                  <TextField label="API Name" fullWidth />
                  <TextField label="API Key Name" fullWidth />
                </Box>
              )}
            </>
          )}

          {/* ===== TAB 2 ===== */}
          {tabIndex === 1 && (
            <>
              <Typography variant="h6" mb={2}>
                Salary Register API Setup
              </Typography>

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
                <Box sx={{ mt: 2, display: "flex", gap: 2 }}>
                  <TextField label="API Name" fullWidth />
                  <TextField label="API Key Name" fullWidth />
                </Box>
              )}
            </>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default ApiIntegration;
