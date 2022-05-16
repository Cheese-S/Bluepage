import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material/';
import { ButtonAppBar } from './NavBar';
import { SearchViewCard } from './SearchViewCard';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { userStore } from '../store/UserStore';
import { getContentPage } from '../api/api';

export default function SearchPage(){
    const history = useNavigate();
    const { sortmode,searchmode,searchstring,page } = useParams();
    let pagenum=Number(page)+1;
    const siteMode = userStore(state => state.siteMode);
    const [pagination, setpagination] = useState(null);
    const [contentList, setContentList] = useState(null);

    useEffect(() => {
        const getcontent = async () =>{
            try {
                let querry={};
                if(searchmode==0){
                    querry={'published':true,'title': searchstring};
                    if(searchstring=="-"){ querry={'published':true};}
                }
                if(searchmode==1){
                    querry={'published':true,'author.name': searchstring};
                    if(searchstring=="-"){ querry={'published':true};}
                }
                if(searchmode==2){querry={'published':true,'tags': "Sci-fi"};}
                if(searchmode==3){querry={'published':true,'tags': "Fantasy"};}
                if(searchmode==4){querry={'published':true,'tags': "Comedy"};}
                if(searchmode==5){querry={'published':true,'tags': "Action"};}
                if(searchmode==6){querry={'published':true,'tags': "Adventure"};}
                if(searchmode==7){querry={'published':true,'tags': "Romance"};}
                if(searchmode==8){querry={'published':true,'tags': "Mystery"};}
                let content=null;
                if(sortmode==0){
                    content = await getContentPage(siteMode, querry,{"sort[updatedAt]": -1,"limit":10,"page":pagenum });
                }
                if(sortmode==1){
                    content = await getContentPage(siteMode, querry,{"sort[views]": -1,"limit":10,"page":pagenum} );
                }
                if(sortmode==2){
                    content = await getContentPage(siteMode, querry,{"sort[likes]": -1,"limit":10,"page":pagenum} );
                }
                if(sortmode==3){
                    content = await getContentPage(siteMode, querry,{"sort[updatedAt]": 1,"limit":10,"page":pagenum} );
                }
                let list = content.data.result.docs;
                console.log(content.data.result.totalPages);
                const pagenationoption =    
                <Pagination count={content.data.result.totalPages}
                    page={pagenum}
                    siblingCount={1}
                    boundaryCount={2}
                    variant="outlined"
                    shape="rounded"
                    onChange={handlepageswitch}
                />;
                setpagination(pagenationoption);
                const listOfContentview =
                <Box style={{ display: 'flex', flexDirection: 'column' }}>
                    {list.length > 0 ? list.map((content) => (
                        <SearchViewCard id={content._id} type={siteMode} key={content._id} />
                    ))
                    :
                        <>
                            <Typography style={{ fontWeight: 'bold', fontSize: 32, marginLeft: 16 }}>
                                Whoops! Looks like there are no results.
                            </Typography>
                            <Typography style={{ fontSize: 24, marginLeft: 16 }}>
                                Try searching for something else.
                            </Typography>
                        </>
                    }
                </Box>;
                setContentList(listOfContentview);
            }  catch(err){
                console.log(err);
            }
        }
        getcontent();
    }, []);

    const handlepageswitch  = (event,value) => {
        var his = `/search/${sortmode}/${searchmode}/${searchstring}/${value-1}`
        history(his);
        window.location.reload();
    };
    return (
        <Box style={{ backgroundColor: '#3c78d8', alignItems: 'center', justifyContent: 'center' }}>
            <ButtonAppBar/>
            <Box style={{ padding: '20px' }} />
            <Box style={{ display: 'flex', flexDirection: 'column' }}>
                {contentList}
                <Stack spacing={2}>
                    {pagination}
                </Stack>
            </Box>
        </Box>
    );
}
