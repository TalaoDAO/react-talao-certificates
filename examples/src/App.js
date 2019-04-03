import React from 'react'
import { AppBar, Button, Card, CardHeader, CircularProgress, Toolbar } from '@material-ui/core'
import TalaoCertificate from '../../src/TalaoCertificate'
import './App.css'

export default class App extends React.Component {

  constructor (props) {
    super (props);
    this.state = {
      json: null
    }
  }

  componentDidMount() {
    const url = 'https://raw.githubusercontent.com/TalaoDAO/react-talao-certificates/master/examples/data/example.json'
    this.fetchJson(url)
  }

  async fetchJson(url) {
    const file = await fetch(url)
    const json = await file.json()
    this.setState({
      json: json
    })
  }

  render() {
    const { json } = this.state
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
              json ?
                <TalaoCertificate json={json} onClose={() => alert('onClose() prop')}/>
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
