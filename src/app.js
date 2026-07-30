const express = require('express');
const cookieParser = require('cookie-parser');
const authroutes = require('./routes/auth.routes');
const musicroutes = require('./routes/music.routes');



const app = express();
app.use(express.json());
app.use(cookieParser());
app.use('/api/auth', authroutes);
app.use('/api/music', musicroutes);


module.exports = app;