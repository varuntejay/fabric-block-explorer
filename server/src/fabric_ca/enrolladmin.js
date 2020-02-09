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
console.log(' Store path:' + store_path);

fabric_client.newDefaultKeyValueStore({ path: store_path })
    .then((state_store) => {
        fabricClient.setStateStore(state_store);
        crypto_suite = fabric_client.newCryptoSuite();
        let crypto_store = fabric_client.newCryptoKeyStore({ path: store_path });
        crypto_suite.setCryptoKeyStore(crypto_store);
        fabricClient.setCryptoSuite(crypto_suite);
        return fabricClient.getUserContext('admin', true)
    }).then((user) => {
        if (user && user.isEnrolled()) {
            console.log('Sucessfully loaded admin from store')
            resolve({ status: true, msg: 'Admin already exists' })
        } else {
            let tlsOptions = {
                verify: false
            };
            fabricCaClient = new fabric_ca_client(FABRIC_CA_URL, tlsOptions, 'ca-org1', crypto_suite);
            fabricCaClient.enroll({
                enrollmentID: 'admin',
                enrollmentSecret: 'adminpw'
            }).then((enrollment) => {
                console.log('Successfully enrolled admin user "admin"');
                return fabricClient.createUser(
                    {
                        username: 'admin',
                        mspid: 'Org1MSP',
                        cryptoContent: { privateKeyPEM: enrollment.key.toBytes(), signedCertPEM: enrollment.certificate }
                    });
            }).then((user) => {
                console.log(user)
            }).catch((err) => {
                console.error('Failed to enroll and persist admin. Error: ' + err.stack ? err.stack : err);                
            });
        }
    }).catch((err) => {
        console.log("Error: ", err);
        reject({ err: err })
    })