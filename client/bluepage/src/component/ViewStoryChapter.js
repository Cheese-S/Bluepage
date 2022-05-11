import React,{useState, useEffect} from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Button, TextField } from '@mui/material/';
import { getSubcontentByID, viewSubcontent, voteOnSubcontent, commentSubcontent, subcommentSubcontent, takeOffSubcontent } from '../api/api';
import { CONTENT_TYPE, SUBCONTENT_TYPE, VOTE_STATE_TYPE } from '../constant';
import { userStore } from '../store/UserStore';
import ContentBlurb from '../subcomponents/ContentBlurb';
import Comment from '../subcomponents/Comment';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';
import PersonIcon from '@mui/icons-material/Person';
import draftToHtml from 'draftjs-to-html';


export default function ViewStoryChapter(){
    const navigate = useNavigate();
    const { id } = useParams();
    const [parentID, setParentID] = useState('');

    const loggedIn = userStore(state => state.isLoggedIn);
    const admin = userStore(state => state.isAdmin);
    const likedChapters = userStore(state => state.likedChapters);
    const setLikedChapters = userStore(state => state.setLikedChapters);
    const dislikedChapters = userStore(state => state.dislikedChapters);
    const setDislikedChapters = userStore(state => state.setDislikedChapters);

    const [title, settitle] = useState(null);
    const [views, setViews] = useState(0);
    const [vote, setVote] = useState(VOTE_STATE_TYPE.NEUTRAL);
    const [likes, setLikes] = useState(0);
    const [dislikes, setDislikes] = useState(0);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [html,sethtml] = useState('');

    /**
   * Handles changing the like/dislike front-end and then send corresponding request
   * @param {Number} newVote from the imported VOTE_STATE_TYPE constant
   */
    const handleChangeVote = async (newVote) => {
        if (!loggedIn) return;

        // Update local store and displayed vote counts
        const tempLiked = [...likedChapters];
        const tempDisliked = [...dislikedChapters];
        if (newVote === VOTE_STATE_TYPE.NEUTRAL) {
            // Check old vote - will have to be removed
            if (vote === VOTE_STATE_TYPE.LIKE) {
                const removeIndex = tempLiked.indexOf(id);
                tempLiked.splice(removeIndex, 1);
                setLikedChapters(tempLiked);
                setLikes(likes - 1);
            } else {
                const removeIndex = tempDisliked.indexOf(id);
                tempDisliked.splice(removeIndex, 1);
                setDislikedChapters(tempDisliked);
                setDislikes(dislikes - 1);
            }
        } else if (newVote === VOTE_STATE_TYPE.LIKE) {
            // Add to list of liked comics - remove from disliked if needed
            tempLiked.push(id);
            setLikedChapters(tempLiked);
            setLikes(likes + 1);

            if (vote === VOTE_STATE_TYPE.DISLIKE) {
                const removeIndex = tempDisliked.indexOf(id);
                if (removeIndex > -1) tempDisliked.splice(removeIndex, 1);
                setDislikedChapters(tempDisliked);
                setDislikes(dislikes - 1);
            }
        } else {
            // Add to list of disliked comics - remove from liked if needed
            tempDisliked.push(id);
            setDislikedChapters(tempDisliked);
            setDislikes(dislikes + 1);

            if (vote === VOTE_STATE_TYPE.LIKE) {
                const removeIndex = tempLiked.indexOf(id);
                if (removeIndex > -1) tempLiked.splice(removeIndex, 1);
                setLikedChapters(tempLiked);
                setLikes(likes - 1);
            }
        }

        // Update server
        await voteOnSubcontent(id, SUBCONTENT_TYPE.CHAPTER, vote, newVote);

        // Update front-end
        setVote(newVote);
    };

    useEffect(() => {
        const getChapter = async () => {
            try {
                const res = await getSubcontentByID(id, SUBCONTENT_TYPE.CHAPTER);
                setParentID(res.data.subcontent.parentID);
                // load in data from the body
                settitle(res.data.subcontent.title);
                setViews(res.data.subcontent.views);
                setComments(res.data.subcontent.comments.reverse());

                if (res.data.subcontent.body.v) {
                    sethtml(draftToHtml(res.data.subcontent.body.v));
                }

                // add a view to the subcontent
                await viewSubcontent(SUBCONTENT_TYPE.CHAPTER, res.data.subcontent._id);

                // Set vote counts
                setLikes(res.data.subcontent.likes);
                setDislikes(res.data.subcontent.dislikes);

                if (loggedIn) {
                    // Process the current user's vote, if any
                    if (likedChapters.indexOf(id) > -1) {
                        setVote(VOTE_STATE_TYPE.LIKE);
                    } else if (dislikedChapters.indexOf(id) > -1) {
                        setVote(VOTE_STATE_TYPE.DISLIKE);
                    }
                }
            } catch (err) {
                // Probably unauthorized - kick out
                console.log(err);
                navigate(`/home`);
            }
        }
        getChapter();
    }, []);

    const submitComment = async () => {
        try {
            // Update server
            const res = await commentSubcontent(SUBCONTENT_TYPE.CHAPTER, id, newComment);

            // Update local with res
            setComments(res.data.subcontent.comments.reverse());
        } catch (err) {
            console.log(err);
        }

        // Clear comment field
        setNewComment('');
    };

    const submitSubcomment = async (commentID, text) => {
        try {
            // Update server
            const res = await subcommentSubcontent(SUBCONTENT_TYPE.CHAPTER, id, commentID, text);

            // Update local with res
            setComments(res.data.subcontent.comments.reverse());
        } catch (err) {
            console.log(err);
        }
    };

    const takeOffChapter = async () => {
        try {
            // Take off content
            await takeOffSubcontent(SUBCONTENT_TYPE.CHAPTER, id);

            // Navigate back to the list page
            navigate(`/list/${parentID}/story`)
        } catch (err) {
            console.log(err);
        }
    };

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
                        {admin &&
                            <Box style={{ width: '100%', display: 'flex', flexDirection: 'row-reverse' }}>
                                <Button onClick={takeOffChapter} sx={{ width: '10%', alignSelf: 'flex-end' }}>Take Off</Button>
                            </Box>
                        }
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                        <Typography style={{ fontWeight: 'bold', width: '70%' }}>{views} views</Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'row-reverse', alignItems: 'center', width: '30%', marginRight: '20px' }}>
                            <Typography style={{ fontWeight: 'bold' }}>{dislikes}</Typography>
                            {vote === VOTE_STATE_TYPE.DISLIKE ?
                                <ThumbDownIcon onClick={() => handleChangeVote(VOTE_STATE_TYPE.NEUTRAL)} sx={{ fontSize: '40px', cursor: 'pointer' }} />
                                :
                                <ThumbDownOffAltIcon onClick={() => handleChangeVote(VOTE_STATE_TYPE.DISLIKE)} sx={{ fontSize: '40px', cursor: 'pointer' }} />}
                            <Typography style={{ fontWeight: 'bold', marginRight: '20px' }}>{likes}</Typography>
                            {vote === VOTE_STATE_TYPE.LIKE ?
                                <ThumbUpIcon onClick={() => handleChangeVote(VOTE_STATE_TYPE.NEUTRAL)} sx={{ fontSize: '40px', cursor: 'pointer' }} />
                                :
                                <ThumbUpOffAltIcon onClick={() => handleChangeVote(VOTE_STATE_TYPE.LIKE)} sx={{ fontSize: '40px', cursor: 'pointer' }} />
                            }
                        </Box>
                    </Box>
                    <Typography style={{ fontSize: '18px', paddingTop: '5px', paddingBottom: '20px' }}>Leave a comment...</Typography>
                    {loggedIn &&
                        <Box style={{ display: 'flex', flexDirection: 'row', paddingBottom: '20px' }}>
                            <PersonIcon style={{ width: '5%', height: '5%', color: '#aaaa00' }} />
                            <Box style={{ paddingRight: '20px' }}/>
                            <Box style={{ display: 'flex', flexDirection: 'column', width: '90%' }}>
                                <TextField value={newComment} onChange={(event) => setNewComment(event.target.value)} fullWidth placeholder='Add a comment...' style={{ paddingBottom: '10px'}}/>
                                <Button onClick={submitComment} variant='contained' sx={{ width: '7%', alignSelf: 'flex-end' }}>Submit</Button>
                            </Box>
                        </Box>
                    }
                    <Box style={{ paddingBottom: '20px', width: '90%' }}>
                        {comments.map((comment, i) =>
                            <Comment key={`comment_${i}`} comment={comment} subcomment={submitSubcomment} />
                        )}
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}
