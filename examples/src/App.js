import React, { Component, Fragment } from 'react';
import { AppBar, Button, Grid, Toolbar, Typography } from '@material-ui/core';
import Openbadge from '../../src/Openbadge';

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
        <Openbadge />
      </Fragment>
    );
  }
}
