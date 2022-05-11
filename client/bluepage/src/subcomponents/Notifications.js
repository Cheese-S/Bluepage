import {useState} from "react"
import { useNavigate } from 'react-router-dom';
import {MenuItem, Button} from '@mui/material/';

export default function Notifications(props) {
    const history = useNavigate();
    const {notification, type} = props;
    const [Delete, setDelete] = useState (false);
    const handleDelete = () => {
        setDelete(true);
    }

    console.log(notification);

    const handleClose = () => {
        setDelete(true);
    }
    const handleNotification = () => {
        var his = '/list/' + notification.link + '/' + type;
        history(his);
    }
    return (
        <div>
            <MenuItem component = "a" onClick = {handleNotification} divider = {true} style = {{width: "100%", whiteSpace: "normal"}}> {notification.text}</MenuItem>
        </div>
    );
}
