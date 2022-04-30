import React,{useState, useEffect} from 'react';
import { Box, TextField, Button } from '@mui/material/';
import { Editor } from "react-draft-wysiwyg";
import { useParams, useNavigate } from 'react-router-dom';
import { EditorState ,convertToRaw,convertFromHTML,ContentState,compositeDecorator,convertFromRaw} from 'draft-js';
import { getSubcontentByID,updateSubContent,publishSubContent,getContentById,updateContent } from '../api/api';
import { CONTENT_TYPE, SUBCONTENT_TYPE } from '../constant';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

export default function EditChapter() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [editorState, setEditorState] = useState(
        () => EditorState.createEmpty(),
      );
    const [title, setTitle] = useState('New Chapter');
    const [parentID, setParentID] = useState(''); 


    useEffect(() => {
        const getChapter = async() => {
          try {
            const res = await getSubcontentByID(id, SUBCONTENT_TYPE.CHAPTER);
            setParentID(res.data.subcontent.parentID);

            // load in data from the body
            if(res.data.subcontent.body.v){
                const blocksFromRaw = convertFromRaw(res.data.subcontent.body.v);
                setEditorState(EditorState.createWithContent(
                    blocksFromRaw ,
                    compositeDecorator,
                ));
            }

    
          } catch (err) {
            // Probably unauthorized - kick out
            console.log(err);
            navigate(`/home/test`);
          }
        }
        getChapter();
      }, []);

    const Save  =  async() =>{
        const blocks = convertToRaw(editorState.getCurrentContent());
        let value={v: blocks};
        try{
        const req= await updateSubContent(SUBCONTENT_TYPE.CHAPTER, id, title, value, false, parentID);
        }
        catch (err){
            console.log(err);
        }
    }

    const Savee  =  async() =>{
        Save();
        navigate(`/list/${parentID}/story`);
    }

    const publish = async () => {
        try {
          // Might have to publish the parent comic too - retrieve it
          const parentRes = await getContentById(CONTENT_TYPE.STORY, parentID);
          const parent = parentRes.data.content;
    
          // First, save this current page
          await Save();
    
          if (parent.published) {
            await publishSubContent(SUBCONTENT_TYPE.CHAPTER, [id], parentID);
          } else {
            await updateContent(CONTENT_TYPE.STORY, parent.title, parent.description, parent._id, [id], true, parent.tags); 
          }
          
          // Last, navigate back to the list page
          navigate(`/list/${parentID}/story`);
        } catch (err) { 
            console.log(err);
            }
      }

    return (
        <>
            <Box style={{ display: 'flex', flexDirection: 'row', height: '10%', alignItems: 'center', backgroundColor: '#9dc3ff' }} sx={{ borderBottom: 2 }}>
            <TextField value={title} onChange={(e) => setTitle(e.target.value)} placeholder='Enter title here...' style={{ marginLeft: '10px', width: '30%' }}></TextField>
                <Box style={{ alignItems: 'center', width: '70%', display: 'flex', flexDirection: 'row-reverse' }}>
                <Button onClick={() => publish()} variant='contained' style={{ marginRight: '10px' }}>Publish</Button>
                    <Button variant='contained' onClick={() => {Savee()}}style={{ marginRight: '10px' }}>Save and Exit</Button>
                    <Button variant='contained' onClick={() => {Save()}} style={{ marginRight: '10px' }}>Save</Button>
                </Box>
            </Box>
            <Box style={{ display: 'flex', flexDirection: 'row', height: '90%' }}>
                <Box style={{ width: '100%', height: '85%', marginTop: '10px', marginLeft: '16px'}}>
                    <Box style={{ width: '1450px', height: '690px', backgroundColor: '#ffffff', margin: 'auto' }}>
                        <Editor
                            editorState={editorState}
                            onEditorStateChange={setEditorState}
                            editorStyle={{ margin: '10px' }}
                        />
                    </Box>
                </Box>
                <Box style={{ width: '15%' }} />
            </Box>
        </>
    );
}