import { useNavigate } from 'react-router-dom';
import {MenuItem, IconButton, Box} from '@mui/material/';
import ClearIcon from '@mui/icons-material/Clear';

export default function Notifications(props) {
    const history = useNavigate();
    const {notification, type, deleteSelf} = props;

    const handleNotification = () => {
        var his = '/list/' + notification.link + '/' + type;
        history(his);
    }
    const removeNotif = async() => {
        // Error handling is done in parent component
        await deleteSelf(type, notification._id);
    }

    return (
        <div>
            <MenuItem disableRipple disableGutters component= "a" divider = {true} style = {{width: "100%", whiteSpace: 'normal'}} sx = {{justifyContent: 'space-between'}}><Box sx={{ display: 'flex', flexGrow: 1, marginLeft: "2%" }} onClick = {handleNotification}>{notification.text}</Box> <IconButton color = 'error' onClick = {removeNotif}><ClearIcon/></IconButton></MenuItem>
        </div>
    );
}
