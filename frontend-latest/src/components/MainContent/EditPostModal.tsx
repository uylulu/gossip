import { Modal, Box, CircularProgress, Alert, TextField, Button, Snackbar } from "@mui/material";
import React, { useState } from "react";
import { Thread } from "../../types/Thread";
import { hooksEditPost } from "../../hooks/thread/hooksEditPost";
import { useThreadContext } from "../../context/ThreadContext";

interface EditPostModalProps {
    open: boolean;
    onClose: () => void;
    thread: Thread; // Replace 'any' with the appropriate type for 'thread'
}

const EditPostModal: React.FC<EditPostModalProps> = ({ open, onClose, thread }) => {
    const [title, setTitle] = useState(thread.Title || "");
    const [tag, setTag] = useState(thread.Tag_content || "");
    const [content, setContent] = useState(thread.Content || "");
    const { editPost, loading, error } = hooksEditPost();
    const [success, setSuccess] = useState(false);
    const { refreshThreads } = useThreadContext();

    const handleSubmit = async () => {
        if (thread.Thread_id !== undefined) {
            await editPost(title, content, tag, thread.Thread_id);

            refreshThreads(); // Refresh the threads after editing a post
            setSuccess(true);
            onClose(); // Close the modal after successful edit
        } else {
            console.error("Thread ID is undefined");
        }
    };

    const handleCloseSnackbar = () => {
        setSuccess(false);
    };

    return (
        <div>
            <Modal open={open} onClose={onClose}>
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: '80%',
                        height: '80%',
                        bgcolor: "background.paper",
                        borderRadius: 4,
                        boxShadow: 24,
                        p: 4,
                    }}
                >
                    {loading && <CircularProgress sx={{ mb: 2 }} />}
                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                    <TextField
                        fullWidth
                        label="Title"
                        variant="outlined"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        sx={{ mb: 2 }}
                        disabled={loading}
                    />
                    <TextField
                        fullWidth
                        label="Tag"
                        variant="outlined"
                        value={tag}
                        onChange={(e) => setTag(e.target.value)}
                        sx={{ mb: 2 }}
                        disabled={loading}
                    />
                    <TextField
                        fullWidth
                        label="Content"
                        variant="outlined"
                        multiline
                        rows={20}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        sx={{ mb: 2 }}
                        disabled={loading}
                    />
                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                        <Button variant="contained" color="primary" onClick={handleSubmit} disabled={loading}>
                            Post
                        </Button>
                        <Button variant="contained" color="primary" onClick={onClose} disabled={loading}>
                            Cancel
                        </Button>
                    </Box>
                </Box>
            </Modal>
            <Snackbar
                open={success}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
            >
                <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
                    Post edited successfully
                </Alert>
            </Snackbar>
        </div>
    );
}

export default EditPostModal;