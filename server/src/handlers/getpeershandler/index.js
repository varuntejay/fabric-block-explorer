const express = require('express');
const router = express.Router();
const fabricSdk = require('./../../sdk');

router.post('/', (req, res) => {
    try {
        fabricSdk.getPeersCount()
            .then(async (response) => {
                let peersCount = response.length;
                res.status(200).send({ status: true, peersCount: peersCount });
            })
    } catch (err) {
        res.status(500).send({ status: false });
    }
})

module.exports = router;