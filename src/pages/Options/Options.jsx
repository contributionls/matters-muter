import React, { Component } from 'react';
import './Options.css';
import CssBaseline from '@material-ui/core/CssBaseline';
import { HashRouter as Router } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import Home from './home';
class Options extends Component {
  render() {
    return (
      <React.Fragment>
        <CssBaseline />
        <Router>
          <Home />
        </Router>
        <ToastContainer
          autoClose={3000}
          position={toast.POSITION.BOTTOM_LEFT}
        />
      </React.Fragment>
    );
  }
}

export default Options;
