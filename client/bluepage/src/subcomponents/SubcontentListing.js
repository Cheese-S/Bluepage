import React, { useEffect, useRef, useImperativeHandle, useState } from "react"
import { Box, Link, Button, Typography, IconButton, Dialog, DialogTitle, DialogContent, DialogContentText, TextField } from '@mui/material/';
import DeleteIcon from '@mui/icons-material/Delete';
import { SUBCONTENT_TYPE } from "../constant";
import { getSubcontentByID, deleteSubcontent } from '../api/api';
import { useNavigate } from 'react-router-dom';
import { userStore } from '../store/UserStore';

export default function SubcontentListing(props) {
    const history = useNavigate();
    const { id, type } = props;
    const [userID, setUserID] = useState('');
    const [title, settitle] = useState('');
    const [views, setviews] = useState(0);
    const [subid, setsubid] = useState('');
    const [deleteModal, setDelete] = useState(false);
    const [published, setpublished] = useState(true);
    const user = userStore(state => state.id);
    const sameUser = (user === userID);
    useEffect(() => {
        const getcontent = async () => {
            try {
                const res = await getSubcontentByID(id, type);

                setUserID(res.data.subcontent.author.id);
                settitle(res.data.subcontent.title);
                const isPublished = res.data.subcontent.published;
                setpublished(isPublished);

                const realTitle = res.data.subcontent.title;
                settitle(!isPublished ? `${realTitle} (Unpublished)` : realTitle);
                setviews(res.data.subcontent.views);
                setsubid(res.data.subcontent._id);
            }
            catch (err) {
                console.log(err);
            }
        }
        getcontent();
    }, []);

    const handlecontent = () => {
        var his = published ? `/${props.type}/${subid}/${props.type}` : `/${props.type}/edit/${subid}/`;
        history(his);
    }
    const handleDelete = () => {
        setDelete(true);
    }

    const handleClose = () => {
        setDelete(false);
    }
    const handleRemove = async () => {
        handleClose();
        try {
            await deleteSubcontent(props.type, subid);
            window.location.reload();
        }
        catch (err) {
            console.log(err);
        }

        handleClose();

    }
    return (
        <>
            <Box style={{ backgroundColor: '#eeeeee', alignItems: 'center', display: 'flex', flexDirection: 'row', padding: '10px', justifyContent: 'space-between' }} sx={{ border: 1.5 }}>
                <Link onClick={handlecontent} underline='hover' style={{ fontWeight: 'bold', fontSize: '18px' }}>{title}</Link>
                {sameUser && <IconButton onClick={handleDelete} aria-label="delete" color="primary" style={{ marginLeft: '1020px' }}>
                    <DeleteIcon />
                </IconButton>}

                <Dialog open={deleteModal} onClose={handleClose} >
                    <DialogTitle>Edit description</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Delete the page?
                        </DialogContentText>
                    </DialogContent>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleRemove} >Delete</Button>
                </Dialog>
                <Typography style={{ fontWeight: 'bold' }}>{views} views</Typography>
            </Box>
            <Box style={{ paddingBottom: '8px' }} />
        </>
    );
}
