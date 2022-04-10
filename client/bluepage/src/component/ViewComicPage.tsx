import React from 'react';
import { Box, Typography, Button, TextField } from '@mui/material/';
import ContentBlurb from '../subcomponents/ContentBlurb';
import Comment from '../subcomponents/Comment';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';

export default function ViewComicPage(){
    return (
        <Box style={{ backgroundColor: '#3c78d8', alignItems: 'center', justifyContent: 'center' }}>
            <Box style={{ width: '90%', margin: 'auto', paddingTop: '10px', paddingBottom: '10px' }}>
                <ContentBlurb />
            </Box>
            <Box style={{ width: '90%', margin: 'auto' }}>
                <Box style={{ backgroundColor: '#ffffff', padding: '10px' }}>
                    <Typography align='center' style={{ fontWeight: 'bold', fontSize: '20px' }}>Page 1: Example Page</Typography>
                </Box>
            </Box>
            <Box style={{ width: '90%', margin: 'auto', paddingTop: '10px' }}>
                <img src='https://manga.guya.moe/media/manga/Kaguya-Wants-To-Be-Confessed-To/chapters/0111-1_x1oc9802/3/01.png' style={{ width: '50%', height: '50%', display: 'block', marginLeft: 'auto', marginRight: 'auto', }}/>
            </Box>
            <Box style={{ width: '90%', margin: 'auto', paddingTop: '10px'}}/>
            <Box style={{ backgroundColor: '#ffffff', width: '90%', margin: 'auto', paddingTop: '10px' }}>
                <Box style={{ width: '98%', margin: 'auto'}}>
                    <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                        <Typography style={{ fontWeight: 'bold', width: '70%' }}>1,234 views</Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'row-reverse', alignItems: 'center', width: '30%', marginRight: '20px' }}>
                            <Typography style={{ fontWeight: 'bold' }}>3</Typography>
                            <ThumbDownOffAltIcon sx={{ fontSize: '40px' }}></ThumbDownOffAltIcon>
                            <Typography style={{ fontWeight: 'bold', marginRight: '20px' }}>112</Typography>
                            <ThumbUpOffAltIcon sx={{ fontSize: '40px' }}></ThumbUpOffAltIcon>
                        </Box>
                    </Box>
                    <Typography style={{ fontSize: '18px', paddingTop: '5px', paddingBottom: '20px' }}>Leave a comment...</Typography>
                    <Box style={{ display: 'flex', flexDirection: 'row', paddingBottom: '20px' }}>
                        <Box style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: '#aaaa00' }}></Box>
                        <Box style={{ paddingRight: '20px' }}/>
                        <Box style={{ display: 'flex', flexDirection: 'column', width: '90%' }}>
                            <TextField fullWidth placeholder='Add a comment...' style={{ paddingBottom: '10px'}}/>
                            <Button variant='contained' sx={{ width: '7%', alignSelf: 'flex-end' }}>Submit</Button>
                        </Box>
                    </Box>
                    <Box style={{ paddingBottom: '20px', width: '90%' }}>
                        
                    </Box>
                    <Comment/>
                </Box>
            </Box>
        </Box>
    );
}
