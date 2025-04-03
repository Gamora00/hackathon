const express = require('express')
const router = express.Router()
const Login = require('../auth/login')
const Register = require('../auth/register')
const AddPolitician = require('../auth/addPolitician')
const RenderPolitics = require('../auth/renderPolitics')
const Game = require('../auth/game')
const mythBuster = require('../auth/mythBuster')
const AddLesson = require('../auth/addLesson')
const AddNewsFlash = require('../auth/addnewsFlash')

const multer = require("multer")
const upload = multer();

router.post('/login', Login.login)
router.post('/register', Register.register)
router.post('/addPolitician', AddPolitician.addPolitician)
router.post('/renderPolitics', RenderPolitics.Politics)
router.post('/game', Game.game)
router.post('/mythBuster', mythBuster.mythBuster)
router.post('/addLesson',upload.none(), AddLesson.addLesson)

router.post('/AddNewsFlash', AddNewsFlash.addNewsFlash)


module.exports = router