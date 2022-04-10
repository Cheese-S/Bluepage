import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import { ButtonAppBar } from './NavBar';
import { ProfileContentCard } from '../subcomponents/ProfileContentCard';
import { ProfileSubcontentCard } from '../subcomponents/ProfileSubcontentCard';

export const HomePage: React.FC = () => {
    return (
        <Box style = {{alignItems: 'center', justifyContent: 'center'}}>
            <ButtonAppBar/>
            <Link color = 'inherit' href="/home/test" underline = "hover">
                        <Typography style={{ fontWeight: 'bold', fontSize: '24px', marginLeft: '16px', marginTop: '10px' }}>Most Recent</Typography>                        
                        </Link>
            <Box style={{ display: 'flex', flexDirection: 'row', margin: '16px' }}>
                            <ProfileContentCard/>
                            <ProfileContentCard/>
                            <ProfileContentCard/>
                            <ProfileContentCard/>
                        </Box>
                        <Link color = 'inherit' href="/home/test" underline = "hover">
                        <Typography style={{ fontWeight: 'bold', fontSize: '24px', marginLeft: '16px', marginTop: '10px' }}>Trending</Typography>                        
                        </Link>
                        <Box style={{ display: 'flex', flexDirection: 'row', margin: '16px' }}>
                            <ProfileContentCard/>
                            <ProfileContentCard/>
                            <ProfileContentCard/>
                            <ProfileContentCard/>
                        </Box>
                        <Link color = 'inherit' href="/home/test" underline = "hover">
                        <Typography style={{ fontWeight: 'bold', fontSize: '24px', marginLeft: '16px', marginTop: '10px' }}>From Your Following</Typography>                        
                        </Link>
                        <Box style={{ display: 'flex', flexDirection: 'row', margin: '16px' }}>
                            <ProfileContentCard/>
                            <ProfileContentCard/>
                            <ProfileContentCard/>
                        </Box>
        </Box>
    )}