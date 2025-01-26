import React, { useState } from "react";
import { Snackbar, Alert, Box, Grid2, Typography, Menu, MenuItem, Modal, TextField, CircularProgress, Button } from "@mui/material";
import { Thread } from "../../types/Thread";
import { RandomAvatar } from "react-random-avatars";
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { hooksEditPost } from "../../hooks/thread/hooksEditPost";
import EditPostModal from "../MainContent/EditPostModal";
import { useNavigate } from "react-router-dom";

interface IndividualComment {
    Comment: Thread;
}

const IndividualComment: React.FC<IndividualComment> = ({ Comment }) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const open = Boolean(anchorEl);
    const { editPost, loading, error } = hooksEditPost();
    const navigate = useNavigate();

    const [title, setTitle] = useState<String>(Comment.Title);
    const [tag, setTag] = useState<String>(Comment.Tag_content);
    const [content, setContent] = useState<String>(Comment.Content);

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleEditPost = () => {
        setEditModalOpen(true);
        handleMenuClose();
    };

    const handleDeletePost = () => {
        setSuccessMessage("Post deleted successfully.");
        setSnackbarOpen(true);
        handleMenuClose();
    };

    const handleSnackBarClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarOpen(false);
        setSuccessMessage(null);
    };

    const handleEditModalClose = () => {
        setEditModalOpen(false);
    };

    return (
        <Box sx={{ flexGrow: 1 }}>

            <Grid2 container spacing={1} alignItems="center" sx={{ cursor: "pointer" }} onClick={() => navigate(`/thread/${Comment.Thread_id}`)}>
                <Grid2 size={1}>
                    <RandomAvatar name={Comment.Username || "Guest"} size={50} />
                </Grid2>

                <Grid2 size={10} sx={{ textAlign: "left" }}>
                    <Typography sx={{ fontSize: "1.25rem" }}>
                        {Comment.Username} replied: {Comment.Content} | at:{" "}
                        {Comment.Created_at
                            ? new Date(Comment.Created_at).toLocaleDateString("en-GB")
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
                thread={Comment}
            />

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleSnackBarClose}
            >
                <Alert onClose={handleSnackBarClose} severity={successMessage ? "success" : "warning"} sx={{ width: '100%' }}>
                    {successMessage || "You cannot edit or delete this post."}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default IndividualComment;