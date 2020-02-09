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
            let tlsOptions = {
                verify: false
            };
            fabricCaClient = new fabric_ca_client(FABRIC_CA_URL, tlsOptions, 'ca-org1', crypto_suite);
            return fabricCaClient.newAffiliationService().getOne("department1", user)
                .then((affiliation) => {
                    console.log("Affiliation: ", affiliation);                    
                }).catch((err) => {
                    return fabricCaClient.newAffiliationService().create({ "name": "department1" }, user)
                        .then((affiliation) => {
                            console.log('Successfully registered affiliation ', affiliation)
                        }).catch((err) => {                            
                            console.log('Failed to create the department: ' + err.stack ? err.stack : err);                            
                        });
                })
        } else {
            reject({ status: false, msg: 'Failed to load admin' })
        }
    })
