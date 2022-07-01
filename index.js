const express = require('express');
const serverPort = 9000;
const app = express();
const data = require('./data.js');
const cors = require('cors');

app.use(cors());
// define the index route
app.get('/', (req, res) => {
    console.log(data); 
    res.send(data);
});
// define the API routes here.. 

app.listen(serverPort, () => console.log('Express server is running!'));