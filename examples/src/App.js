import React, { Component, Fragment } from 'react';
import { AppBar, Button, Grid, Toolbar, Typography } from '@material-ui/core';
import OpenbadgeFromUrl from '../../src/OpenbadgeFromUrl';

export default class App extends Component {
  render() {
    return (
      <Fragment>
        <AppBar position="static">
          <Toolbar>
            <Button
              href="https://https://github.com/TalaoDAO/react-talao-certificates"
              color="inherit">
              React Talao certificates
            </Button>
          </Toolbar>
        </AppBar>
        <OpenbadgeFromUrl
          url="https://raw.githubusercontent.com/TalaoDAO/react-talao-certificates/master/examples/data/example.json"
          download={true} />
      </Fragment>
    );
  }
}
