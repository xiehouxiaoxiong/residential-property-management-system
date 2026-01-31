const mysql = require("mysql");

const express = require('express')

var connection = mysql.createConnection({
    host: 'localhost', 
    port: '3306',
    user: 'root',
    password: '123456',
    database: 'residentialproperty',
    connectTimeout: 10000
});
connection.connect();
connection.on('error', (error) => {
    if (error.code === 'PROTOCOL_CONNECTION_LOST') {
        console.error('数据库连接丢失，尝试重新连接...');
        
    }
    if (error.code === 'ER_CON_COUNT_ERROR') {
        console.error('数据库连接过多，稍后再试...');
        
    }
    if (error.code === 'ETIMEDOUT') {
        console.error('连接数据库超时，检查网络连接或数据库服务状态...');
        
    }
    throw error; 
});

module.exports = connection