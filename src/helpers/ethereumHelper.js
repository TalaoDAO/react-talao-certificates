export default { getNetworkId, getDeploymentBlock }

function getNetworkId(_network) {
  switch (_network) {
    case 'rinkeby':
      return 4

    default:
      return 1
  }
}

function getDeploymentBlock(_network) {
  switch (_network) {
    case 'rinkeby':
      return 3890142

    default:
      return 7270398
  }
}