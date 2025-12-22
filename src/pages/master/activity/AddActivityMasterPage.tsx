import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "../../../app/store";
import {
  Box,
  Button,
  Typography,
  Card,
  CardContent,
  useTheme,
  alpha,
  Alert,
  Snackbar,
  CircularProgress,
  Menu,
  MenuItem,
  Divider,
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { CustomTextField, CustomDropdown } from "../../../components/common";
import {
  addActivityMaster,
  updateActivityMaster,
  clearError,
  clearSuccess,
  fetchActivityMasterById,
  clearCurrentActivityMaster,
  fetchActMasterListForActivity,
} from "./slice/Activity.Slice";
import {
  selectActivityMasterLoading,
  selectActivityMasterError,
  selectActivityMasterSuccess,
  selectCurrentActivityMaster,
  selectFetchByIdLoading,
  selectActMasters,
  selectActMastersLoading,
} from "./slice/Activity.Selector";
import type {
  UpdateActivityMasterRequest,
  FrequencyTypeValue,
} from "./slice/Activity.Type";
import { FREQUENCY_OPTIONS, FrequencyType } from "./slice/Activity.Type";

const AddActivityMasterPage: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { id } = useParams();

  const loading = useSelector(selectActivityMasterLoading);
  const error = useSelector(selectActivityMasterError);
  const success = useSelector(selectActivityMasterSuccess);
  const currentActivityMaster = useSelector(selectCurrentActivityMaster);
  const fetchByIdLoading = useSelector(selectFetchByIdLoading);
  const actMasters = useSelector(selectActMasters);
  const actMastersLoading = useSelector(selectActMastersLoading);

  const isEditMode = !!id;
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [formData, setFormData] = useState({
    actID: "",
    activityName: "",
    description: "",
    frequency: "" as FrequencyTypeValue | "",
    dueDay: "",
    gracePeriodDay: "",
    reminderDay: "",
  });

  const [dueDayError, setDueDayError] = useState("");
  const [gracePeriodError, setGracePeriodError] = useState("");
  const [reminderDayError, setReminderDayError] = useState("");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openMenu = Boolean(anchorEl);

  useEffect(() => {
    dispatch(fetchActMasterListForActivity());
  }, [dispatch]);

  useEffect(() => {
    if (isEditMode && id) {
      dispatch(fetchActivityMasterById(id));
    }
  }, [dispatch, id, isEditMode]);

  useEffect(() => {
    if (isEditMode && currentActivityMaster) {
      // Pehle actID find karo actName se (agar match kare to)
      let matchedActID = "";
      if (currentActivityMaster.actName && actMasters.length > 0) {
        const matchedAct = actMasters.find(
          (act) => act.actName === currentActivityMaster.actName
          // agar department bhi match karna ho to add kar sakte ho:
          // && act.depaermentName === currentActivityMaster.departmentName
        );
        if (matchedAct) {
          matchedActID = matchedAct.actId;
        }
      }

      setFormData({
        actID: matchedActID || "",
        activityName: currentActivityMaster.activityName || "",
        description: currentActivityMaster.description || "",
        frequency: currentActivityMaster.frequency || "",
        dueDay: currentActivityMaster.dueDay?.toString() || "",
        gracePeriodDay: currentActivityMaster.gracePeriodDay?.toString() || "",
        reminderDay: currentActivityMaster.reminderDay?.toString() || "",
      });
    }
  }, [isEditMode, currentActivityMaster, actMasters]);

  useEffect(() => {
    if (success) {
      setShowSnackbar(true);
      setTimeout(() => {
        dispatch(clearSuccess());
        navigate("/dashboard/master/activity");
      }, 1500);
    }
  }, [success, navigate, dispatch]);

  useEffect(() => {
    if (error) {
      setShowSnackbar(true);
    }
  }, [error]);

  useEffect(() => {
    return () => {
      dispatch(clearCurrentActivityMaster());
      dispatch(clearSuccess());
      dispatch(clearError());
    };
  }, [dispatch]);

  const handleCloseSnackbar = () => {
    setShowSnackbar(false);
    if (error) {
      dispatch(clearError());
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Validate due day when frequency or dueDay changes
    if (name === "frequency" || name === "dueDay") {
      validateDueDay(
        name === "frequency"
          ? (value as FrequencyTypeValue)
          : formData.frequency,
        name === "dueDay" ? value : formData.dueDay
      );
    }

    // Validate grace period days
    if (name === "gracePeriodDay" || name === "frequency") {
      validateGracePeriod(
        formData.frequency,
        name === "gracePeriodDay" ? value : formData.gracePeriodDay
      );
    }

    // Validate reminder days
    if (name === "reminderDay" || name === "frequency") {
      validateReminderDays(
        formData.frequency,
        name === "reminderDay" ? value : formData.reminderDay
      );
    }
  };

  const validateDueDay = (
    frequency: FrequencyTypeValue | "",
    dueDay: string
  ) => {
    if (!frequency || !dueDay) {
      setDueDayError("");
      return true;
    }

    const dueDayNum = parseInt(dueDay);
    const frequencyOption = FREQUENCY_OPTIONS.find(
      (opt) => opt.value === frequency
    );

    if (!frequencyOption) {
      setDueDayError("");
      return true;
    }

    // For AS_NEEDED, allow any value without restriction
    if (frequency === FrequencyType.AS_NEEDED) {
      setDueDayError("");
      return true;
    }

    if (dueDayNum < 1 || dueDayNum > frequencyOption.maxDueDay) {
      setDueDayError(
        `Due day must be between 1 and ${frequencyOption.maxDueDay} for ${frequency}`
      );
      return false;
    }

    setDueDayError("");
    return true;
  };

  const validateGracePeriod = (
    frequency: FrequencyTypeValue | "",
    gracePeriod: string
  ) => {
    if (!frequency || !gracePeriod) {
      setGracePeriodError("");
      return true;
    }

    // For AS_NEEDED, allow any value without restriction
    if (frequency === FrequencyType.AS_NEEDED) {
      setGracePeriodError("");
      return true;
    }

    const gracePeriodNum = parseInt(gracePeriod);
    const frequencyOption = FREQUENCY_OPTIONS.find(
      (opt) => opt.value === frequency
    );

    if (!frequencyOption || gracePeriodNum < 0) {
      setGracePeriodError("");
      return true;
    }

    const maxAllowed = frequencyOption.maxDueDay;
    if (gracePeriodNum > maxAllowed) {
      setGracePeriodError(
        `Grace period cannot exceed ${maxAllowed} days for ${frequency}`
      );
      return false;
    }

    setGracePeriodError("");
    return true;
  };

  const validateReminderDays = (
    frequency: FrequencyTypeValue | "",
    reminderDays: string
  ) => {
    if (!frequency || !reminderDays) {
      setReminderDayError("");
      return true;
    }

    // For AS_NEEDED, allow any value without restriction
    if (frequency === FrequencyType.AS_NEEDED) {
      setReminderDayError("");
      return true;
    }

    const reminderDaysNum = parseInt(reminderDays);
    const frequencyOption = FREQUENCY_OPTIONS.find(
      (opt) => opt.value === frequency
    );

    if (!frequencyOption || reminderDaysNum < 0) {
      setReminderDayError("");
      return true;
    }

    const maxAllowed = frequencyOption.maxDueDay;
    if (reminderDaysNum > maxAllowed) {
      setReminderDayError(
        `Reminder days cannot exceed ${maxAllowed} days for ${frequency}`
      );
      return false;
    }

    setReminderDayError("");
    return true;
  };

  const calculateNextDates = () => {
    const today = new Date();
    const dates: string[] = [];
    const dueDay = formData.dueDay ? parseInt(formData.dueDay) : 1;

    if (!formData.frequency || !formData.dueDay) return dates;

    switch (formData.frequency) {
      case FrequencyType.WEEKLY: {
        // For weekly: dueDay is 1-7 (Monday-Sunday)
        // Find next occurrence of that weekday, then add 5 occurrences
        const targetDay = dueDay === 7 ? 0 : dueDay; // Convert to JS day (0=Sunday, 1=Monday, etc.)
        let currentDate = new Date(today);

        // Find the first occurrence
        const todayDay = currentDate.getDay();
        let daysUntilTarget = (targetDay - todayDay + 7) % 7;
        if (daysUntilTarget === 0) daysUntilTarget = 7; // If today is the target day, start from next week

        for (let i = 0; i < 5; i++) {
          const nextDate = new Date(currentDate);
          nextDate.setDate(currentDate.getDate() + daysUntilTarget + i * 7);
          dates.push(
            nextDate.toLocaleDateString("en-GB", {
              weekday: "short",
              day: "2-digit",
              month: "short",
              year: "numeric",
            })
          );
        }
        break;
      }

      case FrequencyType.FORTNIGHTLY: {
        // For fortnightly: dueDay is 1-15 (day of fortnight)
        // If today is 1-15, next cycle starts on 16th; if today is 16-31, next cycle starts on 1st of next month
        const todayDate = today.getDate();
        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();

        for (let i = 0; i < 5; i++) {
          let nextDate: Date;

          if (i === 0) {
            // First date calculation
            if (todayDate <= 15) {
              // Currently in first fortnight (1-15), next cycle starts on 16th
              if (dueDay <= 15) {
                nextDate = new Date(
                  currentYear,
                  currentMonth,
                  16 + (dueDay - 1)
                );
              } else {
                nextDate = new Date(
                  currentYear,
                  currentMonth,
                  16 + (dueDay - 1)
                );
              }
            } else {
              // Currently in second fortnight (16-31), next cycle starts on 1st of next month
              nextDate = new Date(currentYear, currentMonth + 1, dueDay);
            }
          } else {
            // Subsequent dates: alternate between 1st half and 2nd half
            const previousDate = new Date(
              dates[i - 1].split(" ").reverse().join("-")
            );
            const prevDate = previousDate.getDate();

            if (prevDate <= 15) {
              // Previous was in first fortnight, this should be in second fortnight
              nextDate = new Date(
                previousDate.getFullYear(),
                previousDate.getMonth(),
                16 + (dueDay - 1)
              );
            } else {
              // Previous was in second fortnight, this should be in first fortnight of next month
              nextDate = new Date(
                previousDate.getFullYear(),
                previousDate.getMonth() + 1,
                dueDay
              );
            }
          }

          dates.push(
            nextDate.toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })
          );
        }
        break;
      }

      case FrequencyType.MONTHLY: {
        // For monthly: dueDay is 1-31 (day of month)
        // Show next 5 months with that specific day
        for (let i = 0; i < 5; i++) {
          const nextDate = new Date(
            today.getFullYear(),
            today.getMonth() + i + 1,
            1
          );
          nextDate.setDate(
            Math.min(
              dueDay,
              new Date(
                nextDate.getFullYear(),
                nextDate.getMonth() + 1,
                0
              ).getDate()
            )
          );
          dates.push(
            nextDate.toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })
          );
        }
        break;
      }
      case FrequencyType.QUARTERLY: {
        // Quarterly: 4 periods in a year → Jan-Mar, Apr-Jun, Jul-Sep, Oct-Dec
        // Each quarter starts: Jan 1, Apr 1, Jul 1, Oct 1
        const quarterStarts = [0, 3, 6, 9]; // months: 0=Jan, 3=Apr, 6=Jul, 9=Oct
        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();

        // Find current quarter index
        let currentQuarterIndex = quarterStarts.findIndex(
          (m) => currentMonth < m
        );
        if (currentQuarterIndex === -1) currentQuarterIndex = 4; // if in Oct-Dec

        for (let i = 0; i < 5; i++) {
          const quarterIndex = (currentQuarterIndex + i) % 4;
          const yearOffset = Math.floor((currentQuarterIndex + i) / 4);
          const startMonth = quarterStarts[quarterIndex];

          const nextDate = new Date(currentYear + yearOffset, startMonth, 1);
          nextDate.setDate(nextDate.getDate() + dueDay - 1);

          dates.push(
            nextDate.toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })
          );
        }
        break;
      }
      case FrequencyType.HALF_YEARLY: {
        // For half yearly: dueDay is 1-183 (day of half year period)
        // If today is in first half (Jan-Jun), next cycle starts in second half (Jul-Dec)
        // If today is in second half (Jul-Dec), next cycle starts in first half of next year (Jan-Jun)
        const currentMonth = today.getMonth(); // 0-11
        const currentYear = today.getFullYear();

        for (let i = 0; i < 5; i++) {
          let nextDate: Date;

          if (i === 0) {
            // First date calculation
            if (currentMonth < 6) {
              // Currently in first half (Jan-Jun, months 0-5), next cycle starts in July (month 6)
              const julyFirst = new Date(currentYear, 6, 1);
              julyFirst.setDate(julyFirst.getDate() + dueDay - 1);
              nextDate = julyFirst;
            } else {
              // Currently in second half (Jul-Dec, months 6-11), next cycle starts in January of next year
              const janFirst = new Date(currentYear + 1, 0, 1);
              janFirst.setDate(janFirst.getDate() + dueDay - 1);
              nextDate = janFirst;
            }
          } else {
            // Subsequent dates: alternate between first half and second half
            const previousDate = new Date(
              dates[i - 1].split(" ").reverse().join("-")
            );
            const prevMonth = previousDate.getMonth();

            if (prevMonth < 6) {
              // Previous was in first half, this should be in second half (July onwards)
              const julyFirst = new Date(previousDate.getFullYear(), 6, 1);
              julyFirst.setDate(julyFirst.getDate() + dueDay - 1);
              nextDate = julyFirst;
            } else {
              // Previous was in second half, this should be in first half of next year
              const janFirst = new Date(previousDate.getFullYear() + 1, 0, 1);
              janFirst.setDate(janFirst.getDate() + dueDay - 1);
              nextDate = janFirst;
            }
          }

          dates.push(
            nextDate.toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })
          );
        }
        break;
      }

      case FrequencyType.ANNUALLY: {
        // For annually: dueDay is 1-365 (day of year)
        for (let i = 0; i < 5; i++) {
          const nextYear = today.getFullYear() + i + 1;
          const startOfYear = new Date(nextYear, 0, 1);
          startOfYear.setDate(startOfYear.getDate() + dueDay - 1);
          dates.push(
            startOfYear.toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })
          );
        }
        break;
      }

      default:
        break;
    }

    return dates;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateDueDay(formData.frequency, formData.dueDay)) {
      return;
    }

    if (!validateGracePeriod(formData.frequency, formData.gracePeriodDay)) {
      return;
    }

    if (!validateReminderDays(formData.frequency, formData.reminderDay)) {
      return;
    }

    // Calculate reminder date (current date + reminder days)
    // const reminderDate = new Date();
    // reminderDate.setDate(reminderDate.getDate() + parseInt(formData.reminderDay || '0'));
    // const reminderDayISO = reminderDate.toISOString();

    if (isEditMode && currentActivityMaster) {
      // Find the selected act master and get actName and departmentName separately
      const selectedAct = actMasters.find(
        (act) => act.actId === formData.actID
      );
      const actName = selectedAct ? selectedAct.actName : "";
      const departmentName = selectedAct ? selectedAct.depaermentName : "";

      const updateData: UpdateActivityMasterRequest = {
        activityId: currentActivityMaster.activityId,
        actName: actName,
        departmentName: departmentName,
        activityName: formData.activityName,
        description: formData.description,
        frequency: formData.frequency as string,
        dueDay: parseInt(formData.dueDay),
        gracePeriodDay: parseInt(formData.gracePeriodDay),
        reminderDay: parseInt(formData.reminderDay),
      };

      await dispatch(updateActivityMaster(updateData));
    } else {
      // Find the selected act master and get actName and departmentName separately
      const selectedAct = actMasters.find(
        (act) => act.actId === formData.actID
      );
      const actName = selectedAct ? selectedAct.actName : "";
      const departmentName = selectedAct ? selectedAct.depaermentName : "";

      const requestData = {
        activityId: "",
        actName: actName,
        departmentName: departmentName,
        activityName: formData.activityName,
        description: formData.description,
        frequency: formData.frequency as string,
        dueDay: parseInt(formData.dueDay),
        gracePeriodDay: parseInt(formData.gracePeriodDay),
        reminderDay: parseInt(formData.reminderDay),
      };

      await dispatch(addActivityMaster(requestData));
    }
  };

  if (isEditMode && fetchByIdLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <CircularProgress size={50} />
        <Typography variant="body1" color="text.secondary">
          Loading activity data...
        </Typography>
      </Box>
    );
  }

  if (actMastersLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <CircularProgress size={50} />
        <Typography variant="body1" color="text.secondary">
          Loading acts...
        </Typography>
      </Box>
    );
  }

  const actOptions = actMasters.map((act) => ({
    value: act.actId,
    label: `${act.actName} - ${act.depaermentName}`,
  }));

  const frequencyOptions = FREQUENCY_OPTIONS.map((freq) => ({
    value: freq.value,
    label: freq.label,
  }));

  const selectedFrequency = FREQUENCY_OPTIONS.find(
    (opt) => opt.value === formData.frequency
  );

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate("/dashboard/master/activity")}
          sx={{
            textTransform: "none",
            mb: 2,
            color: theme.palette.text.secondary,
            "&:hover": {
              bgcolor: alpha(theme.palette.primary.main, 0.1),
            },
          }}
        >
          Back to Activity List
        </Button>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          {isEditMode ? "Edit Activity" : "Add Activity"}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {isEditMode
            ? "Update activity information"
            : "Create a new compliance activity"}
        </Typography>
      </Box>

      <Card
        sx={{
          borderRadius: 3,
          boxShadow: `0 4px 20px ${alpha(theme.palette.common.black, 0.08)}`,
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Box component="form" onSubmit={handleSubmit}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                  gap: 3,
                }}
              >
                <CustomDropdown
                  label="Act Name - Department"
                  name="actID"
                  value={formData.actID}
                  onChange={handleChange}
                  options={actOptions}
                  required
                  placeholder="Select Act"
                />

                <CustomTextField
                  label="Activity Name"
                  name="activityName"
                  value={formData.activityName}
                  onChange={handleChange}
                  required
                  placeholder="e.g., EPF Monthly Return Filing"
                />
              </Box>

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                  gap: 3,
                }}
              >
                <Box>
                  <CustomDropdown
                    label="Frequency"
                    name="frequency"
                    value={formData.frequency}
                    onChange={handleChange}
                    options={frequencyOptions}
                    required
                    placeholder="Select Frequency"
                  />
                  {selectedFrequency && (
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ mt: 0.5, display: "block" }}
                    >
                      {selectedFrequency.description}
                    </Typography>
                  )}
                </Box>

                <Box sx={{ display: "flex", gap: 1, alignItems: "start" }}>
                  <Box sx={{ flex: "0 0 calc(50% - 4px)" }}>
                    <CustomTextField
                      label="Due Day"
                      name="dueDay"
                      type="number"
                      value={formData.dueDay}
                      onChange={handleChange}
                      required
                      placeholder={
                        formData.frequency === FrequencyType.WEEKLY
                          ? "1=Mon, 2=Tue, 3=Wed..."
                          : formData.frequency === FrequencyType.MONTHLY
                          ? "Enter 1-31"
                          : formData.frequency === FrequencyType.FORTNIGHTLY
                          ? "Enter 1-15"
                          : formData.frequency === FrequencyType.ANNUALLY
                          ? "Enter 1-365"
                          : formData.frequency === FrequencyType.HALF_YEARLY
                          ? "Enter 1-183"
                          : formData.frequency === FrequencyType.AS_NEEDED
                          ? "Enter any value"
                          : "Enter due day"
                      }
                      error={!!dueDayError}
                      helperText={dueDayError}
                      inputProps={{
                        min: 1,
                        max:
                          formData.frequency === FrequencyType.AS_NEEDED
                            ? undefined
                            : selectedFrequency?.maxDueDay || 365,
                      }}
                    />
                  </Box>
                  <Box sx={{ position: "relative" }}>
                    <Button
                      variant="outlined"
                      onClick={(e) => {
                        setAnchorEl(e.currentTarget);
                      }}
                      sx={{
                        minWidth: "120px",
                        height: "56px",
                        textTransform: "none",
                        borderRadius: 2,
                      }}
                    >
                      View next 5 due days
                    </Button>
                    <Menu
                      anchorEl={anchorEl}
                      open={openMenu}
                      onClose={() => setAnchorEl(null)}
                      anchorOrigin={{
                        vertical: "top",
                        horizontal: "left",
                      }}
                      transformOrigin={{
                        vertical: "bottom",
                        horizontal: "left",
                      }}
                      sx={{
                        "& .MuiPaper-root": {
                          minWidth: "200px",
                          mt: -1,
                        },
                      }}
                    >
                      <Typography
                        variant="caption"
                        sx={{
                          px: 2,
                          py: 1,
                          display: "block",
                          fontWeight: 600,
                          color: "text.secondary",
                        }}
                      >
                        Next 5 {formData.frequency} Dates:
                      </Typography>
                      <Divider />
                      {calculateNextDates().map((date, index) => (
                        <MenuItem
                          key={index}
                          onClick={() => {
                            setAnchorEl(null);
                          }}
                          sx={{ fontSize: "0.875rem" }}
                        >
                          {index + 1}. {date}
                        </MenuItem>
                      ))}
                    </Menu>
                  </Box>
                </Box>
              </Box>

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                  gap: 3,
                }}
              >
                <CustomTextField
                  label="Grace Period Days"
                  name="gracePeriodDay"
                  type="number"
                  value={formData.gracePeriodDay}
                  onChange={handleChange}
                  required
                  placeholder="Late submission buffer"
                  error={!!gracePeriodError}
                  helperText={gracePeriodError}
                  inputProps={{
                    min: 0,
                    max:
                      formData.frequency === FrequencyType.AS_NEEDED
                        ? undefined
                        : selectedFrequency?.maxDueDay || 365,
                  }}
                />

                <CustomTextField
                  label="Reminder Days"
                  name="reminderDay"
                  type="number"
                  value={formData.reminderDay}
                  onChange={handleChange}
                  required
                  placeholder="Days before due date"
                  error={!!reminderDayError}
                  helperText={reminderDayError}
                  inputProps={{
                    min: 0,
                    max:
                      formData.frequency === FrequencyType.AS_NEEDED
                        ? undefined
                        : selectedFrequency?.maxDueDay || 365,
                  }}
                />
              </Box>

              <CustomTextField
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                placeholder="Details about the activity"
                multiline
                rows={4}
              />
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
              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate("/dashboard/master/activity")}
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                  px: 4,
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={
                  loading ||
                  fetchByIdLoading ||
                  !!dueDayError ||
                  !!gracePeriodError ||
                  !!reminderDayError
                }
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                  px: 4,
                  boxShadow: `0 4px 15px ${alpha(
                    theme.palette.success.main,
                    0.4
                  )}`,
                  bgcolor: theme.palette.success.main,
                  "&:hover": {
                    bgcolor: theme.palette.success.dark,
                    boxShadow: `0 6px 20px ${alpha(
                      theme.palette.success.main,
                      0.5
                    )}`,
                  },
                }}
              >
                {loading
                  ? "Saving..."
                  : isEditMode
                  ? "Update Activity"
                  : "Submit & Save"}
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>

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
          {success
            ? isEditMode
              ? "Activity updated successfully!"
              : "Activity added successfully!"
            : error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AddActivityMasterPage;
