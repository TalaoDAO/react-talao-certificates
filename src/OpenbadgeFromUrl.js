import 'babel-polyfill';
import React, { Component, } from 'react';
import PropTypes from 'prop-types';
import { Card, CardHeader, CircularProgress } from '@material-ui/core';
import Openbadge from './Openbadge';

export default class OpenbadgeFromUrl extends Component {

  constructor (props) {
    super (props);
    this.state = {
      json: null
    }
  }

  componentDidMount() {
    const { url } = this.props;
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
    const { url, json } = this.state;

    if (!json) {
      return(
        <Card>
          <CardHeader
            title="Loading..."
            avatar={
              <CircularProgress />
            }>
          </CardHeader>
        </Card>
      );
    }

    return(
      <Openbadge
        json={json}
        {...this.props} />
    );
  }
}
