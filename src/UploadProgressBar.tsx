import { LinearProgress, Paper, Stack, Typography } from "@mui/material";
import { useMemo } from "react";

import { TransferTask, useTransferQueue } from "./app/transferQueue";
import { humanReadableSize } from "./app/utils";

function UploadProgressBar() {
  const queue = useTransferQueue();
  const activeUpload = useMemo(
    () =>
      queue.find(
        (task: TransferTask) =>
          task.type === "upload" && ["pending", "in-progress"].includes(task.status)
      ),
    [queue]
  );

  if (!activeUpload) return null;

  const isPending = activeUpload.status === "pending";
  const percent = activeUpload.total
    ? Math.min(100, (activeUpload.loaded / activeUpload.total) * 100)
    : 0;
  return (
    <Paper
      elevation={6}
      sx={{
        position: "fixed",
        bottom: 16,
        left: "50%",
        transform: "translateX(-50%)",
        minWidth: 280,
        px: 2,
        py: 1.5,
        zIndex: 1350,
      }}
    >
      <Stack spacing={1}>
        <Typography variant="body2" fontWeight={600} noWrap>
          Uploading {activeUpload.name}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {humanReadableSize(activeUpload.loaded)} / {humanReadableSize(activeUpload.total)}
        </Typography>
        <LinearProgress
          variant={isPending ? "indeterminate" : "determinate"}
          value={isPending ? undefined : percent}
        />
      </Stack>
    </Paper>
  );
}

export default UploadProgressBar;
