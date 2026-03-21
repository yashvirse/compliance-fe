import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Collapse,
  Chip,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useDispatch, useSelector } from "react-redux";
import { fetchGeneratedReports } from "./Register.slice";
import { selectSalaryLoading, selectSalaryReports } from "./Registers.selector";
import { CircularProgress } from "@mui/material";
const monthNames = [
  "",
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const Registers = () => {
  const dispatch = useDispatch();

  const reports = useSelector(selectSalaryReports);
  const loading = useSelector(selectSalaryLoading);

  const [expandedYears, setExpandedYears] = useState(new Set());
  const [expandedMonths, setExpandedMonths] = useState(new Set());
  const [expandedStates, setExpandedStates] = useState(new Set());

  useEffect(() => {
    dispatch(fetchGeneratedReports() as any);
  }, [dispatch]);

  const toggle = (setState: any, key: string) => {
    const newSet = new Set(setState);
    if (newSet.has(key)) newSet.delete(key);
    else newSet.add(key);
    return newSet;
  };

  /* ==========================
     GROUP DATA
  ========================== */

  const groupedData =
    reports?.reduce((acc: any, item: any) => {
      const year = item.reportYear;
      const month = monthNames[Number(item.reportMonth)];
      const state = item.siteState;

      if (!acc[year]) acc[year] = {};
      if (!acc[year][month]) acc[year][month] = {};
      if (!acc[year][month][state]) acc[year][month][state] = [];

      acc[year][month][state].push(item);

      return acc;
    }, {}) || {};

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight={700}>
          Salary and Muster Roll Registers
        </Typography>
      </Box>

      {/* Main Table */}
      <Paper sx={{ borderRadius: 3 }}>
        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: 200,
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer sx={{ overflowX: "auto" }}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                  <TableCell width={50} sx={{ borderTopLeftRadius: "20px" }} />

                  <TableCell>Name</TableCell>

                  <TableCell sx={{ borderTopRightRadius: "20px" }}>
                    Type
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {Object.keys(groupedData).length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} align="center">
                      <Typography sx={{ py: 4 }}>
                        No Salary and Muster Roll Registers
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  Object.keys(groupedData).map((year) => {
                    const yearKey = `year-${year}`;
                    const yearOpen = expandedYears.has(yearKey);

                    return (
                      <React.Fragment key={yearKey}>
                        {/* YEAR ROW */}
                        <TableRow
                          hover
                          onClick={() =>
                            setExpandedYears(toggle(expandedYears, yearKey))
                          }
                          sx={{ cursor: "pointer" }}
                        >
                          <TableCell>
                            <IconButton size="small">
                              <KeyboardArrowDownIcon />
                            </IconButton>
                          </TableCell>

                          <TableCell>
                            <Typography fontWeight={700}>{year}</Typography>
                          </TableCell>

                          <TableCell>
                            <Chip label="Year" size="small" color="success" />
                          </TableCell>
                        </TableRow>

                        {/* YEAR COLLAPSE */}
                        <TableRow>
                          <TableCell colSpan={3} sx={{ p: 0 }}>
                            <Collapse in={yearOpen} timeout="auto">
                              <Table size="small">
                                <TableBody>
                                  {Object.keys(groupedData[year]).map(
                                    (month) => {
                                      const monthKey = `${year}-${month}`;
                                      const monthOpen =
                                        expandedMonths.has(monthKey);

                                      return (
                                        <React.Fragment key={monthKey}>
                                          {/* MONTH ROW */}
                                          <TableRow
                                            hover
                                            onClick={() =>
                                              setExpandedMonths(
                                                toggle(
                                                  expandedMonths,
                                                  monthKey,
                                                ),
                                              )
                                            }
                                            sx={{ cursor: "pointer" }}
                                          >
                                            <TableCell width={50}>
                                              <IconButton size="small">
                                                <KeyboardArrowDownIcon />
                                              </IconButton>
                                            </TableCell>

                                            <TableCell>
                                              <Typography fontWeight={600}>
                                                {month}
                                              </Typography>
                                            </TableCell>

                                            <TableCell>
                                              <Chip
                                                label="Month"
                                                size="small"
                                                color="primary"
                                              />
                                            </TableCell>
                                          </TableRow>

                                          {/* MONTH COLLAPSE */}
                                          <TableRow>
                                            <TableCell
                                              colSpan={3}
                                              sx={{ p: 0 }}
                                            >
                                              <Collapse in={monthOpen}>
                                                <Table size="small">
                                                  <TableBody>
                                                    {Object.keys(
                                                      groupedData[year][month],
                                                    ).map((state) => {
                                                      const stateKey = `${year}-${month}-${state}`;
                                                      const stateOpen =
                                                        expandedStates.has(
                                                          stateKey,
                                                        );

                                                      return (
                                                        <React.Fragment
                                                          key={stateKey}
                                                        >
                                                          {/* STATE ROW */}
                                                          <TableRow
                                                            hover
                                                            onClick={() =>
                                                              setExpandedStates(
                                                                toggle(
                                                                  expandedStates,
                                                                  stateKey,
                                                                ),
                                                              )
                                                            }
                                                            sx={{
                                                              cursor: "pointer",
                                                            }}
                                                          >
                                                            <TableCell
                                                              width={50}
                                                            >
                                                              <IconButton size="small">
                                                                <KeyboardArrowDownIcon />
                                                              </IconButton>
                                                            </TableCell>

                                                            <TableCell>
                                                              <Typography>
                                                                {state}
                                                              </Typography>
                                                            </TableCell>

                                                            <TableCell>
                                                              <Chip
                                                                label="State"
                                                                size="small"
                                                                color="error"
                                                              />
                                                            </TableCell>
                                                          </TableRow>

                                                          {/* REGISTER TABLE */}
                                                          <TableRow>
                                                            <TableCell
                                                              colSpan={3}
                                                              sx={{ p: 0 }}
                                                            >
                                                              <Collapse
                                                                in={stateOpen}
                                                              >
                                                                <Box
                                                                  sx={{ m: 2 }}
                                                                >
                                                                  <Table
                                                                    size="small"
                                                                    sx={{
                                                                      border:
                                                                        "1px solid #e0e0e0",
                                                                      borderRadius:
                                                                        "10px",
                                                                      overflow:
                                                                        "hidden",

                                                                      "& th": {
                                                                        backgroundColor:
                                                                          "#f5f5f5",
                                                                        fontWeight: 600,
                                                                        borderBottom:
                                                                          "1px solid #e0e0e0",
                                                                      },
                                                                      "& td": {
                                                                        borderBottom:
                                                                          "1px solid #e0e0e0",
                                                                      },
                                                                      "& tr:last-child td":
                                                                        {
                                                                          borderBottom:
                                                                            "none",
                                                                        },
                                                                    }}
                                                                  >
                                                                    <TableHead>
                                                                      <TableRow>
                                                                        <TableCell>
                                                                          Register
                                                                          Name
                                                                        </TableCell>
                                                                        <TableCell>
                                                                          Activity
                                                                        </TableCell>
                                                                        <TableCell>
                                                                          Download
                                                                        </TableCell>
                                                                      </TableRow>
                                                                    </TableHead>

                                                                    <TableBody>
                                                                      {groupedData[
                                                                        year
                                                                      ][month][
                                                                        state
                                                                      ].map(
                                                                        (
                                                                          reg: any,
                                                                        ) => (
                                                                          <TableRow
                                                                            key={
                                                                              reg.reportId
                                                                            }
                                                                          >
                                                                            <TableCell
                                                                              sx={{
                                                                                wordBreak:
                                                                                  "break-word",
                                                                              }}
                                                                            >
                                                                              {
                                                                                reg.reportName
                                                                              }
                                                                            </TableCell>

                                                                            <TableCell>
                                                                              {
                                                                                reg.reportRelatedActivityName
                                                                              }
                                                                            </TableCell>

                                                                            <TableCell>
                                                                              <a
                                                                                href={`https://api.ocmspro.com/${reg.reportPath
                                                                                  .replace(
                                                                                    "wwwroot\\",
                                                                                    "",
                                                                                  )
                                                                                  .replaceAll(
                                                                                    "\\",
                                                                                    "/",
                                                                                  )}`}
                                                                                target="_blank"
                                                                                rel="noreferrer"
                                                                                style={{
                                                                                  textDecoration:
                                                                                    "none",
                                                                                  color:
                                                                                    "#1976d2",
                                                                                  fontWeight: 500,
                                                                                }}
                                                                              >
                                                                                Download
                                                                              </a>
                                                                            </TableCell>
                                                                          </TableRow>
                                                                        ),
                                                                      )}
                                                                    </TableBody>
                                                                  </Table>
                                                                </Box>
                                                              </Collapse>
                                                            </TableCell>
                                                          </TableRow>
                                                        </React.Fragment>
                                                      );
                                                    })}
                                                  </TableBody>
                                                </Table>
                                              </Collapse>
                                            </TableCell>
                                          </TableRow>
                                        </React.Fragment>
                                      );
                                    },
                                  )}
                                </TableBody>
                              </Table>
                            </Collapse>
                          </TableCell>
                        </TableRow>
                      </React.Fragment>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Box>
  );
};

export default Registers;
