import React, { Component, Fragment } from 'react';
import ReactJson from 'react-json-view';
import { Button, Card, CardHeader, CardContent, CardActions } from '@material-ui/core';

export default class Openbadge extends Component {

  render() {
    const { json, download } = this.props;
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
        <CardActions>
          {
            download &&
              <Button
                variant="raised"
                color="primary">
                Download
              </Button>
          }
        </CardActions>
      </Card>
    );
  }
}
