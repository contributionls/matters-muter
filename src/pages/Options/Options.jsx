import React, { Component } from 'react';
import './Options.css';
import CssBaseline from '@material-ui/core/CssBaseline';
import { HashRouter as Router } from 'react-router-dom';
import Home from './home';

class Options extends Component {
  render() {
    return (
      <React.Fragment>
        <CssBaseline />
        <Router>
          <Home />
        </Router>
      </React.Fragment>
    );
  }
}

export default Options;
