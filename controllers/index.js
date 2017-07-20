const express = require('express');
const api = express.Router();
const https = require('https');
const http = require("http");
const session = require('express-session');
const cookieParser = require('cookie-parser');

// all the constants are saved on this file ... 
var consts = require('../config/consts');

const globalHost = consts.globalHost
const client_secret = consts.client_secret




api.use(cookieParser());
api.use(session({ resave: true, saveUninitialized: true, secret: 'ssshhhhh' }));

var sis_section_id_array = [];

var sis_section_id_array = [];

api.get('/', function (req, res) {
    var crnNumberArray = [];
    var codeFromRequest = req.query.code;
    var sectionsArray = [];
    var sectionIDArray = [];
    var json = '';
    var userInfoStr = '';
    var responseDataSections = '';
    var responseDataCourse = '';
    var courseDetailArray = [];

    // All the options:   
    var optionsGetUserAccessToken = {
        hostname: globalHost,
        path: '/login/oauth2/token?grant_type=authorization_code&client_id=' + consts.client_id + '&client_secret=' + client_secret + '&redirect_uri=' + consts.redirect_uri + '&code=' + codeFromRequest,
        method: 'POST'
    };

    // Step 1 : Get user access token 
    var getUserAccessToken = function (response) {
        response.on('data', function (body) {
            json += body;
        });

        response.on('end', function () {
            json = JSON.parse(json);
            // If user clicks Cancel on authorization request
            if (json.error == 'invalid_grant') {
                res.render('about');
            }
            else {
                req.session.access_token = json.access_token;
                req.session.canvasID = json.user.id;
                name = json.user.name;
            }
            var optionsGetUserId = {
                hostname: globalHost,
                path: '/api/v1/users/' + req.session.canvasID + '?access_token=' + consts.adminAccessToken,
                method: 'GET'
            }
            // Step 2 : Get 919 number of the User 
            var getUserId = function (response) {
                response.on('data', function (chunk) {
                    userInfoStr += chunk;
                })

                response.on('end', function () {
                    userInfoStr = JSON.parse(userInfoStr);
                    req.session.facultyId = userInfoStr.sis_user_id;

                    var optionsGetCourse = {
                        host: globalHost,
                        path: '/api/v1/courses/' + req.session.courseId + '/?per_page=200&include[]=term&access_token=' + consts.adminAccessToken
                    };

                    //Step 4: Get course name and term
                    var getCourse = function (response) {
                        response.on('data', function (chunk) {
                            responseDataCourse += chunk;
                        });
                        response.on('end', function () {
                            responseDataCourse = JSON.parse(responseDataCourse);
                            var temp = {
                                name: responseDataCourse.name,
                                term: responseDataCourse.term.name,
                                sis_course_id: responseDataCourse.sis_course_id
                            }
                            courseDetailArray.push(temp);

                            var optionsGetSections = {
                                host: globalHost,
                                path: '/api/v1/courses/' + req.session.courseId + '/sections?per_page=200&access_token=' + consts.adminAccessToken
                            };

                            // Step 3 :  Get Sections 
                            var getSections = function (response) {
                                response.on('data', function (chunk) {
                                    responseDataSections += chunk;
                                });
                                response.on('end', function () {
                                    responseDataSections = JSON.parse(responseDataSections)

                                    for (var key in responseDataSections) {
                                        if (responseDataSections.hasOwnProperty(key)) {
                                            if (responseDataSections[key].sis_section_id != null) {

                                                var temp_sis_section_id = responseDataSections[key].sis_section_id;
                                                var tempCrnArray = temp_sis_section_id.split('-');

                                                // position 3 has the CRN number that we need ..
                                                sis_section_id_array.push(tempCrnArray[3]);

                                                if (crn_teacher_map[tempCrnArray[3]] == req.session.facultyId) {
                                                    sectionsArray.push(responseDataSections[key]);
                                                    sectionIDArray.push(responseDataSections[key].id);
                                                    if (tempCrnArray[3] != undefined) {
                                                        crnNumberArray.push(tempCrnArray[3]);
                                                    }
                                                }
                                            }
                                        }
                                    }





                                    // if there is no sections, it means the user doesn't teach any 
                                    if (crnNumberArray.length > 0) {
                                        generateStudentRecords(sectionIDArray[0], sectionsArray, crnNumberArray, req, res, courseDetailArray);

                                    } else {
                                        res.render('unauthorize');
                                    }

                                });
                            }// end of get sections ...
                            var tempReq = https.request(optionsGetSections, getSections);
                            tempReq.end();

                        });
                    }
                    var coursereq = https.request(optionsGetCourse, getCourse);
                    coursereq.end();
                });
            }

            var userInfoVar = https.request(optionsGetUserId, getUserId);
            userInfoVar.end();

        });
    }
    var accReq = https.request(optionsGetUserAccessToken, getUserAccessToken);
    accReq.end();


});

api.get('/section/:id', function (req, res) {
    var crnNumberArray = [];
    var sectionsArray = [];
    var sectionIDArray = [];
    var responseDataSections = "";
    var responseDataCourse = '';
    var courseDetailArray = [];

    var optionsGetCourse = {
        host: globalHost,
        path: '/api/v1/courses/' + req.session.courseId + '/?per_page=200&include[]=term&access_token=' + consts.adminAccessToken
    };



    //Step 4: Get course name and term
    var getCourse = function (response) {
        response.on('data', function (chunk) {
            responseDataCourse += chunk;
        });
        response.on('end', function () {
            responseDataCourse = JSON.parse(responseDataCourse);
            // key is index value 0 1 2 ...

            var temp = {
                name: responseDataCourse.name,
                term: responseDataCourse.term.name,
                sis_course_id: responseDataCourse.sis_course_id
            }
            courseDetailArray.push(temp);

            var optionsCourse = {
                host: globalHost,
                path: '/api/v1/courses/' + req.session.courseId + '/sections?per_page=200&access_token=' + consts.adminAccessToken
            };

            var callback = function (response) {

                response.on('data', function (chunk) {
                    responseDataSections += chunk;
                });

                response.on('end', function () {
                    responseDataSections = JSON.parse(responseDataSections)

                    for (var key in responseDataSections) {
                        if (responseDataSections.hasOwnProperty(key)) {
                            if (responseDataSections[key].sis_section_id != null) {

                                var temp_sis_section_id = responseDataSections[key].sis_section_id;
                                var tempCrnArray = temp_sis_section_id.split('-');

                                // position 3 has the CRN number that we need ..
                                sis_section_id_array.push(tempCrnArray[3]);

                                if (crn_teacher_map[tempCrnArray[3]] == req.session.facultyId) {
                                    sectionsArray.push(responseDataSections[key]);
                                    sectionIDArray.push(responseDataSections[key].id);
                                    if (tempCrnArray[3] != undefined) {
                                        crnNumberArray.push(tempCrnArray[3]);
                                    }
                                }
                            }
                        }

                    }

                    // if there is no sections, it means the user doesn't teach any 
                    if (crnNumberArray.length > 0) {

                        generateStudentRecords(req.params.id, sectionsArray, crnNumberArray, req, res, courseDetailArray);

                    } else {
                        res.render('unauthorize');
                    }

                });
            }
            var tempReq = https.request(optionsCourse, callback);
            tempReq.end();

        });
    }
    var coursereq = https.request(optionsGetCourse, getCourse);
    coursereq.end();
});


function generateStudentRecords(currentSectionId, sectionsArray, crnNumberArray, req, res, courseDetailArray) {

    var studentRecordsArray = [];
    // step 4
    var options2 = {
        host: globalHost,
        path: '/api/v1/sections/' + currentSectionId + '/enrollments?per_page=200&include[]=avatar_url&access_token=' + consts.adminAccessToken
    };
    var str2 = "";
    var callback2 = function (response2) {
        response2.on('data', function (chunk) {
            str2 += chunk;
        });
        response2.on('end', function () {
            str2 = JSON.parse(str2)
            for (var key in str2) {
                if (str2.hasOwnProperty(key)) {
                    // only push if the user is a student 
                    //removing name check here
                    if (str2[key].user) {
                        if (str2[key].user.name) {
                            if (str2[key].role === "StudentEnrollment" && str2[key].user.name != "Test Student") {

                                var temp = {
                                    name: str2[key].user.name,
                                    sis_section_id: str2[key].sis_section_id,
                                    avatar_url: str2[key].user.avatar_url
                                }

                                studentRecordsArray.push(temp)
                            }
                        }
                    }

                }
            }
            renderResponsePage(studentRecordsArray, sectionsArray, currentSectionId, res, courseDetailArray);
        });
    }

    var tempReq2 = https.request(options2, callback2);
    tempReq2.end();

}


function renderResponsePage(studentRecords, sections, currentSection, res, courseDetailArray) {
    res.render("index", { studentRecords: studentRecords, sections: sections, currentSection: currentSection, courseDetailArray: courseDetailArray });
}

module.exports = api;

