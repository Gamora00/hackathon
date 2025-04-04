const express = require('express')
const router = express.Router()
const verifyToken = require('../middleware/verifyToken')
const profile = require('../routes/politicsProfile')
const MythBuster = require('../routes/getmythbuster')
const rightAndRiddle = require('../routes/getRightAndRiddle')
const NewFlash = require('../routes/getNewFlash')
const news = require('../routes/getnewprofile')
const lesson = require('../routes/lesson')
const statistics = require('../routes/statistics')
const lessonTable = require('../routes/lessonsTable')

router.get('/verifyToken',verifyToken.verifyToken)
router.get('/profile/:id',profile.profile)
router.get('/mythBusterPage',MythBuster.getMythbuster)
router.get('/rightAndRiddle',rightAndRiddle.rightAndRiddle)
router.get('/newsFlash',NewFlash.getNewsFlash)
router.get('/news/:id',news.getNews)
router.get('/lesson/:id', lesson.lesson)

router.get('/lessons', lessonTable.lessonTable)
router.get('/statistics', statistics.statistics)

module.exports = router