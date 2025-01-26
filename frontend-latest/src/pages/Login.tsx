import { useState } from "react";
import { hooksLogin } from "../hooks/Auth/hooksLogin";
import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import LoginIcon from '@mui/icons-material/Login';

const Login = () => {
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const { login, loading, error } = hooksLogin();
    const [formError, setFormError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if(username.length === 0 || password.length === 0) {
            setFormError("Please fill in all fields");
            return;
        }
        await login(username, password);
    }

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
                    <Typography variant="h4" gutterBottom>Login</Typography>
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
                                "Login"
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
        </Container>
    );
};

export default Login;
