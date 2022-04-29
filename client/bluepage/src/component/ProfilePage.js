import React, { useEffect, useRef, useState } from 'react';
import { Box, Typography, Button, Dialog, DialogTitle, DialogContent, DialogContentText, FormControl, OutlinedInput, InputLabel, TextField, DialogActions, MenuItem, TextFieldProps, Select } from '@mui/material/';
import { ButtonAppBar } from './NavBar';
import { ProfileContentCard } from '../subcomponents/ProfileContentCard';
import { getUserByID,changeUserDescription, createNewContent, getUser } from '../api/api';
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

    const [user, setuser] = useState(null);
    const [open, setOpen] = useState(false);
    const [comicOpen, setComicOpen] = useState(false);
    const [tag, setTags] = useState([]);

    useEffect(() => {
        const getuser = async () =>{
            
            const res = sameUser ? await getUser() : await getUserByID(id);
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
    const handleClose = () => {
        setTags([]);
        setComicOpen(false);
    }
    const handleCreateComic = () => {
        setComicOpen(true);
    }
    const handleChange = (event) => {
        const {target: { value }} = event;
        console.log(value);
        setTags(
          typeof value === 'string' ? value.split(',') : value,
        );
      };
    
    // "contentType": "comic",
    // "title": "BAD",
    // "description": "DO NOT WATCH",
    // "tags": ["Action"]
    let counter="N/A";
    let name="N/A";
    let describe="N/A";
    let listpublished; 

    const handleSubmit = async () =>{
        const val = valueRef.current.value;
        const res = await changeUserDescription(val);
        describe = val;
        window.location.reload();
    }
    const handleCreate = async() => {
        const title = comicTitle.current.value;
        const desc = comicDesc.current.value;
        const tags = comicTags.current.value;
        try {   
            await createNewContent("comic", title, desc, tags);
        }
        catch(err) {
            console.log(err);
        }
        window.location.reload();
    }
    if(user != null){
        counter = user.followers.length;
        name = user.name;
        describe = user.description;
        listpublished=
        <Box style={{overflowX: "auto",display: 'flex', flexDirection: 'row', margin: '16px' }}>
            {
                user.ownComics.map((comic) => (
                    <ProfileContentCard
                        id={comic._id}  type={CONTENT_TYPE.COMIC} key={comic.id}
                    />
                ))
            }
            {
            user.ownStories.map((story) => (
                <ProfileContentCard
                    id={story._id}  type={CONTENT_TYPE.STORY} key={story.id}
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
                        <Button onClick = {handleCreateComic} variant = 'contained' size = 'small' style = {{width: '13%', margin: '10px', height: '90%', backgroundColor: '#9932CC'}}>Create Comic</Button>
                        </div>
                        <Dialog open={comicOpen} onClose={handleClose}>
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
                            onChange={handleChange}
                            >
                            {tags.map((tag) => (
                            <MenuItem
                            key={tag}
                            value={tag}
                            >
                            {tag}
                             </MenuItem>
                            ))}
                            </Select>
                            </FormControl>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={handleClose}>Cancel</Button>
                                <Button onClick={handleCreate}>Create</Button>
                                </DialogActions>
                        </Dialog>
                        {listpublished}
                        <Box style={{ padding: '16px' }}/>
                    </Box>
                </Box>
                <Box style={{ width: '2%'}}/>
            </Box>
            <Box style={{ padding: '16px' }}/>
        </Box>
    );
}

