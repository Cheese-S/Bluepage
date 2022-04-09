import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Divider from '@mui/material/Divider';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link'
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SortIcon from '@mui/icons-material/Sort';
import { Menu, MenuItem } from '@mui/material';

export const ButtonAppBar: React.FC = () => {
    const [useranchorEl, setuserAnchorEl] =  React.useState<null | HTMLElement>(null);
    const [sortanchorEl, setsortAnchorEl] =  React.useState<null | HTMLElement>(null);
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
                    <IconButton size="large"  color="inherit">
                        <NotificationsIcon/>
                    </IconButton>
                    <IconButton size="large"  color="inherit" onClick={handleuserMenu}>
                        <AccountCircleIcon/>
                    </IconButton>
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
                            <MenuItem onClick={handleuserClose}>My Profile</MenuItem>
                            <MenuItem onClick={handleuserClose}>My following</MenuItem>
                            <MenuItem onClick={handleuserClose}>Contact Admin</MenuItem>
                            <MenuItem onClick={handleuserClose}>Log out</MenuItem>
                        </Menu>
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
