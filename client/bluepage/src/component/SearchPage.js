import React, { useEffect, useRef, useState } from 'react';
import { Box } from '@mui/material/';
import { ButtonAppBar } from './NavBar';
import { SearchViewCard } from './SearchViewCard';
import { useParams } from 'react-router-dom';
import { userStore } from '../store/UserStore';
import { getContentPage } from '../api/api';
import { CONTENT_TYPE } from "../constant";

export default function SearchPage(){
    const { sortmode,searchmode,searchstring } = useParams();
    const siteMode = userStore(state => state.siteMode);
    const [contentList, setContentList] = useState(null);

    useEffect(() => {
        const getcontent = async () =>{
            try {
                let querry={};
                if(searchmode==0){
                    querry={'published':true,'title': searchstring};
                }
                else{
                    querry={'published':true,'author.name': searchstring};
                }
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
                if(searchstring=="-"){}
                else{
                    if(searchmode==0){
                        let key = 'title';
                        list = list.filter(o => 
                            o[key].toLowerCase().includes(searchstring.toLowerCase()));
                    }
                    else{
                        let key = 'author';
                        list = list.filter(o => 
                            o[key].name.toLowerCase().includes(searchstring.toLowerCase()));
                    }
                }
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
