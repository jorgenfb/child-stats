// 
// check cached data
// check if authenticated
// get updated data
// cache for later
// update graphs if changed


// Your Client ID can be retrieved from your project in the Google
// Developer Console, https://console.developers.google.com
var CLIENT_ID = 'GOOGLE_SHEETS_CLIENT_ID';

var SCOPES = ["https://www.googleapis.com/auth/spreadsheets.readonly"];

/**
 * Check if current user has authorized this application.
 */
function checkAuth() {
	gapi.auth.authorize(
		{
			'client_id': CLIENT_ID,
			'scope': SCOPES.join(' '),
			'immediate': true
		}, handleAuthResult);
}

window.checkAuth = checkAuth;

/**
 * Handle response from authorization server.
 *
 * @param {Object} authResult Authorization result.
 */
function handleAuthResult(authResult) {
	var authorizeDiv = document.getElementById('authorize-div');
	if (authResult && !authResult.error) {
		// Hide auth UI, then load client library.
		authorizeDiv.style.display = 'none';
		loadSheetsApi();
	} else {
		// Show auth UI, allowing the user to initiate authorization by
		// clicking authorize button.
		authorizeDiv.style.display = 'block';
	}
}

/**
 * Initiate auth flow in response to user clicking authorize button.
 *
 * @param {Event} event Button click event.
 */
function handleAuthClick(event) {
	gapi.auth.authorize(
		{client_id: CLIENT_ID, scope: SCOPES, immediate: false},
		handleAuthResult);
	return false;
}

/**
 * Load Sheets API client library.
 */
function loadSheetsApi() {
	var discoveryUrl =
			'https://sheets.googleapis.com/$discovery/rest?version=v4';
	gapi.client.load(discoveryUrl).then(printData);
}

/**
 * Print the names and majors of students in a sample spreadsheet:
 * https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
 */
function printData() {
	gapi.client.sheets.spreadsheets.values.get({
		spreadsheetId: 'GOOGLE_SHEETS_DOCUMENT_URL',
		range: 'Input!A2:D',
	}).then(function(response) {

		var range = response.result;
		if (range.values.length > 0) {
			var weightData= [];
			var lengthData = [];
			var headCircumferenceData = [];
			for (let i = 0; i < range.values.length; i++) {
				var row = range.values[i];
				var dateParts = row[0].split('.');
				var utc = Date.UTC(parseInt(dateParts[2]), parseInt(dateParts[1]) - 1, parseInt(dateParts[0]));

				if (row[1]) {
					weightData.push([utc, parseFloat(row[1].replace(',','.'))]);
				}
				if (row[2]) {
					lengthData.push([utc, parseFloat(row[2].replace(',','.'))]);
				}
				if (row[3]) {
					headCircumferenceData.push([utc, parseFloat(row[3].replace(',','.'))]);
				}
			}
			drawWeightChart(weightData);
			drawLengthChart(lengthData);
		}
	}, function(response) {
		alert('Error: ' + response.result.error.message);
	});
}

function drawWeightChart(data) {
	Highcharts.chart('weightChart', {
		chart: {
				type: 'spline'
		},
		title: {
			text: 'Vekt'
		},
		xAxis: {
				type: 'datetime',
				title: {
						text: 'Dato'
				}
		},
		yAxis: {
				title: {
						text: 'Vekt (kg)'
				},
				min: 3
		},
		tooltip: {
				headerFormat: '<b>{series.name}</b><br>',
				pointFormat: '{point.x:%e. %b}: {point.y:.2f} m'
		},
		plotOptions: {
				spline: {
						marker: {
								enabled: true
						}
				}
		},
		series: [{
			name: 'CHILD_NAME',
			data: data
		}]
	})
}

function drawLengthChart(data) {
	Highcharts.chart('lengthChart', {
		chart: {
				type: 'spline'
		},
		title: {
			text: 'Lengde'
		},
		xAxis: {
				type: 'datetime',
				title: {
						text: 'Dato'
				}
		},
		yAxis: {
				title: {
						text: 'Lengde (m)'
				},
		},
		tooltip: {
				headerFormat: '<b>{series.name}</b><br>',
				pointFormat: '{point.x:%e. %b}: {point.y:.2f} m'
		},
		plotOptions: {
				spline: {
						marker: {
								enabled: true
						}
				}
		},
		series: [{
			name: 'CHILD_NAME',
			data: data
		}]
	})
}


