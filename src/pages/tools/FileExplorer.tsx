import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../app/store";

import {
  Box,
  Typography,
  Card,
  CardContent,
  Stack,
  Button,
  Divider,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Checkbox,
} from "@mui/material";

import FolderIcon from "@mui/icons-material/Folder";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import AddIcon from "@mui/icons-material/CreateNewFolder";
import UploadIcon from "@mui/icons-material/Upload";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import DownloadIcon from "@mui/icons-material/Download";

import { uploadFileExplorer } from "./FileExplorerSlice/FileExplorer.slice";

/* ---------- Types ---------- */
interface FileItem {
  id: number;
  name: string;
  type: "folder" | "file";
  parent: number | "root";
  modified: string;
  size: string;
}

/* ---------- Initial Data ---------- */
const INITIAL_FILES: FileItem[] = [
  {
    id: 1,
    name: "Documents",
    type: "folder",
    parent: "root",
    modified: "Dec 31, 2025",
    size: "--",
  },
  {
    id: 2,
    name: "Pictures",
    type: "folder",
    parent: "root",
    modified: "Dec 31, 2025",
    size: "--",
  },
];

/* ---------- Component ---------- */
const FileExplorer: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const [files, setFiles] = useState<FileItem[]>(INITIAL_FILES);
  const [currentFolder, setCurrentFolder] = useState<number | "root">("root");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<number[]>([]);

  /* ✅ rename states (ONLY ADDITION) */
  const [renameId, setRenameId] = useState<number | null>(null);
  const [renameValue, setRenameValue] = useState("");

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const now = new Date().toLocaleString();

  const folderPath =
    currentFolder === "root" ? "root" : `folder-${currentFolder}`;

  const visibleFiles = files.filter(
    (f) =>
      f.parent === currentFolder &&
      f.name.toLowerCase().includes(search.toLowerCase()),
  );

  const renderTree = (parent: number | "root", level = 0) =>
    files
      .filter((f) => f.parent === parent)
      .map((item) => (
        <Box key={item.id} sx={{ pl: level * 2 }}>
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            sx={{ cursor: "pointer" }}
            onClick={() => item.type === "folder" && setCurrentFolder(item.id)}
          >
            {item.type === "folder" ? (
              <FolderIcon fontSize="small" color="warning" />
            ) : (
              <InsertDriveFileIcon fontSize="small" />
            )}
            <Typography variant="body2">{item.name}</Typography>
          </Stack>

          {item.type === "folder" && renderTree(item.id, level + 1)}
        </Box>
      ));

  const toggleSelect = (id: number) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const createFolder = () => {
    setFiles((prev) => [
      ...prev,
      {
        id: Date.now(),
        name: "New Folder",
        type: "folder",
        parent: currentFolder,
        modified: now,
        size: "--",
      },
    ]);
  };

  const uploadFile = () => fileInputRef.current?.click();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    await dispatch(uploadFileExplorer({ file, folderPath }));

    setFiles((prev) => [
      ...prev,
      {
        id: Date.now(),
        name: file.name,
        type: "file",
        parent: currentFolder,
        modified: new Date().toLocaleString(),
        size: `${Math.ceil(file.size / 1024)} KB`,
      },
    ]);

    e.target.value = "";
  };

  const deleteItems = () => {
    setFiles((prev) => prev.filter((f) => !selected.includes(f.id)));
    setSelected([]);
  };

  /* ✅ rename functions (ONLY ADDITION) */
  const startRename = (file: FileItem) => {
    setRenameId(file.id);
    setRenameValue(file.name);
  };

  const saveRename = () => {
    setFiles((prev) =>
      prev.map((f) => (f.id === renameId ? { ...f, name: renameValue } : f)),
    );
    setRenameId(null);
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Delete") deleteItems();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  });

  return (
    <Box>
      <Box
        sx={{
          mb: 3,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Box>
          <Typography variant="h4" fontWeight={700}>
            Data Repository
          </Typography>
        </Box>
      </Box>
      <Card sx={{ height: "85vh", borderRadius: 3 }}>
        <CardContent
          sx={{ height: "100%", display: "flex", flexDirection: "column" }}
        >
          <Stack direction="row" spacing={1} mb={2}>
            <Button startIcon={<AddIcon />} onClick={createFolder}>
              New Folder
            </Button>
            <Button startIcon={<UploadIcon />} onClick={uploadFile}>
              Upload
            </Button>
            <Button startIcon={<DeleteIcon />} onClick={deleteItems}>
              Delete
            </Button>

            <Box flex={1} />

            <TextField
              size="small"
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </Stack>

          <Divider />

          <Box display="flex" flex={1} overflow="hidden">
            <Box
              width={260}
              borderRight="1px solid #e0e0e0"
              p={1}
              overflow="auto"
            >
              <Typography fontWeight={600} mb={1}>
                Folders
              </Typography>
              {renderTree("root")}
            </Box>

            <Box flex={1} overflow="auto" p={1}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell />
                    <TableCell>Name</TableCell>
                    <TableCell>Modified</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {visibleFiles.map((f) => (
                    <TableRow key={f.id} hover>
                      <TableCell>
                        <Checkbox
                          checked={selected.includes(f.id)}
                          onChange={() => toggleSelect(f.id)}
                        />
                      </TableCell>

                      <TableCell>
                        {renameId === f.id ? (
                          <TextField
                            size="small"
                            autoFocus
                            value={renameValue}
                            onChange={(e) => setRenameValue(e.target.value)}
                            onBlur={saveRename}
                            onKeyDown={(e) => e.key === "Enter" && saveRename()}
                          />
                        ) : (
                          <Stack direction="row" alignItems="center">
                            {f.type === "folder" ? (
                              <FolderIcon color="warning" />
                            ) : (
                              <InsertDriveFileIcon />
                            )}
                            <Box ml={1}>{f.name}</Box>
                          </Stack>
                        )}
                      </TableCell>

                      <TableCell>{f.modified}</TableCell>

                      <TableCell>
                        {f.type === "folder" ? (
                          <Button
                            size="small"
                            startIcon={<EditIcon />}
                            onClick={() => startRename(f)}
                          >
                            Rename
                          </Button>
                        ) : (
                          <Button size="small" startIcon={<DownloadIcon />}>
                            Download
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Box>
        </CardContent>

        <input
          ref={fileInputRef}
          type="file"
          hidden
          onChange={handleFileChange}
        />
      </Card>
    </Box>
  );
};

export default FileExplorer;
