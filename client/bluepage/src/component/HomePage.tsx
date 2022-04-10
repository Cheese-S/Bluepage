import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import { ButtonAppBar } from './NavBar';
import { ViewCard } from './ViewCard'
import Grid from '@material-ui/core/Grid/Grid';

export const HomePage: React.FC = () => {
    return (
        <Box style={{ alignItems: 'center', justifyContent: 'center' }}>
            <ButtonAppBar />
            <Link color='inherit' href="/home/test" underline="hover">
                <Typography style={{ fontWeight: 'bold', fontSize: '24px', marginLeft: '16px', marginTop: '10px' }}>Most Recent</Typography>
            </Link>
            <Grid container spacing={2}>
                <Grid item xs={3}>
                    <ViewCard />
                </Grid >

                <Grid item xs={3}>
                    <ViewCard />
                </Grid >

                <Grid item xs={3}>
                    <ViewCard />
                </Grid >

                <Grid item xs={3}>
                    <ViewCard />
                </Grid >

            </Grid>
            <Link color='inherit' href="/home/test" underline="hover">
                <Typography style={{ fontWeight: 'bold', fontSize: '24px', marginLeft: '16px', marginTop: '10px' }}>Trending</Typography>
            </Link>
            <Grid container spacing={2}>
                <Grid item xs={3}>
                    <ViewCard />
                </Grid >

                <Grid item xs={3}>
                    <ViewCard />
                </Grid >

                <Grid item xs={3}>
                    <ViewCard />
                </Grid >

                <Grid item xs={3}>
                    <ViewCard />
                </Grid >

            </Grid>
            <Link color='inherit' href="/home/test" underline="hover">
                <Typography style={{ fontWeight: 'bold', fontSize: '24px', marginLeft: '16px', marginTop: '10px' }}>From Your Following</Typography>
            </Link>
            <Grid container spacing={2}>
                <Grid item xs={3}>
                    <ViewCard />
                </Grid >

                <Grid item xs={3}>
                    <ViewCard />
                </Grid >

                <Grid item xs={3}>
                    <ViewCard />
                </Grid >

                <Grid item xs={3}>
                    <ViewCard />
                </Grid >

            </Grid>
        </Box>
    )
}