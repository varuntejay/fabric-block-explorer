const Fabric_Client = require('fabric-client');
const fs = require('fs');

const {
    FABRIC_CHANNEL_NAME,
    FABRIC_PEER_NAME,
    FABRIC_PEER_ADDRESS,
    FABRIC_PEER_TLS_FILE_PATH,    
    FABRIC_CLIENT_CERTS_PATH,
    FABRIC_CLIENT_USERNAME
} = require('./../globalconfig.js')

const tlsCert = fs.readFileSync(FABRIC_PEER_TLS_FILE_PATH).toString();

const fabric_client = new Fabric_Client();
let channel = fabric_client.newChannel(FABRIC_CHANNEL_NAME);
let peer = fabric_client.newPeer(FABRIC_PEER_ADDRESS,
    {
        'pem': tlsCert,
        'ssl-target-name-override': FABRIC_PEER_NAME
    });

channel.addPeer(peer);

const getFabricClient = () => {
    return new Promise ((resolve, reject) => {
        let user = FABRIC_CLIENT_USERNAME;
        Fabric_Client.newDefaultKeyValueStore({
            path: FABRIC_CLIENT_CERTS_PATH
        }).then((state_store) => {
            // assign the store to the fabric client
            fabric_client.setStateStore(state_store);
            var crypto_suite = Fabric_Client.newCryptoSuite();
            // use the same location for the state store (where the users' certificate are kept)
            // and the crypto store (where the users' keys are kept)
            var crypto_store = Fabric_Client.newCryptoKeyStore({ path: FABRIC_CLIENT_CERTS_PATH });
            crypto_suite.setCryptoKeyStore(crypto_store);
            fabric_client.setCryptoSuite(crypto_suite);
            return fabric_client.getUserContext(user, true);
        }).then((user_from_store) => {
            if (user_from_store && user_from_store.isEnrolled()) {
                // console.log('Successfully loaded user1 from persistence');                
                member_user = user_from_store;
                resolve();                
            } else {
                throw new Error('Failed to get user1.... run registerUser.js');
            }
        });
    })
}

module.exports.getBlocksHeight = () => {
    return new Promise((resolve, reject) => {
        try {
            getFabricClient().then(() =>{
                resolve (channel.queryInfo());
            })
        } catch (err)  {
            console.error(err);
            reject({status: false, err: err});
        }
    })
}

module.exports.getBlocksDetailsByNumber = (blockNumber) => {
    return new Promise((resolve, reject) => {
        try {
            getFabricClient().then(() =>{
                resolve (channel.queryBlock(blockNumber));
            })
        } catch (err) {
            console.error(err);
            reject({status: false, err: err})            
        }
    })
}

module.exports.getPeersCount = () => {
    return new Promise((resolve, reject) => {
        try {
            getFabricClient().then(() =>{
                resolve (channel.getPeers());
            })
        } catch (err) {
            console.error(err);
            reject({status: false, err: err})            
        }
    })
}


module.exports.getChaincodesCount = () => {
    return new Promise((resolve, reject) => {
        try {
            getFabricClient().then(() =>{
                resolve (channel.queryInstantiatedChaincodes());
            })
        } catch (err) {
            console.error(err);
            reject({status: false, err: err})            
        }
    })
}



