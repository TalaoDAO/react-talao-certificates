import React from 'react'
import {
  Card, CardHeader, CardContent,
  Tabs, Tab,
  Typography,
  withStyles
} from '@material-ui/core'

import Content from './components/Content'
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

  constructor (props) {
    super (props)
    this.state = {
      tab: 0
    }
    this.changeTab = this.changeTab.bind(this)
  }

  changeTab(event, value) {
    this.setState({
      tab: value
    })
  }

  render() {
    const { classes, json } = this.props
    const { tab } = this.state
    return(
      <Card classes={{root: classes.cardRoot}}>
        <CardHeader
          title={
            <img src={certificateImage} alt="Talao certificate" />
          }
          subheader={
            <Tabs
              value={tab}
              onChange={this.changeTab}
              textColor="primary"
              indicatorColor="primary"
              centered>
              <Tab
                label="View">
              </Tab>
              {/* <Tab
                label="Verify">
              </Tab> */}
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
              <Typography>Verification is coming soon</Typography>
          }
        </CardContent>
      </Card>
    )
  }
}

export default withStyles(styles)(TalaoCertificate)
