import idb from 'idb';
import { ChartController } from './chart.ctrl';
import { SheetsService } from './sheets.service';

export class IndexController {
	constructor() {
		this.childName = 'CHILD_NAME';

		this._dbPromise = this.openDatabase();	
		this._charts = new ChartController();

		this.displayCachedData();

		// Bind callback
		window.gApiLoaded = this._onGApiLoaded.bind(this);
	}

	displayCachedData() {
		this.loadData('weight').then(this.drawWeightChart.bind(this));
		this.loadData('height').then(this.drawHeightChart.bind(this));
	}

	drawWeightChart(data) {
		const weightData = data.map(item => ([item.time, item.weight]));
		this._charts.updateWeightChart([{name: this.childName, data: weightData}]);
	}

	drawHeightChart(data) {
		const heightData = data.map(item => ([item.time, item.height]));
		this._charts.updateHeightChart([{name: this.childName, data: heightData}]);
	}

	_onGApiLoaded() {
		this._service = new SheetsService();

		// Check if application already authorized
		this._service.authorize(true)
			.then(this._loadGData.bind(this))
			.catch(() => {
				// Show authorize button	
				document.getElementById('authorize-div').style.display = 'block';
				document.getElementById('authorize-button').addEventListener(() => {
					this._service.authorize(false).then(this._loadGData.bind(this));
				});
			})	
	}

	_loadGData() {
		this._service.loadSheetsApi()
			.then(() => this._service.loadData())
			.then(result => {
				this.storeData('weight', result.weightData);
				this.storeData('height', result.heightData);

				// Update charts if new data available
				this.drawWeightChart(result.weightData);
				this.drawHeightChart(result.heightData);
			});
	}

	loadData(name) {
		return this._dbPromise.then(db => {
			const tx = db.transaction(name, 'readonly');
			return tx.objectStore(name).getAll();	
		});
	}

	storeData(name, freshData) {
		return this._dbPromise.then(db => {
			const tx = db.transaction(name, 'readwrite');	

			freshData.forEach(item => {
				tx.objectStore(name).put(item);
			})	

			return tx.complete;
		});
	}

	openDatabase() {
		return idb.open('stats', 1, upgradeDB => {
			upgradeDB.createObjectStore('weight', {keyPath: 'time'});
			upgradeDB.createObjectStore('height', {keyPath: 'time'});
		});
	}
}
