import React from 'react'
import Web3 from 'web3'
import ReactJson from 'react-json-view'
import {
  Avatar,
  Button,
  Card, CardHeader, CardContent,
  CircularProgress,
  Grid,
  Typography,
  withStyles
} from '@material-ui/core'
import { Link } from '@material-ui/icons'

import checksumHelper from '../helpers/checksumHelper'
import ethereumHelper from '../helpers/ethereumHelper'
import foundationJson from '../contracts/Foundation.json'
import workspaceJson from '../contracts/Workspace.json'

const styles = theme => ({
  gridContainer: {
    marginTop: theme.spacing.unit * 4,
    textAlign: 'left'
  },
  cardRoot: {
    marginLeft: 'auto',
    marginRight: 'auto'
  },
  loaderContainer: {
    textAlign: 'center'
  },
  itemGridResult: {
    textAlign: 'center'
  },
  titleSuccess: {
    color: '#008000'
  },
  titleError: {
    color: '#ff0000'
  },
  avatarSuccess: {
    backgroundColor: '#008000'
  },
  avatarError: {
    backgroundColor: '#ff0000'
  },
  buttonIcon: {
    marginRight: theme.spacing.unit
  }
})

class Verify extends React.Component {

  state = {
    completedSteps: 0,
    checkedRecipientEthereumContract: null,
    checkedOrganizationEthereumContract: null,
    checksum: null,
    event: null
  }

  async componentDidMount() {
    const { json, network } = this.props
    const { recipient, issuer } = json
    const { ethereum_account, ethereum_contract } = recipient
    const { organization } = issuer
    const web3 = new Web3('wss://' + network + '.infura.io/ws')
    const foundationContract = new web3.eth.Contract(
      foundationJson.abi,
      foundationJson.networks[ethereumHelper.getNetworkId(network)].address
    )
    const checkedRecipientEthereumContract = await foundationContract.methods.ownersToContracts(ethereum_account).call()
    this.setState({
      completedSteps: 1,
      checkedRecipientEthereumContract
    })
    const checkedOrganizationEthereumContract = await foundationContract.methods.ownersToContracts(organization.ethereum_account).call()
    this.setState({
      completedSteps: 2,
      checkedOrganizationEthereumContract
    })
    const checksum = checksumHelper.get(json)
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
    this.setState({
      completedSteps: 3,
      checksum,
      event
    })
  }

  getEtherscanAddress = (_address, _type = 'address') => {
    const { network } = this.props
    return 'https://' + network + '.etherscan.io/' + _type + '/' + _address
  }

  getAvatarClass = _step => {
    const { classes } = this.props
    const { completedSteps } = this.state
    switch (_step) {

      case 1:
        return completedSteps >= _step ? this.recipientHasCorrectContract() ? classes.avatarSuccess : classes.avatarError : ''

      case 2:
        return completedSteps >= _step ? this.issuerHasCorrectContract() ? classes.avatarSuccess : classes.avatarError : ''

      case 3:
        return completedSteps >= _step ? this.hasEvent() ? classes.avatarSuccess : classes.avatarError : ''

      default:
        return ''
    }
  }

  getTitleClass = () => {
    const { classes } = this.props
    const { completedSteps } = this.state
    return completedSteps === 3 ? this.isVerified() ? classes.titleSuccess : classes.titleError : ''
  }

  getTitleText = () => {
    const { completedSteps } = this.state
    return completedSteps === 3 ? this.isVerified() ? 'Valid certificate!' : 'Incorrect certificate!' : 'Verifying certificate...'
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

  hasEvent = () => {
    const { event } = this.state
    return event ? true : false
  }

  isVerified = () => {
    return (
      this.recipientHasCorrectContract() &&
      this.issuerHasCorrectContract() &&
      this.hasEvent()
    )
  }

  render() {
    const {
      completedSteps,
      checkedRecipientEthereumContract,
      checkedOrganizationEthereumContract
    } = this.state
    const { classes, json, network } = this.props

    return (
      <Grid container spacing={32} classes={{ container: classes.gridContainer }}>
        <Grid item xs={12} classes={{ item: classes.itemGridResult }}>
          <Typography variant="h2" className={this.getTitleClass()}>
            {this.getTitleText()}
          </Typography>
        </Grid>
        <Grid item xs={12} lg={9}>
          <Grid container spacing={32}>
            <Grid item xs={12}>
              <Card classes={{ root: classes.cardRoot }}>
                <CardHeader
                  title="Recipient Ethereum account and contract"
                  avatar={<Avatar className={this.getAvatarClass(1)}>1</Avatar>} />
                <CardContent>
                  {
                    completedSteps <= 0 ? (
                      <div className={classes.loaderContainer}>
                        <CircularProgress />
                      </div>
                    )
                      : (
                        <Typography>
                          We take the recipient Ethereum account address in the certificate, and compare the address of the smart contract in the certificate and in Talao Foundation.
                        </Typography>
                      )
                  }
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12}>
              <Card classes={{ root: classes.cardRoot }}>
                <CardHeader
                  title="Issuer Ethereum account and contract"
                  avatar={<Avatar className={this.getAvatarClass(2)}>2</Avatar>} />
                <CardContent>
                  {
                    completedSteps <= 1 ? (
                      <div className={classes.loaderContainer}>
                        <CircularProgress />
                      </div>
                    )
                      : (
                        <Typography>
                          We take the issuer Ethereum account address in the certificate, and compare the address of the smart contract in the certificate and in Talao Foundation.
                        </Typography>
                      )
                  }
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12}>
              <Card classes={{ root: classes.cardRoot }}>
                <CardHeader
                  title="Existence of CertificateIssued event"
                  avatar={<Avatar className={this.getAvatarClass(3)}>3</Avatar>} />
                <CardContent>
                  {
                    completedSteps <= 2 ? (
                      <div className={classes.loaderContainer}>
                        <CircularProgress />
                      </div>
                    )
                    : (
                      <Typography>
                        We compute the SHA 256 checksum of the certificate and we look in the smart contract for a DocumentIssued event with this checksum and the issuer smart contract.
                      </Typography>
                    )
                  }
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} lg={3}>
          <Grid container spacing={32}>
            <Grid item xs={12}>
              <Typography variant="h6">Verify by yourself</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography paragraph>Explore the certificate JSON:</Typography>
              <ReactJson src={json} collapsed={true} />
            </Grid>
            <Grid item xs={12}>
              <Button
                href={this.getEtherscanAddress(checkedRecipientEthereumContract)}
                target="etherscan"
                color="primary"
                variant="outlined">
                <Link className={classes.buttonIcon} />Freelance on Etherscan
              </Button>
            </Grid>
            <Grid item xs={12}>
            <Button
                href={this.getEtherscanAddress(checkedOrganizationEthereumContract)}
                target="etherscan"
                color="primary"
                variant="outlined">
                <Link className={classes.buttonIcon} />Organization on Etherscan
              </Button>
            </Grid>
            <Grid item xs={12}>
            <Button
                href={this.getEtherscanAddress(foundationJson.networks[ethereumHelper.getNetworkId(network)].address)}
                target="etherscan"
                color="primary"
                variant="outlined">
                <Link className={classes.buttonIcon} />Foundation on Etherscan
              </Button>
            </Grid>
            <Grid item xs={12}>
            <Button
                href="https://github.com/TalaoDAO/talao-contracts"
                target="github"
                color="primary"
                variant="outlined">
                <Link className={classes.buttonIcon} />Github
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    )
  }
}

export default withStyles(styles)(Verify)
