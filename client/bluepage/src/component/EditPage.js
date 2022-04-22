import React, { useState, useRef } from 'react';
import { Stage, Layer, Line } from 'react-konva';
import { ChromePicker } from 'react-color';
import { Box, TextField, Button } from '@mui/material/';

import PanToolIcon from '@mui/icons-material/PanToolOutlined';
import ModeIcon from '@mui/icons-material/ModeOutlined';
import ClearIcon from '@mui/icons-material/Clear';
import InterestsIcon from '@mui/icons-material/InterestsOutlined';
import CompareArrowsIcon from '@mui/icons-material/CompareArrowsOutlined';
import GrainIcon from '@mui/icons-material/Grain';
import ColorLensIcon from '@mui/icons-material/ColorLensOutlined';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

export default function EditPage() {
  const [lines, setLines] = useState([]);
  
  const [tool, setTool] = useState('pen');
  const [color, setColor] = useState('#000000')
  const [strokeWidth, setStrokeWidth] = useState(5);

  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showStrokeChooser, setShowStrokeChooser] = useState(false);
  const isDrawing = useRef(false);

  const hideAllPopups = () => {
    setShowColorPicker(false);
    setShowStrokeChooser(false);
  }

  const selectColorPicker = () => {
    hideAllPopups();
    setShowColorPicker(!showColorPicker);
  }

  const selectStrokeChooser = () => {
    hideAllPopups();
    setShowStrokeChooser(!showStrokeChooser);
  }

  const handleStrokeChange = (width) => {
    if (width <= 1) {
      setStrokeWidth(1);
    } else if (width >= 64) {
      setStrokeWidth(64);
    } else {
      setStrokeWidth(width);
    }
  }

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
    lastLine.strokeWidth = strokeWidth;

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
      <Box style={{ display: 'flex', flexDirection: 'row', height: '89.5%' }}>
        <Box style={{ display: 'flex', flexDirection: 'column', width: '30%', height: '100%', backgroundColor: '#9dc3ff' }}>
          <TextField value='Enter description here' style={{ height: '50%', margin: '10px' }}></TextField>
        </Box>
        <Box style={{ width: '50%', height: '85%', marginTop: '10px' }}>
          <Box style={{ width: '418px', height: '627px', backgroundColor: '#ffffff', margin: 'auto'}}>
            <Stage
              width={418}
              height={627}
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
                    strokeWidth={line.strokeWidth}
                    tension={0.5}
                    lineCap="square"
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
          {showStrokeChooser ? 
            <Box style={{ backgroundColor: 'white', borderRadius: '10px', display: 'flex', flexDirection: 'row', alignItems: 'center', marginRight: '10px' }}>
              <TextField label='minimum 1, maximum 64' type='number' fullWidth InputProps={{ inputProps: { min: 1, max: 64 } }} value={strokeWidth} onChange={(e) => handleStrokeChange(Number(e.target.value))} style={{ margin: '10px' }} />
            </Box>
          : null}
        </Box>
        <Box style={{ display: 'flex', flexDirection: 'column', width: '5%', height: '100%', backgroundColor: '#9dc3ff', alignItems: 'center', justifyContent: 'space-around' }}>
          <PanToolIcon style={{ fontSize: '40px', color: tool === 'pan' ? '#000000' : '#777777' }}/>
          <ModeIcon onClick={() => setTool('pen')} style={{ fontSize: '40px', color: tool === 'pen' ? '#000000' : '#777777', cursor: 'pointer' }}/>
          <ClearIcon onClick={() => setTool('eraser')} style={{ fontSize: '40px', color: tool === 'eraser' ? '#000000' : '#777777', cursor: 'pointer' }}/>
          <InterestsIcon style={{ fontSize: '40px', color: tool === 'shape' ? '#000000' : '#777777' }}/>
          <CompareArrowsIcon style={{ fontSize: '40px', color: tool === 'line' ? '#000000' : '#777777' }}/>
          <GrainIcon onClick={() => selectStrokeChooser()} style={{ fontSize: '40px', cursor: 'pointer' }}/>
          <ColorLensIcon onClick={() => selectColorPicker()} style={{ fontSize: '40px', color: showColorPicker ? color : '#000000', cursor: 'pointer' }}/>
        </Box>
      </Box>
    </>
  );
}