import logo from './logo.svg';
import './App.css';

import { render } from 'react-dom';
import { Component } from 'react';
import Terminal from 'terminal-in-react';
import { initlize,test_content} from './test_content_controller';

const handleinit=()=>{
  initlize();
}

const handletest=()=>{
  test_content();
}

class App extends Component {
  intro = () => "My name is Foo!"


  render () {
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
      </div>
    );
  }
}

export default App;
