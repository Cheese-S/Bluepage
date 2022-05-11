import React, { useEffect,useState } from 'react';
import { Box, Typography, Button, TextField, Link } from '@mui/material/';
import { ButtonAppBar } from './NavBar';
import { ViewCard } from './ViewCard'
import Grid from '@material-ui/core/Grid/Grid';
import { getContentPage } from '../api/api';
import { userStore } from '../store/UserStore';
import { CONTENT_TYPE } from "../constant";


export const HomePage = () => {
    const siteMode = userStore(state => state.siteMode);
    const [contentListview, setContentListview] = useState(null);
    const [contentListnew, setContentListnew] = useState(null);

    useEffect(() => {
        const getcontent = async () =>{
            try {
                // Load in content
                const viewcontent = await getContentPage(siteMode, {},{"sort[views]": -1,"limit":4} );
                const newcontent = await getContentPage(siteMode, {},{"sort[updatedAt]": -1,"limit":4} );
                const listOfContentview =
                <Grid container spacing={2}>
                    {siteMode === CONTENT_TYPE.COMIC ? 
                        viewcontent.data.result.docs.map((comic) => (
                            <Grid item xs={3}>
                            <ViewCard id={comic._id} type={siteMode} key={comic._id} />
                            </Grid>
                        ))
                    :
                        viewcontent.data.result.docs.map((story) => (
                            <Grid item xs={3}>
                            <ViewCard id={story._id} type={siteMode} key={story._id} />
                            </Grid>
                        ))
                    }
                </Grid >;
                const listOfContentnew =
                <Grid container spacing={2}>
                    {siteMode === CONTENT_TYPE.COMIC ? 
                        newcontent.data.result.docs.map((comic) => (
                            <Grid item xs={3}>
                            <ViewCard id={comic._id} type={siteMode} key={comic._id} />
                            </Grid>
                        ))
                    :
                        newcontent.data.result.docs.map((story) => (
                            <Grid item xs={3}>
                            <ViewCard id={story._id} type={siteMode} key={story._id} />
                            </Grid>
                        ))
                    }
                </Grid >;
                setContentListnew(listOfContentnew);
                setContentListview(listOfContentview);
            }  catch(err){
                console.log(err);
            }
        }
        getcontent();
    }, []);

    return (
        <Box style={{ alignItems: 'center', justifyContent: 'center' }}>
            <ButtonAppBar />
            <Link color='inherit' href="/home" underline="hover">
                <Typography style={{ fontWeight: 'bold', fontSize: '24px', marginLeft: '16px', marginTop: '10px' }}>Most Popular</Typography>
            </Link>
            {contentListview}
            <Link color='inherit' href="/home" underline="hover">
                <Typography style={{ fontWeight: 'bold', fontSize: '24px', marginLeft: '16px', marginTop: '10px' }}>Most Recent</Typography>
            </Link>
            {contentListnew}
        </Box>
    )
}