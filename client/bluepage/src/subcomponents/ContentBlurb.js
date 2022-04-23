import React, { useEffect ,useState} from 'react';
import { Typography, Button, Link, Box , Chip} from '@mui/material/';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';
import { useParams } from 'react-router-dom';
import { getContentById } from '../api/api';
import { CONTENT_TYPE} from "../constant";

export default function ContentBlurb() {
    const { id,type } = useParams();
    const [title, settitle] = useState(null);
    const [views, setviews] = useState(0);
    const [followers, setfollowers] = useState(0);
    const [author, setauthor] = useState(null);
    const [authoridlink, setauthorid] = useState(null);
    const [tag, settag] = useState(['Romance', 'Sci-Fi']);
    const [like, setlike] = useState(0);
    const [dislike, setdislike] = useState(0);
    const [description, setdescription] = useState(null);
    useEffect(() => {
        const getcontent = async () =>{
            try{
                const res = await getContentById(type,id);
                settitle(res.data.content.title);
                setviews(res.data.content.views);
                setfollowers(res.data.content.followers);
                setauthor(res.data.content.author.name);
                setauthorid(res.data.content.author.id);
                settag(res.data.content.tags);
                setdescription(res.data.content.description);
                setlike(res.data.content.like);
                setdislike(res.data.content.dislike);
            } 
            catch(err){
                console.log(err);
            }
        }
        getcontent();
    },[]);
    return (
        <Box style={{ backgroundColor: 'white', padding: '10px' }}>
            <Typography style={{ fontWeight: 'bold' }}>{title}</Typography>
            <Link href={{authoridlink}} underline="hover">by {author}</Link>
            <Typography style={{ paddingTop: '20px' }}>{description}</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems:'center', paddingTop: '10px' }}>
                <Typography style={{ fontWeight: 'bold', paddingRight: '5px' }}>Tags:</Typography>
                {tag.map((tag) =>
                            <Chip
                                key={tag}
                                label={tag}
                                color="primary"
                                size="small"
                            />)}
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems:'center'}}>
                <Typography style={{ fontWeight: 'bold', width: '20%' }}>{views} views</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'row', width: '50%' }}>
                    <Typography style={{ fontWeight: 'bold', paddingRight:'10px' }}>{followers} following</Typography>
                    <Button variant='contained'>Follow</Button>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'row-reverse', alignItems: 'center', width: '30%', marginRight: '20px' }}>
                    <Typography style={{ fontWeight: 'bold' }}>{like}</Typography>
                    <ThumbDownOffAltIcon sx={{ fontSize: '40px' }}></ThumbDownOffAltIcon>
                    <Typography style={{ fontWeight: 'bold', marginRight: '20px' }}>{dislike}</Typography>
                    <ThumbUpOffAltIcon sx={{ fontSize: '40px' }}></ThumbUpOffAltIcon>
                </Box>
            </Box>
        </Box>
    );
}
