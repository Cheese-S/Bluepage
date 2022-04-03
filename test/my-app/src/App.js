import './App.css';                                     
import Terminal from 'terminal-in-react';
import { initlize,test_content,continuetest} from './test_content_controller';
import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";



const App =() => {
  const [open, setOpen] = React.useState(false);
  const [File, setFile] = React.useState(null);

  const handleClose = () => {
    setOpen(false);
    continuetest(File);
  };

  const handleinit=()=>{
    initlize();
  }
  
  const handletest=()=>{
    test_content();
    console.log("waiting for file selection..........................");
    setOpen(true);
  }

    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh"
        }}
      >
        <Terminal
          color='green'
          backgroundColor='black'
          barColor='black'
          style={{ fontWeight: "bold", fontSize: "1em" }}
          commands={{
            'init':()=>handleinit() ,
            'testc':()=>handletest()              
            }}
          msg='Backend Testing'
          watchConsoleLogging 
        />
        <Dialog
        open={open}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{"Please selecte a file"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            <input type="file" name="file" accept="image/png" onChange={(e) => setFile(e.target.files[0])} />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Submit</Button>
        </DialogActions>
      </Dialog>
      </div>
    );
}

export default App;
