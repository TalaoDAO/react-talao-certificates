import React, { Component, Fragment } from 'react';
import downloadjs from 'downloadjs';
import { slugify } from 'transliteration';
import { Button, Card, CardHeader, CardContent, CardActions } from '@material-ui/core';
import ReactJson from 'react-json-view';

export default class Openbadge extends Component {

  constructor (props) {
    super (props);
    this.download = this.download.bind(this);
  }

  download() {
    const { json } = this.props;
    const jsonStringified = JSON.stringify(json);
    const fileName = slugify(json.recipient.name + '-' + json.badge.issuer.name + '-' + json.badge.name);
    downloadjs(jsonStringified, fileName + '.json', 'text/plain');
  }

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
                onClick={() => this.download()}
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
