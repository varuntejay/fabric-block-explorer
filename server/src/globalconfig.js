const path = require('path');

module.exports.FABRIC_CHANNEL_NAME = 'mychannel'
module.exports.FABRIC_PEER_NAME = 'peer0.org1.example.com'    
module.exports.FABRIC_PEER_ADDRESS = 'grpcs://localhost:7051'
module.exports.FABRIC_PEER_TLS_FILE_PATH = path.join(__dirname, 'certs', 'tlsca.org1.example.com-cert.pem')

module.exports.FABRIC_CA_URL='http://localhost:7054'
module.exports.FABRIC_CLIENT_CERTS_PATH = path.join(__dirname, 'certs', 'hfc');
module.exports.FABRIC_CLIENT_USERNAME = 'user1'

