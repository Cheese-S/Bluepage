import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, TextField } from '@mui/material/';
import ContentBlurb from '../subcomponents/ContentBlurb';
import Comment from '../subcomponents/Comment';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';
import { useParams } from 'react-router-dom';
import {getSubcontentByID } from '../api/api';
import { Stage, Layer, Line, Rect, Arrow } from 'react-konva';


export default function ViewComicPage(){
    const { id } = useParams();
    const [title, settitle] = useState(null);
    const [lines, setLines] = useState([]);
    const [shapes, setShapes] = useState([]);
    const [arrows, setArrows] = useState([]);
    useEffect(() => {
        const getcontent = async () =>{
            try{
                const res = await getSubcontentByID(id,"page");
                settitle(res.data.subcontent.title);
                if(res.data.subcontent.body.lines){
                setLines(res.data.subcontent.body.lines);
                }
                if(res.data.subcontent.body.shapes){
                setShapes(res.data.subcontent.body.shapes);
                }
                if(res.data.subcontent.body.arrows){
                setArrows(res.data.subcontent.body.arrows);
                }
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
            <Box style={{ width: '90%', margin: 'auto' }}>
                <Box style={{ backgroundColor: '#ffffff', padding: '10px' }}>
                    <Typography align='center' style={{ fontWeight: 'bold', fontSize: '20px' }}>{title}</Typography>
                </Box>
            </Box>
            <Box style={{ width: '418px', height: '627px', backgroundColor: '#ffffff', margin: 'auto', marginTop: '10px'}}>
            <Stage
              width={418}
              height={627}
            >
              <Layer>
                {shapes.map((shape, i) => (
                  <Rect 
                    key={`rect_${i}`}
                    x={shape.start_x}
                    y={shape.start_y}
                    width={shape.end_x - shape.start_x}
                    height={shape.end_y - shape.start_y}
                    stroke={shape.strokeColor}
                    strokeWidth={shape.strokeWidth}
                  />
                ))}
                
              </Layer>
              <Layer>
              {arrows.map((arrow, i) => (
                  <Arrow
                    key={`arrow_${i}`}
                    points={arrow.points}
                    stroke={arrow.color}
                    strokeWidth={arrow.strokeWidth}
                    tension={1}
                  />
                ))}
              </Layer>
              <Layer>
              {lines.map((line, i) => (
                  <Line
                    key={`line_${i}`}
                    points={line.points}
                    stroke={line.color}
                    strokeWidth={line.strokeWidth}
                    tension={0.5}
                    lineCap='round'
                    globalCompositeOperation={
                      line.tool === 'eraser' ? 'destination-out' : 'source-over'
                    }
                  />
                ))}
              </Layer>
            </Stage>
          </Box>
            <Box style={{ width: '90%', margin: 'auto', paddingTop: '10px'}}/>
            <Box style={{ backgroundColor: '#ffffff', width: '90%', margin: 'auto', paddingTop: '10px' }}>
                <Box style={{ width: '98%', margin: 'auto'}}>
                    <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                    </Box>
                    <Typography style={{ fontSize: '18px', paddingTop: '5px', paddingBottom: '20px' }}>Leave a comment...</Typography>
                    <Box style={{ display: 'flex', flexDirection: 'row', paddingBottom: '20px' }}>
                        <Box style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: '#aaaa00' }}></Box>
                        <Box style={{ paddingRight: '20px' }}/>
                        <Box style={{ display: 'flex', flexDirection: 'column', width: '90%' }}>
                            <TextField fullWidth placeholder='Add a comment...' style={{ paddingBottom: '10px'}}/>
                            <Button variant='contained' sx={{ width: '7%', alignSelf: 'flex-end' }}>Submit</Button>
                        </Box>
                    </Box>
                    <Box style={{ paddingBottom: '20px', width: '90%' }}>
                        
                    </Box>
                    <Comment/>
                </Box>
            </Box>
        </Box>
    );
}
