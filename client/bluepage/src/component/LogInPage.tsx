import React, { useState } from 'react';
import { Box, Typography, Button, TextField, Link, Modal } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { userStore } from '../store/UserStore';
import { login } from '../api/api';

export const LogInPage: React.FC = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const [error, setError] = useState('');
    const state = userStore();
    const navigate = useNavigate();

    // @ts-ignore
    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const formData = new FormData(event.currentTarget);
            const identifier = formData.get('EmailOrUserName');
            const password = formData.get('Password');

            const res = await login(String(identifier), String(password));
            state.setID(res.data._id);
            state.setUsername(res.data.name);
            state.setIsLoggedIn(true);

            navigate("/home/test");
        } catch (err) {
            console.log(err);
            setError('Those credentials are invalid. Please try again.');
            setModalVisible(true);
        }
    }

    return (
        <body>
            <Box  width="100%" height="100%" sx={{  display: 'flex' }}>
                <Box  width="40%" height="100%" sx={{ borderRight: 1,borderColor:"#3d63d4",overflow:'hidden' }}>
                    <Typography variant="h1" align='center' sx={{color:'white', variant:'body1',height: '100%', pt: '20%'}}>BLUE <br /> PAGE</Typography>
                </Box>
                <Modal
                    open={modalVisible}
                >
                    <Box sx={{ position: 'absolute', top: '50%', left: '50%', bgcolor: 'white', border: '2px solid #000', width: '30%', p: 4 }}>
                        <Typography id="modal-modal-title" variant="h6" component="h2">
                            There was a problem
                        </Typography>
                        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                            {error}
                        </Typography>
                        <Button id="close" variant='contained' onClick={() => setModalVisible(false)} style={{ marginTop: 10 }}>
                            Okay
                        </Button>
                    </Box>
                </Modal>
                <Box component="form" onSubmit={handleSubmit} width="40%" height="100%" sx={{ml:"10%",mr:"10%" }}>
                    <Typography variant="h6" align='left' sx={{color:'white', variant:'body1', pt: '20%'}}>Login</Typography>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="EmailOrUserName"
                        label="Email or username"
                        name="EmailOrUserName"
                        autoComplete="EmailOrUserName"
                        autoFocus
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
                    <Link href="/signup" variant="body2" color="#ffffff">
                        Don't have a account? Sign up now
                    </Link>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2,backgroundColor:'#5227cc' }}
                    >
                        Log In
                    </Button>
                    <Link href="#" variant="body2" color="#ffffff">
                        Forgot Password? Click Here
                    </Link>
            </Box>
            </Box>
        </body>
    );
}
