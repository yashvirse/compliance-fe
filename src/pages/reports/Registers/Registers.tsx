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
  Collapse,
  Chip,
  Tooltip,
  Button,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import { useDispatch, useSelector } from "react-redux";
import { fetchGeneratedReports } from "./Register.slice";
import { selectSalaryLoading, selectSalaryReports } from "./Registers.selector";
import { CircularProgress } from "@mui/material";
import * as XLSX from "xlsx";

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

  const handleExportAll = () => {
    const rows: any[] = [];

    // Header
    rows.push(["Year", "Month", "State", "S.No", "Register Name", "Activity"]);

    Object.keys(groupedData).forEach((year) => {
      Object.keys(groupedData[year]).forEach((month) => {
        Object.keys(groupedData[year][month]).forEach((state) => {
          groupedData[year][month][state].forEach((reg: any, index: number) => {
            rows.push([
              year,
              month,
              state,
              index + 1,
              reg.reportName,
              reg.reportRelatedActivityName,
            ]);
          });
        });
      });
    });

    const worksheet = XLSX.utils.aoa_to_sheet(rows);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Registers");
    XLSX.writeFile(workbook, "SalaryRegisters_MusterRolls.xlsx");
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
      <Box
        sx={{
          mb: 3,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h4" fontWeight={700}>
          Salary and Muster Roll Registers
        </Typography>

        <Button
          variant="outlined"
          onClick={handleExportAll}
          sx={{
            borderRadius: 2,
            textTransform: "none",
            px: 2,
            py: 1,
            fontWeight: 600,
          }}
        >
          Export To Excel
        </Button>
      </Box>

      {/* Main Table */}
      <Paper sx={{ borderRadius: "18px 18px 0 0" }}>
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
                <TableRow sx={{ backgroundColor: "#b5d6fd" }}>
                  <TableCell sx={{ borderTopLeftRadius: "20px" }} />

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
                          <TableCell colSpan={3} sx={{ p: 1 }}>
                            <Box
                              sx={{
                                p: 2,
                                borderRadius: 2,
                                background:
                                  "linear-gradient(90deg, #f5f7fa, #e4ecf7)",
                                border: "1px solid #dbe3ec",
                                transition: "0.2s",
                                "&:hover": {
                                  background: "#eaf2ff",
                                },
                              }}
                            >
                              <Box
                                sx={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                }}
                              >
                                <span style={{ fontWeight: 700 }}>
                                  {yearOpen ? "▼" : "▶"} {year}
                                </span>

                                <Chip
                                  label="Year"
                                  size="small"
                                  color="success"
                                />
                              </Box>
                            </Box>
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
                                            <TableCell
                                              colSpan={3}
                                              sx={{ p: 1 }}
                                            >
                                              <Box
                                                sx={{
                                                  p: 2,
                                                  pl: 4, // 👈 indentation
                                                  borderRadius: 2,
                                                  background: "#f9fafc",
                                                  borderLeft:
                                                    "4px solid #1976d2", // 👈 hierarchy line
                                                  borderTop:
                                                    "1px solid #e6eaf0",
                                                  borderRight:
                                                    "1px solid #e6eaf0",
                                                  borderBottom:
                                                    "1px solid #e6eaf0",
                                                  transition: "0.2s",
                                                  "&:hover": {
                                                    background: "#eef4ff",
                                                  },
                                                }}
                                              >
                                                <Box
                                                  sx={{
                                                    display: "flex",
                                                    justifyContent:
                                                      "space-between",
                                                  }}
                                                >
                                                  <span
                                                    style={{ fontWeight: 600 }}
                                                  >
                                                    {monthOpen ? "▼" : "▶"}{" "}
                                                    {month}
                                                  </span>

                                                  <Chip
                                                    label="Month"
                                                    size="small"
                                                    color="primary"
                                                  />
                                                </Box>
                                              </Box>
                                            </TableCell>
                                          </TableRow>

                                          {/* MONTH COLLAPSE */}
                                          <TableRow>
                                            <TableCell
                                              colSpan={3}
                                              sx={{ p: 0 }}
                                            >
                                              <Collapse in={monthOpen}>
                                                <Table
                                                  size="small"
                                                  sx={{
                                                    width: "100%",
                                                    tableLayout: "fixed",
                                                  }}
                                                >
                                                  {" "}
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
                                                              colSpan={3}
                                                              sx={{ p: 1 }}
                                                            >
                                                              <Box
                                                                sx={{
                                                                  p: 2,
                                                                  pl: 6, // 👈 deeper indentation
                                                                  borderRadius: 2,
                                                                  background:
                                                                    "#ffffff",
                                                                  borderLeft:
                                                                    "4px solid #d32f2f", // 👈 hierarchy line
                                                                  borderTop:
                                                                    "1px solid #eee",
                                                                  borderRight:
                                                                    "1px solid #eee",
                                                                  borderBottom:
                                                                    "1px solid #eee",
                                                                  transition:
                                                                    "0.2s",
                                                                  "&:hover": {
                                                                    background:
                                                                      "#f5faff",
                                                                  },
                                                                }}
                                                              >
                                                                <Box
                                                                  sx={{
                                                                    display:
                                                                      "flex",
                                                                    justifyContent:
                                                                      "space-between",
                                                                  }}
                                                                >
                                                                  <span
                                                                    style={{
                                                                      fontWeight: 500,
                                                                    }}
                                                                  >
                                                                    {stateOpen
                                                                      ? "▼"
                                                                      : "▶"}{" "}
                                                                    {state}
                                                                  </span>

                                                                  <Chip
                                                                    label="State"
                                                                    size="small"
                                                                    color="error"
                                                                  />
                                                                </Box>
                                                              </Box>
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
                                                                          "#cbe2fd",
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
                                                                          S.No
                                                                        </TableCell>
                                                                        <TableCell>
                                                                          Register
                                                                          Name
                                                                        </TableCell>
                                                                        <TableCell>
                                                                          Activity
                                                                        </TableCell>
                                                                        <TableCell>
                                                                          Action
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
                                                                          index: number,
                                                                        ) => (
                                                                          <TableRow
                                                                            key={
                                                                              reg.reportId
                                                                            }
                                                                          >
                                                                            <TableCell>
                                                                              {index +
                                                                                1}
                                                                            </TableCell>
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
                                                                              <Tooltip title="Download">
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
                                                                                  <DownloadIcon
                                                                                    sx={{
                                                                                      color:
                                                                                        "#1976d2",
                                                                                      cursor:
                                                                                        "pointer",
                                                                                    }}
                                                                                  />
                                                                                </a>
                                                                              </Tooltip>
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
