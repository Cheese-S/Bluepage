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
                const viewcontent = await getContentPage(siteMode, {'published':true}, {"sort[views]": -1,"limit":5} );
                const newcontent = await getContentPage(siteMode, {'published':true}, {"sort[updatedAt]": -1,"limit":5} );
                const listOfContentview =
                <Grid container>
                    {viewcontent.data.result.docs.length > 0 ?
                        viewcontent.data.result.docs.map((content) => (
                            <Grid item xs={2} style={{ marginLeft: 16, marginBottom: 16 }}>
                                <ViewCard id={content._id} type={siteMode} key={content._id} />
                            </Grid>
                        ))
                    :
                        <Grid item xs={2} style={{ marginLeft: 16 }}>
                            <Typography>
                                There are no published items yet.
                            </Typography>
                        </Grid>
                    }
                </Grid >;
                const listOfContentnew =
                <Grid container>
                    {newcontent.data.result.docs.length > 0 ?
                        newcontent.data.result.docs.map((content) => (
                            <Grid item xs={2} style={{ marginLeft: 16, marginBottom: 16, overflowX: 'auto' }}>
                                <ViewCard id={content._id} type={siteMode} key={content._id} />
                            </Grid>
                        ))
                    :
                        <Grid item xs={2} style={{ marginLeft: 16 }}>
                            <Typography>
                                Try making your own!
                            </Typography>
                        </Grid>
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
            <Link color='inherit' href="/search/1/0/-" underline="hover">
                <Typography style={{ fontWeight: 'bold', fontSize: '24px', marginLeft: '16px', marginTop: '10px' }}>Most Popular</Typography>
            </Link>
            <Box style={{ width: '100%' }}>
                {contentListview}
            </Box>
            <Link color='inherit' href="/search/0/0/-" underline="hover">
                <Typography style={{ fontWeight: 'bold', fontSize: '24px', marginLeft: '16px', marginTop: '10px' }}>Most Recent</Typography>
            </Link>
            <Box style={{ width: '100%' }}>
                {contentListnew}
            </Box>
        </Box>
    )
}