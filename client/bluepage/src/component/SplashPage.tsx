import React from 'react';
import { useNavigate } from 'react-router-dom'; 
import { userStore } from '../store/UserStore';
import { Box, Button, Divider, Typography } from '@mui/material/';
import { CONTENT_TYPE } from '../constant';

export const SplashPage: React.FC = () => {
    const navigate = useNavigate();
    const setSiteMode = userStore(state => state.setSiteMode);

    const goToComic = () => {
        setSiteMode(CONTENT_TYPE.COMIC);
        navigate('/home');
    }

    const goToStory = () => {
        setSiteMode(CONTENT_TYPE.STORY);
        navigate('/home');
    }
    
    return (
        <body>
            <Box height="50%" sx={{ minHeight:'200',overflow:'hidden' }}>
                <Typography variant="h1" align='center'  noWrap={true} sx={{color:'black', variant:'body1',height: '40%', pt: '10%'}}>BLUE PAGE</Typography>
                <Typography variant="h6" align='center' sx={{color:'black', variant:'body1',height: '20%'}}>Where you can create, share, and view comics and stories </Typography>
            </Box>
            <Divider> </Divider>
            <Box  width="100%" height="40%" sx={{  display: 'flex' }}>
                <Box width="50%" sx={{borderRight: 1 ,borderColor:"#82afd6"}} >
                    <Button onClick={goToComic} variant='contained' sx={{ backgroundColor: '#5227cc', pl: '10%', pr: '10%', pt: '2%', pb: '2%', ml: '30%', mt: '15%' }}>
                        <Typography variant="h6" align='center' sx={{ color: 'white', variant: 'body1' }}>COMIC</Typography>
                    </Button>
                    <Typography variant="h6" align='left' sx={{color:'black', variant:'body1',height: '100%', pl:'30%' }}>Doujin, Web Comics, Originals<br/> and more... </Typography>
                </Box>
                <Box width="50%">
                    <Button onClick={goToStory} variant='contained' sx={{ backgroundColor: '#d52941', pl: '10%', pr: '10%', pt: '2%', pb: '2%', ml: '30%', mt: '15%' }}>
                        <Typography variant="h6" align='center' sx={{ color: 'white', variant: 'body1' }}>STORY</Typography>
                    </Button>
                    <Typography variant="h6" align='left' sx={{color:'black', variant:'body1',height: '100%', pl:'30%' }}>Short Stories, Light Novels, Fanfiction<br/> and more... </Typography>
                </Box>
            </Box>
        </body>
    );
}

