const express = require('express');
const router = express.Router();
const musicController = require('../controllers/music.controller');
const multer = require('multer');
const upload = multer();



router.post('/upload',upload.single('music'),musicController.createMusic);






module.exports = router;
