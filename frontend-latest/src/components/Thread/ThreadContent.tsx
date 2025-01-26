import React, { useState } from "react";
import { Thread } from "../../types/Thread";
import { Box, Grid2, CircularProgress, Alert, Snackbar } from "@mui/material";
import FavoriteIcon from '@mui/icons-material/Favorite';
import CommentIcon from '@mui/icons-material/Comment';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button } from "@mui/material";
import { hooksCreatePost } from "../../hooks/thread/hooksCreatePost";
import { useThreadContext } from "../../context/ThreadContext";

interface ThreadContentProps {
    thread: Thread;
}

const ThreadContent = ({ thread }: ThreadContentProps) => {
    const [open, setOpen] = useState(false);
    const [reply, setReply] = useState("");
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const { createPost, loading, error } = hooksCreatePost();
    const { refreshThreads } = useThreadContext();

    const handleCommentClick = (threadId: any) => {
        setOpen(true);
    }

    const handleClose = () => {
        setOpen(false);
    }

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    }

    const handleSubmit = async () => {
        setOpen(false);
        if (thread.Thread_id !== undefined) {
            await createPost("Reply", reply, "Reply", thread.Thread_id);
            setSnackbarOpen(true);
            refreshThreads();
        } else {
            console.error("Thread_id is undefined");
        }
    }

    return (
        <Box sx={{ flexGrow: 1 }}>
            <Grid2 container spacing={2}>
                <Grid2 size={12}>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: '100%',
                            backgroundColor: '#151616',
                            borderRadius: '10px',
                        }}
                    >
                        <Grid2 size={12}>
                            <Box sx={{ color: 'white', fontSize: '15px' }}>
                                {thread.Content}
                            </Box>
                        </Grid2>
                    </Box>
                </Grid2>


                <Grid2 size={12}>

                </Grid2>
            </Grid2>

            <Box sx={{ mt: 2, width: '100%' }}>
                <TextField
                    label="Write a Reply"
                    type="text"
                    fullWidth
                    variant="outlined"
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                />
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                    <Button onClick={handleSubmit} variant="contained" color="primary" disabled={loading}>
                        {loading ? <CircularProgress size={24} /> : "Reply"}
                    </Button>
                </Box>
                {error && (
                    <Box sx={{ mt: 2 }}>
                        <Alert severity="error">{error}</Alert>
                    </Box>
                )}
            </Box>

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                message="Reply sent successfully"
            />
        </Box>
    );
}

export default ThreadContent;