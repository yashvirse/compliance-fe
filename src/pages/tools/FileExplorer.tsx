import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../app/store";
import {
  Box,
  Typography,
  Card,
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
  Snackbar,
  Alert,
} from "@mui/material";
import FolderIcon from "@mui/icons-material/Folder";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import AddIcon from "@mui/icons-material/CreateNewFolder";
import UploadIcon from "@mui/icons-material/Upload";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import DownloadIcon from "@mui/icons-material/Download";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import {
  createFolderExplorer,
  deleteFileExplorer,
  deleteFolderExplorer,
  getFileAndFolderExplorer,
  renameFolderExplorer,
  uploadFileExplorer,
} from "./FileExplorerSlice/FileExplorer.slice";

interface FileItem {
  id: number;
  name: string;
  type: "folder" | "file";
  parent: number | "root";
  modified: string;
  size: string;
}

const FileExplorer: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [expandedFolders, setExpandedFolders] = useState<Set<number>>(
    new Set(),
  );
  const [files, setFiles] = useState<FileItem[]>([]);
  const [currentFolder, setCurrentFolder] = useState<number | "root">("root");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<number[]>([]);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarType, setSnackbarType] = useState<"success" | "error">(
    "success",
  );
  const [renameId, setRenameId] = useState<number | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [idReverseMap, setIdReverseMap] = useState<Map<number, string | null>>(
    new Map(),
  );
  const [isCreating, setIsCreating] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");

  const fetchExplorerData = async () => {
    const res: any = await dispatch(getFileAndFolderExplorer()).unwrap();
    const apiData = res.result || [];

    const idMap = new Map<string | null, number>();
    const reverseMap = new Map<number, string | null>();

    apiData.forEach((item: any, index: number) => {
      const key = item.id ?? `temp-${index}`;
      const numericId = index + 1;
      idMap.set(key, numericId);
      reverseMap.set(numericId, item.id ?? null);
    });

    const formatted: FileItem[] = apiData.map((item: any, index: number) => ({
      id: idMap.get(item.id ?? `temp-${index}`)!,
      name: item.name,
      type: item.type.toLowerCase(),
      parent: item.parentFolderId
        ? (idMap.get(item.parentFolderId) ?? "root")
        : "root",
      modified: new Date(item.createdOn).toLocaleString(),
      size: "--",
    }));

    setFiles(formatted);
    setIdReverseMap(reverseMap);
  };
  useEffect(() => {
    fetchExplorerData();
  }, [dispatch]);
  const visibleFiles = search
    ? files.filter((f) => f.name.toLowerCase().includes(search.toLowerCase()))
    : files.filter((f) => f.parent === currentFolder);

  const renderTree = (parent: number | "root", level = 0) =>
    files
      .filter((f) => f.parent === parent)
      .map((item) => {
        const isExpanded = expandedFolders.has(item.id);
        const toggleExpand = (e: React.MouseEvent) => {
          e.stopPropagation();
          setExpandedFolders((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(item.id)) {
              newSet.delete(item.id);
            } else {
              newSet.add(item.id);
            }
            return newSet;
          });
        };
        return (
          <Box key={item.id} sx={{ pl: level * 2 }}>
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              sx={{
                cursor: "pointer",
                backgroundColor:
                  currentFolder === item.id ? "#e3f2fd" : "transparent",
                borderRadius: 1,
                px: 1,
                py: 0.5,
              }}
              onClick={() =>
                item.type === "folder" && setCurrentFolder(item.id)
              }
            >
              {item.type === "folder" && (
                <Box onClick={toggleExpand} sx={{ display: "flex" }}>
                  {isExpanded ? (
                    <ExpandMoreIcon fontSize="small" />
                  ) : (
                    <ChevronRightIcon fontSize="small" />
                  )}
                </Box>
              )}
              {item.type === "folder" ? (
                <FolderIcon fontSize="small" color="warning" />
              ) : (
                <InsertDriveFileIcon fontSize="small" />
              )}
              <Typography variant="body2">{item.name}</Typography>
            </Stack>
            {item.type === "folder" &&
              isExpanded &&
              renderTree(item.id, level + 1)}
          </Box>
        );
      });

  const toggleSelect = (id: number) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const createFolder = async () => {
    if (!newFolderName.trim()) return;
    try {
      let payload: any = { folderName: newFolderName };
      if (currentFolder !== "root") {
        const parentId = idReverseMap.get(currentFolder);
        payload.parentFolderId = parentId ?? "";
      }
      const res: any = await dispatch(createFolderExplorer(payload)).unwrap();
      setFiles((prev) => [
        ...prev,
        {
          id: Date.now(),
          name: newFolderName,
          type: "folder",
          parent: currentFolder,
          modified: new Date().toLocaleString(),
          size: "--",
        },
      ]);
      setSnackbarMessage(res.message);
      setSnackbarType("success");
      setShowSnackbar(true);
      await fetchExplorerData();
      setIsCreating(false);
      setNewFolderName("");
    } catch (error: any) {
      setSnackbarMessage(error);
      setSnackbarType("error");
      setShowSnackbar(true);
    }
  };

  const uploadFile = () => fileInputRef.current?.click();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    let payload: any = { file };
    if (currentFolder !== "root") {
      const parentId = idReverseMap.get(currentFolder);
      if (parentId) {
        payload.folderId = parentId;
      }
    }
    try {
      const res: any = await dispatch(uploadFileExplorer(payload)).unwrap();
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
      setSnackbarMessage(res.message);
      setSnackbarType("success");
      setShowSnackbar(true);
      await fetchExplorerData();
    } catch (error: any) {
      setSnackbarMessage(error.message);
      setSnackbarType("error");
      setShowSnackbar(true);
    }
  };

  const deleteItems = async () => {
    try {
      let backendMessage = "";
      for (const id of selected) {
        const item = files.find((f) => f.id === id);
        if (!item) continue;
        const originalId = idReverseMap.get(id);
        if (!originalId) continue;
        let res;
        if (item.type === "folder") {
          res = await dispatch(deleteFolderExplorer(originalId)).unwrap(); // ✅ UUID
        } else {
          res = await dispatch(deleteFileExplorer(originalId)).unwrap(); // ✅ UUID
        }
        backendMessage = res?.message;
      }
      setSnackbarMessage(backendMessage);
      setSnackbarType("success");
      setShowSnackbar(true);
      await fetchExplorerData();
      setFiles((prev) => prev.filter((f) => !selected.includes(f.id)));
      setSelected([]);
    } catch (error: any) {
      setSnackbarMessage(error);
      setSnackbarType("error");
      setShowSnackbar(true);
    }
  };

  const startRename = (file: {
    id: React.SetStateAction<number | null>;
    name: React.SetStateAction<string>;
  }) => {
    setRenameId(file.id);
    setRenameValue(file.name);
  };

  const saveRename = async () => {
    try {
      if (!renameId) return;
      const originalId = idReverseMap.get(renameId);
      if (!originalId) return;
      const res: any = await dispatch(
        renameFolderExplorer({
          folderId: originalId,
          newName: renameValue,
        }),
      ).unwrap();
      setSnackbarMessage(res.message);
      setSnackbarType("success");
      setShowSnackbar(true);
      await fetchExplorerData();
      setFiles((prev) =>
        prev.map((f) => (f.id === renameId ? { ...f, name: renameValue } : f)),
      );

      setRenameId(null);
    } catch (error: any) {
      setSnackbarMessage(error);
      setSnackbarType("error");
      setShowSnackbar(true);
    }
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
        <Box sx={{ backgroundColor: "#f5f7fa", p: 2 }}>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
            <Button
              startIcon={<AddIcon />}
              onClick={() => setIsCreating(true)}
              color="warning"
            >
              Create Folder
            </Button>

            <Button
              startIcon={<UploadIcon />}
              onClick={uploadFile}
              color="primary"
            >
              Upload File
            </Button>

            <Button
              startIcon={<DeleteIcon />}
              onClick={deleteItems}
              color="error"
            >
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
        </Box>

        <Divider />

        <Box
          display="flex"
          flexDirection={{ xs: "column", sm: "row" }}
          flex={1}
          overflow="hidden"
        >
          {" "}
          <Box
            sx={{
              width: { xs: "100%", sm: 260 },
              borderRight: { xs: "none", sm: "1px solid #e0e0e0" },
              borderBottom: { xs: "1px solid #e0e0e0", sm: "none" },
              backgroundColor: "#f5f7fa",
            }}
            p={1}
            overflow="auto"
          >
            <Box
              sx={{
                cursor: "pointer",
                backgroundColor:
                  currentFolder === "root" ? "#e3f2fd" : "transparent",
                borderRadius: 1,
                px: 1,
                py: 0.5,
                mb: 1,
              }}
              onClick={() => setCurrentFolder("root")}
            >
              <Typography fontWeight={600}>Folders</Typography>
            </Box>

            {renderTree("root")}
          </Box>
          <Box flex={1} overflow="auto" p={1} sx={{ width: "100%" }}>
            {" "}
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
                {isCreating && (
                  <TableRow>
                    <TableCell />
                    <TableCell>
                      <TextField
                        size="small"
                        autoFocus
                        value={newFolderName}
                        onChange={(e) => setNewFolderName(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && createFolder()}
                        onBlur={() => {
                          setIsCreating(false);
                          setNewFolderName("");
                        }}
                      />
                    </TableCell>
                    <TableCell />
                    <TableCell />
                  </TableRow>
                )}
                {visibleFiles.map((f) => (
                  <TableRow
                    key={f.id}
                    hover
                    onDoubleClick={() =>
                      f.type === "folder" && setCurrentFolder(f.id)
                    }
                    sx={{
                      cursor: f.type === "folder" ? "pointer" : "default",
                    }}
                  >
                    {" "}
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
                          <Box
                            ml={1}
                            sx={{
                              maxWidth: 250,
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                            title={f.name}
                          >
                            {f.name.length > 30
                              ? f.name.slice(0, 30) + "..."
                              : f.name}
                          </Box>{" "}
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

        <input
          ref={fileInputRef}
          type="file"
          hidden
          onChange={handleFileChange}
        />
      </Card>
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

export default FileExplorer;
