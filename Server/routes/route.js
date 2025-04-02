const express = require('express')
const router = express.Router()
const verifyToken = require('../middleware/verifyToken')
const profile = require('../routes/politicsProfile')
const MythBuster = require('../routes/getmythbuster')
const rightAndRiddle = require('../routes/getRightAndRiddle')

router.get('/verifyToken',verifyToken.verifyToken)
router.get('/profile/:id',profile.profile)
router.get('/mythBusterPage',MythBuster.getMythbuster)
router.get('/rightAndRiddle',rightAndRiddle.rightAndRiddle)

module.exports = router