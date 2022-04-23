import React, { useEffect, useState } from "react"
import { Box, Link, Typography } from '@mui/material/';
import {SUBCONTENT_TYPE} from "../constant";
import { getSubcontentByID } from '../api/api';
import { useNavigate } from 'react-router-dom';


export default function SubcontentListing(props){
    const history = useNavigate();
    const { id, type } = props;

    const [title, settitle] = useState('');
    const [views, setviews] = useState(0);
    const [subid, setsubid] = useState('');
    const [published, setpublished] = useState(true);

    useEffect(() => {
        const getcontent = async () => {
            try{
                const res = await getSubcontentByID(id, type);
                settitle(res.data.subcontent.title);
                setviews(res.data.subcontent.views);
                setsubid(res.data.subcontent._id);
                setpublished(res.data.subcontent.published);
            } 
            catch(err){
                console.log(err);
            }
        }
        getcontent();
    },[]);

    const handlecontent = () => {
        var his = published ? `/${props.type}/${subid}/` : `/${props.type}/edit/${subid}/`;
        history(his);
    }
    return (
        <>
            <Box style={{ backgroundColor: '#eeeeee', alignItems: 'center', display: 'flex', flexDirection: 'row', padding: '10px', justifyContent: 'space-between' }} sx={{ border: 1.5 }}>
                    <Link onClick={handlecontent} underline='hover' style={{ fontWeight: 'bold', fontSize: '18px' }}>{title}</Link>
                    <Typography style={{ fontWeight: 'bold' }}>{views} views</Typography>
            </Box>
            <Box style={{ paddingBottom: '8px' }}/>
        </>
    );
}
