const express = require('express');
const router = express.Router();
const fabricSdk = require('./../../sdk');

router.post('/details', async (req, res) => {
    try {
        const { fromBlockNumber, toBlockNumber } = req.body;
        console.log("From block number: ", fromBlockNumber);
        console.log("To block number:   ", toBlockNumber)

        let blocksDetails = []
        for (let blockNumber = fromBlockNumber; blockNumber >= toBlockNumber; blockNumber--) {
            let result = await fabricSdk.getBlocksDetailsByNumber(blockNumber);
            blocksDetails.push({
                blockNumber: result.header.number,
                // blockHash: hashCalculator.calculateBlockHash(result.header),
                previousHash: result.header.previous_hash,
                dataHash: result.header.data_hash,
                trnxnCount: (result.data.data).length,
                trnxns: result.data.data
            })
        }
        res.status(200).send({ status: true, blocksDetails: blocksDetails });

    } catch (err) {
        res.status(500).send({ status: false });
    }
})

router.post('/height', (req, res) => {
    try {
        fabricSdk.getBlocksHeight()
            .then(async (response) => {
                let blocksHeight = parseInt(response.height);
                res.status(200).send({ status: true, blocksHeight: blocksHeight });
            })
    } catch (err) {
        res.status(500).send({ status: false });
    }
})

module.exports = router;