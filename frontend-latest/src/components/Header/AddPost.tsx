import React, { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import { Box, colors, Typography, Modal, TextField, Button, CircularProgress, Alert } from "@mui/material";
import { hooksCreatePost } from "../../hooks/thread/hooksCreatePost";
import { useThreadContext } from "../../context/ThreadContext";

const AddPost = () => {
    const [open, setOpen] = useState<boolean>(false);
    const [success, setSuccess] = useState<boolean>(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const handleSuccessClose = () => setSuccess(false);
    const [title, setTitle] = useState<string>("");
    const [tag, setTag] = useState<string>("");
    const [content, setContent] = useState<string>("");

    const { createPost, loading, error } = hooksCreatePost();
    const { refreshThreads } = useThreadContext();

    const handleSubmit = async () => {
        const result = await createPost(title, content, tag, -1);

        if (result) {
            setSuccess(true);
            handleClose();
            await refreshThreads();
        }
    };

    return (
        <>
            {/* Button to open the modal */}
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100%",
                    width: "100%",
                    backgroundColor: "transparent",
                }}
            >
                <Box
                    onClick={handleOpen}
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "50%",
                        width: "50%",
                        backgroundColor: "transparent",
                        borderColor: "transparent",
                        borderRadius: 100,
                        transition: "all 0.1s",
                        "&:hover": {
                            backgroundColor: "#323435",
                        },
                        gap: 1,
                        border: 1,
                        borderStyle: "solid",
                        cursor: "pointer",
                    }}
                >
                    <AddIcon
                        sx={{
                            color: colors.common.white,
                            fontSize: "4vh",
                        }}
                    />
                    <Typography
                        sx={{
                            color: colors.common.white,
                            fontWeight: "bold",
                            fontSize: "2vh",
                        }}
                    >
                        Create
                    </Typography>
                </Box>
            </Box>

            {/* Modal for the form */}
            <Modal open={open} onClose={handleClose}>
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
                        <Button variant="contained" color="primary" onClick={handleClose} disabled={loading}>
                            Cancel
                        </Button>
                    </Box>
                </Box>
            </Modal>

            {/* Success message */}
            <Modal open={success} onClose={handleSuccessClose}>
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: '50%',
                        bgcolor: "background.paper",
                        borderRadius: 4,
                        boxShadow: 24,
                        p: 4,
                    }}
                >
                    <Alert severity="success" onClose={handleSuccessClose}>
                        Post created successfully!
                    </Alert>
                </Box>
            </Modal>
        </>
    );
};

export default AddPost;
