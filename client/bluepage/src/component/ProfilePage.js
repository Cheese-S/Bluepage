import React, { useEffect, useRef, useState } from 'react';
import { Box, Typography, Button, Dialog, DialogTitle, DialogContent, DialogContentText, FormControl, OutlinedInput, InputLabel, TextField, DialogActions, MenuItem, Select } from '@mui/material/';
import { ButtonAppBar } from './NavBar';
import { ProfileContentCard } from '../subcomponents/ProfileContentCard';
import { getUserByID, changeUserDescription, createNewContent, getUser } from '../api/api';
import { useParams } from 'react-router-dom';
import { userStore } from '../store/UserStore';
import { CONTENT_TYPE} from "../constant";

const tags = [
    'Action',
    'Comedy',
    'Fantasy',
    'Fanwork',
    'Historical',
    'Mystery',
    'Psychological',
    'Romance',
    'Sci-Fi',
    'Thriller',
  ];
export default function ProfilePage(){
    const { id } = useParams();
    const selfID = userStore(state => state.id); 
    const sameUser = selfID === id;

    const valueRef = useRef(null);
    const comicTitle = useRef(null);
    const comicDesc = useRef(null);
    const comicTags = useRef(null);

    const [name, setName] = useState('N/A');
    const [followers, setFollowers] = useState(0);
    const [describe, setDescribe] = useState('');
    const [contentList, setContentList] = useState(null);
    const [openDescModal, setOpenDescModal] = useState(false);
    const [openCreateModal, setOpenCreateModal] = useState(false);
    const [tag, setTags] = useState([]);

    useEffect(() => {
        const getuser = async () =>{
            
            const res = sameUser ? await getUser() : await getUserByID(id);

            setName(res.data.user.name);
            setFollowers(res.data.user.followers.length);
            setDescribe(res.data.user.description);

            const listOfContent =
                <Box style={{ overflowX: "auto", display: 'flex', flexDirection: 'row', margin: '16px' }}>
                    {
                        res.data.user.ownComics.map((comic) => (
                            <ProfileContentCard
                                id={comic._id} type={CONTENT_TYPE.COMIC} key={comic.id}
                            />
                        ))
                    }
                    {
                        res.data.user.ownStories.map((story) => (
                            <ProfileContentCard
                                id={story._id} type={CONTENT_TYPE.STORY} key={story.id}
                            />
                        ))
                    }
                </Box>;
            
            setContentList(listOfContent);
        }
        getuser();
    }, []);
  
    const handleCreateClose = () => {
        setTags([]);
        setOpenCreateModal(false);
    };

    const handleCreateChange = (event) => {
        const {target: { value }} = event;
        console.log(value);
        setTags(
          typeof value === 'string' ? value.split(',') : value,
        );
      };

    const handleDescriptionChange = async () =>{
        const val = valueRef.current.value;

        try {
            await changeUserDescription(val);
            setDescribe(val);
            setOpenDescModal(false);
        } catch (err) {
            console.log(err);
            setOpenDescModal(false);
        }
    };

    const handleCreate = async() => {
        const title = comicTitle.current.value;
        const desc = comicDesc.current.value;
        const tags = comicTags.current.value;
        
        try {   
            await createNewContent("comic", title, desc, tags);
        } catch(err) {
            console.log(err);
        }
        window.location.reload();
    };

    return (
        <Box style={{ backgroundColor: '#3c78d8', alignItems: 'center', justifyContent: 'center' }}>
            <Dialog open={openDescModal} onClose={() => setOpenDescModal(false)} >
                <DialogTitle>Edit description</DialogTitle>
                <DialogContent>
                <DialogContentText>
                    Enter a new description
                </DialogContentText>
                <TextField
                    autoFocus
                    multiline={true}
                    rows={3}
                    inputRef={valueRef}
                    defaultValue={describe}
                    margin="dense"
                    id="desc"
                    label="desc"
                    type="desc"
                    fullWidth
                    variant="standard"
                />
                </DialogContent>
                <Button onClick={() => setOpenDescModal(false)}>Cancel</Button>
                <Button onClick={handleDescriptionChange}>Save</Button>
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
                                <Typography>{followers} followers</Typography>
                            </Box>
                            <Box>
                                <Typography style={{ padding: '10px', wordWrap: 'break-word' }} >{describe}</Typography>
                            </Box>
                            {sameUser && 
                                <Button fullWidth variant='text' onClick={() => setOpenDescModal(true)} >
                                    Edit Description
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
                        <div style = {{display: 'flex', justifyContent: 'space-between'}}>
                            <Typography style={{ fontWeight: 'bold', fontSize: '24px', marginLeft: '16px', marginTop: '10px' }}>{sameUser ? 'Your Content' : 'Published Content'}</Typography> 
                            <Button onClick = {() => setOpenCreateModal(true)} variant = 'contained' size = 'small' style = {{width: '13%', margin: '10px', height: '90%', backgroundColor: '#9932CC'}}>Create Comic</Button>
                        </div>
                        <Dialog open={openCreateModal} onClose={handleCreateClose}>
                            <DialogTitle>Create Comic</DialogTitle>
                                <DialogContent>
                                    <DialogContentText>
                                        Enter a title, description, and tags for the new comic
                                    </DialogContentText>
                                    <TextField
                                        autoFocus
                                        margin="dense"
                                        id="title"
                                        inputRef={comicTitle}
                                        label="Title"
                                        fullWidth
                                        variant="standard"
                                    />
                                    <TextField
                                        margin="dense"
                                        label="Desciption"
                                        fullWidth
                                        inputRef={comicDesc}
                                        variant="standard"
                                    />
                                    <FormControl sx={{marginTop: '15px', width: 300 }}>
                                        <InputLabel id="tags-label">Tags</InputLabel>
                                        <Select
                                            labelId="Tags"  
                                            input={<OutlinedInput label="Tag" />}
                                            value={tag}
                                            inputRef={comicTags}
                                            label="Age"
                                            multiple
                                            onChange={handleCreateChange}
                                        >
                                            {tags.map((tag) => (
                                                <MenuItem key={tag} value={tag} >
                                                    {tag}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </DialogContent>
                            <DialogActions>
                                <Button onClick={handleCreateClose}>Cancel</Button>
                                <Button onClick={handleCreate}>Create</Button>
                            </DialogActions>
                        </Dialog>
                        {contentList}
                        <Box style={{ padding: '16px' }}/>
                    </Box>
                </Box>
                <Box style={{ width: '2%'}}/>
            </Box>
            <Box style={{ padding: '16px' }}/>
        </Box>
    );
}

