import React, { useEffect, useState } from "react"
import { Card, CardContent, CardMedia, Typography, Box, Chip, Link ,CardActionArea} from '@mui/material/';
import { useNavigate } from 'react-router-dom'; 
import { CONTENT_TYPE} from "../constant";
import { getContentById } from '../api/api';

const cardData = {
    title: "To Kill a Mockingbird",
    views: 100,
    followers: 10000,
    author: "Harper Lee",
    tags: ['Romance', 'Sci-Fi']
}


const getFormattedNum = (num) => {
    if (num > 1000000000)
        return `${(num / 1000000000).toFixed(2)}B`
    if (num > 1000000)
        return `${(num / 1000000).toFixed(2)}M`
    if (num > 1000)
        return `${(num / 1000).toFixed(2)}K`

    return num.toString();
}


export const ProfileContentCard = (props) => {
    const [title, settitle] = useState(null);
    const [views, setviews] = useState(0);
    const [followers, setfollowers] = useState(0);
    const [author, setauthor] = useState(null);
    const [authorid, setauthorid] = useState(null);
    const [tag, settag] = useState(['Romance', 'Sci-Fi']);
    const [description, setdescription] = useState(null);
    const [thumb, setthumb] = useState(null);

    const history = useNavigate();
    const handlecontent = () =>{
        var his = `/list/${props.id}`
        history(his);
    }

    useEffect(() => {
        const getcontent = async () =>{
            try{
                const res = await getContentById(props.type,props.id);
                settitle(res.data.content.title);
                setviews(res.data.content.views);
                setfollowers(res.data.content.followers);
                setauthor(res.data.content.author.name);
                setauthorid(res.data.content.author.id);
                settag(res.data.content.tags);
                setdescription(res.data.content.description);
                //setthumb(res.data.content.??????);
            }
            catch(err){
                console.log(err);
            }
        }
        getcontent();
    },[]);

    return (
        <Card sx={{ display: "flex", width: 300, marginRight: '16px' }}>
         <CardActionArea onClick={handlecontent}>
            <Box style={{ display: 'flex', flexDirection: 'column'}}>
                <CardMedia
                    component="img"
                    sx={{ width: 300 }}
                    image={thumb}
                    alt="Loading...."
                />
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                    <CardContent sx={{ flex: "1 0 auto" }}>
                        <Typography sx={{ fontWeight: "bold" }} component="div" variant="h5">
                           {title}
                        </Typography>
                        <Typography sx={{ marginY: '1em' }} variant="body1" color="text" component="div">
                            {description}
                        </Typography>

                        <Typography variant="body1" color="text.secondary" component="div">
                        {getFormattedNum(views)} views · {getFormattedNum(followers)} Followers
                        </Typography>

                        <Typography variant="body1" color="text.secondary" component="div" >
                            By {author}
                        </Typography>
                        {tag.map((tag) =>
                            <Chip
                                key={tag}
                                label={tag}
                                color="primary"
                                size="small"
                            />)}
                        <Typography sx={{ marginTop: '1em' }} variant="body2" color="text.secondary" component="div">
                            ---
                        </Typography>
                    </CardContent>
                </Box>
            </Box>
            </CardActionArea>
        </Card>
    )
}