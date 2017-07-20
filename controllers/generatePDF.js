const express = require('express');
const api = express.Router();
const fs = require('fs');
var PDFDocument = require('pdfkit');
var request = require('request');
var async = require('async');
var https = require('https');
const session = require('express-session');

api.post('/', function (req, res) {


	var name = req.body.name;
	var section = req.body.sectionID;
	var imageArray = req.body.image;
	var courseName = req.body.courseName;
	var courseTerm = req.body.courseTerm;
	var courseID = req.body.courseID;

	//Fetching course ID from session variable
	session["courseID"] = courseID;

	var file = './photoroster/' + courseID + '.pdf';
	res.setHeader('Content-disposition', 'attachment; filename=' + file);
	res.setHeader('Content-type', 'application/pdf');


	//creating document
	doc = new PDFDocument
	doc.pipe(res);
	doc.pipe(fs.createWriteStream(file));
	doc.text('Photo Roster: ' + section);
	doc.text('Course Name: ' + courseName + ' - ' + courseTerm);
	doc.fontSize(10);
	var x = 60
	var y = 120
	var i = 0
	var j = 0
	var magic = {
		jpg: 'ffd8ffe0',
		png: '89504e47',
		gif: '47494638'
	};

	function imagetoPDF(url, callback) {
		request({ url: url, encoding: null }, function (error, response, body) {
			if (!error && response.statusCode == 200) {
				var magicNumberInBody = body.toString('hex', 0, 4);
				if (magicNumberInBody == magic.jpg || magicNumberInBody == magic.png) {
					doc.image(body, x, y, { width: 100, height: 100 });
				}
				else {
					doc.image('./photoroster_assets/img/avatar-50.png', x, y, { width: 100, height: 100 });
				}
				doc.text(name[i], x, y + 105, { width: 100, height: 100 });
				i += 1
				j += 1
				x += 120
				if (x >= 480) {
					x = 60
					y += 140
				}
				if (y > 550) {
					doc.addPage();
					y = 50
				}
				callback(error, 'done');

			}
		});
	}

	async.eachSeries(imageArray, imagetoPDF, function (err, data) {
		if (err) {
			return err;
		} else {
			doc.end();
			res.send(data);
		}

	});

});

module.exports = api;