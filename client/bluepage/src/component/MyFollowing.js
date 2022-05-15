import React from 'react';
import { Box, Typography } from '@mui/material/';
import { ButtonAppBar } from './NavBar';
import { SearchViewCard } from './SearchViewCard';
import { userStore } from '../store/UserStore';
import { CONTENT_TYPE } from '../constant';

export const MyFollowing = () => {
    const siteMode = userStore(state => state.siteMode);
    const followingList = (siteMode === CONTENT_TYPE.COMIC) ? userStore(state => state.followingComics) : userStore(state => state.followingStories);

    const cards = followingList.length > 0 ?
        followingList.map((id) => (
            <SearchViewCard id={id} type={siteMode} key={id} />
        ))
        :
        <>
            <Typography style={{ fontWeight: 'bold', fontSize: 32, marginLeft: 16 }}>
                Whoops! Looks like you aren't following any {(siteMode === CONTENT_TYPE.COMIC) ? 'comics.' : 'stories.'}
            </Typography>
            <Typography style={{ fontSize: 24, marginLeft: 16 }}>
                Try searching for some content and following it!
            </Typography>
        </>;
    
    return (
        <Box style={{ backgroundColor: '#3c78d8', alignItems: 'center', justifyContent: 'center' }}>
            <ButtonAppBar/>
            <Typography variant='h4' style={{ marginLeft: '2%', marginTop: '1%', marginBottom: '1%' }}>{(siteMode === CONTENT_TYPE.COMIC) ? 'Comics' : 'Stories'} You're Following</Typography>
            <Box style={{ display: 'flex', flexDirection: 'column' }}>
                {cards}
            </Box>
        </Box>
    );
}
