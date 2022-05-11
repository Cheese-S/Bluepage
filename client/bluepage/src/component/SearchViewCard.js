import React, { useEffect, useState }from "react"
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { Box, CardActionArea } from '@mui/material';
import Chip from '@mui/material/Chip';
import { getContentById } from '../api/api';

const cardData = {
    title: "To Kill a Mockingbird",
    views: 100,
    followers: 10000,
    author: "Harper Lee",
    tags: ['Romance', 'Sci-Fi']
}


const getFormattedNum = (num)=> {
    if (num > 1000000000)
        return `${(num / 1000000000).toFixed(2)}B`
    if (num > 1000000)
        return `${(num / 1000000).toFixed(2)}M`
    if (num > 1000)
        return `${(num / 1000).toFixed(2)}K`

    return num.toString();
}

export const SearchViewCard= (props) => {
    const [title, settitle] = useState(null);
    const [views, setviews] = useState(0);
    const [followers, setfollowers] = useState(0);
    const [author, setauthor] = useState(null);
    const [description, setdescription] = useState(null);
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
                setdescription(res.data.content.description);
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

    return (
        <Card sx={{ display: "flex" }}>
            <CardMedia
                component="img"
                sx={{ width: 300 }}
                image={thumb}
                alt="Live from space album cover"
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
                        {views} views · 200k {followers}
                    </Typography>

                    <Typography variant="body1" color="text.secondary" component="div" >
                        {author}
                    </Typography>
                    {tag.map((tag) =>
                            <Chip
                                key={tag}
                                label={tag}
                                color="primary"
                                size="small"
                                sx = {{marginRight: "1.5px", marginBottom: "1px"}}
                            />)}
                    <Typography sx={{ marginTop: '1em' }} variant="body2" color="text.secondary" component="div">
                        {time}
                    </Typography>
                </CardContent>
            </Box>
        </Card>
    )
}