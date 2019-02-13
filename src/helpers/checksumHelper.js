import { sha256 } from 'js-sha256'

export default { get }

function get(_json) {
  const stringified = JSON.stringify(_json)
  const checksum = sha256(stringified)
  return checksum
}
