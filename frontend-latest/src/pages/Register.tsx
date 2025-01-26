import { useState } from "react";
import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import LoginIcon from '@mui/icons-material/Login';
import { hooksRegister } from "../hooks/Auth/hooksRegister";
import { useNavigate } from "react-router-dom";

const Register = () => {
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const { register, loading, error } = hooksRegister();
    const [formError, setFormError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if(username.length === 0 || password.length === 0 || confirmPassword.length === 0) {
            setFormError("Please fill in all fields");
            return;
        }
        if(password !== confirmPassword) {
            setFormError("Passwords do not match");
            return;
        }

        const result = await register(username, password);
        if (result) {
            setSuccessMessage("Registration successful!");
            navigate("/login");
        }
    }

    const handleCloseSnackbar = () => {
        setSuccessMessage(null);
    };

    return (
        <Container maxWidth="sm">
            <Box 
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '100vh',
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '50vh', 
                        width: '100%', 
                        maxWidth: 400, 
                        padding: 2,
                        background: 'grey',
                        boxShadow: 3,
                        borderRadius: 2,
                    }}
                >
                    <LoginIcon sx={{ fontSize: "large" }} />
                    <Typography variant="h4" gutterBottom>Signup</Typography>
                    <form onSubmit={handleSubmit} style={{width: '100%'}}>
                        {/* Username Field */}
                        <TextField 
                            id="filled-basic" 
                            label="Username" 
                            variant="filled"
                            margin="normal"
                            onChange={(e) => setUsername(e.target.value)}
                            fullWidth={true}
                        />

                        {/* Password Field */}
                        <TextField 
                            id="filled-basic" 
                            label="Password" 
                            variant="filled"
                            margin="normal"
                            type="password"
                            onChange={(e) => setPassword(e.target.value)}
                            fullWidth={true}
                        />

                        {/* Confirm Password Field */}
                        <TextField 
                            id="filled-basic" 
                            label="Confirm Password" 
                            variant="filled"
                            margin="normal"
                            type="password"
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            fullWidth={true}
                        />

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            fullWidth
                            disabled={loading}
                            sx={{ marginTop: 2 }}
                        >
                            {loading ? (
                                <CircularProgress size={24} color="inherit" />
                            ) : (
                                "Signup"
                            )}
                        </Button>
                        {/* Signup Link */}
                        <Typography variant="body2" sx={{ marginTop: 2 }}>
                            Don't have an account? <a href="/signup">Sign up</a>
                        </Typography>

                        {/* Error Message */}
                        {error && (
                            <Typography variant="body2" color="error" sx={{ marginTop: 2 }}>
                                {error}
                            </Typography>
                        )}

                        {/* Form Error */}
                        {formError && (
                            <Typography variant="body2" color="error" sx={{ marginTop: 2 }}>
                                {formError}
                            </Typography>
                        )}
                    </form>
                </Box>
            </Box>
            <Snackbar open={!!successMessage} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
                    {successMessage}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default Register;
