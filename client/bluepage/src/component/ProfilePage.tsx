import React from 'react';
import { Box, Typography, Button } from '@mui/material/';
import { ButtonAppBar } from './NavBar';
import { ProfileContentCard } from '../subcomponents/ProfileContentCard';
import { ProfileSubcontentCard } from '../subcomponents/ProfileSubcontentCard';

export default function ProfilePage(){
    return (
        <Box style={{ backgroundColor: '#3c78d8', alignItems: 'center', justifyContent: 'center' }}>
            <ButtonAppBar/>
            <Box style={{ padding: '20px' }} />
            <Box style={{ display: 'flex', flexDirection: 'row' }}>
                <Box style={{ width: '20%'}}>
                    <Box style={{ display: 'flex', flexDirection: 'column', width: '80%', margin: 'auto' }}>
                        <Box style={{ width: '100%', height: '240px', backgroundColor: '#d25eb2' }}>
                            <Typography style={{ fontWeight: 'bold', fontSize: '80px' }}>JS</Typography>
                        </Box>
                        <Box style={{ backgroundColor: '#ffffff' }}>
                            <Typography style={{ fontSize: '18px', margin: '10px' }}>@joeyschmoey</Typography>
                            <Box style={{ display: 'flex', flexDirection: 'row', margin: '10px' }}>
                                <Button variant='contained' style={{ fontSize: '10px', marginRight: '10px' }}>Follow</Button>
                                <Typography>7 followers</Typography>
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
