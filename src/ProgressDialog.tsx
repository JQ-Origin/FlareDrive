import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  LinearProgress,
  List,
  ListItem,
  Tab,
  Tabs,
  Tooltip,
  Typography,
} from "@mui/material";
import { useMemo, useState } from "react";
import { TransferTask, useTransferQueue } from "./app/transferQueue";
import { humanReadableSize } from "./app/utils";
import {
  CheckCircleOutline as CheckCircleOutlineIcon,
  ErrorOutline as ErrorOutlineIcon,
} from "@mui/icons-material";

function ProgressDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [tab, setTab] = useState(0);
  const transferQueue: TransferTask[] = useTransferQueue();

  const tasks = useMemo(() => {
    const taskType = tab === 0 ? "download" : "upload";
    return Object.values(transferQueue).filter(
      (task) => task.type === taskType
    );
  }, [tab, transferQueue]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>Progress</DialogTitle>
      <Tabs
        value={tab}
        onChange={(_, newTab) => setTab(newTab)}
        sx={{ "& .MuiTab-root": { flexBasis: "50%" } }}
      >
        <Tab label="Downloads" />
        <Tab label="Uploads" />
      </Tabs>
      {tasks.length === 0 ? (
        <DialogContent>
          <Typography textAlign="center" color="text.secondary">
            No tasks
          </Typography>
        </DialogContent>
      ) : (
        <DialogContent sx={{ padding: 0 }}>
          <List>
            {tasks.map((task) => (
              <ListItem key={task.name} alignItems="flex-start">
                <Box sx={{ flexGrow: 1, paddingRight: 2 }}>
                  <Typography variant="body2" fontWeight={600} noWrap>
                    {task.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {humanReadableSize(task.loaded)} / {humanReadableSize(task.total)}
                  </Typography>
                  <LinearProgress
                    sx={{ marginTop: 1 }}
                    variant={
                      task.status === "pending" ? "indeterminate" : "determinate"
                    }
                    value={
                      task.status === "in-progress"
                        ? task.total
                          ? Math.min(100, (task.loaded / task.total) * 100)
                          : 0
                        : task.status === "completed" || task.status === "failed"
                        ? 100
                        : undefined
                    }
                    color={
                      task.status === "failed"
                        ? "error"
                        : task.status === "completed"
                        ? "success"
                        : "primary"
                    }
                  />
                </Box>
                {task.status === "failed" ? (
                  <Tooltip title={task.error?.message ?? "Failed"}>
                    <ErrorOutlineIcon color="error" />
                  </Tooltip>
                ) : task.status === "completed" ? (
                  <CheckCircleOutlineIcon color="success" />
                ) : null}
              </ListItem>
            ))}
          </List>
        </DialogContent>
      )}
    </Dialog>
  );
}

export default ProgressDialog;
