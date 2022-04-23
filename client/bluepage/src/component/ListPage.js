import React, { useEffect ,useState} from 'react';
import { Box, Typography, Button, TextField } from '@mui/material/';
import ContentBlurb from '../subcomponents/ContentBlurb';
import SubcontentListing from '../subcomponents/SubcontentListing';
import Comment from '../subcomponents/Comment';
import { useParams, useNavigate } from 'react-router-dom';
import { getContentById, createNewSubcontent } from '../api/api';
import { userStore } from '../store/UserStore';
import { SUBCONTENT_TYPE} from "../constant";


export default function ListPage() {
    const navigate = useNavigate();

    const { id, type } = useParams();
    const subtype = (type == 'story') ? SUBCONTENT_TYPE.CHAPTER : SUBCONTENT_TYPE.PAGE;

    const selfID = userStore(state => state.id);
    const [sameUser, setSameUser] = useState(false);
    
    const [list, setlist] = useState([]);
    let sublist = "";
    if(list){
        sublist= list.map((list) => <SubcontentListing id={list.subcontent._id} type={subtype}/>);
    }

    useEffect(() => {
        const getcontent = async () =>{
            try{
                const res = await getContentById(type, id);
                setlist(res.data.content.contentList);
            } 
            catch(err){
                console.log(err);
            }
        }
        getcontent();
    }, []);

    const createNewPage = async () => {
        const emptyBody = {
            lines: [],
            shapes: [],
            arrows: []
        };
        const res = await createNewSubcontent(id, subtype, 'Untitled Page', emptyBody);
        const pageID = res.data.subcontent._id;

        navigate(`/${subtype}/edit/${pageID}`);
    }

    return (
        <Box style={{ backgroundColor: '#3c78d8', alignItems: 'center', justifyContent: 'center' }}>
            <Box style={{ width: '90%', margin: 'auto', paddingTop: '10px', paddingBottom: '10px' }}>
                <ContentBlurb />
            </Box>
            <Box style={{ backgroundColor: '#ffffff', width: '90%', margin: 'auto', paddingTop: '10px' }}>
                <Box style={{ display: 'flex', flexDirection: 'row' }}>
                    <Button onClick={() => createNewPage()} variant='contained' style={{ margin: '10px' }}>Create New Page</Button>
                </Box>
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
