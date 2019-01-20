import React, { Component, } from 'react';
import PropTypes from 'prop-types';
import { Typography } from '@material-ui/core';

export default class OpenbadgeFromUrl {

  constructor (props) {
    super (props);
    this.state = {
      json: null
    }
  }

  async componentDidMount() {
    { url } = this.props;
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
        <Typography>
          Trying to load Openbadge from {url}
        </Typography>
      );
    }
    return(
      <Openbadge
        json={json} />
    );
  }
}
