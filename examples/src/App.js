import React from 'react'
import {
  AppBar,
  Button,
  Card, CardHeader,
  CircularProgress,
  Divider,
  Toolbar,
  Typography
} from '@material-ui/core'
import TalaoCertificate from '../../src/TalaoCertificate'
import './App.css'

export default class App extends React.Component {

  constructor (props) {
    super (props);
    this.state = {
      v1: null,
      v2: null
    }
  }

  componentDidMount() {
    // const url1 = 'https://raw.githubusercontent.com/TalaoDAO/react-talao-certificates/master/examples/data/version1.json'
    // this.fetchJson(url1, 'v1')
    const url2 = 'https://raw.githubusercontent.com/TalaoDAO/react-talao-certificates/master/examples/data/version2.json'
    this.fetchJson(url2, 'v2')
  }

  async fetchJson(url, stateVariable) {
    const file = await fetch(url)
    const json = await file.json()
    this.setState({
      [stateVariable]: json
    })
  }

  render() {
    const { v2 } = this.state
    return (
      <React.Fragment>
        <AppBar position="static">
          <Toolbar>
            <Button
              href="https://github.com/TalaoDAO/react-talao-certificates"
              color="inherit">
              React Talao certificates
            </Button>
          </Toolbar>
        </AppBar>
        <div className="Main">
          <div className="Content">
            {
              v2 ?
                <TalaoCertificate json={v2} network='rinkeby' onClose={() => alert('onClose() prop')} />
              :
                <Card>
                  <CardHeader
                    title="Loading..."
                    avatar={
                      <CircularProgress />
                    }>
                  </CardHeader>
                </Card>
            }
          </div>
        </div>
      </React.Fragment>
    )
  }
}
