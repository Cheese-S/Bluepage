import React from 'react';
import { useNavigate } from 'react-router-dom';
import {Box, Button, Typography, Card, CardMedia} from '@mui/material/';

export default function FourOFourPage() {
    const navigate = useNavigate();

    let x = " ";
    const goHome = () => {
        navigate('/home');
    }
    return (
        <Box style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%'}}>
            <Typography align = 'center' variant = 'h1' style = {{color: "#DF0000"}} sx = {{marginTop: "5%"}}>404 Page</Typography>
            <br></br>
            <br></br>
            <Card sx ={{width: "40%", align: "center", marginLeft: "30%"}} >
                <CardMedia
                    component="img"
                    height="100%"
                    width="100"
                    image="https://images.unsplash.com/photo-1555861496-0666c8981751?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2940&q=80"
                    alt="green iguana"
                />
            </Card>
            <br></br>
            <Typography align = 'center' variant = 'h5'>Oh no! You have stumbled on a page that no longer exists. </Typography>
            <Typography align = 'center' variant = 'h5'>Or, you are trying to access a page you can't. Either way, go back to the home screen.</Typography>
            <br></br>
            <Button variant = "contained" sx = {{marginLeft: '35%', width: '30%'}} style = {{color: '#000000', background: "#FFFFFF"}} onClick = {goHome}>Back To Home Screen</Button>
        </Box>
    );
}