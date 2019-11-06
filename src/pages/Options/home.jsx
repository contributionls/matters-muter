import React, { Component } from 'react';
import { HashRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  main: {},
}));
export default function CenteredGrid() {
  const classes = useStyles();

  return (
    <Router className={classes.root}>
      <div>
        <header>
          <nav>
            <section>
              <p>Matters Muter</p>
            </section>
          </nav>
        </header>
        <hr />
        <Grid className={classes.main} container spacing={3}>
          <Grid item xs={12} md={2} lg={2}>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/about">About</Link>
              </li>
              <li>
                <Link to="/dashboard">Dashboard</Link>
              </li>
            </ul>
          </Grid>
          <Grid item xs={12} md={10} lg={10}>
            <Switch>
              <Route exact path="/">
                <Mute />
              </Route>
              <Route path="/about">
                <About />
              </Route>
              <Route path="/dashboard">
                <Dashboard />
              </Route>
            </Switch>
          </Grid>
        </Grid>
      </div>
    </Router>
  );
}

// You can think of these components as "pages"
// in your app.

function Mute() {
  return (
    <div>
      <h2>Home</h2>
    </div>
  );
}

function About() {
  return (
    <div>
      <h2>About</h2>
    </div>
  );
}

function Dashboard() {
  return (
    <div>
      <h2>Dashboard</h2>
    </div>
  );
}
