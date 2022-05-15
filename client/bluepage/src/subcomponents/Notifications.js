import {useState} from "react"
import { useNavigate } from 'react-router-dom';
import {MenuItem, IconButton, Box} from '@mui/material/';
import ClearIcon from '@mui/icons-material/Clear';
import {removeNotification} from '../api/api';

export default function Notifications(props) {
    const history = useNavigate();
    const {notification, type} = props;

    const handleNotification = () => {
        var his = '/list/' + notification.link + '/' + type;
        history(his);
    }
    const removeNotif = async() => {
        try {
            await removeNotification(type, notification._id);
        }
        catch (err) {
            console.log(err);
        }
    }
    return (
        <div>
            <MenuItem disableRipple disableGutters component= "a" divider = {true} style = {{width: "100%", whiteSpace: 'normal'}} sx = {{justifyContent: 'space-between'}}><Box sx={{ display: 'flex', flexGrow: 1, marginLeft: "2%" }} onClick = {handleNotification}>{notification.text}</Box> <IconButton color = 'error' onClick = {removeNotif}><ClearIcon/></IconButton></MenuItem>
        </div>
    );
}
