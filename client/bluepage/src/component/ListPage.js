import React, { useEffect ,useState} from 'react';
import { Box, Typography, Button, TextField } from '@mui/material/';
import ContentBlurb from '../subcomponents/ContentBlurb';
import SubcontentListing from '../subcomponents/SubcontentListing';
import Comment from '../subcomponents/Comment';
import { useParams } from 'react-router-dom';
import { getContentById } from '../api/api';
import { SUBCONTENT_TYPE} from "../constant";


export default function ListPage(){
    const { id,type } = useParams();
    let typee="";
    if(type=="story"){
        typee=SUBCONTENT_TYPE.CHAPTER;
    }
    else{
        typee=SUBCONTENT_TYPE.PAGE;
    }
    const [list, setlist] = useState(null);
    let sublist = "";
    if(list){
        sublist= list.map((list) => <SubcontentListing id={list.subcontent._id} type={typee}/>);
    }
    useEffect(() => {
        const getcontent = async () =>{
            try{
                const res = await getContentById(type,id);
                setlist(res.data.content.contentList);
            } 
            catch(err){
                console.log(err);
            }
        }
        getcontent();
    },[]);
    return (
        <Box style={{ backgroundColor: '#3c78d8', alignItems: 'center', justifyContent: 'center' }}>
            <Box style={{ width: '90%', margin: 'auto', paddingTop: '10px', paddingBottom: '10px' }}>
                <ContentBlurb />
            </Box>
            <Box style={{ backgroundColor: '#ffffff', width: '90%', margin: 'auto', paddingTop: '10px' }}>
                <Box style={{ width: '98%', margin: 'auto'}}>
                {sublist}
                    <hr style={{ color: 'black', backgroundColor: 'black', height: 1}} />
                    <Typography style={{ fontSize: '18px', paddingTop: '5px', paddingBottom: '20px' }}>Leave a comment...</Typography>
                    <Box style={{ display: 'flex', flexDirection: 'row', paddingBottom: '20px' }}>
                        <Box style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: '#aaaa00' }}></Box>
                        <Box style={{ paddingRight: '20px' }}/>
                        <Box style={{ display: 'flex', flexDirection: 'column', width: '90%' }}>
                            <TextField fullWidth placeholder='Add a comment...' style={{ paddingBottom: '10px'}}/>
                            <Button variant='contained' sx={{ width: '7%', alignSelf: 'flex-end' }}>Submit</Button>
                        </Box>
                    </Box>
                    <Box style={{ display: 'flex', flexDirection: 'row-reverse', paddingBottom: '20px', width: '90%' }}>
                        
                    </Box>
                    <Comment/>
                </Box>
            </Box>
        </Box>
    );
}
