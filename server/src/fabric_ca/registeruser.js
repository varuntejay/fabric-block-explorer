const fabric_ca_client = require('fabric-ca-client');
const fabric_client = require('fabric-client');
const {
    FABRIC_CA_URL,
    FABRIC_CLIENT_CERTS_PATH
} = require('../globalconfig');

let fabricClient = new fabric_client();
let fabricCaClient = null;
let crypto_suite = null;
let store_path = FABRIC_CLIENT_CERTS_PATH;
let admin_user = null;
let user = 'user1';
console.log(' Store path:' + store_path);

fabric_client.newDefaultKeyValueStore({ path: store_path })
    .then((state_store) => {
        fabricClient.setStateStore(state_store);
        crypto_suite = fabric_client.newCryptoSuite();
        let crypto_store = fabric_client.newCryptoKeyStore({ path: store_path });
        crypto_suite.setCryptoKeyStore(crypto_store);
        fabricClient.setCryptoSuite(crypto_suite);
        return fabricClient.getUserContext('admin', true)
    }).then((user_from_store) => {
        if (user_from_store && user_from_store.isEnrolled()) {
            admin_user = user_from_store;
        } else {
            reject({ status: false, msg: 'Failed to load admin' })
        }
        let tlsOptions = {
            verify: false
        };

        fabricCaClient = new fabric_ca_client(FABRIC_CA_URL, tlsOptions, 'ca-org1', crypto_suite);
        return fabricCaClient.register({ enrollmentID: user, affiliation: 'department1', role: 'client' }, admin_user)
    }).then((secret) => {
        console.log('Successfully registered ' + user + ' - secret:' + secret);
        return fabricCaClient.enroll({ enrollmentID: user, enrollmentSecret: secret });
    }).then((enrollment) => {
        console.log('Successfully enrolled member user ', user);
        return fabricClient.createUser(
            {
                username: user,
                mspid: 'Org1MSP',
                cryptoContent: { privateKeyPEM: enrollment.key.toBytes(), signedCertPEM: enrollment.certificate }
            });
    }).then((user) => {
        console.log(`User registedred success ${user}`)
    }).catch((err) => {
        console.error('Failed to enroll and persist admin. Error: ' + err.stack ? err.stack : err);        
    });


