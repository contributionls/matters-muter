import React from 'react';
import { Switch, Route, useHistory, useLocation } from 'react-router-dom';
import {
  createMuiTheme,
  makeStyles,
  ThemeProvider,
} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import Mute from './Mute';
import General from './General';
import Put from './Put';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  appBar: {
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  toolbar: {
    flexWrap: 'wrap',
  },
  toolbarTitle: {
    flexGrow: 1,
  },
  link: {
    margin: theme.spacing(1, 1.5),
  },
  main: {
    paddingTop: theme.spacing(5),
  },
  section: {
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
  },
}));
const defaultTheme = createMuiTheme({
  palette: {
    primary: {
      // light: will be calculated from palette.primary.main,
      main: '#0d6763',
      // dark: will be calculated from palette.primary.main,
      // contrastText: will be calculated to contrast with palette.primary.main
    },
    secondary: {
      // light: '#0066ff',
      main: '#0d6763',
      // dark: will be calculated from palette.secondary.main,
      // contrastText: '#ffcc00',
    },
    // error: will use the default color
  },
});
export default function Home() {
  const classes = useStyles();
  const theme = useTheme();
  let history = useHistory();
  let location = useLocation();
  const isLessLg = useMediaQuery(theme.breakpoints.down('md'));
  const [tabValue, setTabValue] = React.useState(location.pathname);
  const handleTabChange = (e, value) => {
    // change
    setTabValue(value);
    history.push(value);
  };
  return (
    <ThemeProvider theme={defaultTheme}>
      <div className={classes.root}>
        <header>
          <AppBar
            position="static"
            color="default"
            elevation={0}
            className={classes.appBar}
          >
            <Toolbar className={classes.toolbar}>
              <Typography
                variant="h6"
                color="inherit"
                noWrap
                className={classes.toolbarTitle}
              >
                Matters消音器
              </Typography>
              <nav>
                <Link
                  variant="button"
                  color="textPrimary"
                  href="#"
                  className={classes.link}
                >
                  Github
                </Link>
              </nav>
            </Toolbar>
          </AppBar>
        </header>
        <Grid className={classes.main} container spacing={6}>
          <Grid item xs={12} lg={2}>
            <Tabs
              orientation={isLessLg ? 'horizontal' : 'vertical'}
              value={tabValue}
              onChange={handleTabChange}
              aria-label="simple tabs example"
            >
              <Tab value="/" label="靜音設置" />
              <Tab value="/general" label="通用設置" />
              <Tab value="/put" label="導入/導出" />
              <Tab value="/about" label="關於" />
            </Tabs>
          </Grid>
          <Grid item xs={12} lg={10}>
            <div className={classes.section}>
              <Grid container>
                <Grid item xs={12} md={8}>
                  <Switch>
                    <Route exact path="/">
                      <Mute />
                    </Route>
                    <Route path="/general">
                      <General></General>
                    </Route>
                    <Route path="/about">
                      <About />
                    </Route>
                    <Route path="/put">
                      <Put />
                    </Route>
                  </Switch>
                </Grid>
              </Grid>
            </div>
          </Grid>
        </Grid>
      </div>
    </ThemeProvider>
  );
}

function About() {
  return (
    <div>
      <h2>About</h2>
    </div>
  );
}
