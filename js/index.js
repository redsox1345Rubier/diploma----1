import getData from './api.js'

const url = 'https://jscp-diplom.netoserver.ru/';

const options = {
	method: 'POST',
	body: 'event=update',
	headers: {
		'Content-Type': 'application/x-www-form-urlencoded'
	}
};

let nav = document.getElementsByTagName('nav')[0];
const days = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб']
const date = new Date();
const weekDay = date.getDay();
const distance = (weekDay == 0 ? 7 : date.getDay()) - 1
let currentTime = null
date.setDate(date.getDate() - distance)
for (let i = 1; i < 8; i++) {
	if (i == 7) i = 0
	let pageNavToday = document.createElement('a');
	pageNavToday.classList.add('page-nav__day');
	if (i == weekDay) {
		pageNavToday.classList.add('page-nav__day_today', 'page-nav__day_chosen');
		currentTime = Number(date);
	}
	pageNavToday.setAttribute('href', '#');
	pageNavToday.setAttribute('data-time', Number(date));
	nav.appendChild(pageNavToday);
	let pageNavDayWeek = document.createElement("span");
	pageNavDayWeek.classList.add('page-nav__day-week');
	let dayNumber = document.createElement("span");
	dayNumber.classList.add("page-nav__day-number");
	pageNavToday.appendChild(pageNavDayWeek);
	pageNavToday.appendChild(dayNumber);
	pageNavDayWeek.innerText = days[i];
	dayNumber.innerText = date.getDate();
	date.setDate(date.getDate() + 1);
	pageNavToday.addEventListener('click', (event) => {
		currentTime = Number(pageNavToday.getAttribute('data-time'));
		let dayChosen = document.getElementsByClassName("page-nav__day_chosen")[0];
		dayChosen.classList.remove('page-nav__day_chosen');
		pageNavToday.classList.add('page-nav__day_chosen');
		renderMain()
	})
	if (i == 0) break
}

async function renderMain() {
	let response = await getData(url, options)
	if (response) {
		let main = document.getElementsByTagName('main')[0];
		const recentTime = Date.now();
		main.innerHTML = '';
		for (let i = 0; i < response.films.result.length; i++) {
			const film = response.films.result[i];
			let seances = response.seances.result.filter((seance) => {
				return seance.seance_filmid === film.film_id
			});
			let hallNames = []
			let halls = []
			seances.forEach((seance) => {
				response.halls.result.forEach((hall) => {
					if (seance.seance_hallid == hall.hall_id && !hallNames.includes(hall.hall_name)) {
						hallNames.push(hall.hall_name)
						halls.push(hall)
					}
				})

			})
			hallNames.sort()
			halls.sort((hall_1, hall_2) => hall_1.hall_name > hall_2.hall_name ? 1 : hall_1.hall_name < hall_2.hall_name ? -1 : 0)
			let section = document.createElement('section');
			section.classList.add('movie');
			let divInfo = document.createElement('div');
			divInfo.classList.add('movie__info');
			let imgPoster = document.createElement('img');
			imgPoster.classList.add('movie__poster-image');
			imgPoster.setAttribute('src', film.film_poster);
			imgPoster.setAttribute('alt', film.film_name);
			let divMoviePoster = document.createElement('div');
			divMoviePoster.classList.add('movie__poster');
			divMoviePoster.appendChild(imgPoster);
			let movieDescription = document.createElement('div');
			movieDescription.classList.add('movie__description');
			let movieTitle = document.createElement('h2');
			movieTitle.classList.add('movie__title');
			movieTitle.innerText = film.film_name;
			let movieSynopsis = document.createElement('p');
			movieSynopsis.classList.add('movie__synopsis');
			movieSynopsis.innerText = film.film_description;
			let movieData = document.createElement('p');
			movieData.classList.add('movie__data');
			let movieDataDuration = document.createElement('span');
			movieDataDuration.classList.add('movie__data-duration');
			movieDataDuration.innerText = film.film_duration + ' мин. ';
			let movieDataOrigin = document.createElement('span');
			movieDataOrigin.classList.add('movie__data-origin');
			movieDataOrigin.innerText = film.film_origin;
			movieData.appendChild(movieDataDuration);
			movieData.appendChild(movieDataOrigin);
			movieDescription.appendChild(movieTitle);
			movieDescription.appendChild(movieSynopsis);
			movieDescription.appendChild(movieData);
			divInfo.appendChild(divMoviePoster);
			divInfo.appendChild(movieDescription);
			section.appendChild(divInfo);
			main.appendChild(section);

			for (let t = 0; t < halls.length; t++) {
				let movieSeancesHall = document.createElement('div');
				movieSeancesHall.classList.add('movie-seances__hall');
				let movieSeancesHallTitle = document.createElement('h3');
				movieSeancesHallTitle.classList.add('movie-seances__hall-title');

				movieSeancesHallTitle.innerText = halls[t].hall_name;
				let movieSeancesList = document.createElement('ul');
				movieSeancesList.classList.add('movie-seances__list');
				let hallSeances = seances.filter((seance) => {
					return seance.seance_hallid === halls[t].hall_id
				})

				for (let j = 0; j < hallSeances.length; j++) {
					let movieSeancesTimeBlock = document.createElement("li");
					movieSeancesTimeBlock.classList.add('movie-seances__time-block');
					let movieSeancesTime = document.createElement('a');
					movieSeancesTime.classList.add('movie-seances__time');
					movieSeancesTime.setAttribute('href', "hall.html")
					movieSeancesTime.innerText = hallSeances[j].seance_time;
					const seanceStartTime = new Date(currentTime).setHours(0, 0, 0) + hallSeances[j].seance_start * 60_000
					if (seanceStartTime <= recentTime) {
						movieSeancesTime.removeAttribute('href')
						movieSeancesTime.style.backgroundColor = 'gray'
					}
					movieSeancesTimeBlock.appendChild(movieSeancesTime);
					movieSeancesList.appendChild(movieSeancesTimeBlock);
					movieSeancesTimeBlock.addEventListener('click', () => {
						let timestamp = Math.trunc((new Date().setHours(0, 0, 0) / 1000));
						timestamp += hallSeances[j].seance_start * 60
						const data = {
							timestamp,
							hallId: halls[t].hall_id,
							seanceId: hallSeances[j].seance_id,
							filmName: film.film_name,
							hallName: halls[t].hall_name,
							seanceTime: hallSeances[j].seance_time,
							hallConfig: halls[t].hall_config
						}
						localStorage.setItem('ud', JSON.stringify(data))
					})
				}

				section.appendChild(movieSeancesHall);
				movieSeancesHall.appendChild(movieSeancesHallTitle);
				movieSeancesHall.appendChild(movieSeancesList);
			}
		}
	} else alert('Ошибка получения данных с сервера')

}

renderMain()