# fabric-block-explorer
Hyperledger fabric custom block explorer built using React JS as client and Node JS as server

## **Prerequisites**

1. Nodejs 10.x.x

2. Fabric Network 

3. Fabric Crypto material
    
## **Installation**

First ensure you are in a new and empty directory.

1. Clone the respository

```
git clone https://github.com/varuntejay/fabric_block_explorer
```

2. Change directory to server and install node modules

```
cd ./server
npm install
```

3. Change directory to client and install node modules

```
cd ./client
npm install
```

## **Configuration**

1. Copy the peer tls certificate from network crypto-config folder to following directory

```
./server/src/certs
```
E.g. peer tls certifcate path in fabric samples - first network is following

```
fabric-samples/first-network/crypto-config/peerOrganizations/org1.example.com/tlsca/tlsca.org1.example.com-cert.pem
```

2. Copy the user certifcate registered either from fabric-ca tool or custom tool to following directory

```
./server/src/certs/hfc
```

  - If User certificate available. Please update the following globalconfig file with username
  
  ```
  ./server/src/globalconfig.js
  module.exports.FABRIC_CLIENT_USERNAME = '{username}'
  ```
  
  - If you don't have scripts to generate user certifcates. Please follow the steps listed below.
  
    - Open the following file in a code/text editor
    
    ```
    ./server/src/globalconfig.js
    ```
    - Edit the following configuration to point to the fabric CA
    
    ```
    module.exports.FABRIC_CA_URL='http://localhost:7054'    
    module.exports.FABRIC_CLIENT_USERNAME = 'user1'
    ```
    - Next run the following scripts one after another.
    
     ```
     ./server/src/fabric_ca/enrolladmin.js
     ./server/src/fabric_ca/enrollaffiliation.js
     ./server/src/fabric_ca/registeruser.js
     ```
     - With the above steps, an user certifcate will be created under the following direcotry
     
     ```
     ./server/src/certs/hfc
     ```
 3. Update the fabric configuration following global config file.
 
 ```
./server/src/globalconfig.js

// 
module.exports.FABRIC_CHANNEL_NAME = 'mychannel'
module.exports.FABRIC_PEER_NAME = 'peer0.org1.example.com'    
module.exports.FABRIC_PEER_ADDRESS = 'grpcs://localhost:7051'
 ```
## **Run node express back end server**

1. First ensure that you're in the fabric-block-explorer/server folder.

2. Run the node express back end server in dev mode. This will up bring the express server on PORT 9086.

```
npm run dev
```
3. Make a test get call to express server. This will return "Hello from server".

```
http://localhost:9086
```

## **Run react front end application**

1. First ensure that you're in the fabric-block-explorer/client folder.

2. Run the web application in dev mode. This will up bring the react front end application on PORT 4000.

```
npm run dev
```
3. Check out to the following URL to access the web application.

```
http://localhost:4000
```



