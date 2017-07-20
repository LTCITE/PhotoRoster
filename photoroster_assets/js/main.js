$(document).ready(function () {
	// this section makes the current section navbar active 
	var currentSection = $('#currentSection').text();
	var navString = "#navId" + currentSection;
	$(navString).addClass('active');
});


function printPDF() {
	//wait icon
	$("#loading").css("display", "block");

	var nameArray = []

	var imageArray = []

	$('.nameClass').each(function (userName) {
		nameArray.push($(this).text());
	});

	$('.avatar').each(function (image) {
		imageArray.push($(this).attr('src'));

	});

	var sectionID = $('#sectionID').text();
	var courseName = $('#courseName').text();
	var courseTerm = $('#courseTerm').text();
	var courseID = $('#courseID').text();


	var root = "https://<server-hostname>/photoroster/generatePDF";

	var data = [];

	data = {}
	data.name = nameArray;
	data.sectionID = sectionID;
	data.image = imageArray;
	data.courseName = courseName;
	data.courseTerm = courseTerm;
	data.courseID = courseID;

	$.ajax({
		url: root,
		type: 'POST',
		data: JSON.stringify(data), // converts javascript to JSON
		contentType: 'application/json',
		success: function (response) {
			$('#downloadPDFButton').prop("href", "/photoroster/downloadPDF");

		},
		complete: function (response) {

			downloadPDF();
			$("#loading").css("display", "none");
		}
	});

}

function downloadPDF() {
	$("#downloadPDFButton")[0].click();
}