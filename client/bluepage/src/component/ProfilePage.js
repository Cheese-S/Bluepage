import React, { useEffect, useRef, useState } from 'react';
import { Box, Typography, Button, Dialog, DialogTitle, DialogContent, DialogContentText, FormControl, OutlinedInput, InputLabel, TextField, DialogActions, MenuItem, Select } from '@mui/material/';
import { ButtonAppBar } from './NavBar';
import { ProfileContentCard } from '../subcomponents/ProfileContentCard';
import { getUserByID, changeUserDescription, createNewContent, getUser, followUser,uploadThumbnaill } from '../api/api';
import { useParams } from 'react-router-dom';
import { userStore } from '../store/UserStore';
import { CONTENT_TYPE } from "../constant";

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
    const siteMode = userStore(state => state.siteMode);
    const formatSiteMode = siteMode === CONTENT_TYPE.COMIC ? ['Comic', 'Comics'] : ['Story', 'Stories'];
    const following = userStore(state => state.followingUsers);
    const setFollowing = userStore(state => state.setFollowingUsers);

    const valueRef = useRef(null);
    const contentTitle = useRef(null);
    const contentDesc = useRef(null);
    const contentTags = useRef(null);

    const [File, setFile] = useState(null);
    const [name, setName] = useState('N/A');
    const [followers, setFollowers] = useState(0);
    const [describe, setDescribe] = useState('');
    const [contentList, setContentList] = useState(null);
    const [openDescModal, setOpenDescModal] = useState(false);
    const [openCreateModal, setOpenCreateModal] = useState(false);
    const [tag, setTags] = useState([]);
    const [followingUser, setFollowingUser] = useState(false);

    useEffect(() => {
        const getuser = async () =>{
            
            const res = sameUser ? await getUser() : await getUserByID(id);

            setName(res.data.user.name);
            setFollowers(res.data.user.followers.length);
            setDescribe(res.data.user.description);
            if (selfID) {
                if (following.indexOf(id) > -1) {
                    setFollowingUser(true);
                }
                else {
                    setFollowingUser(false);
                }
            } 
            const listOfContent =
                <Box style={{ overflowX: "auto", display: 'flex', flexDirection: 'row', margin: '16px' }}>
                    {siteMode === CONTENT_TYPE.COMIC ? 
                        res.data.user.ownComics.map((comic) => (
                            <ProfileContentCard
                                id={comic._id} type={CONTENT_TYPE.COMIC} key={comic.id}
                            />
                        ))
                    :
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
        const title = contentTitle.current.value;
        const desc = contentDesc.current.value;
        const tags = contentTags.current.value;
        
        try {   
            const res = await createNewContent(siteMode, title, desc, tags);
            console.log(res);
            if(siteMode==CONTENT_TYPE.COMIC){
                let comicarray=res.data.user.ownComics;
                await uploadThumbnaill(siteMode,comicarray[comicarray.length-1]._id,File);
            }
            else{
                let storyarray=res.data.user.ownStories;
                await uploadThumbnaill(siteMode,storyarray[storyarray.length-1]._id,File);
            }

        } catch(err) {
            console.log(err);
        }
        window.location.reload();
    };

    const follow = async() => {
        const tempFollowing = [...following];
        try {
            setFollowingUser(true);
            tempFollowing.push(id);
            setFollowing(tempFollowing);
            await followUser(id, "follow");
            window.location.reload();
        }
        catch(err){
            console.log(err);
        }
    }
    const unfollow = async() => {
        const tempFollowing = [...following];
        try {
            setFollowingUser(false);
            const removeIndex = tempFollowing.indexOf(id);
            if (removeIndex > -1) {
                console.log(tempFollowing.indexOf(id));
                tempFollowing.splice(removeIndex, 1);
                console.log(tempFollowing.indexOf(id));
            }
            setFollowing(tempFollowing);
            await followUser(id, "unfollow");
            window.location.reload();
        }
        catch (err){
            console.log(err);
        }
    }
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
                                {!sameUser && selfID && !followingUser && <Button variant='contained' onClick = {follow} style={{ fontSize: '10px', marginRight: '10px' }}>Follow</Button>}
                                {!sameUser && selfID && followingUser && <Button variant='contained' onClick = {unfollow} style={{ fontSize: '10px', marginRight: '10px' }}>Unfollow</Button>}
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
                            <Typography style={{ fontWeight: 'bold', fontSize: '24px', marginLeft: '16px', marginTop: '10px' }}>{sameUser ? `Your ${formatSiteMode[1]}` : `Published ${formatSiteMode[1]}`}</Typography> 
                            {sameUser && 
                                <Button onClick = {() => setOpenCreateModal(true)} variant = 'contained' size = 'small' style = {{width: '13%', margin: '10px', height: '90%', backgroundColor: '#9932CC'}}>
                                    {`Create ${formatSiteMode[0]}`}
                                </Button>
                            }
                        </div>
                        <Dialog open={openCreateModal} onClose={handleCreateClose}>
                            <DialogTitle>{`Create a ${formatSiteMode[0]}`}</DialogTitle>
                                <DialogContent>
                                    <DialogContentText>
                                        {`Enter a title, description, and tags for the new ${siteMode}`}
                                    </DialogContentText>
                                    <TextField
                                        autoFocus
                                        margin="dense"
                                        id="title"
                                        inputRef={contentTitle}
                                        label="Title"
                                        fullWidth
                                        variant="standard"
                                    />
                                    <TextField
                                        margin="dense"
                                        label="Desciption"
                                        fullWidth
                                        inputRef={contentDesc}
                                        variant="standard"
                                    />
                                    <DialogContentText>
                                        <br/>
                                        Select a image as thumbnail
                                    </DialogContentText>
                                    <DialogContentText id="alert-dialog-slide-description">
                                        <input type="file" name="file" accept="image/png" onChange={(e) => setFile(e.target.files[0])} />
                                    </DialogContentText>
                                    <FormControl sx={{marginTop: '15px', width: 300 }}>
                                        <InputLabel id="tags-label">Tags</InputLabel>
                                        <Select
                                            labelId="Tags"  
                                            input={<OutlinedInput label="Tag" />}
                                            value={tag}
                                            inputRef={contentTags}
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

