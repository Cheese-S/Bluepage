import React, { useState } from 'react';
import { Box, Typography, Button, TextField, Link, Modal } from '@mui/material/';
import { registerUser } from '../api/api';
import { userStore } from '../store/UserStore';
import { useNavigate } from 'react-router-dom';

export const RegisterPage = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const [error, setError] = useState('');
    const storeLogin = userStore(state => state.login);
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const formData = new FormData(event.currentTarget);
            const username = formData.get('username');
            const email = formData.get('email');
            const password = formData.get('password');
            const passwordConfirmation = formData.get('passwordConfirm');

            if (password !== passwordConfirmation) {
                setError('Your passwords do not match.');
                setModalVisible(true);
                return;
            } else if (password.length < 8) {
                setError('Your password is too short! For security, use a password of at least 8 characters.');
                setModalVisible(true);
                return;
            }

            const answer1 = formData.get('sec1');
            const answer2 = formData.get('sec2');
            const answer3 = formData.get('sec3');
            const answers = [answer1, answer2, answer3];

            const res = await registerUser(username, password, passwordConfirmation, email, answers);
            const { _id, name, likedComics, dislikedComics, likedPages, dislikedPages, likedStories, dislikedStories, likedChapters, dislikedChapters, isAdmin } = res.data.user;

            storeLogin(_id, name, likedComics, dislikedComics, likedPages, dislikedPages, likedStories, dislikedStories, likedChapters, dislikedChapters, isAdmin);
            navigate("/home");
        } catch (err) {
            console.log(err);
            const error = String(err);
            const errMsg = error.includes('409') ? 'Someone already has that username or email.' : 'There was a problem on our end. Try again later.';
            setError(errMsg);
            setModalVisible(true);
        }
    }

    return (
            <Box  width="100%" height="100%" sx={{  display: 'flex' }}>
                <Box  width="40%" height="100%" sx={{ borderRight: 1,borderColor:"#3d63d4",overflow:'hidden' }}>
                    <Typography variant="h1" align='center' sx={{color:'black', variant:'body1',height: '100%', pt: '20%'}}>BLUE <br /> PAGE</Typography>
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
                        <Button id='close' variant='contained' onClick={() => setModalVisible(false)} style={{ marginTop: 10 }}>
                            Okay
                        </Button>
                    </Box>
                </Modal>
                <Box component="form" onSubmit={handleSubmit} width="40%" height="100%" sx={{ml:"10%",mr:"10%" }}>
                    <Typography variant="h6" align='left' sx={{color:'black', variant:'body1', pt: '20%'}}>Register</Typography>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="username"
                        label="Username"
                        name="username"
                        autoComplete="username"
                        autoFocus
                        InputLabelProps={{style : {color : 'black'} }}
                        sx={{ color:'black',input: { color: 'black' } }}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="email"
                        label="Email"
                        type="email"
                        id="email"
                        autoComplete="email"
                        InputLabelProps={{style : {color : 'black'} }}
                        sx={{ color:'black',input: { color: 'black' } }}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="password"
                        InputLabelProps={{style : {color : 'black'} }}
                        sx={{ color:'black',input: { color: 'black' } }}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="passwordConfirm"
                        label="Confirm password"
                        type="password"
                        id="passwordConfirm"
                        autoComplete="password"
                        InputLabelProps={{style : {color : 'black'} }}
                        sx={{ color:'black',input: { color: 'black' } }}
                    />
                    <Typography variant="h6" align='left' sx={{color:'black', variant:'body1', pt: '5%'}}>Security Questions</Typography>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="sec1"
                        label="In what country were you born?"
                        type="sec1"
                        id="sec1"
                        InputLabelProps={{style : {color : 'black'} }}
                        sx={{ color:'black',input: { color: 'black' } }}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="sec2"
                        label="What town did you grow up in?"
                        type="sec2"
                        id="sec2"
                        InputLabelProps={{style : {color : 'black'} }}
                        sx={{ color:'black',input: { color: 'black' } }}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="sec3"
                        label="What is your mother's maiden name?"
                        type="sec3"
                        id="sec3"
                        InputLabelProps={{style : {color : 'black'} }}
                        sx={{ color:'black',input: { color: 'black' } }}
                    />
                    <Link href="/login" variant="body2" color="#000000">
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
    );
}
