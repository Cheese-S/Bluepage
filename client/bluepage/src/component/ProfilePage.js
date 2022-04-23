import React, { useEffect, useRef, useState } from 'react';
import { Box, Typography, Button, Dialog, DialogTitle, DialogContent, DialogContentText, TextField, DialogActions, TextFieldProps } from '@mui/material/';
import { ButtonAppBar } from './NavBar';
import { ProfileContentCard } from '../subcomponents/ProfileContentCard';
import { ProfileSubcontentCard } from '../subcomponents/ProfileSubcontentCard';
import { getUserByID,changeUserDescription } from '../api/api';
import { useNavigate, useParams } from 'react-router-dom';
import { userStore } from '../store/UserStore';
import { CONTENT_TYPE} from "../constant";

export default function ProfilePage(){
    const { id } = useParams();
    const state = userStore(); 
    const history = useNavigate();
    const valueRef = useRef(null);;
    const [user, setuser] = useState(null);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const getuser = async () =>{
            const res = await getUserByID(id);
            setuser(res.data.user);
        }
        getuser();
    },[]);

    const handledescribe = () => {
      setOpen(true);
    };
  
    const handleCancel = () => {
      setOpen(false);
    };

    let counter="N/A";
    let name="N/A";
    let describe="N/A";
    let listpublished; 
    let listunpublished;
    let sameUser = false;

    const handleSubmit = async () =>{
        const val = valueRef.current.value;
        const res = await changeUserDescription(val);
        describe = val;
        window.location.reload();
    }

    if(user != null){
        counter = user.followers.length;
        name = user.name;
        describe = user.description;
        sameUser = name === state.username;
        listpublished=
        <Box style={{overflowX: "auto",display: 'flex', flexDirection: 'row', margin: '16px' }}>
            {
            user.ownComics.filter(function (comic ) {return comic.published === true;}).map((comic) => (
                <ProfileContentCard
                    id={comic._id}  type={CONTENT_TYPE.COMIC} key={comic.id}
                />
            ))
            }
            {
            user.ownStories.filter(function (story ) {return story.published === true;}).map((story) => (
                <ProfileContentCard
                    id={story._id}  type={CONTENT_TYPE.STORY} key={story.id}
                />
            ))
            }
        </Box>;
        listunpublished=<Box style={{ display: 'flex', flexDirection: 'row', margin: '16px' }}>
        {
            user.ownComics.filter(function (comic ) {return comic.published === false;}).map((comic ) => (
                <ProfileContentCard
                    id={comic._id} type={CONTENT_TYPE.COMIC} key={comic.id}
                />
            ))
            }
            {
            user.ownStories.filter(function (story) {return story.published === false;}).map((story) => (
                <ProfileContentCard
                    id={story._id} type={CONTENT_TYPE.STORY} key={story.id}
                />
            ))
            }
        </Box>;
    }

    return (
        <Box style={{ backgroundColor: '#3c78d8', alignItems: 'center', justifyContent: 'center' }}>
            <Dialog open={open} onClose={handleCancel} >
                <DialogTitle>Edit description</DialogTitle>
                <DialogContent>
                <DialogContentText>
                    Enter descrption and save
                </DialogContentText>
                <TextField
                    autoFocus
                    multiline={true}
                    rows={3}
                    inputRef={valueRef}
                    margin="dense"
                    id="desc"
                    label="desc"
                    type="desc"
                    fullWidth
                    variant="standard"
                />
                </DialogContent>
                <Button onClick={handleCancel}>Cancel</Button>
                <Button onClick={handleSubmit}>Save</Button>
            </Dialog>
            <ButtonAppBar/>
            <Box style={{ padding: '20px' }} />
            <Box style={{ display: 'flex', flexDirection: 'row' }}>
                <Box style={{ width: '20%'}}>
                    <Box style={{ display: 'flex', flexDirection: 'column', width: '80%', margin: 'auto' }}>
                        <Box style={{ width: '100%', height: '240px', backgroundColor: '#d25eb2' }}>
                            <Typography style={{ fontWeight: 'bold', fontSize: '24px', padding: 8 }}>{name}</Typography>
                        </Box>
                        <Box style={{ backgroundColor: '#ffffff' }}>
                            <Box style={{ display: 'flex', flexDirection: 'row', margin: '10px' }}>
                                <Button variant='contained' style={{ fontSize: '10px', marginRight: '10px' }}>Follow</Button>
                                <Typography>{counter} followers</Typography>
                            </Box>
                            <Box>
                                <Typography style={{ padding: '10px', wordWrap: 'break-word' }} >{describe}</Typography>
                            </Box>
                            {sameUser && 
                                <Button fullWidth variant='text' onClick={handledescribe} >
                                    Edit
                                </Button>
                            }
                        </Box>
                        {sameUser && 
                            <Button href='/changepassword' variant='contained' color="error" style={{ fontSize: '10px', margin: '10px' }}>Change Password</Button>
                        }
                    </Box>
                </Box>
                <Box style={{ width: '78%', backgroundColor: '#ffffff'}} sx={{ borderRadius: 4 }}>
                    <Box style={{ display: 'flex', flexDirection: 'column' }}>
                        <Typography style={{ fontWeight: 'bold', fontSize: '24px', marginLeft: '16px', marginTop: '10px' }}>Published Content</Typography>
                        {listpublished}
                        <Typography style={{ fontWeight: 'bold', fontSize: '24px', marginLeft: '16px', marginTop: '10px' }}>Unpublished Subcontent</Typography>
                        {listunpublished}
                        <Box style={{ padding: '16px' }}/>
                    </Box>
                </Box>
                <Box style={{ width: '2%'}}/>
            </Box>
            <Box style={{ padding: '16px' }}/>
        </Box>
    );
}

