export default { getNetworkId }

function getNetworkId(_name) {
  switch (_name) {
    case 'rinkeby':
      return 4

    default:
      return 1
  }
}