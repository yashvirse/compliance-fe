import React, { useEffect, useState, useRef } from "react";
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
  MenuItem,
  Autocomplete,
  TextField,
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { CustomDropdown, CustomTextField } from "../../components/common";
import {
  addTemplate,
  clearTemplateError,
  clearTemplateSuccess,
  fetchTemplateById,
  getCompanyActivities,
  getIndiaStates,
  updateTemplateMaster,
} from "./TemplateFormaterSlice/TemplateFormater.slice";
import { useAppDispatch } from "../../app/hooks";
import { useSelector } from "react-redux";
import {
  selectTemplateFormaterDetail,
  selectTemplateFormaterError,
  selectTemplateFormaterSuccess,
} from "./TemplateFormaterSlice/TemaplateFormater.selector";
import JoditEditor from "jodit-react";
import type { StateItem } from "./TemplateFormaterSlice/TemplateFormater.type";
import { useParams } from "react-router-dom";
import Checkbox from "@mui/material/Checkbox";
import ListItemText from "@mui/material/ListItemText";

const AddTemplateFormater: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const editorRef = useRef(null);

  const [showSnackbar, setShowSnackbar] = useState(false);
  const success = useSelector(selectTemplateFormaterSuccess);
  const error = useSelector(selectTemplateFormaterError);
  const templateDetail = useSelector(selectTemplateFormaterDetail);

  const states = useSelector((state: any) => state.templateFormater.states);
  const [fileType, setFileType] = useState("");
  const [slipName, setSlipName] = useState("");
  // 🔹 change 1: stateId as array
  const [stateId, setStateId] = useState<string[]>([]);
  const [activity, setActivity] = useState("");
  const [htmlTemplate, setHtmlTemplate] = useState("");
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const companyId = localStorage.getItem("companyID") || "";
  const activityList = useSelector(
    (state: any) => state.templateFormater.activities,
  );
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "slipName") setSlipName(value);
    if (name === "stateId") setStateId(value as unknown as string[]);
    if (name === "activity") setActivity(value);
    if (name === "fileType") setFileType(value);
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };
  const { id: templateId } = useParams<{ id: string }>();
  const companyDomain = localStorage.getItem("companyDomain") || "";
  const message = useSelector((state: any) => state.templateFormater.message);
  useEffect(() => {
    dispatch(getIndiaStates());
    dispatch(getCompanyActivities(companyId));
  }, [dispatch]);

  useEffect(() => {
    if (templateId) {
      dispatch(fetchTemplateById(templateId));
    }
  }, [templateId, dispatch]);

  useEffect(() => {
    if (!templateId) {
      setSlipName("");
      setStateId([]);
      setActivity("");
      setHtmlTemplate("");
    }
  }, [templateId]);

  useEffect(() => {
    if (success) {
      setShowSnackbar(true);
      setTimeout(() => {
        dispatch(clearTemplateSuccess());
        navigate("/dashboard/tools/template-formatter");
      }, 1500);
    }
  }, [success, dispatch, navigate]);

  useEffect(() => {
    if (error) setShowSnackbar(true);
  }, [error]);

  const handleCloseSnackbar = () => {
    setShowSnackbar(false);
    if (error) dispatch(clearTemplateError());
  };
  useEffect(() => {
    if (templateId && templateDetail) {
      setSlipName(templateDetail.slipName);
      setFileType(templateDetail.fileTye);
      const selectedStates = states
        .filter((s: StateItem) =>
          templateDetail.stateName?.split(", ").includes(s.stateName),
        )
        .map((s: StateItem) => s.stateId);

      setStateId(selectedStates);
      setActivity(templateDetail.activityId);
      setHtmlTemplate(templateDetail.htmlTemplate);
    }
  }, [templateId, templateDetail, states]);
  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!slipName.trim()) {
      errors.slipName = "Form Name is required";
    }

    if (!fileType) {
      errors.fileType = "File Type is required";
    }

    if (stateId.length === 0) {
      errors.stateId = "At least one state is required";
    }

    if (!activity) {
      errors.activity = "Activity is required";
    }

    if (!htmlTemplate || htmlTemplate.trim() === "") {
      errors.htmlTemplate = "Template content is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    const selectedStates = states.filter((s: StateItem) =>
      stateId.includes(s.stateId),
    );

    const stateNames = selectedStates
      .map((s: { stateName: any }) => s.stateName)
      .join(", ");
    const selectedActivity = activityList.find(
      (a: any) => a.activityId === activity,
    );
    if (templateId) {
      dispatch(
        updateTemplateMaster({
          slipID: templateId,
          compID: companyId,
          compDomain: companyDomain,
          slipName,
          fileTye: fileType,
          htmlTemplate,
          stateName: stateNames,
          activityId: selectedActivity?.activityId || "",
          activityActName: selectedActivity
            ? `${selectedActivity.actName} - ${selectedActivity.activityName}`
            : "",
          createdOn: new Date().toISOString(),
        }),
      );
    } else {
      dispatch(
        addTemplate({
          slipID: "string",
          compID: "string",
          compDomain: "string",
          slipName,
          htmlTemplate,
          stateName: stateNames,
          fileTye: fileType,
          activityId: selectedActivity?.activityId || "",
          activityActName: selectedActivity
            ? `${selectedActivity.actName} - ${selectedActivity.activityName}`
            : "",
          createdOn: new Date().toISOString(),
        }),
      );
    }
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
          {templateId ? "Edit Template" : "Add Template"}
        </Typography>

        <Typography variant="body1" color="text.secondary">
          Create salary and muster template
        </Typography>
      </Box>

      {/* Form */}
      <Card sx={{ borderRadius: 3 }}>
        <CardContent sx={{ p: 4 }}>
          <Box component="form" onSubmit={handleSubmit}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
                <Box sx={{ flex: "1 1 calc(50% - 12px)", minWidth: 250 }}>
                  <CustomTextField
                    label="Form Name"
                    name="slipName"
                    value={slipName}
                    onChange={handleChange}
                    error={!!formErrors.slipName}
                    helperText={formErrors.slipName}
                  />
                </Box>
                <Box sx={{ flex: "1 1 calc(50% - 12px)", minWidth: 250 }}>
                  <CustomDropdown
                    label="File Type"
                    name="fileType"
                    value={fileType}
                    onChange={handleChange}
                    options={[
                      { label: "Muster Roll", value: "Muster Roll" },
                      { label: "Salary Register", value: "Salary Register" },
                    ]}
                    error={!!formErrors.fileType}
                    helperText={formErrors.fileType}
                  />
                </Box>
              </Box>
              <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
                <Box sx={{ flex: "1 1 calc(50% - 12px)", minWidth: 250 }}>
                  <CustomTextField
                    select
                    label="Applicable State"
                    name="stateId"
                    value={stateId}
                    onChange={handleChange}
                    error={!!formErrors.stateId}
                    helperText={formErrors.stateId}
                    SelectProps={{
                      multiple: true,
                      renderValue: (selected: any) =>
                        states
                          ?.filter((s: { stateId: any }) =>
                            selected.includes(s.stateId),
                          )
                          .map((s: { stateName: any }) => s.stateName)
                          .join(", "),
                    }}
                  >
                    {states?.map((state: StateItem) => (
                      <MenuItem key={state.stateId} value={state.stateId}>
                        <Checkbox checked={stateId.includes(state.stateId)} />
                        <ListItemText primary={state.stateName} />
                      </MenuItem>
                    ))}
                  </CustomTextField>
                </Box>
                <Box sx={{ flex: "1 1 calc(50% - 12px)", minWidth: 250 }}>
                  <Autocomplete
                    options={activityList}
                    getOptionLabel={(option: any) =>
                      `${option.actName} - ${option.activityName}`
                    }
                    value={
                      activityList.find(
                        (a: any) => a.activityId === activity,
                      ) || null
                    }
                    onChange={(_, newValue) => {
                      setActivity(newValue?.activityId || "");
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Applicable Activity"
                        error={!!formErrors.activity}
                        helperText={formErrors.activity}
                      />
                    )}
                  />
                </Box>
              </Box>
              <Box>
                <Typography variant="subtitle1" fontWeight={600} mb={1}>
                  Template
                </Typography>
                <JoditEditor
                  ref={editorRef}
                  value={htmlTemplate}
                  onBlur={(newContent) => setHtmlTemplate(newContent)}
                />
              </Box>
            </Box>

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
              {" "}
              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate(-1)}
                sx={{ borderRadius: 2, textTransform: "none", px: 4 }}
              >
                Cancel
              </Button>
              <Button type="submit" variant="contained">
                Save Template
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>

      <Snackbar
        open={showSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={success ? "success" : "error"}
          sx={{ width: "100%" }}
        >
          {message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AddTemplateFormater;
