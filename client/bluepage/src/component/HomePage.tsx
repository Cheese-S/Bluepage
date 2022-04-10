import React from 'react';
import { Box } from '@mui/material/';
import { ButtonAppBar } from './NavBar';
import { ViewCard } from './ViewCard';
import Grid from '@material-ui/core/Grid/Grid';

export default function HomePage(){
    return (
        <Box style={{ backgroundColor: '#3c78d8', alignItems: 'center', justifyContent: 'center' }}>
            <ButtonAppBar/>
            <Box style={{ padding: '20px' }} />
            <Grid container spacing={2}>
                <Grid item xs={3}>
                    <ViewCard />
                </Grid>

                <Grid item xs={3}>
                    <ViewCard />
                </Grid>

                <Grid item xs={3}>
                    <ViewCard />
                </Grid>

                <Grid item xs={3}>
                    <ViewCard />
                </Grid>
                <Grid item xs={3}>
                    <ViewCard />
                </Grid>

                <Grid item xs={3}>
                    <ViewCard />
                </Grid>

                <Grid item xs={3}>
                    <ViewCard />
                </Grid>

                <Grid item xs={3}>
                    <ViewCard />
                </Grid>
                <Grid item xs={3}>
                    <ViewCard />
                </Grid>

                <Grid item xs={3}>
                    <ViewCard />
                </Grid>

                <Grid item xs={3}>
                    <ViewCard />
                </Grid>

                <Grid item xs={3}>
                    <ViewCard />
                </Grid>
            </Grid>
        </Box>
    );
}
