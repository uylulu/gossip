import React, { useState } from "react";
import { Snackbar, Alert, Box, Grid2, Typography, Menu, MenuItem, Modal, TextField, CircularProgress, Button } from "@mui/material";
import { Thread } from "../../types/Thread";
import { RandomAvatar } from "react-random-avatars";
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { hooksEditPost } from "../../hooks/thread/hooksEditPost";
import EditPostModal from "../MainContent/EditPostModal";
import { useNavigate } from "react-router-dom";
import { hooksDeletePost } from "../../hooks/thread/hooksDeletePost";
import { useThreadContext } from "../../context/ThreadContext";
import { useAuth } from "../../context/AuthContext";

interface ThreadHeaderProps {
    thread: Thread;
}

const ThreadHeader: React.FC<ThreadHeaderProps> = ({ thread }) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const open = Boolean(anchorEl);
    const { editPost, loading, error } = hooksEditPost();
    const { deletePost } = hooksDeletePost();
    const { refreshThreads } = useThreadContext();
    const navigate = useNavigate();

    const [title, setTitle] = useState<String>(thread.Title);
    const [tag, setTag] = useState<String>(thread.Tag_content);
    const [content, setContent] = useState<String>(thread.Content);

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const { state } = useAuth();
    console.log(state);

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleEditPost = () => {
        setEditModalOpen(true);
        handleMenuClose();
    };

    const handleDeletePost = async () => {
        if (thread.Thread_id !== undefined) {
            try {
                await deletePost(thread.Thread_id);
                setMessage("Post deleted successfully.");
                setSnackbarOpen(true);
                refreshThreads();
            } catch (err) {
                setMessage("Failed to delete post: " + error);
                setSnackbarOpen(true);
            }
        } else {
            console.error("Thread ID is undefined");
        }
        handleMenuClose();
    };

    const handleSnackBarClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarOpen(false);
        setMessage(null);
    };

    const handleEditModalClose = () => {
        setEditModalOpen(false);
    };

    return (
        <Box sx={{ flexGrow: 1 }}>

            <Grid2 container spacing={1} alignItems="center" sx={{ cursor: "pointer" }} onClick={() => navigate(`/thread/${thread.Thread_id}`)}>
                <Grid2 size={1}>
                    <RandomAvatar name={thread.Username || "Guest"} size={50} />
                </Grid2>

                <Grid2 size={10} sx={{ textAlign: "left" }}>
                    <Typography sx={{ fontSize: "1.25rem" }}>
                        {thread.Username} wrote: {thread.Title} | {thread.Tag_content} | at:{" "}
                        {thread.Created_at
                            ? new Date(thread.Created_at).toLocaleDateString("en-GB")
                            : "Unknown date"}
                    </Typography>
                </Grid2>

                <Grid2
                    size={1}
                    sx={{
                        borderRadius: 50,
                        "&:hover": {
                            backgroundColor: "#323435",
                        },
                    }}
                    onClick={(e) => {
                        e.stopPropagation();
                        handleMenuOpen(e);
                    }}
                >
                    <MoreHorizIcon />
                </Grid2>
            </Grid2>

            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleMenuClose}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "center",
                }}
                transformOrigin={{
                    vertical: "top",
                    horizontal: "center",
                }}
            >
                <MenuItem onClick={handleEditPost}>Edit Post</MenuItem>
                <MenuItem onClick={handleDeletePost}>Delete Post</MenuItem>
            </Menu>

            {/* Edit post modal */}
            <EditPostModal
                open={editModalOpen}
                onClose={handleEditModalClose}
                thread={thread}
            />

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleSnackBarClose}
            >
                <Alert onClose={handleSnackBarClose} severity={message?.includes("successfully") ? "success" : "error"} sx={{ width: '100%' }}>
                    {message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default ThreadHeader;