import React from 'react'
import PropTypes from 'prop-types'
import {
  Card, CardHeader, CardContent,
  IconButton,
  MuiThemeProvider,
  Tabs, Tab,
  withStyles
} from '@material-ui/core'
import { Close } from '@material-ui/icons'

import theme from './providers/mui/theme'

import ContentVersion1 from './components/ContentVersion1'
import ContentVersion2 from './components/ContentVersion2'
import Verify from './components/Verify'

const styles = theme => ({
  cardHeaderRoot: {
    textAlign: 'center',
    backgroundColor: '#edecec',
    paddingBottom: 0,
    marginBottom: theme.spacing.unit * 2
  },
  cardContentRoot: {
    marginTop: theme.spacing.unit * 4,
    marginBottom: theme.spacing.unit * 2
  }
})

function Content({ json, version }) {
  switch (version) {
    case 1:
      return <ContentVersion1 json={json} />
    case 2:
      return <ContentVersion2 json={json} />
    default:
      return <ContentVersion2 json={json} />
  }
}

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

    const { classes, json, network, preview, onClose } = this.props
    const { tab } = this.state

    return (
      <MuiThemeProvider theme={theme}>
        <Card classes={{ root: classes.cardRoot }}>
          <CardHeader
            action={
              this.props.onClose && (
                <IconButton
                  onClick={() => onClose()}
                  aria-label="Close">
                  <Close />
                </IconButton>
              )
            }
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
          <CardContent classes={{root: classes.cardContentRoot}}>
            {
              preview ? (
                <Content version={json.version} json={json} />
              ) :
                tab === 0 ? (
                  <Content version={json.version} json={json} />
                )
                : (
                  <Verify json={json} network={network} />
                )
            }
          </CardContent>
        </Card>
      </MuiThemeProvider>
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
