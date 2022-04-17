import React, { useState } from 'react';
import { Box, Typography, Button, TextField, Link, Modal } from '@mui/material/';
import { changePasswordLoggedOut } from '../api/api';

export const ResetPasswordPage: React.FC = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    // @ts-ignore
    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const formData = new FormData(event.currentTarget);
            const identifier = formData.get('usernameOrEmail');
            const password = formData.get('password');
            const passwordConfirmation = formData.get('passwordConfirm');

            if (password !== passwordConfirmation) {
                setError('Your passwords do not match.');
                setModalVisible(true);
                return;
            }

            const answer1 = formData.get('sec1');
            const answer2 = formData.get('sec2');
            const answer3 = formData.get('sec3');
            const answers = [answer1, answer2, answer3];

            // @ts-ignore
            await changePasswordLoggedOut(password, answers, identifier);
            setSuccess(true);
            setError('Your password was successfully changed.')
            setModalVisible(true);
        } catch (err) {
            console.log(err);
            setSuccess(false);
            setError('That user may not exist, or your security answers were wrong. Please try again.');
            setModalVisible(true);
        }
    }

    return (
            <Box  width="100%" height="100%" sx={{  display: 'flex' }}>
                <Box  width="40%" height="100%" sx={{ borderRight: 1,borderColor:"#3d63d4",overflow:'hidden' }}>
                    <Typography variant="h1" align='center' sx={{color:'white', variant:'body1',height: '100%', pt: '20%'}}>BLUE <br /> PAGE</Typography>
                </Box>
                <Modal
                    open={modalVisible}
                >
                    <Box sx={{ position: 'absolute', top: '50%', left: '50%', bgcolor: 'white', border: '2px solid #000', width: '30%', p: 4 }}>
                        <Typography id="modal-modal-title" variant="h6" component="h2">
                            {success ? 'Success!' : 'There was a problem'}
                        </Typography>
                        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                            {error}
                        </Typography>
                        {success ?
                        <Link href="/login" variant="body2" color="#ffffff">
                            <Button id='close' variant='contained' onClick={() => setModalVisible(false)} style={{ marginTop: 10 }}>
                                Back to login
                            </Button>
                        </Link>
                        :
                        <Button id='close' variant='contained' onClick={() => setModalVisible(false)} style={{ marginTop: 10 }}>
                            Okay
                        </Button>
                        }
                    </Box>
                </Modal>
                <Box component="form" onSubmit={handleSubmit} width="40%" height="100%" sx={{ml:"10%",mr:"10%" }}>
                    <Typography variant="h6" align='left' sx={{color:'white', variant:'body1', pt: '20%'}}>Reset Your Password</Typography>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="usernameOrEmail"
                        label="Username or email"
                        name="usernameOrEmail"
                        autoComplete="usernameOrEmail"
                        autoFocus
                        InputLabelProps={{style : {color : 'white'} }}
                        sx={{ color:'white',input: { color: 'white' } }}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="New password"
                        type="password"
                        id="password"
                        autoComplete="password"
                        InputLabelProps={{style : {color : 'white'} }}
                        sx={{ color:'white',input: { color: 'white' } }}
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
                        InputLabelProps={{style : {color : 'white'} }}
                        sx={{ color:'white',input: { color: 'white' } }}
                    />
                    <Typography variant="h6" align='left' sx={{color:'white', variant:'body1', pt: '5%'}}>Security Questions</Typography>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="sec1"
                        label="In what country were you born?"
                        type="sec1"
                        id="sec1"
                        InputLabelProps={{style : {color : 'white'} }}
                        sx={{ color:'white',input: { color: 'white' } }}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="sec2"
                        label="What town did you grow up in?"
                        type="sec2"
                        id="sec2"
                        InputLabelProps={{style : {color : 'white'} }}
                        sx={{ color:'white',input: { color: 'white' } }}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="sec3"
                        label="What is your mother's maiden name?"
                        type="sec3"
                        id="sec3"
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
    );
}
