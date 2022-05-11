import React, { useEffect, useState }from "react"
import { useNavigate } from 'react-router-dom'; 
import { Card, CardContent, CardActionArea, CardMedia, Typography, Chip } from '@mui/material/';
import { getContentById } from '../api/api';

const getFormattedNum = (num)=> {
    if (num > 1000000000)
        return `${(num / 1000000000).toFixed(2)}B`
    if (num > 1000000)
        return `${(num / 1000000).toFixed(2)}M`
    if (num > 1000)
        return `${(num / 1000).toFixed(2)}K`

    return num.toString(); 
}   

export const ViewCard = (props) => {
    const navigate = useNavigate();

    const [title, settitle] = useState(null);
    const [views, setviews] = useState(0);
    const [followers, setfollowers] = useState(0);
    const [author, setauthor] = useState(null);
    const [thumb, setthumb] = useState("https://wallpaperaccess.com/full/629055.jpg");
    const [time, settime] = useState(null);
    const [tag, settag] = useState(['Romance', 'Sci-Fi']);

    useEffect(() => {
        const getcontent = async () =>{
            try{
                const res = await getContentById(props.type,props.id);
                settitle(res.data.content.title);
                setviews(res.data.content.views);
                setfollowers(res.data.content.followers);
                setauthor(res.data.content.author.name);
                settime(res.data.content.updatedAt);
                settag(res.data.content.tags);
                if(res.data.content.thumbnail){
                        setthumb('data:image/jpeg;base64,' + btoa(
                            res.data.content.thumbnail.data.reduce((data, byte) => data + String.fromCharCode(byte), '')
                         ));
                    }
                }
            catch(err){
                console.log(err);
            }
        }
        getcontent();
    },[]);

    const handleNavigate = () => {
        navigate(`/list/${props.id}/${props.type}`);
    };

    return (
        <Card sx={{ width: 1}}>
            <CardActionArea onClick={handleNavigate} >
                <CardMedia
                    component="img"
                    height="140"
                    image={thumb}
                    alt="green iguana"
                />
                <CardContent>
                    <Typography sx={{fontWeight: "bold"}} gutterBottom variant="h5">
                        {title}
                    </Typography>
                    <Typography variant="body1" color="text">
                        Views: {getFormattedNum(views)}
                    </Typography>
                    <Typography variant="body1" color="text">
                        Followers: {getFormattedNum(followers)}
                    </Typography>
                    <Typography variant="body1" color="text">
                        Author: {author}
                    </Typography>
                    {tag.map((tag) =>
                            <Chip
                                key={tag}
                                label={tag}
                                color="primary"
                                size="small"
                                sx = {{marginRight: "1.5px", marginBottom: "1px"}}
                            />)}
                    <Typography variant="body2" color="text.secondary" display="block">
                        {time}
                    </Typography>
                </CardContent>
            </CardActionArea>
        </Card>
    )
}