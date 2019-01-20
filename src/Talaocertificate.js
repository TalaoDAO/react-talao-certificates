import React, { Component, Fragment } from 'react';
import downloadjs from 'downloadjs';
import { slugify } from 'transliteration';
import { Button, Card, CardHeader, CardContent, CardActions } from '@material-ui/core';
import ReactJson from 'react-json-view';

export default class Talaocertificate extends Component {

  constructor (props) {
    super (props);
    this.download = this.download.bind(this);
  }

  download() {
    const { json } = this.props;
    const stringified = JSON.stringify(json);
    const fileName = slugify(
      'certificate-' +
      json.recipient.name + '-' +
      json.badge.issuer.name + '-' +
      json.badge.name
    );
    downloadjs(stringified, fileName + '.json', 'text/plain');
  }

  render() {
    const { json, download } = this.props;
    return(
      <Card>
        <CardHeader
          title="Talaocertificate example">
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
