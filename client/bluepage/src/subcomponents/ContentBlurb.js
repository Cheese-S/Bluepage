import React, { useEffect ,useState} from 'react';
import { Typography, Button, Link, Box , Chip} from '@mui/material/';
import { getContentById, voteOnContent, followContent, getUser, takeoffContent} from '../api/api';
import { CONTENT_TYPE, VOTE_STATE_TYPE } from '../constant';
import { useNavigate } from 'react-router-dom';
import { userStore } from '../store/UserStore';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';
import HomeIcon from '@mui/icons-material/Home';

export default function ContentBlurb(props) {
    const history = useNavigate();
    const { id, type, subtype } = props;

    const loggedIn = userStore(state => state.isLoggedIn);
    const likedContent = (type === CONTENT_TYPE.COMIC) ? userStore(state => state.likedComics) : userStore(state => state.likedStories);
    const setLikedContent = (type === CONTENT_TYPE.COMIC) ? userStore(state => state.setLikedComics) : userStore(state => state.setLikedStories);
    const dislikedContent = (type === CONTENT_TYPE.COMIC) ? userStore(state => state.dislikedComics) : userStore(state => state.dislikedStories);
    const setDislikedContent = (type === CONTENT_TYPE.COMIC) ? userStore(state => state.setDislikedComics) : userStore(state => state.setDislikedStories);
    const followingContent = (type === CONTENT_TYPE.COMIC) ? userStore(state => state.followingComics) : userStore(state => state.followingStories);
    const setFollowingContent = (type === CONTENT_TYPE.COMIC) ? userStore(state => state.setFollowingComics) : userStore(state => state.setFollowingStories);
    const userID = userStore(state => state.id);

    const [title, settitle] = useState(null);
    const [views, setviews] = useState(0);
    const [description, setdescription] = useState(null);
    const [tag, settag] = useState(null);
    const [followers, setfollowers] = useState(0);

    const [author, setauthor] = useState(null);
    const [authoridlink, setauthorid] = useState(null);
    
    const [isAdmin, setIsAdmin] = useState(false);

    const [vote, setVote] = useState(VOTE_STATE_TYPE.NEUTRAL);
    const [likes, setLikes] = useState(0);
    const [dislikes, setDislikes] = useState(0);
    const [following, setFollowing] = useState(false);
    const [published, setpublished] = useState(false);

    const handletoauthor= () =>{
        var his = `/profile/${authoridlink}`
        history(his);
    };

    const handleToContent = () => {
        history(`/list/${id}/${type}/`)
    };

    /**
     * Handles changing the like/dislike front-end and then send corresponding request
     * @param {Number} newVote from the imported VOTE_STATE_TYPE constant
     */
    const handleChangeVote = async (newVote) => {
        if (!loggedIn) return;

        // Update local store and displayed vote counts
        const tempLiked = [...likedContent];
        const tempDisliked = [...dislikedContent];
        if (newVote === VOTE_STATE_TYPE.NEUTRAL) {
            // Check old vote - will have to be removed
            if (vote === VOTE_STATE_TYPE.LIKE) {
                const removeIndex = tempLiked.indexOf(id);
                tempLiked.splice(removeIndex, 1);
                setLikedContent(tempLiked);
                setLikes(likes - 1);
            } else {
                const removeIndex = tempDisliked.indexOf(id);
                tempDisliked.splice(removeIndex, 1);
                setDislikedContent(tempDisliked);
                setDislikes(dislikes - 1);
            }
        } else if (newVote === VOTE_STATE_TYPE.LIKE) {
            // Add to list of liked comics - remove from disliked if needed
            tempLiked.push(id);
            setLikedContent(tempLiked);
            setLikes(likes + 1);

            if (vote === VOTE_STATE_TYPE.DISLIKE) {
                const removeIndex = tempDisliked.indexOf(id);
                if (removeIndex > -1) tempDisliked.splice(removeIndex, 1);
                setDislikedContent(tempDisliked);
                setDislikes(dislikes - 1);
            }
        } else {
            // Add to list of disliked comics - remove from liked if needed
            tempDisliked.push(id);
            setDislikedContent(tempDisliked);
            setDislikes(dislikes + 1);

            if (vote === VOTE_STATE_TYPE.LIKE) {
                const removeIndex = tempLiked.indexOf(id);
                if (removeIndex > -1) tempLiked.splice(removeIndex, 1);
                setLikedContent(tempLiked);
                setLikes(likes - 1);
            }
        }
    
        // Update server
        await voteOnContent(type, id, vote, newVote);

        // Update front-end
        setVote(newVote);
    };

    useEffect(() => {
        const getcontent = async () =>{
            try{
                if(userID){
                    const userRes= await getUser(userID);
                    setIsAdmin(userRes.data.user.isAdmin);
                }
                const res = await getContentById(type,id);
                if (res.data.content.published) {
                    setpublished(true);
                }
                else {
                    setpublished(false);
                }

                settitle(res.data.content.title);
                setviews(res.data.content.views);
                setfollowers(res.data.content.followers);
                setauthor(res.data.content.author.name);
                setauthorid(res.data.content.author.id);
                settag(res.data.content.tags);
                setdescription(res.data.content.description);
                setLikes(res.data.content.likes);
                setDislikes(res.data.content.dislikes);

                if (loggedIn) {
                    // Process the current user's vote, if any
                    if (likedContent.indexOf(id) > -1) {
                        setVote(VOTE_STATE_TYPE.LIKE);
                    } else if (dislikedContent.indexOf(id) > -1) {
                        setVote(VOTE_STATE_TYPE.DISLIKE);
                    }
                    if (followingContent.indexOf(id) > -1) {
                        setFollowing(true);
                    }
                    else {
                        setFollowing(false);
                    }
                } 
            } 
            catch(err){
                console.log(err);
            }
        }
        if (id) {
            getcontent();
        }
    }, [id]);
    const followtest = followers + " following"

    let tags=""
    if (tag){
        tags= tag.map((tag) =>
            <Chip
                key={tag}
                label={tag}
                color="primary"
                size="small"
            />)
    }

    const follow = async() => {
        const tempFollowing = [...followingContent];
        try{
            setFollowing(true);
            tempFollowing.push(id);
            setFollowingContent(tempFollowing);
            await followContent(id, type, "follow");
            const res = await getContentById(type,id);
            setfollowers(res.data.content.followers);
        }
        catch (err){
            console.log(err);
        }
    }
    const unfollow = async() => {
        const tempFollowing = [...followingContent];
        try {
            setFollowing(false);
            const removeIndex = tempFollowing.indexOf(id);
            if (removeIndex > -1) {
                tempFollowing.splice(removeIndex, 1);
            }
            setFollowingContent(tempFollowing);
            await followContent(id, type, "unfollow");
            const res = await getContentById(type, id);
            setfollowers(res.data.content.followers);
        }
        catch (err) {
            console.log(err);
        }
        
    }
    const takeOffContentNow = async() => {
        try {
            await takeoffContent(type, id);
            var his = `/profile/${authoridlink}`
            history(his);
        }
        catch (err){
            console.log(err);
        }
    }
    return (
        <Box style={{ backgroundColor: 'white', padding: '10px' }}>
            <Box style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <Link onClick={handleToContent} underline="hover">
                    <Typography style={{ fontWeight: 'bold' }}>{title}</Typography>
                </Link>
                <Link href='/home'>
                    <HomeIcon style={{ color: 'black', fontSize: 32 }} />
                </Link>
            </Box>
            <Link onClick={handletoauthor} underline="hover">by {author}</Link>
            <Typography style={{ paddingTop: '20px' }}>{description}</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems:'center', paddingTop: '10px' }}>
                <Typography style={{ fontWeight: 'bold', paddingRight: '5px' }}>Tags:</Typography>
                {tags}
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems:'center'}}>
                <Typography style={{ fontWeight: 'bold', width: '20%' }}>{views} views</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'row', width: '50%' }}>
                    <Typography style={{ fontWeight: 'bold', paddingRight:'10px' }}>{followtest}</Typography>
                    {!following && loggedIn && published &&  <Button variant='contained' onClick = {follow}>Follow</Button>}
                    {following && loggedIn && published && <Button variant = 'contained' onClick = {unfollow}>Unfollow</Button>}
                    {isAdmin && <Button variant = 'contained' onClick = {takeOffContentNow} sx = {{marginLeft: "4px"}}>TAKE OFF</Button>}
                </Box>
                {published &&
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
                </Box>}
            </Box>
        </Box>
    );
    }
