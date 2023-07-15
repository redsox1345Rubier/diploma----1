let ticket = localStorage.getItem("ticket");
ticket = JSON.parse(ticket);
let ticketTitle = document.querySelector('span.ticket__title');
ticketTitle.innerText = ticket.filmName;
let ticketChairs = document.querySelector('span.ticket__chairs');
ticketChairs.innerText = ticket.places;
let ticketHall = document.querySelector('span.ticket__hall');
ticketHall.innerText = ticket.hallName;
let ticketStart = document.querySelector('span.ticket__start');
ticketStart.innerText = ticket.seanceTime;

const qrcode = QRCreator(`Фильм: ${ticket.filmName}, Начало сеанса: ${ticket.seanceTime}, Ряд/Место: ${ticket.places}`, {
	mode: 4,
	image: 'svg'
});

let div = document.createElement('div');
div.classList.add('ticket__info-qr');
div.appendChild(qrcode.result);

let ticketHint = document.querySelector('p.ticket__hint');

ticketHint.before(div);