const express = require('express');
const router = express.Router();
const fabricSdk = require('./../../sdk');

router.post('/', (req, res) => {
    try {
        fabricSdk.getChaincodesCount()
            .then(async (response) => {
                console.log(`*************`, response) ;
                let chaincodesCount = response.length;
                res.status(200).send({ status: true, chaincodesCount: chaincodesCount });
            })
    } catch (err) {
        res.status(500).send({ status: false });
    }
})

module.exports = router;