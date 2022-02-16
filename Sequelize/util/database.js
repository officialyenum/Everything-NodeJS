// const mysql = require('mysql2');

// const pool = mysql.createPool({
//     host:'localhost',
//     port:3306,
//     database:'node-test',
//     user:'root',
//     password:''
// });

// module.exports = pool.promise();

const Sequelize = require('sequelize');
const sequelize = new Sequelize("node-test","root","",{
    dialect:"mysql",
    host:"localhost"
});

module.exports = sequelize;