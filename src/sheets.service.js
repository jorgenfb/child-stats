export class SheetsService {
	constructor() {
		this.spreadsheetId = 'GOOGLE_SHEETS_DOCUMENT_URL';
	}

	authorize(immediate) {
		return new Promise((resolve, reject) => {
			gapi.auth.authorize({
					'client_id': 'GOOGLE_SHEETS_CLIENT_ID',
					'scope': 'https://www.googleapis.com/auth/spreadsheets.readonly',
					'immediate': immediate
				}, authResult => {
					if (authResult && !authResult.error) {
						resolve(authResult);
					} else {
						reject(authResult);
					}
				});
		});
	}

	loadSheetsApi() {
		var discoveryUrl = 'https://sheets.googleapis.com/$discovery/rest?version=v4';
		return gapi.client.load(discoveryUrl);
	}

	loadData() {
		return gapi.client.sheets.spreadsheets.values.get({
			spreadsheetId: this.spreadsheetId,
			range: 'Input!A2:C',
		}).then(function(response) {
			var range = response.result;
			if (range.values.length > 0) {
				var weightData= [];
				var heightData = [];
				for (let i = 0; i < range.values.length; i++) {
					var row = range.values[i];
					var dateParts = row[0].split('.');
					var utc = Date.UTC(parseInt(dateParts[2]), parseInt(dateParts[1]) - 1, parseInt(dateParts[0]));

					if (row[1]) {
						weightData.push({time: utc, weight: parseFloat(row[1].replace(',','.'))});
					}
					if (row[2]) {
						heightData.push({time: utc, height: parseFloat(row[2].replace(',','.'))});
					}
				}
				return {weightData, heightData};
			}
		}, function(response) {
			alert('Error: ' + response.result.error.message);
		});
	}
}
