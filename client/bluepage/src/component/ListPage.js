import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, TextField } from '@mui/material/';
import ContentBlurb from '../subcomponents/ContentBlurb';
import SubcontentListing from '../subcomponents/SubcontentListing';
import Comment from '../subcomponents/Comment';
import { useParams, useNavigate } from 'react-router-dom';
import { getContentById, createNewSubcontent, viewContent, commentContent, subcommentContent } from '../api/api';
import { userStore } from '../store/UserStore';
import { CONTENT_TYPE, SUBCONTENT_TYPE} from "../constant";
import PersonIcon from '@mui/icons-material/Person';

export default function ListPage() {
    const navigate = useNavigate();

    const { id, type } = useParams();
    const subtype = (type === CONTENT_TYPE.STORY) ? SUBCONTENT_TYPE.CHAPTER : SUBCONTENT_TYPE.PAGE;

    const selfID = userStore(state => state.id);
    const loggedIn = userStore(state => state.isLoggedIn);

    const [published, setPublished] = useState(false);
    const [sameUser, setSameUser] = useState(false);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    
    const [list, setlist] = useState([]);
    let sublist = "";
    if (list) {
        if (sameUser) {
            sublist = list.map((list, i) => <SubcontentListing key={`subcontent_${i}`} id={list.subcontent._id} type={subtype}/>);
        } else {
            sublist = list.filter(function(subcontent) {return subcontent.subcontent.published;} ).map((list, i) => <SubcontentListing key={`subcontent_${i}`} id={list.subcontent._id} type={subtype}/>);
        }
    }

    useEffect(() => {
        const getcontent = async () =>{
            try {
                // Load in content
                const res = await getContentById(type, id);
                setlist(res.data.content.contentList);
                setSameUser(res.data.content.author.id === selfID);
                setComments(res.data.content.comments.reverse());
                setPublished(res.data.content.published);

                // Add a view to that content
                if(res.data.content.published) {
                    await viewContent(type, res.data.content._id);
                }
            }  catch(err){
                // Probably unauthorized - kick out
                console.log(err);
                navigate('/home')
            }
        }
        getcontent();
    }, []);

    const createNewPage = async () => {
        const emptyBody = {
            lines: [],
            shapes: [],
            arrows: []
        };
        const res = await createNewSubcontent(id, subtype, 'Untitled Page', emptyBody);
        const pageID = res.data.subcontent._id;

        navigate(`/${subtype}/edit/${pageID}`);
    };

    const createNewChapter  = async () =>{
        const emptyBody = {
        };
        const res = await createNewSubcontent(id, subtype, 'Untitled Page', emptyBody);
        const pageID = res.data.subcontent._id;
        navigate(`/${subtype}/edit/${pageID}`);
    }

    const createSubcontent = async () => {
        if (subtype === SUBCONTENT_TYPE.PAGE) {
            await createNewPage();
        } if (subtype === SUBCONTENT_TYPE.CHAPTER) {
            await createNewChapter();
        }
        else{
            console.log("missing/wrong subtype");
        }
    };

    const submitComment = async () => {
        try {
            // Update server
            const res = await commentContent(type, id, newComment);

            // Update local with res
            setComments(res.data.content.comments.reverse());
        } catch (err) {
            console.log(err);
        }

        // Clear comment field
        setNewComment('');
    };

    const submitSubcomment = async (commentID, text) => {
        try {
            // Update server
            const res = await subcommentContent(type, id, commentID, text);

            // Update local with res
            setComments(res.data.content.comments.reverse());
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <Box style={{ backgroundColor: '#3c78d8', alignItems: 'center', justifyContent: 'center' }}>
            <Box style={{ width: '90%', margin: 'auto', paddingTop: '10px', paddingBottom: '10px' }}>
                <ContentBlurb id={id} type={type} subtype={subtype} />
            </Box>
            <Box style={{ backgroundColor: '#ffffff', width: '90%', margin: 'auto', paddingTop: '10px' }}>
                {sameUser &&
                    <Box style={{ display: 'flex', flexDirection: 'row' }}>
                        <Button onClick={() => createSubcontent()} variant='contained' style={{ margin: '10px' }}>
                            {`Create New ${subtype}`}
                        </Button>
                    </Box>
                }
                <Box style={{ width: '98%', margin: 'auto'}}>
                    {sublist}
                    <hr style={{ color: 'black', backgroundColor: 'black', height: 1}} />
                    <Typography style={{ fontSize: '18px', paddingTop: '5px', paddingBottom: '20px' }}>Comments</Typography>
                    {(published && loggedIn) &&
                        <Box style={{ display: 'flex', flexDirection: 'row', paddingBottom: '20px' }}>
                            <PersonIcon style={{ width: '5%', height: '5%', color: '#aaaa00' }} />
                            <Box style={{ paddingRight: '20px' }}/>
                            <Box style={{ display: 'flex', flexDirection: 'column', width: '90%' }}>
                                <TextField value={newComment} onChange={(event) => setNewComment(event.target.value)} fullWidth placeholder='Add a comment...' style={{ paddingBottom: '10px'}}/>
                                <Button disabled={newComment === ''} onClick={submitComment} variant='contained' sx={{ width: '7%', alignSelf: 'flex-end' }}>Submit</Button>
                            </Box>    
                        </Box>
                    }
                    <Box style={{ display: 'flex', flexDirection: 'row-reverse', paddingBottom: '20px', width: '90%' }} />
                    {comments.map((comment, i) =>
                        <Comment key={`comment_${i}`} comment={comment} subcomment={submitSubcomment} />
                    )}
                </Box>
            </Box>
        </Box>
    );
}
