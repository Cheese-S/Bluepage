import React, { useState, useRef, useEffect } from 'react';
import { Stage, Layer, Line, Rect, Arrow } from 'react-konva';
import { ChromePicker } from 'react-color';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, TextField, Button, Typography } from '@mui/material/';
import kTPS, { AddItem_Transaction } from '../kTPS/kTPS';
import { getContentById, getSubcontentByID, updateSubContent, updateContent, publishSubContent } from '../api/api';
import { CONTENT_TYPE, SUBCONTENT_TYPE } from '../constant';

import ModeIcon from '@mui/icons-material/ModeOutlined';
import ClearIcon from '@mui/icons-material/Clear';
import InterestsIcon from '@mui/icons-material/InterestsOutlined';
import CompareArrowsIcon from '@mui/icons-material/CompareArrowsOutlined';
import GrainIcon from '@mui/icons-material/Grain';
import ColorLensIcon from '@mui/icons-material/ColorLensOutlined';
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';

const tps = new kTPS();

export default function EditPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [parentID, setParentID] = useState(''); 

  const [lines, setLines] = useState([]);
  const [shapes, setShapes] = useState([]);
  const [arrows, setArrows] = useState([]);

  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  const [title, setTitle] = useState('New Page');
  const [messageToUser, setMessageToUser] = useState('');
  
  const [tool, setTool] = useState('pen');
  const [color, setColor] = useState('#000000')
  const [strokeWidth, setStrokeWidth] = useState(5);

  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showStrokeChooser, setShowStrokeChooser] = useState(false);
  const isDrawing = useRef(false);

  useEffect(() => {
    const getPage = async() => {
      try {
        const res = await getSubcontentByID(id, SUBCONTENT_TYPE.PAGE);

        // load in data from the body
        setTitle(res.data.subcontent.title);
        setLines(res.data.subcontent.body.lines);
        setShapes(res.data.subcontent.body.shapes);
        setArrows(res.data.subcontent.body.arrows);
        setParentID(res.data.subcontent.parentID);

      } catch (err) {
        // Probably unauthorized - kick out
        console.log(err);
        navigate(`/home/test`);
      }
    }
    getPage();
  }, []);

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

  const updateUndoRedo = () => {
    setCanUndo(tps.hasTransactionToUndo());
    setCanRedo(tps.hasTransactionToRedo());
  }

  const handleUndo = () => {
    tps.undoTransaction();
    updateUndoRedo();
  }

  const handleRedo = () => {
    tps.doTransaction();
    updateUndoRedo();
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

    /**
     * Process of adding a transaction:
     * 1) Remove the new object from its respective array. This preserves the illusion
     * of it being drawn 'live', but now we need it to be added as a transaction.
     * 2) Create a new AddItem_Transaction for that item for add events. Clear the newObject hook.
     * 3) Add the transaction to kTPS.
     * 4) Do the transaction.
     */
    if (tool === 'pen' || tool === 'eraser') {
      const newObject = lines.pop();
      setLines(lines.concat());

      const transaction = new AddItem_Transaction(lines, setLines, newObject);

      tps.addTransaction(transaction);
    } else if (tool === 'shape') {
      const newObject = shapes.pop();
      setShapes(shapes.concat());

      const transaction = new AddItem_Transaction(shapes, setShapes, newObject);

      tps.addTransaction(transaction);
    } else if (tool === 'arrow') {
      const newObject = arrows.pop();
      setArrows(arrows.concat());

      const transaction = new AddItem_Transaction(arrows, setArrows, newObject);

      tps.addTransaction(transaction);
    }

    updateUndoRedo();
    
  };

  const savePage = async () => {
    const newBody = {
      lines,
      shapes,
      arrows
    };
    try {
      await updateSubContent(SUBCONTENT_TYPE.PAGE, id, title, newBody, false, parentID);
      const rightNow = new Date();
      setMessageToUser(`Saved! at ${rightNow.toLocaleTimeString()}`);
    } catch (err) {
      // Could be connection issues - don't immediately kick out, wouldn't want to lose important data
      setMessageToUser('Something went wrong - please try again.');
    }
  }
  
  const saveAndExit = async () => {
    try {
      await savePage();
      navigate(`/list/${parentID}/comic`);
    } catch (err) {
      // Could be connection issues - don't immediately kick out, wouldn't want to lose important data
      setMessageToUser('Something went wrong - please try again.');
    }
  }

  const publish = async () => {
    try {
      // Might have to publish the parent comic too - retrieve it
      const parentRes = await getContentById(CONTENT_TYPE.COMIC, parentID);
      const parent = parentRes.data.content;

      // First, save this current page
      await savePage();

      if (parent.published) {
        await publishSubContent(SUBCONTENT_TYPE.PAGE, [id], parentID);
      } else {
        await updateContent(CONTENT_TYPE.COMIC, parent.title, parent.description, parent._id, [id], true, parent.tags); 
      }
      
      // Last, navigate back to the list page
      navigate(`/list/${parentID}/comic`);
    } catch (err) { 
      // Could be connection issues - don't immediately kick out, wouldn't want to lose important data
      setMessageToUser('Something went wrong - please try again.');
    }
  }

  return (
    <Box style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%'}}>
      <Box style={{ display: 'flex', flexDirection: 'row', height: '10%', alignItems: 'center', backgroundColor: '#9dc3ff' }} sx={{ borderBottom: 2 }}>
        <TextField value={title} onChange={(e) => setTitle(e.target.value)} placeholder='Enter title here...' style={{ marginLeft: '10px', width: '30%' }}></TextField>
        <Box style={{ alignItems: 'center', width: '40%', display: 'flex', flexDirection: 'row-reverse', padding: '10px' }}>
          <Button disabled={!canRedo} onClick={handleRedo} >
            <RedoIcon style={{ fontSize: '40px' }} />
          </Button>
          <Button disabled={!canUndo} onClick={handleUndo} >
            <UndoIcon style={{ fontSize: '40px', marginRight: '20px' }} />
          </Button>
        </Box>
        <Box style={{ alignItems: 'cx enter', width: '30%', display: 'flex', flexDirection: 'row-reverse' }}>
          <Button onClick={() => publish()} variant='contained' style={{ marginRight: '10px' }}>Publish</Button>
          <Button onClick={() => saveAndExit()} variant='contained' style={{ marginRight: '10px' }}>Save and Exit</Button>
          <Button onClick={() => savePage()} variant='contained' style={{ marginRight: '10px' }}>Save</Button>
        </Box>
      </Box>
      <Box style={{ display: 'flex', flexDirection: 'row', height: '90%' }}>
        <Box style={{ display: 'flex', flexDirection: 'column', width: '30%', height: '100%', backgroundColor: '#9dc3ff' }} >
          <Typography style={{ margin: '10px', fontSize: '18px', fontWeight: 'bold' }}>{messageToUser}</Typography>
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
          <ModeIcon onClick={() => setTool('pen')} style={{ fontSize: '40px', color: tool === 'pen' ? '#000000' : '#777777', cursor: 'pointer' }}/>
          <ClearIcon onClick={() => setTool('eraser')} style={{ fontSize: '40px', color: tool === 'eraser' ? '#000000' : '#777777', cursor: 'pointer' }}/>
          <InterestsIcon onClick={() => setTool('shape')} style={{ fontSize: '40px', color: tool === 'shape' ? '#000000' : '#777777', cursor: 'pointer' }}/>
          <CompareArrowsIcon onClick={() => setTool('arrow')} style={{ fontSize: '40px', color: tool === 'arrow' ? '#000000' : '#777777', cursor: 'pointer' }}/>
          <GrainIcon onClick={() => selectStrokeChooser()} style={{ fontSize: '40px', cursor: 'pointer' }}/>
          <ColorLensIcon onClick={() => selectColorPicker()} style={{ fontSize: '40px', color: color, cursor: 'pointer' }}/>
        </Box>
      </Box>
    </Box>
  );
}