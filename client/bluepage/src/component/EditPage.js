import React, { useState, useRef } from 'react';
import { Stage, Layer, Line, Rect, Arrow } from 'react-konva';
import { ChromePicker } from 'react-color';
import { Box, TextField, Button } from '@mui/material/';

import PanToolIcon from '@mui/icons-material/PanToolOutlined';
import ModeIcon from '@mui/icons-material/ModeOutlined';
import ClearIcon from '@mui/icons-material/Clear';
import InterestsIcon from '@mui/icons-material/InterestsOutlined';
import CompareArrowsIcon from '@mui/icons-material/CompareArrowsOutlined';
import GrainIcon from '@mui/icons-material/Grain';
import ColorLensIcon from '@mui/icons-material/ColorLensOutlined';

export default function EditPage() {
  const [lines, setLines] = useState([]);
  const [shapes, setShapes] = useState([]);
  const [arrows, setArrows] = useState([]);
  const [title, setTitle] = useState('New Page');
  const [description, setDescription] = useState('');
  
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
    if (width <= 0) {
      setStrokeWidth(0);
    } else if (width >= 64) {
      setStrokeWidth(64);
    } else {
      setStrokeWidth(width);
    }
  }

  const handleMouseDown = (e) => {
    isDrawing.current = true;
    const pos = e.target.getStage().getPointerPosition();

    if (tool === 'pen' || tool === 'eraser') {
      setLines([...lines, { tool, points: [pos.x, pos.y], color: color, strokeWidth: strokeWidth }]);
    } else if (tool === 'shape') {
      setShapes([...shapes, { start_x: pos.x, start_y: pos.y, end_x: pos.x, end_y: pos.y, strokeColor: color, strokeWidth: strokeWidth }])
    } else if (tool === 'arrow') {
      setArrows([...arrows, { points: [pos.x, pos.y], color: color, strokeWidth: strokeWidth }]);
    }
  };

  const handleMouseMove = (e) => {
    // no drawing - skipping
    if (!isDrawing.current) {
      return;
    }

    const stage = e.target.getStage();
    const point = stage.getPointerPosition();

    if (tool === 'pen' || tool === 'eraser') {
      let lastLine = lines[lines.length - 1];
      // add point
      lastLine.points = lastLine.points.concat([point.x, point.y]);

      // replace last
      lines.splice(lines.length - 1, 1, lastLine);
      setLines(lines.concat());
    } else if (tool === 'shape') {
      let lastShape = shapes[shapes.length - 1];
      
      // set new end position
      lastShape.end_x = point.x;
      lastShape.end_y = point.y;

      // replace last
      shapes.splice(shapes.length - 1, 1, lastShape);
      setShapes(shapes.concat());
    } else if (tool === 'arrow') {
      let lastArrow = arrows[arrows.length - 1];
      // change end position
      lastArrow.points = [lastArrow.points[0], lastArrow.points[1], point.x, point.y];

      // replace last
      arrows.splice(arrows.length - 1, 1, lastArrow);
      setArrows(arrows.concat());
    }
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
  };

  return (
    <Box style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%'}}>
      <Box style={{ display: 'flex', flexDirection: 'row', height: '10%', alignItems: 'center', backgroundColor: '#9dc3ff' }} sx={{ borderBottom: 2 }}>
        <TextField value={title} onChange={(e) => setTitle(e.target.value)} placeholder='Enter title here...' style={{ marginLeft: '10px', width: '30%' }}></TextField>
        <Box style={{ alignItems: 'center', width: '70%', display: 'flex', flexDirection: 'row-reverse' }}>
          <Button variant='contained' style={{ marginRight: '10px' }}>Save and Exit</Button>
          <Button variant='contained' style={{ marginRight: '10px' }}>Save</Button>
        </Box>
      </Box>
      <Box style={{ display: 'flex', flexDirection: 'row', height: '90%' }}>
        <Box style={{ display: 'flex', flexDirection: 'column', width: '30%', height: '100%', backgroundColor: '#9dc3ff' }}>
          <TextField value={description} placeholder='Enter description here...' onChange={(e) => setDescription(e.target.value)} style={{ height: '50%', margin: '10px' }}></TextField>
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
        </Box>
        <Box style={{ width: '15%', display: 'flex', flexDirection: 'column-reverse' }}>
          {showColorPicker &&
            <Box style={{ display: 'flex', marginRight: '10px' }}>
              <ChromePicker color={color} onChange={(color) => setColor(color.hex)} style={{ paddingBottom: '10px' }}/>
            </Box>
          }
          {showStrokeChooser &&
            <Box style={{ backgroundColor: 'white', borderRadius: '10px', display: 'flex', flexDirection: 'row', marginRight: '10px' }}>
              <TextField label='minimum 0, maximum 64' type='number' fullWidth InputProps={{ inputProps: { min: 0, max: 64 } }} value={strokeWidth} onChange={(e) => handleStrokeChange(Number(e.target.value))} style={{ margin: '10px' }} />
            </Box>
          }
        </Box>
        <Box style={{ display: 'flex', flexDirection: 'column', width: '5%', height: '100%', backgroundColor: '#9dc3ff', alignItems: 'center', justifyContent: 'space-around' }}>
          <PanToolIcon style={{ fontSize: '40px', color: tool === 'pan' ? '#000000' : '#777777' }}/>
          <ModeIcon onClick={() => setTool('pen')} style={{ fontSize: '40px', color: tool === 'pen' ? '#000000' : '#777777', cursor: 'pointer' }}/>
          <ClearIcon onClick={() => setTool('eraser')} style={{ fontSize: '40px', color: tool === 'eraser' ? '#000000' : '#777777', cursor: 'pointer' }}/>
          <InterestsIcon onClick={() => setTool('shape')} style={{ fontSize: '40px', color: tool === 'shape' ? '#000000' : '#777777', cursor: 'pointer' }}/>
          <CompareArrowsIcon onClick={() => setTool('arrow')} style={{ fontSize: '40px', color: tool === 'arrow' ? '#000000' : '#777777', cursor: 'pointer' }}/>
          <GrainIcon onClick={() => selectStrokeChooser()} style={{ fontSize: '40px', cursor: 'pointer' }}/>
          <ColorLensIcon onClick={() => selectColorPicker()} style={{ fontSize: '40px', color: showColorPicker ? color : '#000000', cursor: 'pointer' }}/>
        </Box>
      </Box>
    </Box>
  );
}