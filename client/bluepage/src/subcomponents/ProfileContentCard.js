import React, { useEffect, useState } from "react"
import { Card, CardContent, CardMedia, Typography, Box, Chip, Link, CardActionArea, Modal, Button} from '@mui/material/';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom'; 
import { CONTENT_TYPE, SUBCONTENT_TYPE } from "../constant";
import { getContentById, deleteContent, deleteSubcontent } from '../api/api';
import { userStore } from "../store/UserStore";

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
    const [thumb, setthumb] = useState("https://wallpaperaccess.com/full/629055.jpg");
    const [time, settime] = useState(null);
    const [sameUser, setSameUser] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const selfID = userStore(state => state.id);

    const history = useNavigate();
    const handlecontent = () =>{
        var his = `/list/${props.id}/${props.type}`
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
                settime(res.data.content.updatedAt);
                setSameUser(res.data.content.author.id === selfID);
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

    const handleDelete = (event) => {
        event.stopPropagation();

        setShowModal(true);
    };

    const handleConfirmDelete = async () => {
        try {
            // First, need to get content to delete all its subcontent
            const res = await getContentById(props.type,props.id);
            const contentList = res.data.content.contentList;

            // Now, delete ALL of the subcontent
            const subtype = props.type === CONTENT_TYPE.COMIC ? SUBCONTENT_TYPE.PAGE : SUBCONTENT_TYPE.CHAPTER; 
            for (let i = 0; i < contentList.length; i++) {
                await deleteSubcontent(subtype, contentList[i].subcontent._id);
            }

            // Last, delete the content itself
            await deleteContent(props.type, props.id);
        } catch (err) {
            console.log(err);
        }

        window.location.reload();
    };

    return (
        <Card sx={{ width: '20%', marginRight: '16px' }}>
            <Modal
                open={showModal}
                onClose={() => setShowModal(false)}
                style={{ width: '35%', top: '50%', left: '50%' }}
            >
                <Box style={{ backgroundColor: 'white', display: 'flex', flexDirection: 'column', padding: '20px', borderRadius: '4px' }}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Are you sure?
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 1 }}>
                        Do you really want to delete this comic?
                    </Typography>
                    <Box style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'left' }}>
                        <Button onClick={() => handleConfirmDelete()} variant='contained' style={{ margin: '10px' }} >Yes</Button>
                        <Button onClick={() => setShowModal(false)} variant='contained' style={{ margin: '10px' }} >No</Button>
                    </Box>
                </Box>
            </Modal>
         <CardActionArea onClick={handlecontent}>
            <Box style={{ flexDirection: 'column'}}>
                <CardMedia
                    component="img"
                    sx={{ width: 300 }}
                    image={thumb}
                    alt="Loading...."
                />
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                    <CardContent sx={{ flex: "auto" }}>
                        <Box style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} >
                            <Typography sx={{ fontWeight: "bold" }} component="div" variant="h5">
                            {title}
                            </Typography>
                            {sameUser && 
                                <DeleteIcon onClick={(e) => handleDelete(e)} style={{ fontSize: '36px' }} />
                            }
                        </Box>
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
                                sx = {{marginRight: "1.5px", marginBottom: "1px"}}
                            />)}
                        <Typography sx={{ marginTop: '1em' }} variant="body2" color="text.secondary" component="div">
                            Last updated:{time}
                        </Typography>
                    </CardContent>
                </Box>
            </Box>
            </CardActionArea>
        </Card>
    )
}