import React, { useEffect } from 'react';
import { Box, Typography, Button } from '@mui/material/';
import { ButtonAppBar } from './NavBar';
import { ProfileContentCard } from '../subcomponents/ProfileContentCard';
import { ProfileSubcontentCard } from '../subcomponents/ProfileSubcontentCard';
import { getUserByID } from '../api/api';

export default function ProfilePage(){
    useEffect(() => {
        // getUserByID();
      });
    let counter = 7;
    let name = "Joeshimo";
    let initla = "JS";

    return (
        <Box style={{ backgroundColor: '#3c78d8', alignItems: 'center', justifyContent: 'center' }}>
            <ButtonAppBar/>
            <Box style={{ padding: '20px' }} />
            <Box style={{ display: 'flex', flexDirection: 'row' }}>
                <Box style={{ width: '20%'}}>
                    <Box style={{ display: 'flex', flexDirection: 'column', width: '80%', margin: 'auto' }}>
                        <Box style={{ width: '100%', height: '240px', backgroundColor: '#d25eb2' }}>
                            <Typography style={{ fontWeight: 'bold', fontSize: '80px' }}>{initla}</Typography>
                        </Box>
                        <Box style={{ backgroundColor: '#ffffff' }}>
                            <Typography style={{ fontSize: '18px', margin: '10px' }}>@{name}</Typography>
                            <Box style={{ display: 'flex', flexDirection: 'row', margin: '10px' }}>
                                <Button variant='contained' style={{ fontSize: '10px', marginRight: '10px' }}>Follow</Button>
                                {counter}<Typography> followers</Typography>
                            </Box>
                        </Box>
                    </Box>
                </Box>
                <Box style={{ width: '78%', backgroundColor: '#ffffff'}} sx={{ borderRadius: 4 }}>
                    <Box style={{ display: 'flex', flexDirection: 'column' }}>
                        <Typography style={{ fontWeight: 'bold', fontSize: '24px', marginLeft: '16px', marginTop: '10px' }}>Published Content</Typography>
                        <Box style={{ display: 'flex', flexDirection: 'row', margin: '16px' }}>
                            <ProfileContentCard/>
                            <ProfileContentCard/>
                            <ProfileContentCard/>
                        </Box>
                        <Typography style={{ fontWeight: 'bold', fontSize: '24px', marginLeft: '16px', marginTop: '10px' }}>Unpublished Subcontent</Typography>
                        <Box style={{ display: 'flex', flexDirection: 'row', margin: '16px' }}>
                            <ProfileSubcontentCard/>
                        </Box>
                        <Box style={{ padding: '16px' }}/>
                    </Box>
                </Box>
                <Box style={{ width: '2%'}}/>
            </Box>
            <Box style={{ padding: '16px' }}/>
        </Box>
    );
}
function componentDidMount() {
    throw new Error('Function not implemented.');
}

