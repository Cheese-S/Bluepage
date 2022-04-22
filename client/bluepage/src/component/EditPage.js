import React, { useState, useRef } from 'react';
import { Stage, Layer, Line } from 'react-konva';
import { ChromePicker } from 'react-color';
import { Box, TextField, Button } from '@mui/material/';

import PanToolOutlinedIcon from '@mui/icons-material/PanToolOutlined';
import ModeOutlinedIcon from '@mui/icons-material/ModeOutlined';
import ClearIcon from '@mui/icons-material/Clear';
import InterestsOutlinedIcon from '@mui/icons-material/InterestsOutlined';
import CompareArrowsOutlinedIcon from '@mui/icons-material/CompareArrowsOutlined';
import TextIncreaseOutlinedIcon from '@mui/icons-material/TextIncreaseOutlined';
import ColorLensOutlinedIcon from '@mui/icons-material/ColorLensOutlined';

export default function EditPage() {
  const [tool, setTool] = useState('pen');
  const [lines, setLines] = useState([]);
  const [color, setColor] = useState('#000000')
  const [showColorPicker, setShowColorPicker] = useState(false);
  const isDrawing = useRef(false);

  const handleMouseDown = (e) => {
    isDrawing.current = true;
    const pos = e.target.getStage().getPointerPosition();
    setLines([...lines, { tool, points: [pos.x, pos.y] }]);
  };

  const handleMouseMove = (e) => {
    // no drawing - skipping
    if (!isDrawing.current) {
      return;
    }
    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    let lastLine = lines[lines.length - 1];
    // add point
    lastLine.points = lastLine.points.concat([point.x, point.y]);
    lastLine.color = color;

    // replace last
    lines.splice(lines.length - 1, 1, lastLine);
    setLines(lines.concat());
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
  };

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
        <Box style={{ width: '50%', height: '85%', marginTop: '10px' }}>
          <Box style={{ width: '380px', height: '570px', backgroundColor: '#ffffff', margin: 'auto'}}>
            <Stage
              width={380}
              height={570}
              onMouseDown={handleMouseDown}
              onMousemove={handleMouseMove}
              onMouseup={handleMouseUp}
            >
              <Layer>
                {lines.map((line, i) => (
                  <Line
                    key={i}
                    points={line.points}
                    stroke={line.color}
                    strokeWidth={5}
                    tension={0.5}
                    lineCap="round"
                    globalCompositeOperation={
                      line.tool === 'eraser' ? 'destination-out' : 'source-over'
                    }
                  />
                ))}
              </Layer>
            </Stage>
          </Box>
        </Box>
        <Box style={{ width: '15%', display: 'flex', flexDirection: 'column-reverse' }}>
          {showColorPicker ?
            <ChromePicker color={color} onChange={(color) => setColor(color.hex)} style={{ paddingBottom: '10px' }}/>
            : null}
        </Box>
        <Box style={{ display: 'flex', flexDirection: 'column', width: '5%', height: '100%', backgroundColor: '#9dc3ff', alignItems: 'center', justifyContent: 'space-around' }}>
          <PanToolOutlinedIcon style={{ fontSize: '40px' }}/>
          <ModeOutlinedIcon style={{ fontSize: '40px' }}/>
          <ClearIcon style={{ fontSize: '40px' }}/>
          <InterestsOutlinedIcon style={{ fontSize: '40px' }}/>
          <CompareArrowsOutlinedIcon style={{ fontSize: '40px' }}/>
          <TextIncreaseOutlinedIcon style={{ fontSize: '40px' }}/>
          <ColorLensOutlinedIcon onMouseDown={() => setShowColorPicker(!showColorPicker)} style={{ fontSize: '40px', color: showColorPicker ? color : '#000000', cursor: 'pointer' }}/>
        </Box>
      </Box>
    </>
  );
}