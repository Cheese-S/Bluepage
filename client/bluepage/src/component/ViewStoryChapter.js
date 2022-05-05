import React,{useState, useEffect} from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Button, TextField } from '@mui/material/';
import ContentBlurb from '../subcomponents/ContentBlurb';
import { getSubcontentByID, updateSubContent, publishSubContent, getContentById, updateContent, viewSubcontent } from '../api/api';
import Comment from '../subcomponents/Comment';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';
import { CONTENT_TYPE, SUBCONTENT_TYPE } from '../constant';
import draftToHtml from 'draftjs-to-html';


export default function ViewStoryChapter(){
    const navigate = useNavigate();
    const { id } = useParams();
    const [parentID, setParentID] = useState('');
    const [title, settitle] = useState(null);
    const [views, setViews] = useState(0);
    const [html,sethtml] = useState('');

    useEffect(() => {
        const getChapter = async () => {
            try {
                const res = await getSubcontentByID(id, SUBCONTENT_TYPE.CHAPTER);
                setParentID(res.data.subcontent.parentID);
                // load in data from the body
                settitle(res.data.subcontent.title);
                setViews(res.data.subcontent.views);
                if (res.data.subcontent.body.v) {
                    sethtml(draftToHtml(res.data.subcontent.body.v));
                }

                // add a view to the subcontent
                await viewSubcontent(SUBCONTENT_TYPE.CHAPTER, res.data.subcontent._id);
            } catch (err) {
                // Probably unauthorized - kick out
                console.log(err);
                navigate(`/home/test`);
            }
        }
        getChapter();
    }, []);

    return (
        <Box style={{ backgroundColor: '#3c78d8', alignItems: 'center', justifyContent: 'center' }}>
            <Box style={{ width: '90%', margin: 'auto', paddingTop: '10px', paddingBottom: '10px' }}>
                <ContentBlurb id={parentID} type={CONTENT_TYPE.STORY} subtype={SUBCONTENT_TYPE.CHAPTER}/>
            </Box>
            <Box style={{ width: '90%', margin: 'auto' }}>
                <Box style={{ backgroundColor: '#ffffff', padding: '10px' }}>
                    <Typography align='center' style={{ fontWeight: 'bold', fontSize: '20px' }}>{title}</Typography>
                </Box>
            </Box>
            <Box style={{ width: '90%', margin: 'auto', paddingTop: '10px'}}/>
            <Box style={{ backgroundColor: '#ffffff', width: '90%', margin: 'auto', paddingTop: '10px' }}>
                <Box style={{ width: '98%', margin: 'auto'}} sx={{ whiteSpace: 'normal', overflow: 'auto' }}>
                   <div dangerouslySetInnerHTML={{ __html: html }} /> 
                </Box>
                
                <Box style={{ width: '98%', margin: 'auto'}}>
                    <hr style={{ color: 'black', backgroundColor: 'black', height: 1}} />
                    <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                        <Typography style={{ fontWeight: 'bold', width: '70%' }}>{views} views</Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'row-reverse', alignItems: 'center', width: '30%', marginRight: '20px' }}>
                            <Typography style={{ fontWeight: 'bold' }}>3</Typography>
                            <ThumbDownOffAltIcon sx={{ fontSize: '40px' }}></ThumbDownOffAltIcon>
                            <Typography style={{ fontWeight: 'bold', marginRight: '20px' }}>112</Typography>
                            <ThumbUpOffAltIcon sx={{ fontSize: '40px' }}></ThumbUpOffAltIcon>
                        </Box>
                    </Box>
                    <Typography style={{ fontSize: '18px', paddingTop: '5px', paddingBottom: '20px' }}>Leave a comment...</Typography>
                    <Box style={{ display: 'flex', flexDirection: 'row', paddingBottom: '20px' }}>
                        <Box style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: '#aaaa00' }}></Box>
                        <Box style={{ paddingRight: '20px' }}/>
                        <Box style={{ display: 'flex', flexDirection: 'column', width: '90%' }}>
                            <TextField fullWidth placeholder='Add a comment...' style={{ paddingBottom: '10px'}}/>
                            <Button variant='contained' sx={{ width: '7%', alignSelf: 'flex-end' }}>Submit</Button>
                        </Box>
                    </Box>
                    <Box style={{ paddingBottom: '20px', width: '90%' }}>
                        
                    </Box>
                    <Comment/>
                </Box>
            </Box>
        </Box>
    );
}
