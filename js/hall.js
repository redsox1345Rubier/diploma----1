import getData from './api.js'
const url = 'https://jscp-diplom.netoserver.ru/';

let Ud = localStorage.getItem("ud")
Ud = JSON.parse(Ud)
const options = {
	method: 'POST',
	body: `event=get_hallConfig&timestamp=${Ud.timestamp}&hallId=${Ud.hallId}&seanceId=${Ud.seanceId}`,
	headers: {
		'Content-Type': 'application/x-www-form-urlencoded'
	},

};

let response = await getData(url, options)

let infoTitle = document.querySelector('h2.buying__info-title');
infoTitle.innerText = Ud.filmName;
let infoStart = document.querySelector('p.buying__info-start');
infoStart.innerText = 'Начало сеанса: ' + Ud.seanceTime;
let infoHall = document.querySelector('p.buying__info-hall');
infoHall.innerText = Ud.hallName;
let wrapper = document.querySelector('div.conf-step__wrapper');
wrapper.innerHTML = response === null ? Ud.hallConfig : response;

let Allplaces = document.querySelectorAll('div.conf-step__wrapper div.conf-step__row span.conf-step__chair');
let selectedPlaces = []
let confStepWrapper = document.querySelector('div.conf-step__wrapper').children
let confStepWrapperArr = []
for (let i = 0; i < confStepWrapper.length; i++) {
	confStepWrapperArr.push(confStepWrapper[i])
}
for (let i = 0; i < Allplaces.length; i++) {
	if (!(Allplaces[i].classList.contains('conf-step__chair_disabled') || Allplaces[i].classList.contains('conf-step__chair_taken'))) {
		Allplaces[i].addEventListener('click', (e) => {

			let target = e.currentTarget
			let row = target.parentElement
			let places = []
			for (let j = 0; j < row.children.length; j++) {
				places.push(row.children[j])
			}

			const placeData = {
				numberRow: confStepWrapperArr.indexOf(row) + 1,
				numberPlace: places.indexOf(target) + 1,
				price: target.classList.contains('conf-step__chair_standart') ?  Ud.hallPriceStandart : Ud.hallPriceVip
			}

			if (target.classList.contains('conf-step__chair_selected')) {
				selectedPlaces = selectedPlaces.filter(place => place.numberRow != placeData.numberRow && place.numberPlace != placeData.numberPlace)
			} else {
				selectedPlaces.push(placeData)
			}

			Allplaces[i].classList.toggle('conf-step__chair_selected')
			checkChairs()
		})
	}
}

let spanPriceStandart = document.querySelector('span.price-standart');
spanPriceStandart.innerText = Ud.hallPriceStandart;
let spanPriceVip = document.querySelector('span.price-vip');
spanPriceVip.innerText = Ud.hallPriceVip;

function checkChairs() {
	const selectedChairs = document.querySelectorAll('span.conf-step__chair_selected');
	if (selectedChairs.length - 1) button.removeAttribute('disabled')
	else button.setAttribute('disabled', true)

}

let button = document.querySelector('button.acceptin-button');
checkChairs()
button.addEventListener('click', (e) => {
	let wrapper = document.querySelector('div.conf-step__wrapper');

	const data = {
		timestamp: Ud.timestamp,
		hallId: Ud.hallId,
		seanceId: Ud.seanceId,
		hallConfiguration: wrapper.innerHTML,
		places: selectedPlaces,
		filmName: Ud.filmName,
		seanceTime: Ud.seanceTime,
		hallName: Ud.hallName,

	}

	localStorage.setItem('fuck', JSON.stringify(data))

	location.href = 'payment.html'

})
