export class ChartController {
	constructor() {}

	updateWeightChart(series) {
		Highcharts.chart('weightChart', {
			chart: {
				type: 'spline',
				animation: false
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
				series: {
					animation: false
				}, 
				spline: {
					marker: {
						enabled: true
					}
				}
			},
			series
		});
	}

	updateHeightChart(series) {
		Highcharts.chart('heightChart', {
			chart: {
				type: 'spline',
				animation: false
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
				series: {
					animation: false
				}, 
				spline: {
					marker: {
						enabled: true
					}
				}
			},
			series
		});
	}
}
