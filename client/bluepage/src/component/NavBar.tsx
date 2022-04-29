import * as React from 'react';
import { AppBar, Box, Badge, Toolbar, Typography, Button, IconButton, Menu, MenuItem, Divider, Switch, TextField, Link } from '@mui/material/';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SortIcon from '@mui/icons-material/Sort';
import { userStore } from '../store/UserStore';
import { logout } from '../api/api';
import { useNavigate } from 'react-router-dom'; 

export const ButtonAppBar: React.FC = () => {
    const history = useNavigate();

    const [useranchorEl, setuserAnchorEl] =  React.useState<null | HTMLElement>(null);
    const [sortanchorEl, setsortAnchorEl] =  React.useState<null | HTMLElement>(null);
    const [notificationanchorEl, setnotificationAnchorEl] = React.useState<null | HTMLElement>(null);

    const id = userStore((state: { id: any; }) => state.id);
    const isLoggedIn = userStore((state: { isLoggedIn: any; }) => state.isLoggedIn);
    const resetUserStore = userStore((state: { resetStore: any; }) => state.resetStore);

    const handleLogout = async () => {
        handleuserClose();
        resetUserStore();
        await logout();
        window.location.reload();
    };

    const handleuserMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
        setuserAnchorEl(event.currentTarget);
    };

    const handleuserClose = () => {
        setuserAnchorEl(null);
    };

    const handlesortMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
        setsortAnchorEl(event.currentTarget);
    };
    
    const handlesortClose = () => {
        setsortAnchorEl(null);
    };

    const handleNotificationMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
        setnotificationAnchorEl(event.currentTarget);
    }

    const handleNotificationClose = () => {
        setnotificationAnchorEl(null);
    }

    const handlemyprofile = () =>{
        var his = `/profile/${id}`
        history(his);
    }

    return (
        <div>
            <Box sx={{ flexGrow: 1 }}>
                <AppBar position="static">
                    <Toolbar>
                        <Box component="div" sx={{ flexGrow: 1 }}>
                            <Link href="/" underline="none" variant="h6" color="#000000" sx={{pl:"2%",pr:"2%"}}>
                                BLUE PAGE
                            </Link>
                            <Link href="/" underline="none" variant="body2" color="#5227cc">
                                COMIC
                            </Link>
                            <Link href="/" underline="none"  variant="body2" color="#d52941" sx={{pl:"2%"}}>
                                STORY
                            </Link>
                        </Box>

                    <Badge badgeContent = {3} color = 'error'>
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
                            style={{ width: 370, maxHeight: 200}}
                        >
                            <MenuItem onClick={handleNotificationClose} style = {{width: 350, whiteSpace: "normal"}}>"author name" uploads "title of page/chapter" or page/chapter X (if no name is provided) of (title of comic/story)</MenuItem>
                            <Divider light/>
                            <MenuItem onClick={handleNotificationClose} style = {{width: 350, whiteSpace: "normal"}}>George uploaded Page 10 of Test Data</MenuItem>
                            <Divider light/>
                            <MenuItem onClick={handleNotificationClose} style = {{width: 350, whiteSpace: "normal"}}>The scrolling works!!!</MenuItem>
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
                                <MenuItem onClick={handleuserClose}>My following</MenuItem>
                                <MenuItem onClick={handleuserClose}>Contact Admin</MenuItem>
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
                                <MenuItem><Link href="/login" underline="none">Login</Link></MenuItem>
                                <MenuItem><Link href="/signup" underline="none">Sign up</Link></MenuItem>
                            </Menu>
                    }
                    </Toolbar>
                </AppBar>
            </Box>
            <Box sx={{ flexGrow: 1 }}>
                <AppBar position="static" style={{ background: '#5227cc' }}>
                    <Toolbar>
                        <Typography>Tag:</Typography>
                        <Link href="/" underline="none"  variant="body2" color="#ffffff" sx={{pl:"2%"}}>
                            Sci-fi
                        </Link>
                        <Link href="/" underline="none"  variant="body2" color="#ffffff" sx={{pl:"2%"}}>
                            Fantasy
                        </Link>
                        <Link href="/" underline="none"  variant="body2" color="#ffffff" sx={{pl:"2%"}}>
                            Comedy
                        </Link>
                        <Link href="/" underline="none"  variant="body2" color="#ffffff" sx={{pl:"2%"}}>
                            Action
                        </Link>
                        <Link href="/" underline="none"  variant="body2" color="#ffffff" sx={{pl:"2%"}}>
                            Adventure
                        </Link>
                        <Link href="/" underline="none"  variant="body2" color="#ffffff" sx={{pl:"2%"}}>
                            Romance
                        </Link>
                        <Link href="/" underline="none"  variant="body2" color="#ffffff" sx={{pl:"2%"}}>
                            Mystery
                        </Link>
                        <Divider orientation="vertical" sx={{ flexGrow: 1 }} flexItem>  
                        </Divider>
                        <Switch defaultChecked />
                        <Typography sx={{pr:"2%"}}>Search User</Typography>
                        <TextField
                            margin="normal"
                            required
                            id="Search"
                            label="Search"
                            name="Search"
                            autoComplete="Search"
                            autoFocus
                            InputLabelProps={{style : {color : 'white'} }}
                            sx={{ color:'white',input: { color: 'white' }}}
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            sx={{ mt: 3, mb: 2,backgroundColor:'#5227cc',ml:"2%" }}
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
                            <MenuItem onClick={handlesortClose}>New</MenuItem>
                            <MenuItem onClick={handlesortClose}>View</MenuItem>
                            <MenuItem onClick={handlesortClose}>Like</MenuItem>
                            <MenuItem onClick={handlesortClose}>Old</MenuItem>
                        </Menu>
                    </Toolbar>
                </AppBar>
            </Box>
        </div>
  );
}


