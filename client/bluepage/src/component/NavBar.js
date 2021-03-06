import React, { useEffect, useRef, useState } from 'react';
import { AppBar, Box, Badge, Toolbar, Typography, Button, IconButton, Menu, MenuItem, Divider, Switch, TextField, Link } from '@mui/material/';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SortIcon from '@mui/icons-material/Sort';
import { userStore } from '../store/UserStore';
import { logout, getUser, removeNotification } from '../api/api';
import { useNavigate } from 'react-router-dom';
import { CONTENT_TYPE } from '../constant';
import Notifications from '../subcomponents/Notifications';

export const ButtonAppBar= () => {
    const history = useNavigate();

    const search = useRef(null);

    const [searchmode, setsearchmode] = useState(0);
    const [sort, setsort] = useState(0);

    const [useranchorEl, setuserAnchorEl] =  useState(null);
    const [sortanchorEl, setsortAnchorEl] =  useState(null);
    const [notificationanchorEl, setnotificationAnchorEl] = useState(null);
    const [comicNotification, setComicNotification] = useState([]);
    const [storyNotification, setStoryNotification] = useState([]);

    const id = userStore((state) => state.id);
    const isLoggedIn = userStore((state) => state.isLoggedIn);
    const siteMode = userStore(state => state.siteMode);
    const setSiteMode = userStore(state => state.setSiteMode);
    const resetUserStore = userStore((state) => state.resetStore);

    useEffect(() => {
        const getUse = async () =>{
            try {
                // Load in content
                const res = await getUser();
                setComicNotification(res.data.user.comicNotifications);
                setStoryNotification(res.data.user.storyNotifications);
            }  catch(err){
                console.log(err);
            }
        }
        getUse();
    }, []);

    const handleLogout = async () => {
        handleuserClose();
        resetUserStore();
        await logout();
        window.location.reload();
    };

    const handleChangeMode = (mode) => {
        if (siteMode !== mode) {
            setSiteMode(mode);
            window.location.reload();
        }
    };

    const handleuserMenu = (event) => {
        setuserAnchorEl(event.currentTarget);
    };

    const handleuserClose = () => {
        setuserAnchorEl(null);
    };

    const handlesortMenu = (event) => {
        setsortAnchorEl(event.currentTarget);
    };
    
    const handlesortClose = () => {
        setsortAnchorEl(null);
    };

    const Switchmode = () =>{
        if(searchmode==1){
            setsearchmode(2);
        }
        else{
            setsearchmode(1);
        }
    }

    const handlesortCloseNew = () => {
        setsort(0);
        setsortAnchorEl(null);
    };

    const handlesortCloseView = () => {
        setsort(1);
        setsortAnchorEl(null);
    };

    const handlesortCloseLike = () => {
        setsort(2);
        setsortAnchorEl(null);
    };

    const handlesortCloseOld = () => {
        setsort(3);
        setsortAnchorEl(null);
    };
    const handleNotificationMenu = (event) => {
        setnotificationAnchorEl(event.currentTarget);
    };

    const handleNotificationClose = () => {
        setnotificationAnchorEl(null);
    };

    const handlemyprofile = () =>{
        var his = `/profile/${id}`;
        history(his);
        window.location.reload();
    };

    const handleMyFollowing = () => {
        history('/following');
    };

    const Search = async () => {
        let re="-";
        if(search.current.value!=""){
            re=search.current.value;
        }
        var his = `/search/${sort}/${searchmode}/${re}/0`
        history(his);
        window.location.reload();
    };

    const handleKeyPress = async (event) => {
        if (event.keyCode === 13) {
            await Search();
        }
    };

    const deleteNotification = async (type, id) => {
        // Remove from local notifications
        let tempNotifications = [];
        if (type === CONTENT_TYPE.COMIC) {
            tempNotifications = [...comicNotification];
        } else {
            tempNotifications = [...storyNotification];
        }
        
        // Get index of notification to delete
        let indexOf = -1;
        for (let i = 0; i < tempNotifications.length; i++) {
            if (tempNotifications[i]._id === id) {
                indexOf = i;
                break;
            }
        }

        // if index somehow not found, do nothing
        if (indexOf === -1) return;

        // Remove notification from array
        tempNotifications.splice(indexOf, 1);

        // Set back into NavBar state
        if (type === CONTENT_TYPE.COMIC) {
            setComicNotification(tempNotifications);
        } else {
            setStoryNotification(tempNotifications);
        }

        // Lastly, remove from database
        try {
            await removeNotification(type, id);
        } catch (err) {
            console.log(err);
        }
    };

    
    let sublist;
    let notification = 0;
    if (comicNotification.length > 0 && siteMode == CONTENT_TYPE.COMIC) {
        sublist = comicNotification.map((comicNotification, i) => <Notifications key={i} deleteSelf={deleteNotification} notification = {comicNotification} type = {CONTENT_TYPE.COMIC}/>);
        notification = comicNotification.length;
    } 
    else if (storyNotification.length > 0 && siteMode == CONTENT_TYPE.STORY) {
        sublist = storyNotification.map((storyNotification, i) => <Notifications key={i} deleteSelf={deleteNotification} notification = {storyNotification} type = {CONTENT_TYPE.STORY}/>);
        notification = storyNotification.length;
    } else {
        sublist = <MenuItem component="a" style = {{width: "100%", whiteSpace: "normal"}}>No notifications here. You're all caught up!</MenuItem>
    }

    return (
        <div>
            <Box sx={{ flexGrow: 1 }}>
                <AppBar position="static">
                    <Toolbar>
                        <Box component="div" sx={{ flexGrow: 1 }}>
                            <Link href="/home" underline="none" variant="h6" color="#000000" sx={{pl:"2%",pr:"2%"}}>
                                BLUE PAGE
                            </Link>
                            <Link underline="none" variant="body2" color="#5227cc" style={{ fontSize: 18, cursor: siteMode !== CONTENT_TYPE.COMIC ? 'pointer' : 'default', fontWeight: (siteMode === CONTENT_TYPE.COMIC) ? 'bold' : 'normal' }} onClick={() => handleChangeMode(CONTENT_TYPE.COMIC)}>
                                COMIC
                            </Link>
                            <Link underline="none"  variant="body2" color="#d52941" sx={{pl:"2%"}} style={{ fontSize: 18, cursor: siteMode !== CONTENT_TYPE.STORY ? 'pointer' : 'default', fontWeight: (siteMode === CONTENT_TYPE.STORY) ? 'bold' : 'normal' }} onClick={() => handleChangeMode(CONTENT_TYPE.STORY)}>
                                STORY
                            </Link>
                        </Box>

                    <Badge badgeContent = {notification} color = 'error'>
                        <IconButton size="small"  color="inherit" onClick = {handleNotificationMenu}>
                            <NotificationsIcon/>
                        </IconButton>
                    </Badge>
                    <Menu 
                            id = "notification-appbar"
                            anchorEl={notificationanchorEl}
                            anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                            }}
                            open={Boolean(notificationanchorEl)}
                            onClose={handleNotificationClose}
                            style={{ width: "100%", height: "30%"}}
                        >
                            {sublist}
                    </Menu>

                    <IconButton size="large"  color="inherit" onClick={handleuserMenu}>
                        <AccountCircleIcon/>
                    </IconButton>
                    {isLoggedIn ?
                            <Menu
                                id="menu-appbar"
                                anchorEl={useranchorEl}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                open={Boolean(useranchorEl)}
                                onClose={handleuserClose}
                            >
                                <MenuItem onClick={handlemyprofile}>My Profile</MenuItem>
                                <MenuItem onClick={handleMyFollowing}>{siteMode === CONTENT_TYPE.COMIC ? 'Comics' : 'Stories'} I'm Following</MenuItem>
                                <MenuItem onClick={handleuserClose}><Link target="_blank" underline = "none" style = {{color: "#000000"}} href="https://docs.google.com/forms/d/e/1FAIpQLSfaVOX_I84bfUAoMuxvQLdzR4FOVNErYoVYUnf5HKfuNcM-EQ/viewform?usp=sf_link">Report Comics/Stories</Link></MenuItem>
                                <MenuItem onClick={handleLogout}>Log out</MenuItem>
                            </Menu>
                    :
                            <Menu
                                id="menu-appbar"
                                anchorEl={useranchorEl}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                open={Boolean(useranchorEl)}
                                onClose={handleuserClose}
                            >
                                <MenuItem><Link href="/login" underline="none" sx = {{flexGrow: 1}}>Login</Link></MenuItem>
                                <MenuItem><Link href="/signup" underline="none" sx = {{flexGrow: 1}}>Sign up</Link></MenuItem>
                                <MenuItem onClick={handleuserClose}><Link target="_blank" underline = "none" href="https://docs.google.com/forms/d/e/1FAIpQLSfaVOX_I84bfUAoMuxvQLdzR4FOVNErYoVYUnf5HKfuNcM-EQ/viewform?usp=sf_link">Report Comics/Stories</Link></MenuItem>

                            </Menu>
                    }
                    </Toolbar>
                </AppBar>
            </Box>
            <Box sx={{ flexGrow: 1 }}>
                <AppBar position="static" style={{ background: '#5227cc' }}>
                    <Toolbar>
                        <Typography>Tag:</Typography>
                        <Link href="/search/0/2/-/0" underline="none"  variant="body2" color="#ffffff" sx={{pl:"2%"}}>
                            Sci-fi
                        </Link>
                        <Link href="/search/0/3/-/0" underline="none"  variant="body2" color="#ffffff" sx={{pl:"2%"}}>
                            Fantasy
                        </Link>
                        <Link href="/search/0/4/-/0" underline="none"  variant="body2" color="#ffffff" sx={{pl:"2%"}}>
                            Comedy
                        </Link>
                        <Link href="/search/0/5/-/0" underline="none"  variant="body2" color="#ffffff" sx={{pl:"2%"}}>
                            Action
                        </Link>
                        <Link href="/search/0/6/-/0" underline="none"  variant="body2" color="#ffffff" sx={{pl:"2%"}}>
                            Adventure
                        </Link>
                        <Link href="/search/0/7/-/0" underline="none"  variant="body2" color="#ffffff" sx={{pl:"2%"}}>
                            Romance
                        </Link>
                        <Link href="/search/0/8/-/0" underline="none"  variant="body2" color="#ffffff" sx={{pl:"2%"}}>
                            Mystery
                        </Link>
                        <Divider orientation="vertical" sx={{ flexGrow: 1 }} flexItem>  
                        </Divider>
                        <Typography sx={{pr:"2%", paddingLeft: '5px', paddingRight: '0%'}}>Search {siteMode}</Typography>
                        <Switch onClick={Switchmode} />
                        <Typography sx={{pr:"2%"}}>Search User</Typography>
                        <TextField
                            margin="normal"
                            required
                            id="Search"
                            label="Search"
                            name="Search"
                            autoComplete="Search"
                            inputRef={search}
                            onKeyDown={handleKeyPress}
                            autoFocus
                            InputLabelProps={{style : {color : 'white'} }}
                            sx={{ color:'white',input: { color: 'white' }}}
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            sx={{ mt: 3, mb: 2,backgroundColor:'#5227cc',ml:"2%" }}
                            onClick={Search}
                        >
                            Search
                        </Button>
                        <IconButton size="large"  color="inherit" onClick={handlesortMenu}>
                            <SortIcon/>
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={sortanchorEl}
                            anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                            }}
                            open={Boolean(sortanchorEl)}
                            onClose={handlesortClose}
                        >
                            <MenuItem onClick={handlesortCloseNew}>New</MenuItem>
                            <MenuItem onClick={handlesortCloseView}>View</MenuItem>
                            <MenuItem onClick={handlesortCloseLike}>Like</MenuItem>
                            <MenuItem onClick={handlesortCloseOld}>Old</MenuItem>
                        </Menu>
                    </Toolbar>
                </AppBar>
            </Box>
        </div>
  );
}


