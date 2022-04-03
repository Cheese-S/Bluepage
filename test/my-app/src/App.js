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
import {  init_users, current_test } from './test_user_controller'; 



const App =() => {
  const [open, setOpen] = React.useState(false);
  const [File, setFile] = React.useState(null);

  const handleInitUser = () => {
    init_users();
  };
  
  const handleTestUser = () => {
    current_test();
  };

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
            'testc':()=>handletest(),
            'initu':()=>handleInitUser(),
            'testu':()=>handleTestUser()
          }}
            msg='Backend Testing'
            watchConsoleLogging 
            />
      <Dialog open={open} onClose={handleClose}>
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
