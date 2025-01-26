import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid2 from '@mui/material/Grid2';
import { useParams } from 'react-router-dom';
import Header from '../components/Header/Header';
import MainContent from '../components/MainContent/MainContent';
import { useThreadContext } from '../context/ThreadContext';
import ThreadHeader from '../components/Thread/ThreadHeader';
import ThreadContent from '../components/Thread/ThreadContent';
import CommentSection from '../components/Comment/CommentSection';

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

export default function ThreadPage() {
    const { thread_id } = useParams<{ thread_id: string }>();
    const { threads } = useThreadContext();
    const MainThread = threads.find((thread) => thread.Thread_id === parseInt(thread_id || '0'));

    return (
        <Item sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ flexGrow: 1 }}>
            <Grid2 container spacing={2}>
                {/* Header */}
                <Grid2 size={12}>
                <Header />
                </Grid2>

                {/* Main Content */}
                <Grid2 size={3}></Grid2>
                <Grid2 size={6}>
                <Box
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
                    }}
                >
                    <Grid2 size={12}>
                    {MainThread && <ThreadHeader thread={MainThread} />}
                    </Grid2>
                </Box>
                </Grid2>
                <Grid2 size={3}></Grid2>

                <Grid2 size={3}></Grid2>
                    <Grid2 size={6}>
                        {MainThread && <ThreadContent thread={MainThread} />}
                    </Grid2>
                <Grid2 size={3}></Grid2>

                {/* Comment Section */}
                <Grid2 size={3}></Grid2>
                    <Grid2 size={6}>
                        {MainThread && <CommentSection MainThread={MainThread} />}
                    </Grid2>
                <Grid2 size={3}></Grid2>
                
            </Grid2>
            </Box>
        </Item>
    );
}
