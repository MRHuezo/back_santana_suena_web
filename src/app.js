const express = require('express');
const cors = require('cors');
const app = express();


//settings
app.set('port', process.env.PORT || '0.0.0.0');
app.set('host',process.env.HOST || '0.0.0.0');

app.use(cors());

app.use(express.json());

//Routes
app.use('/api/sede', require('./routes/Sedes'));
app.use('/api/competitor', require('./routes/Competitor'));
app.use('/api/user', require('./routes/Users'));
app.use('/api/tiopa', require('./routes/Tiopa'));
app.use(express.static('uploads'));

module.exports = app;