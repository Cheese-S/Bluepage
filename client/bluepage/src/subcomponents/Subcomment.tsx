import React from 'react';
import { Box, Typography, } from '@mui/material/';
import PersonIcon from '@mui/icons-material/Person';

interface User {
    id: String,
    name: String,
}

interface SubcommentType {
    text: String,
    user: User,
}

interface Props {
    subcomment: SubcommentType,
}

export default function Subcomment(props: Props) {
    const { subcomment } = props;
    
    return (
        <Box style={{ display: 'flex', flexDirection: 'column' }}>
            <Box style={{ display: 'flex', flexDirection: 'row', paddingBottom: '20px' }}>
                <PersonIcon style={{ width: '5%', height: '5%', color: '#aa00aa' }} />
                <Box style={{ paddingRight: '20px' }}/>
                <Box style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                    <Typography style={{ fontWeight: 'bold', fontSize: '16px'}}>{subcomment.user.name}</Typography>
                    <Typography style={{ color: '#68717a', fontSize: '16px', paddingTop: '5px' }}>{subcomment.text}</Typography>
                </Box>
            </Box>
        </Box>
    );
}
