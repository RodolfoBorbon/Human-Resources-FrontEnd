// oracledb.js

const oracledb = require('oracledb');

let connection;

async function connectToDb() {
    try {
        connection = await oracledb.getConnection({
            user: "COMP214_m23_er_10",
            password: "password",
            connectString: "199.212.26.208:1521/SQLD"
        });
        console.log("Successfully connected to Oracle DB");
    } catch (err) {
        console.error(err);
    }
    return connection;
}

module.exports = {
    connect: connectToDb,
    connection: () => connection
};