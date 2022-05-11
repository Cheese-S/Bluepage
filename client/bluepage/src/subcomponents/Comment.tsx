import React, { useState } from 'react';
import { Box, Typography, TextField, Button } from '@mui/material/';
import Subcomment from './Subcomment';
import PersonIcon from '@mui/icons-material/Person';

interface User {
    id: String,
    name: String,
}

interface CommentType {
    _id: String,
    text: String,
    user: User,
    subcomments: Array<SubcommentType>,
}

interface SubcommentType {
    text: String,
    user: User,
}

interface Props {
    comment: CommentType,
    subcomment: Function,
}

export default function Comment(props: Props) {
    const { comment, subcomment } = props;
    const [replying, setReplying] = useState(false);
    const [newSubcomment, setNewSubcomment] = useState('');

    const cancelReply = () => {
        // Reset subcomment
        setNewSubcomment('');

        // Hide field
        setReplying(false);
    };

    const handleSubmit = async () => {
        // Call on parent component's submit function
        await subcomment(comment._id, newSubcomment);
        setNewSubcomment('');
        setReplying(false);
    };
    
    return (
        <Box style={{ display: 'flex', flexDirection: 'column' }}>
            <Box style={{ display: 'flex', flexDirection: 'row', paddingBottom: '20px' }}>
                <PersonIcon style={{ width: '5%', height: '5%', color: '#aa00aa' }} />
                <Box style={{ paddingRight: '20px' }}/>
                <Box style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                    <Typography style={{ fontWeight: 'bold', fontSize: '16px'}}>{comment.user.name}</Typography>
                    <Typography style={{ color: '#68717a', fontSize: '16px', paddingTop: '5px' }}>{comment.text}</Typography>
                    {replying ?
                        <Box style={{ display: 'flex', flexDirection: 'column', width: '90%', paddingTop: '10px' }}>
                            <TextField value={newSubcomment} onChange={(event) => setNewSubcomment(event.target.value)} fullWidth placeholder='Add a comment...' style={{ paddingBottom: '10px' }} />
                            <Box style={{ display: 'flex', flexDirection: 'row-reverse' }}>
                                <Button onClick={handleSubmit} disabled={newSubcomment === ''} variant='contained' sx={{ width: '7%' }}>Submit</Button>
                                <Box style={{ width: '3%' }} />
                                <Button onClick={cancelReply} variant='contained' sx={{ width: '7%' }}>Cancel</Button>
                            </Box>
                        </Box>
                    :
                        <Button onClick={() => setReplying(true)} sx={{ paddingTop: '10px', alignSelf: 'flex-start', fontSize: '14px' }}>Reply</Button>
                    }
                    <Box style={{ padding: '10px' }}>
                        {comment.subcomments.map((subcomment, i) =>
                            <Subcomment key={`subcomment_${i}`} subcomment={subcomment} />
                        )}
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}
