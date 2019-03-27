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
// import certificateImage from './assets/images/certificate.js'

const styles = theme => ({
  cardHeaderRoot: {
    textAlign: 'center',
    backgroundColor: '#edecec',
    padding: 0,
    marginBottom: theme.spacing.unit * 2
  },
  // logo: {
  //   // width: '150px',
  //   // height: '54px',
  //   width: '200px',
  //   height: 'auto'
  // }
})

class TalaoCertificate extends React.Component {

  state = {
    tab: 0
  }

  changeTab = (event, value) => {
    this.setState({
      tab: value
    })
  }

  render() {

    const { classes, json, network, preview } = this.props
    const { tab } = this.state

    return (
      <Card classes={{ root: classes.cardRoot }}>
        <CardHeader
          // title={
          //   <img src={certificateImage} alt="FreeDapp certificate" className={classes.logo} />
          // }
          subheader={
            <Tabs
              value={tab}
              onChange={(event, value) => this.changeTab(event, value)}
              textColor="primary"
              indicatorColor="primary"
              centered>
              <Tab
                label={preview ? 'Preview' : 'View'}>
              </Tab>
              {
                !preview && (
                  <Tab
                    label="Verify">
                  </Tab>
                )
              }
            </Tabs>
          }
          classes={{
            root: classes.cardHeaderRoot
          }}>
        </CardHeader>
        <CardContent>
          {
            preview ? (
              <Content json={json} />
            ) :
              tab === 0 ? (
                <Content json={json} />
              )
              : (
                <Verify json={json} network={network} />
              )
          }
        </CardContent>
      </Card>
    )
  }
}

TalaoCertificate.propTypes = {
  network: PropTypes.string,
  preview: PropTypes.bool
}

TalaoCertificate.defaultProps = {
  network: 'mainnet'
}

export default withStyles(styles)(TalaoCertificate)
