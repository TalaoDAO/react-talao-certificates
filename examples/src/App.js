import React, { Component, Fragment } from 'react';
import { AppBar, Button, Card, CardHeader, CircularProgress, Grid, Toolbar, Typography } from '@material-ui/core';
import Talaocertificate from '../../src/Talaocertificate';

export default class App extends Component {

  constructor (props) {
    super (props);
    this.state = {
      json: null
    }
  }

  componentDidMount() {
    const url = 'https://raw.githubusercontent.com/TalaoDAO/react-talao-certificates/master/examples/data/example.json';
    this.fetchJson(url);
  }

  async fetchJson(url) {
    const file = await fetch(url);
    const json = await file.json();
    this.setState({
      json: json
    });
  }

  render() {
    const { json } = this.state;
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
        {
          json ?
            <Talaocertificate json={json} />
          :
            <Card>
              <CardHeader
                title="Loading..."
                avatar={
                  <CircularProgress />
                }>
              </CardHeader>
            </Card>
        }
      </Fragment>
    );
  }
}
