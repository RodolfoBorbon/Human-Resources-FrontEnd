//Back-End/server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const routes = require('./routes/routes');
const dbModule = require('./oracledb');

const server = express();

// Middleware setup
server.use(cors());
server.use(bodyParser.json());
server.use(routes);

// Establish the database connection
async function init() {
    await dbModule.connect();

    // Establish the Port
    const port = 8080;
    server.listen(port, function check(error) {
        if (error) {
            console.log("Error....!!!!");
        } else {
            console.log("Started....at port:", port);
        }
    });
}

init();