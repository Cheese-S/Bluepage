import React, { useEffect, useRef, useState } from 'react';
import { Box } from '@mui/material/';
import { ButtonAppBar } from './NavBar';
import { SearchViewCard } from './SearchViewCard';
import { useParams } from 'react-router-dom';
import { userStore } from '../store/UserStore';
import { getContentPage } from '../api/api';
import { CONTENT_TYPE } from "../constant";

export default function SearchPage(){
    const { sortmode,searchmode,searchstring,Page } = useParams();
    const siteMode = userStore(state => state.siteMode);
    const [contentList, setContentList] = useState(null);

    useEffect(() => {
        const getcontent = async () =>{
            try {
                let querry={};
                let searchs=""
                if(searchmode==0){
                    querry={'published':true,'title': searchs};
                    if(searchstring=="-"){ querry={'published':true};}
                }
                if(searchmode==1){
                    querry={'published':true,'author.name': searchs};
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
                    content = await getContentPage(siteMode, querry,{"sort[updatedAt]": -1,"limit":99} );
                }
                if(sortmode==1){
                    content = await getContentPage(siteMode, querry,{"sort[views]": -1,"limit":99} );
                }
                if(sortmode==2){
                    content = await getContentPage(siteMode, querry,{"sort[likes]": -1,"limit":99} );
                }
                if(sortmode==3){
                    content = await getContentPage(siteMode, querry,{"sort[updatedAt]": 1,"limit":99} );
                }
                let list = content.data.result.docs;
                const listOfContentview =
                <Box style={{ display: 'flex', flexDirection: 'column' }}>
                    {siteMode === CONTENT_TYPE.COMIC ? 
                        list.map((comic) => (
                            <SearchViewCard id={comic._id} type={siteMode} key={comic._id} />
                        ))
                    :
                        list.map((story) => (
                            <SearchViewCard id={story._id} type={siteMode} key={story._id} />
                        ))
                    }
                </Box>;
                setContentList(listOfContentview);
            }  catch(err){
                console.log(err);
            }
        }
        getcontent();
    }, []);
    return (
        <Box style={{ backgroundColor: '#3c78d8', alignItems: 'center', justifyContent: 'center' }}>
            <ButtonAppBar/>
            <Box style={{ padding: '20px' }} />
            <Box style={{ display: 'flex', flexDirection: 'column' }}>
                {contentList}
            </Box>
        </Box>
    );
}
