import React from 'react';
import { Typography, Button, Link, Box } from '@mui/material/';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';

export default function ContentBlurb() {
    return (
        <Box style={{ backgroundColor: 'white', padding: '10px' }}>
            <Typography style={{ fontWeight: 'bold' }}>Placeholder Comic/Story</Typography>
            <Link href="#" underline="hover">by placeholderUser123</Link>
            <Typography style={{ paddingTop: '20px' }}>An example comic/story about a generic protagonist, named Joseph Schmosef, who goes on a generic adventure in Generic High School with his generic friends, Comic Relief Character and Emotional Death Fodder. They go on generic adventures all throughout Generic Town, and the story follows a very generic slice-of-life format until some generic tragedy occurs that completely changes the genre of the show and makes the audience cry a single, generic tear. Then the comic/story will have a decline in its already generic quality, because its generic author has no experience in writing generic dramas.</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems:'center', paddingTop: '10px' }}>
                <Typography style={{ fontWeight: 'bold', paddingRight: '5px' }}>Tags:</Typography>
                <Typography>Romance, Slice of Life, Drama, Hurt/Comfort, Slash</Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems:'center'}}>
                <Typography style={{ fontWeight: 'bold', width: '20%' }}>1,234,567,890 views</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'row', width: '50%' }}>
                    <Typography style={{ fontWeight: 'bold', paddingRight:'10px' }}>39 following</Typography>
                    <Button variant='contained'>Follow</Button>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'row-reverse', alignItems: 'center', width: '30%', marginRight: '20px' }}>
                    <Typography style={{ fontWeight: 'bold' }}>107,231</Typography>
                    <ThumbDownOffAltIcon sx={{ fontSize: '40px' }}></ThumbDownOffAltIcon>
                    <Typography style={{ fontWeight: 'bold', marginRight: '20px' }}>31</Typography>
                    <ThumbUpOffAltIcon sx={{ fontSize: '40px' }}></ThumbUpOffAltIcon>
                </Box>
            </Box>
        </Box>
    );
}
