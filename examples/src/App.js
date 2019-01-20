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
              href="https://github.com/guix77/react-openbadges"
              color="inherit">
              React Openbadges
            </Button>
          </Toolbar>
        </AppBar>
        <OpenbadgeFromUrl
          url="https://raw.githubusercontent.com/guix77/react-openbadges/master/examples/data/example.json"
          download={true} />
      </Fragment>
    );
  }
}
