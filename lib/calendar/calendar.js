'use strict'

const journeys = require('../api').journeys
const chunk = require('lodash').chunk
const formatDuration = require('ms')
const moment = require('moment-timezone')
const Queue = require('p-queue')
const retry = require('p-retry')
const timeout = require('p-timeout')
const helpers = require('../helpers')
const sortBy = require('lodash').sortBy

const timeoutTime = 10*1000
const ChartjsNode = require('chartjs-node');



// format output (only price and duration)
const formatDayResult = (result) => {
	return result ? {
		price: helpers.formatPrice(result.price.amount),
		duration: formatDuration(result.duration),
		graph: result.graph
	} : null
}


function createGraph(day,max,min) {
	var chartNode = new ChartjsNode(128, 40);
	var heights = [];
	var colors=[];
	for (var i = 0; i < 24; i++) {
		heights.push(0);
		colors.push('rgba(0,0,0,0)');
	}
	for(let journey of day) {
		var hour = new Date(journey.legs[0].departure).getHours();
		if (heights[hour] > journey.price.amount || heights[hour] == 0){
			heights[hour] = journey.price.amount;
			var factor = 1- (journey.price.amount - min) /(max-min);
			colors[hour] = 'hsla('+Math.floor(factor*122)+', 50%, 50%,0.4)';
		}

	}
	console.log(heights)
	console.log(colors)
	return chartNode.drawChart({
		type: 'bar',
		data: {
			labels: ['','','','','','','','','','','','','','','','','','','','','','','',''],
			datasets: [{
				label: '',
				data: heights,
				backgroundColor: colors,
				borderWidth: 0
			}]
		},
		options: {
			legend: {
				display: false
			},
			responsive: false,
			width: 128,
			height: 40,
			animation: false,
			scales:{
				xAxes: [{
					categoryPercentage: 1.0,
					barPercentage: 1.0,
					display: false //this will remove all the x-axis grid lines
				}],yAxes: [{
					display: false, //this will remove all the x-axis grid lines
					ticks: {
						suggestedMax: max
					}}]
			}
		}
	})
		.then(() => {
			return chartNode.getImageDataUrl("image/png").then(data=>{for(let journey of day)journey.graph =  data;});
		}).catch(err => {
			console.error('Error : ', err);
			return false;
		})
}
// add handy short-hand attributes like "duration"
 const addAttributes = (journeysPerDay)=> {
	var promises = []
	 var max = 0;
	var min = 100000;
	 for(let day of journeysPerDay) {
		 for (let journey of day) {
			 if (max < journey.price.amount) max = journey.price.amount;
			 if (min > journey.price.amount) min = journey.price.amount;
		 }
	 }

	for(let day of journeysPerDay){
		for(let journey of day){
			const departure = new Date(journey.legs[0].departure)
			const arrival = new Date(journey.legs[journey.legs.length-1].arrival)
			const duration = +arrival - (+departure)
			journey.duration = duration

			promises.push(createGraph(day,max,min))
		}

	}
	return Promise.all(promises).then(()=>{return journeysPerDay})
}

// only keep journeys with price information
const filterPricelessJourneys = (journeysPerDay) => {
	const days = []
	for(let day of journeysPerDay){
		days.push(day.filter(j => j.price && j.price.amount))
	}
	return days
}

// sort by price and duration
const sortJourneysPerDay = (journeysPerDay) => {
	const days = []
	for(let day of journeysPerDay){
		const perDuration = sortBy(day, ['duration'])
		const perPrice = sortBy(perDuration, j => j.price.amount)
		days.push(perPrice)
	}
	return days
}

// add marker for the cheapest day
const markCheapest = (formattedJourneyPerDay) => {
	// Find cheapest offer(s)
	let cheapest = null
	for(let day of formattedJourneyPerDay){if(day && day.price && (!cheapest || +day.price.euros<cheapest)) cheapest = +day.price.euros}
	// Mark cheapest offer(s)
	for(let day of formattedJourneyPerDay){if(day && day.price) day.cheapest = (+day.price.euros===cheapest)}
	return formattedJourneyPerDay
}

const generateCalendar = (weeks) => {
	let date = moment().tz('Europe/Berlin')
	let emptyDates = 0
	while(date.format('E')!=1){date.subtract(1, 'days'); emptyDates++} // go back to last monday

	const dates = []
	for(let i=0; i<weeks*7; i++){
		if(dates.length==0 || +date.format('D')==1) dates.push({date: {raw: moment(date), formatted: date.format('D MMM')}, past: (i<emptyDates)})
		else dates.push({date: {raw: moment(date), formatted: date.format('D')}, past: (i<emptyDates)})

		date.add(1, 'days')
		if(i>=emptyDates) date = date.startOf('day')
	}

	return dates
}

const fillCalendar = (cal, formattedJourneyPerDay) => {
	let counter = 0
	for(let day of cal){
		if(!day.past) Object.assign(day, formattedJourneyPerDay[counter++] || {price: false, duration: false})
	}
	return chunk(cal, 7)
}


const calendar = (params) => {
	const q = new Queue({concurrency: 16})
	const cal = generateCalendar(params.weeks)
	const requests = []
	for(let day of cal){
		if(!day.past) requests.push(
			q.add(() =>
				retry(
					() => timeout(journeys(params, day.date.raw), timeoutTime),
					{retries: 3}
				)
				.catch((err) => [])
			)
		)
	}
// console.log(journeysPerDay)
	// todo: this is insanely inefficient code, but easier to understand
	// add handy short-hand attributes like "transfers" or "duration"
	return Promise.all(requests).then(addAttributes).then((journeysPerDay)=>{
		// only keep journeys with price information
		journeysPerDay = filterPricelessJourneys(journeysPerDay)
		// sort by price and duration
		journeysPerDay = sortJourneysPerDay(journeysPerDay)
		// select cheapest price per day
		const journeyPerDay = journeysPerDay.map(js => js[0])
		// format output (only price and duration)
		let formattedJourneyPerDay = journeyPerDay.map(formatDayResult)
		// check if all days are "empty"
		if(formattedJourneyPerDay.every((element) => !element)) return null
		// add marker for the cheapest day
		formattedJourneyPerDay = markCheapest(formattedJourneyPerDay)
		// add prices to calendar
		return fillCalendar(cal, formattedJourneyPerDay)
	})
	.catch(err => {
		console.error(err)
		return null
	})
}

module.exports = calendar
