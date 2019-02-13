import React from 'react'
import Web3 from 'web3'
import {
  Button,
  Card, CardHeader, CardContent, CardActions,
  Chip,
  Grid,
  List, ListItem, ListItemText,
  Table, TableBody, TableRow, TableCell,
  Typography,
  withStyles
} from '@material-ui/core'
import { Link } from '@material-ui/icons'
import format from 'date-fns/format'

import checksumHelper from '../helpers/checksumHelper'
import ethereumHelper from '../helpers/ethereumHelper'
import foundationJson from '../contracts/Foundation.json'
import workspaceJson from '../contracts/Workspace.json'

const styles = theme => ({
  gridItem: {
    textAlign: 'center'
  },
  button: {
    marginLeft: 'auto'
  },
  buttonIcon: {
    marginRight: theme.spacing.unit
  }
})

class Verify extends React.Component {

  state = {
    checksum: null,
    checkedRecipientEthereumAccount: null
  }

  async componentDidMount() {
    const { json, network } = this.props
    const { recipient } = json
    const { ethereum_account, ethereum_contract } = recipient
    const checksum = checksumHelper.get(json)
    const web3 = new Web3('wss://' + network + '.infura.io/ws')
    const foundationContract = new web3.eth.Contract(
      foundationJson.abi,
      foundationJson.networks[ethereumHelper.getNetworkId(network)].address
    )
    const checkedRecipientEthereumAccount = await foundationContract.methods.ownersToContracts(ethereum_account).call()
    const recipientContract = new web3.eth.Contract(workspaceJson.abi, ethereum_contract)
    const certificateIssuedEvent = await recipientContract.getPastEvents(
      'CertificateIssued', {
        fromBlock: 0,
        toBlock: 'latest'
      }
    )
    this.setState({
      checksum,
      checkedRecipientEthereumAccount,
      certificateIssuedEvent
    })
  }

  renderEtherscan = _address => {
    const { network } = this.props
    return (
      <a
        href={'https://' + network + '.etherscan.io/address/' + _address}
        target='etherscan'
        rel="noopener noreferrer">
        {_address}
      </a>
    )
  }

  render() {

    const { checksum, checkedRecipientEthereumAccount, certificateIssuedEvent } = this.state
    console.log(this.state)
    const { classes, json } = this.props
    const { recipient, issuer, certificate } = json
    const { ethereum_account, ethereum_contract } = recipient
    const { organization, responsible } = issuer

    if (certificateIssuedEvent && certificateIssuedEvent.length > 0) {
      certificateIssuedEvent.forEach(event => {
        console.log(event.returnValues.checksum)
        console.log('0x' + checksum)
      })
    }

    return (
      <Grid container spacing={32} alignItems="center">
        <Grid item xs={12} classes={{ item: classes.gridItem }}>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell>Recipient Ethereum account</TableCell>
                <TableCell>According to JSON: {this.renderEtherscan(ethereum_account)}</TableCell>
                <TableCell>&nbsp;</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Recipient Ethereum smart contract</TableCell>
                <TableCell>According to JSON: {this.renderEtherscan(ethereum_contract)}</TableCell>
                <TableCell>According to Talao foundation smart contract: {this.renderEtherscan(checkedRecipientEthereumAccount)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Certificate checksum</TableCell>
                <TableCell>According to JSON: {checksum}</TableCell>
                <TableCell>Event CertificateIssued found in recipient smart contract with this checksum: </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Grid>
      </Grid>
    )
  }
}

export default withStyles(styles)(Verify)
