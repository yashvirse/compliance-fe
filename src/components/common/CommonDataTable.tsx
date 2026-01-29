import React from "react";
import { Paper, useTheme, alpha, Box, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import type { GridColDef, GridValidRowModel } from "@mui/x-data-grid";

interface CommonDataTableProps<T extends GridValidRowModel> {
    rows: T[];
    columns: GridColDef[];
    loading?: boolean;
    getRowId?: (row: T) => any;
    pageSizeOptions?: number[];
    initialPageSize?: number;
    checkboxSelection?: boolean;
    autoHeight?: boolean;
    height?: number | string;
    noRowsMessage?: string;
    disableRowSelectionOnClick?: boolean;
    sx?: any;
}

const CommonDataTable = <T extends GridValidRowModel>({
    rows,
    columns,
    loading = false,
    getRowId,
    pageSizeOptions = [5, 10, 25, 50],
    initialPageSize = 10,
    checkboxSelection = false,
    autoHeight = true,
    height = 500,
    noRowsMessage = "No data available",
    disableRowSelectionOnClick = true,
    sx = {},
}: CommonDataTableProps<T>) => {
    const theme = useTheme();

    const defaultSx = {
        border: "none",
        "& .MuiDataGrid-cell": {
            borderColor: theme.palette.divider,
        },
        "& .MuiDataGrid-columnHeaders": {
            bgcolor: alpha(theme.palette.primary.main, 0.05),
            borderColor: theme.palette.divider,
            fontWeight: 600,
        },
        "& .MuiDataGrid-footerContainer": {
            borderColor: theme.palette.divider,
        },
        "& .MuiDataGrid-row:hover": {
            bgcolor: alpha(theme.palette.primary.main, 0.02),
        },
        ...sx,
    };

    return (
        <Paper
            elevation={0}
            sx={{
                borderRadius: 3,
                overflow: "hidden",
                border: `1px solid ${theme.palette.divider}`,
                boxShadow: `0 4px 20px ${alpha(theme.palette.common.black, 0.05)}`,
            }}
        >
            <Box sx={{ height: autoHeight ? "auto" : height, width: "100%" }}>
                {rows && rows.length > 0 ? (
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        getRowId={getRowId}
                        loading={loading}
                        initialState={{
                            pagination: {
                                paginationModel: { pageSize: initialPageSize, page: 0 },
                            },
                        }}
                        pageSizeOptions={pageSizeOptions}
                        checkboxSelection={checkboxSelection}
                        disableRowSelectionOnClick={disableRowSelectionOnClick}
                        autoHeight={autoHeight}
                        sx={defaultSx}
                    />
                ) : (
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            height: height,
                            p: 3,
                        }}
                    >
                        <Typography color="text.secondary">
                            {loading ? "Loading..." : noRowsMessage}
                        </Typography>
                    </Box>
                )}
            </Box>
        </Paper>
    );
};

export default CommonDataTable;
