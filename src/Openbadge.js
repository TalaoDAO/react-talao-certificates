import React, { Component, Fragment } from 'react';
import ReactJson from 'react-json-view';
import { Card, CardHeader, CardContent } from '@material-ui/core';

export default class Openbadge extends Component {

  render() {
    const { json } = this.props;
    return(
      <Card>
        <CardHeader
          title="Openbadge example">
        </CardHeader>
        <CardContent>
          <ReactJson
            src={json}
          />
        </CardContent>
      </Card>
    );
  }
}
