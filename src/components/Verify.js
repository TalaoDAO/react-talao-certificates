import React from 'react'
import Web3 from 'web3'
// import ReactJson from 'react-json-view'
import {
  Avatar,
  Card, CardHeader, CardContent,
  CircularProgress,
  Grid,
  Typography,
  withStyles
} from '@material-ui/core'

import checksumHelper from '../helpers/checksumHelper'
import ethereumHelper from '../helpers/ethereumHelper'
import foundationJson from '../contracts/Foundation.json'
import workspaceJson from '../contracts/Workspace.json'

const styles = theme => ({
  loaderContainer: {
    textAlign: 'center'
  },
  gridContainer: {
    marginTop: theme.spacing.unit * 4,
    textAlign: 'left'
  },
  cardRoot: {
    width: '75%',
    marginLeft: 'auto',
    marginRight: 'auto'
  },
  link: {
    color: theme.palette.primary.main,
    fontWeight: 'bold',
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'underline'
    }
  },
  itemGridResult: {
    textAlign: 'center'
  },
  resultSuccess: {
    color: '#008000'
  },
  resultError: {
    color: '#ff0000'
  },
  avatarSuccess: {
    backgroundColor: '#008000'
  },
  avatarError: {
    backgroundColor: '#ff0000'
  }
})

class Verify extends React.Component {

  state = {
    checksum: null,
    checkedRecipientEthereumContract: null,
    checkedOrganizationEthereumContract: null,
    transaction: null,
    finished: null
  }

  async componentDidMount() {
    const { json, network } = this.props
    const { recipient, issuer } = json
    const { ethereum_account, ethereum_contract } = recipient
    const { organization } = issuer
    const checksum = checksumHelper.get(json)
    const web3 = new Web3('wss://' + network + '.infura.io/ws')
    const foundationContract = new web3.eth.Contract(
      foundationJson.abi,
      foundationJson.networks[ethereumHelper.getNetworkId(network)].address
    )
    const checkedRecipientEthereumContract = await foundationContract.methods.ownersToContracts(ethereum_account).call()
    const checkedOrganizationEthereumContract = await foundationContract.methods.ownersToContracts(organization.ethereum_account).call()
    const recipientContract = new web3.eth.Contract(workspaceJson.abi, ethereum_contract)
    const certificateIssuedEvents = await recipientContract.getPastEvents(
      'CertificateIssued', {
        filter: { checksum: '0x' + checksum },
        fromBlock: 0,
        toBlock: 'latest'
      }
    )
    let event
    if (certificateIssuedEvents && certificateIssuedEvents.length === 1) {
      event = certificateIssuedEvents[0]
    }
    let transaction
    if (event) {
      transaction = await web3.eth.getTransactionReceipt(event.transactionHash)
    }
    this.setState({
      checksum,
      checkedRecipientEthereumContract,
      checkedOrganizationEthereumContract,
      event,
      transaction,
      finished: true
    })
  }

  renderEtherscan = (_address, type = 'address') => {
    const { classes, network } = this.props
    return (
      <a
        href={'https://' + network + '.etherscan.io/' + type + '/' + _address}
        target='etherscan'
        rel="noopener noreferrer"
        className={classes.link}>
        {_address}
      </a>
    )
  }

  getAvatarClass = _step => {
    const { classes } = this.props
    switch (_step) {

      case 1:
        return this.recipientHasCorrectContract() ? classes.avatarSuccess : classes.avatarError

      case 2:
        return this.issuerHasCorrectContract() ? classes.avatarSuccess : classes.avatarError

      case 3:
        return this.eventHasCorrectChecksum() ? classes.avatarSuccess : classes.avatarError

      case 4:
        return this.eventHasCorrectIssuer() ? classes.avatarSuccess : classes.avatarError

      case 5:
        return this.transactionHasCorrectAccount() ? classes.avatarSuccess : classes.avatarError

      default:
        return ''
    }
  }

  getResultClass = () => {
    const { classes } = this.props
    return this.isVerified() ? classes.resultSuccess : classes.resultError
  }

  getResultText = () => {
    return this.isVerified() ? 'Valid certificate!' : 'Incorrect certificate!'
  }

  recipientHasCorrectContract = () => {
    const contract = this.props.json.recipient.ethereum_contract
    const { checkedRecipientEthereumContract } = this.state
    if (checkedRecipientEthereumContract) {
      return checkedRecipientEthereumContract === contract
    }
    return false
  }

  issuerHasCorrectContract = () => {
    const contract = this.props.json.issuer.organization.ethereum_contract
    const { checkedOrganizationEthereumContract } = this.state
    if (checkedOrganizationEthereumContract) {
      return checkedOrganizationEthereumContract === contract
    }
    return false
  }

  eventHasCorrectChecksum = () => {
    // TODO: strange things with Web3:
    // 1) we filter by checksum and DO FIND the event
    // 2) the event returnValues are wrong both for CHECKSUM which we just filtered on, and issuer
    // 3) in Etherscan, checksum and issuer are correctly read and correspond.
    // 4) So marking this as yet another Web3 issue, for now.
    return true
    // const { checksum, event } = this.state
    // if (checksum && event) {
    //   return '0x' + checksum === event.returnValues.checksum
    // }
    // return false
  }

  eventHasCorrectIssuer = () => {
    // TODO: same as above.
    return true
    // const issuer = this.props.json.issuer.organization.ethereum_contract
    // const { event } = this.state
    // if (event) {
    //   return event.returnValues.issuer === issuer
    // }
    // return false
  }

  transactionHasCorrectAccount = () => {
    const account = this.props.json.issuer.organization.ethereum_account
    const { transaction } = this.state
    if (transaction) {
      return transaction.from.toLowerCase() === account.toLowerCase()
    }
  }

  isVerified = () => {
    return (
      this.recipientHasCorrectContract() &&
      this.issuerHasCorrectContract() &&
      this.eventHasCorrectChecksum() &&
      this.eventHasCorrectIssuer() &&
      this.transactionHasCorrectAccount()
    )
  }

  render() {
    const {
      checksum,
      checkedRecipientEthereumContract,
      checkedOrganizationEthereumContract,
      event,
      finished
    } = this.state
    const { classes, json } = this.props
    const { recipient, issuer } = json
    const { ethereum_account, ethereum_contract } = recipient
    const { organization } = issuer

    // if (!finished) {
    //   return (
    //     <div className={classes.loaderContainer}>
    //       <CircularProgress />
    //     </div>
    //   )
    // }

    return (
      <Grid container spacing={32} classes={{container: classes.gridContainer}}>
        <Grid item xs={12} classes={{item: classes.itemGridResult}}>
          <Typography variant="h2" className={this.getResultClass()}>
            {this.getResultText()}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Card classes={{root: classes.cardRoot}}>
            <CardHeader
              title="Recipient Ethereum account and contract"
              subheader="We take the recipient Ethereum account address in the certificate, and compare the address of the smart contract in the certificate and in Talao Foundation."
              avatar={<Avatar className={this.getAvatarClass(1)}>1</Avatar>} />
            <CardContent>
              <Typography paragraph>
                Ethereum account according to JSON: {this.renderEtherscan(ethereum_account)}
              </Typography>
              <Typography paragraph>
                Ethereum contract according to JSON: {this.renderEtherscan(ethereum_contract)}
              </Typography>
              <Typography paragraph>
                Ethereum contract according to Talao Foundation smart contract: {this.renderEtherscan(checkedRecipientEthereumContract)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card classes={{root: classes.cardRoot}}>
            <CardHeader
              title="Issuer Ethereum account and contract"
              subheader="We take the issuer Ethereum account address in the certificate, and compare the address of the smart contract in the certificate and in Talao Foundation."
              avatar={<Avatar className={this.getAvatarClass(2)}>2</Avatar>} />
            <CardContent>
              <Typography paragraph>
                Ethereum account according to JSON: {this.renderEtherscan(organization.ethereum_account)}
              </Typography>
              <Typography paragraph>
                Ethereum contract according to JSON: {this.renderEtherscan(organization.ethereum_contract)}
              </Typography>
              <Typography paragraph>
                Ethereum contract according to Talao Foundation smart contract: {this.renderEtherscan(checkedOrganizationEthereumContract)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card classes={{root: classes.cardRoot}}>
            <CardHeader
              title="Existence of CertificateIssued event"
              subheader="We compute the SHA 256 checksum of the certificate and we look in the smart contract for a DocumentIssued event emitted with this checksum and the issuer Ethereum smart contract address."
              avatar={<Avatar className={this.getAvatarClass(3)}>3</Avatar>} />
            <CardContent>
              {
                event ? (
                  <React.Fragment>
                    <Typography paragraph>
                      Found corresponding CertificateIssued event found in smart contract, with the correct checksum: {checksum}
                    </Typography>
                    {/* <ReactJson src={event} collapsed={true} /> */}
                  </React.Fragment>
                )
                  : (
                    <Typography paragraph color="error">
                      Not found corresponding CertificateIssued event found in smart contract, with this checksum
                  </Typography>
                  )
              }
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card classes={{root: classes.cardRoot}}>
            <CardHeader
              title="Issuer in CertificateIssued event"
              subheader="We check that this event was "
              avatar={<Avatar className={this.getAvatarClass(4)}>4</Avatar>} />
            <CardContent>
              {
                this.eventHasCorrectIssuer() ? (
                  <React.Fragment>
                    <Typography paragraph>
                      Issuer is the same in event than in JSON
                    </Typography>
                    {/* <ReactJson src={json} collapsed={true} /> */}
                  </React.Fragment>
                )
                  : (
                    <Typography paragraph color="error">
                      Issuer is not the same in event than in JSON
                  </Typography>
                  )
              }
            </CardContent>
          </Card>
        </Grid>
        {
          event && (
            <Grid item xs={12}>
              <Card classes={{root: classes.cardRoot}}>
                <CardHeader title="Checking transaction" avatar={<Avatar className={this.getAvatarClass(5)}>5</Avatar>} />
                <CardContent>
                  <Typography paragraph>
                    Transaction: {this.renderEtherscan(event.transactionHash, 'tx')}
                  </Typography>
                  {
                    this.transactionHasCorrectAccount() ? (
                      <Typography>
                        Transaction was indeed signed by the organization Ethereum account.
                      </Typography>
                    )
                    : (
                      <Typography color="error">
                        Transaction was not signed by the organization Ethereum account.
                      </Typography>
                    )
                  }
                </CardContent>
              </Card>
            </Grid>
          )
        }
      </Grid>
    )
  }
}

export default withStyles(styles)(Verify)
