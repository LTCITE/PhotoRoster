const express = require('express');
const api = express.Router();
const https = require('https');
const http = require("http");
const session = require('express-session');
const cookieParser = require('cookie-parser');
const csv = require('fast-csv');
const fs = require('fs');

// all the constants are saved on this file ... 
var consts = require('../config/consts');

const globalHost = consts.globalHost
const client_secret = consts.client_secret
const newaccesstoken = consts.adminAccessToken

api.use(cookieParser());
api.use(session({ resave: true, saveUninitialized: true, secret: 'ssshhhhh' }));

global.crn_teacher_map = {};

api.all('/', function (req, res) {
    var stream = fs.createReadStream("crnFile.csv");

    req.session.body = req.body;
    var newcourseid = JSON.stringify(req.headers.referer);
    req.session.courseId = parseInt(newcourseid.substring(newcourseid.indexOf("es/") + 3, newcourseid.indexOf("es/") + 7));

    var csvStream = csv()
        .on("data", function (data) {
            csvData = data[0] + " " + data[1];
            var key = data[0] + "";
            var value = data[1] + "";
            crn_teacher_map[key] = value;
        })
        .on("end", function () {
            res.redirect('https://' + consts.globalHost + '/login/oauth2/auth?client_id=' + consts.client_id + '&response_type=code&redirect_uri=' + consts.redirect_uri);
        });
    stream.pipe(csvStream);
});

module.exports = api;