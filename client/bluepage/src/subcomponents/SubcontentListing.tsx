import React from 'react';
import { Box, Link, Typography } from '@mui/material/';

export default function SubcontentListing(){
    return (
        <>
            <Box style={{ backgroundColor: '#eeeeee', alignItems: 'center', display: 'flex', flexDirection: 'row', padding: '10px', justifyContent: 'space-between' }} sx={{ border: 1.5 }}>
                    <Link href='#' underline='hover' style={{ fontWeight: 'bold', fontSize: '18px' }}>Chapter X: Example Subcontent</Link>
                    <Typography style={{ fontWeight: 'bold' }}>1,234,567 views</Typography>
            </Box>
            <Box style={{ paddingBottom: '8px' }}/>
        </>
    );
}
