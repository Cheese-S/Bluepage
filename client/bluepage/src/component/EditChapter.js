import React from 'react';
import { Box, TextField, Button } from '@mui/material/';
import { Editor } from "react-draft-wysiwyg";
import { EditorState } from 'draft-js';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

export default function EditChapter() {
    const editorState = EditorState.createEmpty();

    return (
        <>
            <Box style={{ display: 'flex', flexDirection: 'row', height: '10%', alignItems: 'center', backgroundColor: '#9dc3ff' }} sx={{ borderBottom: 2 }}>
                <TextField value='Unpublished Page Title' style={{ marginLeft: '10px', width: '30%' }}></TextField>
                <Box style={{ alignItems: 'center', width: '70%', display: 'flex', flexDirection: 'row-reverse' }}>
                    <Button variant='contained' style={{ marginRight: '10px' }}>Save and Exit</Button>
                    <Button variant='contained' style={{ marginRight: '10px' }}>Save</Button>
                </Box>
            </Box>
            <Box style={{ display: 'flex', flexDirection: 'row', height: '90%' }}>
                <Box style={{ display: 'flex', flexDirection: 'column', width: '30%', height: '100%', backgroundColor: '#9dc3ff' }}>
                    <TextField value='Enter description here' style={{ height: '50%', margin: '10px' }}></TextField>
                </Box>
                <Box style={{ width: '50%', height: '85%', marginTop: '10px', marginLeft: '16px'}}>
                    <Box style={{ width: '950px', height: '690px', backgroundColor: '#ffffff', margin: 'auto' }}>
                        <Editor
                            editorState={editorState}
                            toolbarClassName="toolbarClassName"
                            wrapperClassName="wrapperClassName"
                            editorClassName="editorClassName"
                        />
                    </Box>
                </Box>
                <Box style={{ width: '15%' }} />
            </Box>
        </>
    );
}