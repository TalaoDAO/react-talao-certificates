import React from 'react'
import PropTypes from 'prop-types'
import {
  Card, CardHeader, CardContent,
  Tabs, Tab,
  Typography,
  withStyles
} from '@material-ui/core'

import Content from './components/Content'
import Verify from './components/Verify'
import certificateImage from './assets/images/certificate.js'

const styles = theme => ({
  cardRoot: {
    border: 'none',
    boxShadow: 'none',
    borderRadius: 0
  },
  cardHeaderRoot: {
    textAlign: 'center',
    backgroundColor: '#edecec',
    paddingBottom: 0
  }
})

class TalaoCertificate extends React.Component {

  state = {
    tab: 1
  }

  changeTab = (event, value) => {
    this.setState({
      tab: value
    })
  }

  render() {

    const { classes, json, network } = this.props
    const { tab } = this.state

    return (
      <Card classes={{ root: classes.cardRoot }}>
        <CardHeader
          title={
            <img src={certificateImage} alt="Talao certificate" />
          }
          subheader={
            <Tabs
              value={tab}
              onChange={(event, value) => this.changeTab(event, value)}
              textColor="primary"
              indicatorColor="primary"
              centered>
              <Tab
                label="View">
              </Tab>
              <Tab
                label="Verify">
              </Tab>
            </Tabs>
          }
          classes={{
            root: classes.cardHeaderRoot
          }}>
        </CardHeader>
        <CardContent>
          {
            tab === 0 ?
              <Content json={json} />
              :
              <Verify json={json} network={network} />
          }
        </CardContent>
      </Card>
    )
  }
}

TalaoCertificate.propTypes = {
  network: PropTypes.string
}

TalaoCertificate.defaultProps = {
  network: 'mainnet'
}

export default withStyles(styles)(TalaoCertificate)
