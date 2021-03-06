import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, TextField } from '@mui/material/';
import { useParams, useNavigate } from 'react-router-dom';
import { getContentById, getSubcontentByID, viewSubcontent, voteOnSubcontent, commentSubcontent, subcommentSubcontent, takeOffSubcontent } from '../api/api';
import { CONTENT_TYPE, SUBCONTENT_TYPE, VOTE_STATE_TYPE } from '../constant';
import { Stage, Layer, Line, Rect, Arrow, Circle } from 'react-konva';
import { userStore } from '../store/UserStore';
import ContentBlurb from '../subcomponents/ContentBlurb';
import Comment from '../subcomponents/Comment';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';
import PersonIcon from '@mui/icons-material/Person';

export default function ViewComicPage() {
  const navigate = useNavigate();

  const loggedIn = userStore(state => state.isLoggedIn);
  const likedPages = userStore(state => state.likedPages);
  const admin = userStore(state => state.isAdmin);
  const setLikedPages = userStore(state => state.setLikedPages);
  const dislikedPages = userStore(state => state.dislikedPages);
  const setDislikedPages = userStore(state => state.setDislikedPages);

  const { id } = useParams();
  const [parentID, setParentID] = useState('');
  const [title, settitle] = useState(null);
  const [views, setViews] = useState(0);
  const [vote, setVote] = useState(VOTE_STATE_TYPE.NEUTRAL);
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  const [previousPage, setPreviousPage] = useState('');
  const [nextPage, setNextPage] = useState('');

  const [lines, setLines] = useState([]);
  const [shapes, setShapes] = useState([]);
  const [arrows, setArrows] = useState([]);

  const getPrevious = async (contentList, startIndex) => {
    // We have to see if the 'previous' is actually published, requiring queries
    for (let i = startIndex; i >= 0; i--) {
      try {
        const res = await getSubcontentByID(contentList[i].subcontent._id, SUBCONTENT_TYPE.PAGE);

        // If this page is published, it can be the previous
        if (res.data.subcontent.published) {
          setPreviousPage(contentList[i].subcontent._id);
          return;
        }
      } catch (err) {
        // Might be unauthorized - just keep going
        continue;
      }
    }
  };

  const getNext = async (contentList, startIndex) => {
    // We have to see if the 'previous' is actually published, requiring queries
    for (let i = startIndex; i < contentList.length; i++) {
      try {
        const res = await getSubcontentByID(contentList[i].subcontent._id, SUBCONTENT_TYPE.PAGE);

        // If this page is published, it can be the previous
        if (res.data.subcontent.published) {
          setNextPage(contentList[i].subcontent._id);
          return;
        }
      } catch (err) {
        // Might be unauthorized - just keep going
        continue;
      }
    }
  };

  const setPrevNext = async (contentList) => {
    // Search the given contentList for this page's id
    for (let i = 0; i < contentList.length; i++) {
      if (contentList[i].subcontent._id === id) {
        // id has been found - set prev and next accordingly
        await getPrevious(contentList, i - 1);
        await getNext(contentList, i + 1);
      }
    }

    // if we reached here, the id wasn't found, meaning something's wrong
    // let both remain blank
    return;
  };

  /**
   * Handles changing the like/dislike front-end and then send corresponding request
   * @param {Number} newVote from the imported VOTE_STATE_TYPE constant
   */
  const handleChangeVote = async (newVote) => {
    if (!loggedIn) return;

    // Update local store and displayed vote counts
    const tempLiked = [...likedPages];
    const tempDisliked = [...dislikedPages];

    if (newVote === VOTE_STATE_TYPE.NEUTRAL) {
      // Check old vote - will have to be removed
      if (vote === VOTE_STATE_TYPE.LIKE) {
        const removeIndex = tempLiked.indexOf(id);
        tempLiked.splice(removeIndex, 1);
        setLikedPages(tempLiked);
        setLikes(likes - 1);
      } else {
        const removeIndex = tempDisliked.indexOf(id);
        tempDisliked.splice(removeIndex, 1);
        setDislikedPages(tempDisliked);
        setDislikes(dislikes - 1);
      }
    } else if (newVote === VOTE_STATE_TYPE.LIKE) {
      // Add to list of liked comics - remove from disliked if needed
      tempLiked.push(id);
      setLikedPages(tempLiked);
      setLikes(likes + 1);

      if (vote === VOTE_STATE_TYPE.DISLIKE) {
        const removeIndex = tempDisliked.indexOf(id);
        if (removeIndex > -1) tempDisliked.splice(removeIndex, 1);
        setDislikedPages(tempDisliked);
        setDislikes(dislikes - 1);
      }
    } else {
      // Add to list of disliked comics - remove from liked if needed
      tempDisliked.push(id);
      setDislikedPages(tempDisliked);
      setDislikes(dislikes + 1);

      if (vote === VOTE_STATE_TYPE.LIKE) {
        const removeIndex = tempLiked.indexOf(id);
        if (removeIndex > -1) tempLiked.splice(removeIndex, 1);
        setLikedPages(tempLiked);
        setLikes(likes - 1);
      }
    }

    // Update server
    await voteOnSubcontent(id, SUBCONTENT_TYPE.PAGE, vote, newVote);

    // Update front-end
    setVote(newVote);
  };

  useEffect(() => {
    const getcontent = async () => {
      try {
        // Load in the page's data
        const res = await getSubcontentByID(id, "page");
        settitle(res.data.subcontent.title);
        setViews(res.data.subcontent.views);
        setParentID(res.data.subcontent.parentID);
        setComments(res.data.subcontent.comments.reverse());

        if (res.data.subcontent.body.lines) {
          setLines(res.data.subcontent.body.lines);
        }
        if (res.data.subcontent.body.shapes) {
          setShapes(res.data.subcontent.body.shapes);
        }
        if (res.data.subcontent.body.arrows) {
          setArrows(res.data.subcontent.body.arrows);
        }

        // Add a view to the page
        await viewSubcontent(SUBCONTENT_TYPE.PAGE, res.data.subcontent._id);

        // Set vote counts
        setLikes(res.data.subcontent.likes);
        setDislikes(res.data.subcontent.dislikes);

        if (loggedIn) {
          // Process the current user's vote, if any
          if (likedPages.indexOf(id) > -1) {
            setVote(VOTE_STATE_TYPE.LIKE);
          } else if (dislikedPages.indexOf(id) > -1) {
            setVote(VOTE_STATE_TYPE.DISLIKE);
          }
        }

        // Load in the parent's data
        const parentRes = await getContentById(CONTENT_TYPE.COMIC, res.data.subcontent.parentID);

        // Set the previous/next page information from the parent's info
        setPrevNext(parentRes.data.content.contentList);
      } catch (err) {
        // Probably unauthorized - kick out
        console.log(err);
        navigate(`/404`);
      }
    }
    getcontent();
  }, []);

  const submitComment = async () => {
    try {
      // Update server
      const res = await commentSubcontent(SUBCONTENT_TYPE.PAGE, id, newComment);

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
      const res = await subcommentSubcontent(SUBCONTENT_TYPE.PAGE, id, commentID, text);

      // Update local with res
      setComments(res.data.subcontent.comments.reverse());
    } catch (err) {
      console.log(err);
    }
  };

  const takeOffPage = async () => {
    try {
      // Take off content
      await takeOffSubcontent(SUBCONTENT_TYPE.PAGE, id);

      // Navigate back to the list page
      navigate(`/list/${parentID}/comic`)
    } catch (err) {
      console.log(err);
    }
  };

  const handlePrevious = () => {
    navigate(`/page/${previousPage}/page`);
    window.location.reload();
  };

  const handleNext = () => {
    navigate(`/page/${nextPage}/page`);
    window.location.reload();
  };

  return (
    <Box style={{ backgroundColor: '#81c4ff', alignItems: 'center', justifyContent: 'center' }}>
      <Box style={{ width: '90%', margin: 'auto', paddingTop: '10px', paddingBottom: '10px' }}>
        <ContentBlurb id={parentID} type={CONTENT_TYPE.COMIC} subtype={SUBCONTENT_TYPE.PAGE} />
      </Box>
      <Box style={{ width: '90%', margin: 'auto' }}>
        <Box style={{ backgroundColor: '#ffffff', padding: '10px' }}>
          <Typography align='center' style={{ fontWeight: 'bold', fontSize: '20px' }}>{title}</Typography>
        </Box>
      </Box>
      <Box style={{ width: '418px', height: '627px', backgroundColor: '#ffffff', margin: 'auto', marginTop: '10px' }}>
        <Stage
          width={418}
          height={627}
        >
          <Layer>
            {shapes.map((shape, i) => (
              <>
                {!('shapeType' in shape) || shape.shapeType === 'square' ?
                  <Rect
                    key={`rect_${i}`}
                    x={shape.start_x}
                    y={shape.start_y}
                    width={shape.end_x - shape.start_x}
                    height={shape.end_y - shape.start_y}
                    stroke={shape.strokeColor}
                    strokeWidth={shape.strokeWidth}
                  />
                  : shape.shapeType === 'circle' ?
                    <Circle
                      key={`circle_${i}`}
                      x={shape.start_x}
                      y={shape.start_y}
                      radius={Math.sqrt(Math.pow(shape.end_x - shape.start_x, 2) + Math.pow(shape.end_y - shape.start_y, 2))}
                      stroke={shape.strokeColor}
                      strokeWidth={shape.strokeWidth}
                    />
                    :
                    <Rect
                      key={`rect_${i}`}
                      x={shape.start_x}
                      y={shape.start_y}
                      width={shape.end_x - shape.start_x}
                      height={shape.end_y - shape.start_y}
                      stroke={shape.strokeColor}
                      strokeWidth={shape.strokeWidth}
                    />
                }
              </>
            ))}
            {arrows.map((arrow, i) => (
              <Arrow
                key={`arrow_${i}`}
                points={arrow.points}
                stroke={arrow.color}
                strokeWidth={arrow.strokeWidth}
                tension={1}
              />
            ))}
            {lines.map((line, i) => (
              <Line
                key={`line_${i}`}
                points={line.points}
                stroke={line.color}
                strokeWidth={line.strokeWidth}
                tension={0.5}
                lineCap='round'
                globalCompositeOperation={
                  line.tool === 'eraser' ? 'destination-out' : 'source-over'
                }
              />
            ))}
          </Layer>
        </Stage>
      </Box>
      <Box style={{ width: '90%', margin: 'auto', paddingTop: '10px' }} />
      <Box style={{ backgroundColor: '#ffffff', width: '90%', margin: 'auto', paddingTop: '10px' }}>
        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
          {admin &&
            <Box style={{ width: '100%', display: 'flex', flexDirection: 'row-reverse' }}>
              <Button onClick={takeOffPage} sx={{ width: '10%', alignSelf: 'flex-end' }}>Take Off</Button>
            </Box>
          }
        </Box>
        <Box style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Button disabled={previousPage === ''} onClick={handlePrevious} variant='contained' style={{ margin: 8 }}>Previous Page</Button>
          <Button disabled ={nextPage === ''} onClick={handleNext} variant='contained' style={{ margin: 8 }}>Next Page</Button>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
          <Typography style={{ fontWeight: 'bold', width: '70%', marginLeft: '10px' }}>{views} views</Typography>
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
        <Box style={{ width: '98%', margin: 'auto' }}>
          <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
          </Box>
          <Typography style={{ fontSize: '18px', paddingTop: '5px', paddingBottom: '20px' }}>Comments</Typography>
          {loggedIn &&
            <Box style={{ display: 'flex', flexDirection: 'row', paddingBottom: '20px' }}>
              <PersonIcon style={{ width: '5%', height: '5%', color: '#aaaa00' }} />
              <Box style={{ paddingRight: '20px' }} />
              <Box style={{ display: 'flex', flexDirection: 'column', width: '90%' }}>
                <TextField value={newComment} onChange={(event) => setNewComment(event.target.value)} fullWidth placeholder='Add a comment...' style={{ paddingBottom: '10px' }} />
                <Button onClick={submitComment} variant='contained' sx={{ width: '7%', alignSelf: 'flex-end' }}>Submit</Button>
              </Box>
            </Box>
          }
          <Box style={{ paddingBottom: '20px', width: '90%' }} >
            {comments.map((comment, i) =>
              <Comment key={`comment_${i}`} comment={comment} subcomment={submitSubcomment} />
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
