import React from 'react';
import { Box, Typography } from '@mui/material/';

interface User {
    id: String,
    name: String,
}

interface CommentType {
    id: String,
    text: String,
    user: User,
    subcomments: Array<Comment>,
}

export default function Comment(comment: {comment: CommentType}) {
    
    return (
        <Box style={{ display: 'flex', flexDirection: 'row', paddingBottom: '20px' }}>
            <Box style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: '#aa00aa' }}></Box>
            <Box style={{ paddingRight: '20px' }}/>
            <Box style={{ display: 'flex', flexDirection: 'column' }}>
                <Typography style={{ fontWeight: 'bold', fontSize: '14px'}}>{comment.comment.user.name}</Typography>
                <Typography style={{ color: '#68717a' }}>{comment.comment.text}</Typography>
            </Box>
        </Box>
    );
}
