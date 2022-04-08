import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Link from '@mui/material/Link'

export default function RegisterPage(){
    return (
        <body>
            <Box  width="100%" height="100%" sx={{  display: 'flex' }}>
                <Box  width="40%" height="100%" sx={{ borderRight: 1,borderColor:"#3d63d4",overflow:'hidden' }}>
                    <Typography variant="h1" align='center' sx={{color:'white', variant:'body1',height: '100%', pt: '20%'}}>BLUE <br /> PAGE</Typography>
                </Box>
                <Box  width="40%" height="100%" sx={{ml:"10%",mr:"10%" }}>
                    <Typography variant="h6" align='left' sx={{color:'white', variant:'body1', pt: '20%'}}>Register</Typography>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="UserName"
                        label="UserName"
                        name="UserName"
                        autoComplete="UserName"
                        autoFocus
                        InputLabelProps={{style : {color : 'white'} }}
                        sx={{ color:'white',input: { color: 'white' } }}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="Email"
                        label="Email"
                        type="Email"
                        id="Email"
                        autoComplete="Email"
                        InputLabelProps={{style : {color : 'white'} }}
                        sx={{ color:'white',input: { color: 'white' } }}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="Password"
                        label="Password"
                        type="Password"
                        id="Password"
                        autoComplete="Password"
                        InputLabelProps={{style : {color : 'white'} }}
                        sx={{ color:'white',input: { color: 'white' } }}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="PasswordConfirm"
                        label="PasswordConfirm"
                        type="PasswordConfirm"
                        id="PasswordConfirm"
                        autoComplete="PasswordConfirm"
                        InputLabelProps={{style : {color : 'white'} }}
                        sx={{ color:'white',input: { color: 'white' } }}
                    />
                    <Link href="/login" variant="body2" color="#ffffff">
                        Already have a account? Login Here
                    </Link>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2,backgroundColor:'#5227cc' }}
                    >
                        Sign Up
                    </Button>
            </Box>
            </Box>
        </body>
    );
}
