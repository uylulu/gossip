import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid2';
import Header from '../components/Header/Header';
import MainContent from '../components/MainContent/MainContent';
import { hooksChangePassword } from '../hooks/user/hooksChangePassword';
import CircularProgress from '@mui/material/CircularProgress';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: 'black',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    ...theme.applyStyles('dark', {
        backgroundColor: 'black',
    }),
}));

export default function ChangePassword() {

    const [oldPassword, setOldPassword] = React.useState<string>('');
    const [newPassword, setNewPassword] = React.useState<string>('');
    const [confirmPassword, setConfirmPassword] = React.useState<string>('');
    const [success, setSuccess] = React.useState<boolean>(false);
    const { changePassword, loading, error } = hooksChangePassword();

    async function handleChangePassword(event: React.FormEvent) {
        event.preventDefault();
        if (newPassword !== confirmPassword) {
            alert("New Password and Confirm Password do not match");
            return;
        }
        const result = await changePassword(oldPassword, newPassword, confirmPassword);
        if (result) {
            setSuccess(true);
        }
    }

    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setSuccess(false);
    };

    return (
        <Item sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={2}>

                    {/* Header */}
                    <Grid size={12}>
                        <Header />
                    </Grid>

                    <Grid size={3}></Grid>

                    {/* Main Content */}
                    <Grid size={6}>
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: '50vh',
                            backgroundColor: '#151616',
                            borderRadius: '10px',
                            border: 1,
                            borderColor: 'gray',
                            padding: '20px',
                        }}>
                            <form onSubmit={handleChangePassword}>
                                <Box sx={{ marginBottom: '3vh', width: '100%' }}>
                                    <label htmlFor="oldPassword" style={{ color: 'white' }}>Old Password</label>
                                    <input type="password" id="oldPassword" name="oldPassword" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid gray', backgroundColor: '#1e1e1e', color: 'white' }} />
                                </Box>
                                <Box sx={{ marginBottom: '3vh', width: '100%' }}>
                                    <label htmlFor="newPassword" style={{ color: 'white' }}>New Password</label>
                                    <input type="password" id="newPassword" name="newPassword" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid gray', backgroundColor: '#1e1e1e', color: 'white' }} />
                                </Box>
                                <Box sx={{ marginBottom: '3vh', width: '100%' }}>
                                    <label htmlFor="confirmPassword" style={{ color: 'white' }}>Confirm New Password</label>
                                    <input type="password" id="confirmPassword" name="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid gray', backgroundColor: '#1e1e1e', color: 'white' }} />
                                </Box>
                                {error && <Box sx={{ color: 'red', marginBottom: '2vh' }}>{error}</Box>}
                                <Box sx={{ width: '100%' }}>
                                    <button type="submit" style={{ width: '100%', padding: '10px', borderRadius: '5px', border: 'none', backgroundColor: '#3f51b5', color: 'white', cursor: 'pointer' }} disabled={loading}>
                                        {loading ? <CircularProgress size={24} color="inherit" /> : 'Change Password'}
                                    </button>
                                </Box>
                            </form>
                        </Box>
                    </Grid>

                    <Grid size={3}></Grid>
                </Grid>
            </Box>
            <Snackbar open={success} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
                    Password changed successfully!
                </Alert>
            </Snackbar>
        </Item>
    );
}
