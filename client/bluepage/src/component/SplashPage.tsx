import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import { Typography } from '@mui/material';



export const SplashPage: React.FC = ({}) => {
    
    return (
        <body>
            <Box   height="50%" sx={{ minHeight:'200',overflow:'hidden' }}>
                <Typography variant="h1" align='center'  noWrap={true} sx={{color:'white', variant:'body1',height: '40%', pt: '10%'}}>BLUE PAGE</Typography>
                <Typography variant="h6" align='center' sx={{color:'white', variant:'body1',height: '20%'}}>Where you can create,share,view comic and story </Typography>
            </Box>
            <Divider> </Divider>
            <Box  width="100%" height="40%" sx={{  display: 'flex' }}>
                <Box width="50%" sx={{borderRight: 1 ,borderColor:"#3d63d4"}} >
                    <Button variant='contained' sx={{backgroundColor:'#5227cc', pl:'10%',pr:'10%',pt:'2%',pb:'2%', ml:'30%',mt:'15%'}}><Typography variant="h6" align='center' sx={{color:'white', variant:'body1'}}>COMIC</Typography></Button>
                    <Typography variant="h6" align='left' sx={{color:'white', variant:'body1',height: '100%', pl:'30%' }}>Doujin,Fan-fiction,Original<br/> and more.. </Typography>
                </Box>
                <Box width="50%">
                    <Button variant='contained'sx={{backgroundColor:'#d52941',pl:'10%',pr:'10%',pt:'2%',pb:'2%', ml:'30%',mt:'15%'}}><Typography variant="h6" align='center' sx={{color:'white', variant:'body1'}}>STORY</Typography></Button>
                    <Typography variant="h6" align='left' sx={{color:'white', variant:'body1',height: '100%', pl:'30%' }}>Short story,Light novel,Novel sereis<br/> and more.. </Typography>
                </Box>
            </Box>
        </body>
    );
}

