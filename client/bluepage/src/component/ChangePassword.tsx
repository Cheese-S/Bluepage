import React, { useState } from 'react';
import { Box, Typography, Button, TextField, Link, Modal } from '@mui/material/';
import { changePassword } from '../api/api';
import { userStore } from '../store/UserStore';

export const ChangePassword: React.FC = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const id = userStore(state => state.id);
    const route = `/profile/test/${id}`;

    // @ts-ignore
    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const formData = new FormData(event.currentTarget);
            const password = formData.get('password');
            const passwordConfirmation = formData.get('passwordConfirm');

            if (password !== passwordConfirmation) {
                setError('Your passwords do not match.');
                setModalVisible(true);
                return;
            }

            // @ts-ignore
            await changePassword(password);
            setSuccess(true);
            setError('Your password was successfully changed.')
            setModalVisible(true);
        } catch (err) {
            console.log(err);
            setSuccess(false);
            setError('Something went wrong! Try Again!');
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
                        <Link href={route} variant="body2" color="#ffffff">
                            <Button id='close' variant='contained' onClick={() => setModalVisible(false)} style={{ marginTop: 10 }}>
                                Back to profile
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
                    <Typography variant="h6" align='left' sx={{color:'white', variant:'body1', pt: '20%'}}>Change Your Password</Typography>
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
                    <Link href={route} variant="body2" color="#ffffff">
                        Don't want to change your password anymore? Go back to profile.
                    </Link>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2,backgroundColor:'#5227cc' }}
                    >
                        Change Password
                    </Button>
                </Box>
            </Box>
    );
}
