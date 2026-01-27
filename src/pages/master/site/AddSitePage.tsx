import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import type { AppDispatch } from "../../../app/store";
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  Snackbar,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Divider,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
  Download as DownloadIcon,
  CloudUpload as CloudUploadIcon,
} from "@mui/icons-material";
import {
  addSite,
  updateSite,
  fetchSiteList,
  clearError,
  fetchCountriesAndStates,
  bulkUploadSite,
} from "./slice/Site.Slice";
import {
  selectSites,
  selectSiteLoading,
  selectSiteError,
} from "./slice/Site.Selector";
import type { Site, DefaultUser, State, CountryState } from "./slice/Site.Type";
import { apiClient, apiService } from "../../../services/api";
import type { GetUserListResponse } from "../customeradminuser/slice";
import { useAuth } from "../../../context/AuthContext";

const AddSitePage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const { user } = useAuth();

  const sites = useSelector(selectSites);
  const loading = useSelector(selectSiteLoading);
  const error = useSelector(selectSiteError);

  const [formData, setFormData] = useState<Site>({
    siteName: "",
    companyId: user?.companyID || "",
    compnanyDomain: user?.domain || "",
    description: "",
    siteLocation: "",
    state: "",
    country: "",
    siteId: "",
    latitude: "",
    longtitude: "",
    defaultUser: {
      defaultMaker: "",
      defaultMakerId: "",
      defaultChecker: "",
      defaultCheckerId: "",
      defaultReviewer: "",
      defaultReviewerId: "",
      defaultAuditer: "",
      defaultAuditerId: "",
    },
  });
  // New states for dynamic country & states
  const [countries, setCountries] = useState<CountryState[]>([]);
  const [selectedCountryId, setSelectedCountryId] = useState<string>(""); // Default India
  const [availableStates, setAvailableStates] = useState<State[]>([]);
  const [countryStateLoading, setCountryStateLoading] = useState(false);

  // Fetch user list from API
  const [userList, setUserList] = useState<
    Array<{ userID: string; userName: string; userRole: string }>
  >([]);
  const [userListLoading, setUserListLoading] = useState(false);

  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const isEditMode = !!id;

  // Fetch users on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setUserListLoading(true);
        const response = await apiClient.get<GetUserListResponse>(
          "User/getUserList"
        );
        // API returns data wrapped in result array
        if (
          response.data &&
          response.data.result &&
          Array.isArray(response.data.result)
        ) {
          setUserList(response.data.result);
        }
      } catch (err) {
        console.error("Error fetching user list:", err);
        // Show error but don't block form
        setSnackbarMessage("Failed to load user list");
        setSnackbarSeverity("error");
        setShowSnackbar(true);
      } finally {
        setUserListLoading(false);
      }
    };

    fetchUsers();
  }, []);
  // Fetch countries and states on mount
  useEffect(() => {
    const loadCountriesAndStates = async () => {
      setCountryStateLoading(true);
      try {
        const response = await dispatch(fetchCountriesAndStates()).unwrap();
        if (response.isSuccess && response.result) {
          setCountries(response.result);
        }
      } catch (err) {
        console.error("Failed to load countries/states", err);
        setSnackbarMessage("Failed to load countries and states");
        setSnackbarSeverity("error");
        setShowSnackbar(true);
      } finally {
        setCountryStateLoading(false);
      }
    };

    loadCountriesAndStates();
  }, [dispatch]);

  // Update available states when country changes
  useEffect(() => {
    const selected = countries.find((c) => c.countryId === selectedCountryId);
    if (selected) {
      setAvailableStates(selected.states);
      setFormData((prev) => ({
        ...prev,
        country: selected.countryName,
        state: isEditMode ? prev.state : "", // Reset state on country change
      }));
    }
  }, [selectedCountryId, countries]);

  // In edit mode, set correct country and states based on existing data
  useEffect(() => {
    if (isEditMode && formData.country && countries.length > 0) {
      const matched = countries.find(
        (c) =>
          c.countryName.toLowerCase() === formData.country.toLowerCase() ||
          c.countryId === formData.country
      );
      if (matched) {
        setSelectedCountryId(matched.countryId);
        setAvailableStates(matched.states);
      }
    }
  }, [formData.country, countries, isEditMode]);

  // Load site data in edit mode
  useEffect(() => {
    if (isEditMode && id) {
      if (sites.length === 0) {
        dispatch(fetchSiteList());
      } else {
        const site = sites.find((s: Site) => s.siteId === id);
        if (site) {
          setFormData(site);
        }
      }
    }
  }, [id, isEditMode, dispatch, sites]);

  useEffect(() => {
    if (error) {
      setSnackbarMessage(error);
      setSnackbarSeverity("error");
      setShowSnackbar(true);
    }
  }, [error]);

  const handleCloseSnackbar = () => {
    setShowSnackbar(false);
    dispatch(clearError());
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.siteName.trim()) {
      errors.siteName = "Site name is required";
    }
    if (!formData.siteLocation.trim()) {
      errors.siteLocation = "Address is required";
    }
    if (!formData.state.trim()) {
      errors.state = "State is required";
    }
    if (!formData.country.trim()) {
      errors.country = "Country is required";
    }
    if (!formData.latitude.trim()) {
      errors.latitude = "Latitude is required";
    }
    if (!formData.longtitude.trim()) {
      errors.longtitude = "Longtitude is required";
    }
    if (!formData.defaultUser.defaultMaker.trim()) {
      errors.defaultMaker = "Default Maker is required";
    }
    // if (!formData.defaultUser.defaultChecker.trim()) {
    //   errors.defaultChecker = "Default Checker is required";
    // }
    // if (!formData.defaultUser.defaultReviewer.trim()) {
    //   errors.defaultReviewer = "Default Reviewer is required";
    // }
    // if (!formData.defaultUser.defaultAuditer.trim()) {
    //   errors.defaultAuditer = "Default Auditor is required";
    // }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field when user starts typing
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleUserSelectChange = (fieldName: keyof DefaultUser) => (e: any) => {
    const selectedUserId = e.target.value;
    const selectedUser = userList.find((u) => u.userID === selectedUserId);

    setFormData((prev) => ({
      ...prev,
      defaultUser: {
        ...prev.defaultUser,
        [fieldName]: selectedUser?.userName || "",
        [fieldName === "defaultMaker"
          ? "defaultMakerId"
          : fieldName === "defaultChecker"
          ? "defaultCheckerId"
          : fieldName === "defaultReviewer"
          ? "defaultReviewerId"
          : "defaultAuditerId"]: selectedUserId,
      },
    }));

    if (formErrors[fieldName]) {
      setFormErrors((prev) => ({
        ...prev,
        [fieldName]: "",
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      let result;
      if (isEditMode && id) {
        result = await dispatch(
          updateSite({ ...formData, siteId: id })
        ).unwrap();
        setSnackbarMessage(result?.message || "Site updated successfully");
      } else {
        result = await dispatch(addSite(formData)).unwrap();
        setSnackbarMessage(result?.message || "Site added successfully");
      }
      setSnackbarSeverity("success");
      setShowSnackbar(true);

      setTimeout(() => {
        navigate("/dashboard/master/site");
      }, 2000);
    } catch (error: any) {
      setSnackbarMessage(error?.message || error || "An error occurred");
      setSnackbarSeverity("error");
      setShowSnackbar(true);
    }
  };

  const handleBack = () => {
    navigate("/dashboard/master/site");
  };

  const [bulkFile, setBulkFile] = useState<File | null>(null);

  const handleDownloadTemplate = async () => {
    try {
      await apiService.download(
        "Master/siteMasterCsvTemplate",
        "SiteMasterTemplate.csv"
      );
    } catch (err) {
      console.error("Template download error:", err);
      setSnackbarMessage("Failed to download template");
      setSnackbarSeverity("error");
      setShowSnackbar(true);
    }
  };

  const handleBulkFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.name.endsWith(".csv")) {
        setBulkFile(file);
      } else {
        setSnackbarMessage("Please select a CSV file");
        setSnackbarSeverity("error");
        setShowSnackbar(true);
      }
    }
  };

  const handleBulkUpload = async () => {
    if (!bulkFile) {
      setSnackbarMessage("Please select a CSV file first");
      setSnackbarSeverity("error");
      setShowSnackbar(true);
      return;
    }

    try {
      const result = await dispatch(bulkUploadSite(bulkFile)).unwrap();
      setSnackbarMessage(result?.message || "Bulk upload successful");
      setSnackbarSeverity("success");
      setShowSnackbar(true);
      setBulkFile(null);
      // Reset the file input
      const fileInput = document.getElementById(
        "bulk-site-upload"
      ) as HTMLInputElement;
      if (fileInput) fileInput.value = "";
      setTimeout(() => {
        navigate("/dashboard/master/site");
      }, 2000);
    } catch (err: any) {
      setSnackbarMessage(err || "Bulk upload failed");
      setSnackbarSeverity("error");
      setShowSnackbar(true);
    }
  };

  // Filter users by role
  const getMakerUsers = () =>
    userList.filter((user) => user.userRole === "Maker");
  const getCheckerUsers = () =>
    userList.filter((user) => user.userRole === "Checker");
  const getReviewerUsers = () =>
    userList.filter((user) => user.userRole === "Reviewer");
  const getAuditorUsers = () =>
    userList.filter((user) => user.userRole === "Auditor");

  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
          sx={{ mr: 2, textTransform: "none" }}
        >
          Back
        </Button>
        <Box>
          <Typography variant="h4" fontWeight={700}>
            {isEditMode ? "Edit Site" : "Add New Site"}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {isEditMode
              ? "Update site information"
              : "Create a new site master record"}
          </Typography>
        </Box>
      </Box>

      {/* Bulk Upload Section */}
      {!isEditMode && (
        <Paper sx={{ p: 4, borderRadius: 2, mb: 4 }}>
          <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
            Bulk Upload
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Download the template, fill it with site data, and upload it to add
            multiple sites at once.
          </Typography>

          <Box
            sx={{
              display: "flex",
              gap: 2,
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              onClick={handleDownloadTemplate}
              sx={{ textTransform: "none" }}
            >
              Download Template
            </Button>

            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <input
                type="file"
                accept=".csv"
                id="bulk-site-upload"
                style={{ display: "none" }}
                onChange={handleBulkFileChange}
              />
              <Button
                variant="outlined"
                component="label"
                htmlFor="bulk-site-upload"
                startIcon={<CloudUploadIcon />}
                sx={{ textTransform: "none" }}
              >
                {bulkFile ? bulkFile.name : "Select CSV File"}
              </Button>

              <Button
                variant="contained"
                onClick={handleBulkUpload}
                disabled={!bulkFile || loading}
                sx={{ textTransform: "none" }}
              >
                {loading ? "Uploading..." : "Upload & Process"}
              </Button>
            </Box>
          </Box>
        </Paper>
      )}

      <Paper sx={{ p: 4, borderRadius: 2 }}>
        <form onSubmit={handleSubmit}>
          {/* Site Basic Information */}
          <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
            Site Information
          </Typography>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Site Name"
                name="siteName"
                value={formData.siteName}
                onChange={handleChange}
                error={!!formErrors.siteName}
                helperText={formErrors.siteName}
                placeholder="Enter site name"
                variant="outlined"
                required
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter site description"
                variant="outlined"
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Site Address"
                name="siteLocation"
                value={formData.siteLocation}
                onChange={handleChange}
                error={!!formErrors.siteLocation}
                helperText={formErrors.siteLocation}
                placeholder="Enter site address"
                variant="outlined"
                required
              />
            </Grid>

            {/* Dynamic Country Select */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl
                fullWidth
                error={!!formErrors.country}
                disabled={countryStateLoading}
                required
              >
                <InputLabel>Country</InputLabel>
                <Select
                  value={selectedCountryId}
                  onChange={(e) => {
                    setSelectedCountryId(e.target.value);
                    if (formErrors.country) {
                      setFormErrors((prev) => ({ ...prev, country: "" }));
                    }
                  }}
                  label="Country"
                >
                  <MenuItem value="">Select Country</MenuItem>
                  {countries.map((country) => (
                    <MenuItem key={country.countryId} value={country.countryId}>
                      {country.countryName}
                    </MenuItem>
                  ))}
                </Select>
                {countryStateLoading && (
                  <CircularProgress size={20} sx={{ mt: 1 }} />
                )}
              </FormControl>
            </Grid>

            {/* Dynamic State Select */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl
                fullWidth
                error={!!formErrors.state}
                disabled={countryStateLoading || availableStates.length === 0}
                required
              >
                <InputLabel>State</InputLabel>
                <Select
                  value={formData.state}
                  onChange={(e) => {
                    setFormData((prev) => ({ ...prev, state: e.target.value }));
                    if (formErrors.state) {
                      setFormErrors((prev) => ({ ...prev, state: "" }));
                    }
                  }}
                  label="State"
                >
                  <MenuItem value="">Select State</MenuItem>
                  {availableStates.map((state) => (
                    <MenuItem key={state.stateId} value={state.stateName}>
                      {state.stateName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Latitude"
                name="latitude"
                value={formData.latitude}
                onChange={handleChange}
                error={!!formErrors.latitude}
                helperText={formErrors.latitude}
                placeholder="Enter site Latitude"
                variant="outlined"
                required
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="longtitude"
                name="longtitude"
                value={formData.longtitude}
                onChange={handleChange}
                error={!!formErrors.longtitude}
                helperText={formErrors.longtitude}
                placeholder="Enter site longtitude"
                variant="outlined"
                required
              />
            </Grid>
          </Grid>

          {/* Default Users Section */}
          <Divider sx={{ my: 4 }} />
          <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
            Default Users{" "}
            {userListLoading && <CircularProgress size={20} sx={{ ml: 2 }} />}
          </Typography>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl
                fullWidth
                error={!!formErrors.defaultMaker}
                disabled={userListLoading}
                required
              >
                <InputLabel>Default Maker</InputLabel>
                <Select
                  value={formData.defaultUser.defaultMakerId}
                  onChange={handleUserSelectChange("defaultMaker")}
                  label="Default Maker"
                >
                  <MenuItem value="">Select Maker</MenuItem>
                  {getMakerUsers().map((user) => (
                    <MenuItem key={user.userID} value={user.userID}>
                      {user.userName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl
                fullWidth
                error={!!formErrors.defaultChecker}
                disabled={userListLoading}
              >
                <InputLabel>Default Checker</InputLabel>
                <Select
                  value={formData.defaultUser.defaultCheckerId}
                  onChange={handleUserSelectChange("defaultChecker")}
                  label="Default Checker"
                >
                  <MenuItem value="">Select Checker</MenuItem>
                  {getCheckerUsers().map((user) => (
                    <MenuItem key={user.userID} value={user.userID}>
                      {user.userName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl
                fullWidth
                error={!!formErrors.defaultReviewer}
                disabled={userListLoading}
              >
                <InputLabel>Default Reviewer</InputLabel>
                <Select
                  value={formData.defaultUser.defaultReviewerId}
                  onChange={handleUserSelectChange("defaultReviewer")}
                  label="Default Reviewer"
                >
                  <MenuItem value="">Select Reviewer</MenuItem>
                  {getReviewerUsers().map((user) => (
                    <MenuItem key={user.userID} value={user.userID}>
                      {user.userName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl
                fullWidth
                error={!!formErrors.defaultAuditer}
                disabled={userListLoading}
              >
                <InputLabel>Default Auditor</InputLabel>
                <Select
                  value={formData.defaultUser.defaultAuditerId}
                  onChange={handleUserSelectChange("defaultAuditer")}
                  label="Default Auditor"
                >
                  <MenuItem value="">Select Auditor</MenuItem>
                  {getAuditorUsers().map((user) => (
                    <MenuItem key={user.userID} value={user.userID}>
                      {user.userName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          {/* Form Actions */}
          <Grid size={{ xs: 12 }}>
            <Box
              sx={{
                display: "flex",
                gap: 2,
                justifyContent: "flex-start",
                mt: 4,
              }}
            >
              <Button
                variant="contained"
                startIcon={
                  loading ? <CircularProgress size={20} /> : <SaveIcon />
                }
                onClick={handleSubmit}
                disabled={loading || userListLoading}
                sx={{ textTransform: "none", borderRadius: 2 }}
              >
                {loading
                  ? isEditMode
                    ? "Updating..."
                    : "Saving..."
                  : isEditMode
                  ? "Update Site"
                  : "Save Site"}
              </Button>
              <Button
                variant="outlined"
                onClick={handleBack}
                disabled={loading}
                sx={{ textTransform: "none", borderRadius: 2 }}
              >
                Cancel
              </Button>
            </Box>
          </Grid>
        </form>
      </Paper>

      <Snackbar
        open={showSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AddSitePage;
