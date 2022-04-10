import React from 'react';
import { Box, Typography } from '@mui/material/';

export default function SubcontentListing(){
    return (
        <Box style={{ display: 'flex', flexDirection: 'row', paddingBottom: '20px' }}>
            <Box style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: '#aa00aa' }}></Box>
            <Box style={{ paddingRight: '20px' }}/>
            <Box style={{ display: 'flex', flexDirection: 'column' }}>
                <Typography style={{ fontWeight: 'bold', fontSize: '14px'}}>exampleCommenterUsername</Typography>
                <Typography style={{ color: '#68717a' }}>I hate this so much that I'm doing it on a Saturday night.</Typography>
            </Box>
        </Box>
    );
}
