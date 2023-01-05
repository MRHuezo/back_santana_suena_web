const mongoose = require('mongoose');


const URI = process.env.MONGO_URI;

mongoose.connect(URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
   // useFindAndModify: false,

   
});

const connection = mongoose.connection;

connection.once('open', () => {
    console.log('database is connected');
});