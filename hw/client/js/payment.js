import getData from './api.js'
const url = 'https://jscp-diplom.netoserver.ru/';

let Fuck = localStorage.getItem("fuck")
Fuck = JSON.parse(Fuck)

const options = {
	method: 'POST',
	body: `event=sale_add&timestamp=${Fuck.timestamp}&hallId=${Fuck.hallId}&seanceId=${Fuck.seanceId}&hallConfiguration=${Fuck.hallConfiguration}`,
	headers: {
		'Content-Type': 'application/x-www-form-urlencoded'
	},

};

let response = await getData(url, options)
if (response) {
	let ticketTitle = document.querySelector('span.ticket__title');
	ticketTitle.innerText = Fuck.filmName;
	let ticketChairs = document.querySelector('span.ticket__chairs');
	let ticketChairsText = Fuck.places.map((place) => `${place.numberRow}/${place.numberPlace}`).join(', ');
	ticketChairs.innerText = ticketChairsText
	let ticketHall = document.querySelector('span.ticket__hall');
	ticketHall.innerText = Fuck.hallName;
	let ticketStart = document.querySelector('span.ticket__start');
	ticketStart.innerText = Fuck.seanceTime;
	let ticketCost = document.querySelector('span.ticket__cost');
	let ticketCostText = Fuck.places.reduce((ticketsSum, place) => ticketsSum + place.price, 0);
	ticketCost.innerText = ticketCostText
	let acceptinButton = document.querySelector('button.acceptin-button');
	acceptinButton.addEventListener('click', (e) => {
		const data = {
			filmName: Fuck.filmName,
			seanceTime: Fuck.seanceTime,
			hallName: Fuck.hallName,
			places: ticketChairsText,

		}

		localStorage.setItem('ticket', JSON.stringify(data))
		location.href = 'ticket.html'
	})
} else {
	alert('Error of sending response to server')
}
