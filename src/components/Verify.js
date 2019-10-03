import React from 'react'
import Web3 from 'web3'
import downloadjs from 'downloadjs'
import {
  Avatar,
  Button,
  Card, CardHeader, CardContent,
  CircularProgress,
  Hidden,
  Grid,
  Typography,
  withStyles
} from '@material-ui/core'
import { ArrowDownward, Done, Link } from '@material-ui/icons'

import checksumHelper from '../helpers/checksumHelper'
import ethereumHelper from '../helpers/ethereumHelper'
import foundationJson from '../contracts/Foundation.json'
import workspaceJson from '../contracts/Workspace.json'

const styles = theme => ({
  gridContainer: {
    // marginTop: theme.spacing.unit * 4,
    // textAlign: 'left'
  },
  cardRoot: {
    marginLeft: 'auto',
    marginRight: 'auto'
  },
  cardContentRoot: {
    padding: 'unset',
    paddingTop: theme.spacing.unit,
    paddingRight: theme.spacing.unit * 4,
    paddingBottom: theme.spacing.unit * 4,
    paddingLeft: theme.spacing.unit * 9
  },
  cardHeaderRoot: {
    paddingBottom: 0
  },
  loaderContainer: {
    textAlign: 'center'
  },
  itemGridResult: {
    // textAlign: 'center'
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
  },
  links: {
    [theme.breakpoints.down('sm')]: {
      textAlign: 'center'
    }
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
    const { json, network, projectId } = this.props
    const { recipient, issuer } = json
    const { ethereum_account, ethereum_contract } = recipient
    const { organization } = issuer
    const infuraEndpoint = projectId ? 'wss://' + network + '.infura.io/ws/v3/' + projectId : 'wss://' + network + '.infura.io/ws'
    const web3 = new Web3(infuraEndpoint)
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
        fromBlock: ethereumHelper.getDeploymentBlock(network),
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
    if (network === 'mainnet') {
      return 'https://etherscan.io/' + _type + '/' + _address
    }
    else {
      return 'https://' + network + '.etherscan.io/' + _type + '/' + _address
    }
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

  download = () => {
    const { json } = this.props
    const stringified = JSON.stringify(json)
    downloadjs(stringified, 'certificate.json', 'text/plain')
  }

  render() {
    const {
      completedSteps,
      checkedRecipientEthereumContract,
      checkedOrganizationEthereumContract
    } = this.state
    const { classes, json, network } = this.props

    return (
      <Grid container spacing={40} classes={{ container: classes.gridContainer }}>
        <Grid item xs={12} md={9}>
          <Grid container spacing={32}>
            <Hidden smDown><Grid item md={1}></Grid></Hidden>
            <Grid item xs={12} md={10}>
              <Card classes={{ root: classes.cardRoot }}>
                <CardHeader
                  title={
                    <Typography variant="h2">Recipient identity</Typography>
                  }
                  avatar={
                    <Avatar className={this.getAvatarClass(1)}>
                      {this.recipientHasCorrectContract() && <Done />}
                    </Avatar>
                  }
                  classes={{root: classes.cardHeaderRoot}} />
                <CardContent classes={{ root: classes.cardContentRoot }}>
                  {
                    completedSteps <= 0 ? (
                      <div className={classes.loaderContainer}>
                        <CircularProgress />
                      </div>
                    )
                      : (
                        <Typography>
                          We compare the smart contract address in the certificate with the one stored in Talao foundation to verify the recipient identity.
                        </Typography>
                      )
                  }
                </CardContent>
              </Card>
            </Grid>
            <Hidden smDown><Grid item md={1}></Grid></Hidden>
            <Hidden smDown><Grid item md={1}></Grid></Hidden>
            <Grid item xs={12} md={10}>
              <Card classes={{ root: classes.cardRoot }}>
                <CardHeader
                  title={
                    <Typography variant="h2">Issuer identity</Typography>
                  }
                  avatar={
                    <Avatar className={this.getAvatarClass(2)}>
                      {this.issuerHasCorrectContract() && <Done />}
                    </Avatar>
                  }
                  classes={{root: classes.cardHeaderRoot}} />
                <CardContent classes={{ root: classes.cardContentRoot }}>
                  {
                    completedSteps <= 1 ? (
                      <div className={classes.loaderContainer}>
                        <CircularProgress />
                      </div>
                    )
                      : (
                        <Typography>
                          We compare the smart contract address in the certificate with the one stored in Talao foundation to verify the issuer identity.
                        </Typography>
                      )
                  }
                </CardContent>
              </Card>
            </Grid>
            <Hidden smDown><Grid item md={1}></Grid></Hidden>
            <Hidden smDown><Grid item md={1}></Grid></Hidden>
            <Grid item xs={12} md={10}>
              <Card classes={{ root: classes.cardRoot }}>
                <CardHeader
                  title={
                    <Typography variant="h2">Content validity</Typography>
                  }
                  avatar={
                    <Avatar className={this.getAvatarClass(3)}>
                      {this.hasEvent() && <Done />}
                    </Avatar>
                  }
                  classes={{root: classes.cardHeaderRoot}} />
                <CardContent classes={{ root: classes.cardContentRoot }}>
                  {
                    completedSteps <= 2 ? (
                      <div className={classes.loaderContainer}>
                        <CircularProgress />
                      </div>
                    )
                      : (
                        <Typography>
                          We compute the SHA 256 checksum of the certificate and compare it with the one stored when the certificate was issued. If anything changed in the certificate, the checksums will be different.
                      </Typography>
                      )
                  }
                </CardContent>
              </Card>
            </Grid>
            <Hidden smDown><Grid item md={1}></Grid></Hidden>
          </Grid>
        </Grid>
        <Grid item xs={12} md={3}>
          <Grid container spacing={16} className={classes.links}>
            <Grid item xs={12}>
              <Typography variant="h1" className={this.getTitleClass()}>
              {
                this.getTitleText()
              }
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography paragraph>Download the certificate JSON:</Typography>
              <Button
                onClick={() => this.download()}
                color="primary"
                variant="outlined">
                <ArrowDownward className={classes.buttonIcon} />Download
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Typography>Etherscan links:</Typography>
            </Grid>
            <Grid item xs={12}>
              <Button
                href={this.getEtherscanAddress(checkedRecipientEthereumContract)}
                target="etherscan"
                color="primary"
                variant="outlined">
                <Link className={classes.buttonIcon} />Freelance
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Button
                href={this.getEtherscanAddress(checkedOrganizationEthereumContract)}
                target="etherscan"
                color="primary"
                variant="outlined">
                <Link className={classes.buttonIcon} />Organization
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Button
                href={this.getEtherscanAddress(foundationJson.networks[ethereumHelper.getNetworkId(network)].address)}
                target="etherscan"
                color="primary"
                variant="outlined">
                <Link className={classes.buttonIcon} />Foundation
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Typography>Source code:</Typography>
            </Grid>
            <Grid item xs={12}>
              <Button
                href="https://github.com/TalaoDAO/talao-contracts"
                target="github"
                color="primary"
                variant="outlined">
                <Link className={classes.buttonIcon} />Smart contracts
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Button
                href="https://github.com/TalaoDAO/react-talao-certificates"
                target="github"
                color="primary"
                variant="outlined">
                <Link className={classes.buttonIcon} />React component
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    )
  }
}

export default withStyles(styles)(Verify)
