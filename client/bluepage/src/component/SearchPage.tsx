import React from 'react';
import { Box } from '@mui/material/';
import { ButtonAppBar } from './NavBar';
import { SearchViewCard } from './SearchViewCard';

export default function SearchPage(){
    return (
        <Box style={{ backgroundColor: '#3c78d8', alignItems: 'center', justifyContent: 'center' }}>
            <ButtonAppBar/>
            <Box style={{ padding: '20px' }} />
            <Box style={{ display: 'flex', flexDirection: 'column' }}>
                <SearchViewCard/>
                <SearchViewCard/>
                <SearchViewCard/>
                <SearchViewCard/>
            </Box>
        </Box>
    );
}
