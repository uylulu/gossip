import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid2';
import Header from '../components/Header/Header';
import MainContent from '../components/MainContent/MainContent';

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

export default function Home() {
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
              height: '100%',
              backgroundColor: '#151616',
              border: 1,
              borderColor: 'gray',
            }}>
              
              {/* gray line */}
              <Grid size={12}>
                <Box sx={{ height: '1px', backgroundColor: 'gray', width: '100%' }} />
              </Grid>

              <Grid size={12}>
                <MainContent />            
              </Grid>
            </Box>
          </Grid>

          <Grid size={3}>
          </Grid>
        </Grid>
      </Box>
    </Item>
  );
}
