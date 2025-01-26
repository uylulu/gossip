import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid2';
import Header from '../components/Header/Header';
import MainContent from '../components/MainContent/MainContent';
import { hooksChangeUsername } from '../hooks/user/hooksChangeUsername';
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

export default function ChangeUsername() {
  const [username, setUsername] = React.useState('');
  const [success, setSuccess] = React.useState(false);
  const { changeUsername, loading, error } = hooksChangeUsername();

  async function handleChangeUsername(event: React.FormEvent) {
    event.preventDefault();
    const result = await changeUsername(username);
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
          
          <Grid size={6}>
            <Box
              component="form"
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%',
                backgroundColor: '#151616',
                borderRadius: '10px',
                border: 1,
                borderColor: 'gray',
                padding: '20px',
              }}
              onSubmit={handleChangeUsername}
            >
              <Box sx={{ marginBottom: '20px', color: 'white' }}>
                <h2>Change Username</h2>
              </Box>
              <Box sx={{ marginBottom: '20px', width: '100%' }}>
                <input
                  type="text"
                  placeholder="Enter new username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  style={{
                    width: '97.4%',
                    padding: '10px',
                    borderRadius: '5px',
                    border: '1px solid gray',
                    backgroundColor: '#1e1e1e',
                    color: 'white',
                  }}
                />
              </Box>
              {loading && (
                <Box sx={{ marginBottom: '20px', color: 'white' }}>
                  Loading...
                </Box>
              )}
              {error && (
                <Box sx={{ marginBottom: '20px', color: 'red' }}>
                  {error}
                </Box>
              )}
              <Box sx={{ width: '100%' }}>
                <button
                  type="submit"
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '5px',
                    border: 'none',
                    backgroundColor: '#3f51b5',
                    color: 'white',
                    cursor: 'pointer',
                  }}
                  disabled={loading}
                >
                  Submit
                </button>
              </Box>
            </Box>
          </Grid>

          <Grid size={3}></Grid>
        </Grid>
      </Box>
      <Snackbar open={success} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
          Username changed successfully!
        </Alert>
      </Snackbar>
    </Item>
  );
}
