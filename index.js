//tmdb api key
const API_KEY = '9a741eedc883eb2485313658de855d23';


async function getPopularFilms(){
	let movieList = [];
	let i = 1;
			
	while(i < 10){
		let popular = await fetchPopularFilms(i);
		let popularFilm = popular.results
		let topRated = await fetchTopRatedFilms(i);
		let topRatedFilm = topRated.results

		// console.log('popular film here: ', popularFilm);

		for(let i = 0; i < popularFilm.length; i++){
			let filmObj = popularFilm[i];
			let topObj = topRatedFilm[i];
			if (filmObj.original_language === 'en') {
				movieList.push({title: filmObj.original_title, poster: filmObj.poster_path, rating: filmObj.vote_average});
			}
			if (topObj.original_language === 'en'){
				movieList.push({title: topObj.original_title, poster: topObj.poster_path, rating: topObj.vote_average});
			}
		}
		i += 1;
	}

	
	console.log('here are my movies:', movieList);
	return movieList;	
}

async function startGame(){

	let data;
	let movieNames = [];
	movies = await getPopularFilms();
	
	let i = 0;
	let previous = [];
	let pastRatings = [];
	
	while (i < 2){
		
		let random = Math.floor(Math.random() * movies.length);
		while (previous.includes(random)){
			random = Math.floor(Math.random() * movies.length);
		}
		let name = movies[random].title;
		let poster = `https://image.tmdb.org/t/p/original${movies[random].poster}`
		let rating = movies[random].rating;
		let appendFilm;
		movieNames.push(name);
		pastRatings.push(rating);
	
		
		if (i === 0) {
			appendFilm = `<li><img class="poster" src="${poster}"/> <h1>${name} (${rating})</h1></li>`
		} else {
			previous.push(random);

				data = [
				{'movieList' : movies},
				{'previous' : previous},
				{'pastMovie' : `<li><img class="poster" src="${poster}"/> <h1>${name} (${rating})</h1></li>`},
				{'pastRatings' : pastRatings},
				{'movieNames' : movieNames}
			]

			console.log(data);
			
			console.log(`first movie, ${data[4].movieNames[0]} has a rating of ${data[3].pastRatings[0]}`);
			console.log(`second movie, ${data[4].movieNames[1]} has a rating of ${data[3].pastRatings[1]}`);

			appendFilm = 
			`<li>
				<img class="poster" src="${poster}"/> 
					<h1>${name}</h1>
					<button id="higher" class="custom-btn btn-1">Higher</button>
					<Button id="lower" class="custom-btn btn-5">Lower</button>
			</li>`
		}
		document.querySelector('.movies').innerHTML += appendFilm;
		document.querySelector('.score').innerHTML = `<h1>Score: 0</h1>`;
		i += 1;
	}
	
	const higher = document.getElementById("higher");
	const lower = document.getElementById("lower");
	
	
	// higher.addEventListener("click", stopProp); 
	higher.addEventListener("click", newMovieHigher);
	lower.addEventListener("click", newMovieLower);

	let score = 0;
	function newMovieHigher(){
		console.log('updated data on higher click', data);
		/*
		data[0] = {movielist : array}
		data[1] = {previous : array (past random numbers)}
		data[2] = {pastMovie : html data}
		data[3] = {pastRatings} : array}

		*/
		
		if (data[3].pastRatings[1] >= data[3].pastRatings[0]){
			score += 1;

			let random = Math.floor(Math.random() * movies.length);
			
			while(data[1].previous.includes(random)) {
				random = Math.floor(Math.random() * movies.length);
			}
			data[1].previous.push(random);

			let newMovie = data[0].movieList[random];
			let name = newMovie.title;
			let poster = `https://image.tmdb.org/t/p/original/${newMovie.poster}`
			let rating = newMovie.rating;
			
			data[3].pastRatings[0] = data[3].pastRatings[1];
			data[3].pastRatings[1] = rating;

			console.log('first movies rating: ', data[3].pastRatings[0]);
			console.log('second movies rating: ', data[3].pastRatings[1]);

			let secondMovie = `<li>
			<img class="poster" src="${poster}"> 
				<h1>${name}</h1>
				<button id="higher" class="custom-btn btn-1">Higher</button>
				<Button id="lower" class="custom-btn btn-5">Lower</button>
			</li>`




			document.querySelector('.movies').innerHTML = '';
			document.querySelector('.movies').innerHTML += data[2].pastMovie;
			document.querySelector('.movies').innerHTML += secondMovie;
			document.querySelector('.score').innerHTML = `<h1>Score: ${score}</h1>`;

			data[2].pastMovie = `<li><img class="poster" src=${poster}><h1>${name} (${rating})</h1>`

			

			const higher = document.getElementById("higher");
			const lower = document.getElementById("lower");
			higher.addEventListener("click", newMovieHigher);
			lower.addEventListener("click", newMovieLower);
		}
		else {
			document.querySelector('.movies').innerHTML = '';
			document.querySelector('.score').innerHTML = `<h1>You lose. Your score is: ${score}</h1>`;
			document.querySelector('.leaderboard').innerHTML = `<h2>Add your score to the leaderboard below: </h2>
																<input type="text" id="text" name="q" placeholder="Enter your name here..." autcomplete="false" readonly onfocus="this.removeAttribute('readonly');">
																<button class="custom-btn btn-1" id="scoreList" type="button">Submit</button>
																`;
			function getScoreList(){
				
				const scoreThisRound = score;
				let addToLeaderBoard = '';
				const inputVal = document.getElementById("text").value;

				console.log('inputVal from getScoreList: ', inputVal);
				console.log('score from getScoreList: ', scoreThisRound);
				document.querySelector('.leaderboard').innerHTML = ``;
			
				fetch('/index.html', {
					method: 'POST',
					headers: {
						'Content-Type' : 'application/json',
					},
					body: JSON.stringify({'name': inputVal, 'score': scoreThisRound}),
				})
					.then(res => res.json())
					.then(data => {

					console.log('here is the response from the fetch in newMovieHigher: ', data);
					console.log('here is the first place from the scorelist in newMovieHigher: ', data.scoreList[0]);
					console.log('here is the name of first place from the scorelist in newMovieHigher: ', data.scoreList[0].name);

					let scoreList = data.scoreList;
					scoreList.sort((a,b) => (a.score > b.score) ? -1 : 1);

					console.log('sorted scoreList in newMovieLower: ', scoreList);
						
					document.querySelector('.leaders').innerHTML = '';
					document.querySelector('.leaders').innerHTML += '<h1>Leaderboard</h1>';

					
					for(let i = 0; i < data.scoreList.length; i++){
						addToLeaderBoard += `<div class="row"><div class="playerName">${data.scoreList[i].name} : ${data.scoreList[i].score}</div>`
					}

					console.log('here is the leaderBoard in newMovieLower: ', addToLeaderBoard);
					document.querySelector('.leaders').innerHTML += addToLeaderBoard;

					})
					.catch(err => console.log('error in getScoreList fetch: ', err))
			
			}

			const scoreListGenerator = document.getElementById("scoreList");
			scoreListGenerator.addEventListener("click", getScoreList);
		}
	}
	function newMovieLower(){

		

		
		if (data[3].pastRatings[1] <= data[3].pastRatings[0]){
			score += 1;

			let random = Math.floor(Math.random() * movies.length);
			
			while(data[1].previous.includes(random)) {
				random = Math.floor(Math.random() * movies.length);
			}
			data[1].previous.push(random);

			let newMovie = data[0].movieList[random];
			let name = newMovie.title;
			let poster = `https://image.tmdb.org/t/p/original/${newMovie.poster}`
			let rating = newMovie.rating;
			
			data[3].pastRatings[0] = data[3].pastRatings[1];
			data[3].pastRatings[1] = rating;

			console.log('first movies rating: ', data[3].pastRatings[0]);
			console.log('second movies rating: ', data[3].pastRatings[1]);

			let secondMovie = `<li>
			<img class="poster" src="${poster}"> 
				<h1>${name}</h1>
				<button id="higher" class="custom-btn btn-1">Higher</button>
				<Button id="lower" class="custom-btn btn-5">Lower</button>
			</li>`
			
			



			document.querySelector('.movies').innerHTML = '';
			document.querySelector('.movies').innerHTML += data[2].pastMovie;
			document.querySelector('.movies').innerHTML += secondMovie;
			document.querySelector('.score').innerHTML = `<h1>Score: ${score}</h1>`;

			data[2].pastMovie = `<li><img class="poster" src=${poster}><h1>${name} (${rating})</h1>`

			const higher = document.getElementById("higher");
			const lower = document.getElementById("lower");
			higher.addEventListener("click", newMovieHigher);
			lower.addEventListener("click", newMovieLower);
		}
		else {
			document.querySelector('.movies').innerHTML = '';
			document.querySelector('.score').innerHTML = `<h1>You lose. Your score is: ${score}</h1>`;
			document.querySelector('.leaderboard').innerHTML = `<h2>Add your score to the leaderboard below: </h2>
																<input type="text" id="text" name="q" placeholder="Enter your name here..." autcomplete="false" readonly onfocus="this.removeAttribute('readonly');">
																<button class="custom-btn btn-1" id="scoreList" type="button">Submit</button>
																`;
			
			function getScoreList(){

				
				let addToLeaderBoard = ``;
				const scoreThisRound = score;
				const inputVal = document.getElementById("text").value;

				console.log('inputVal from getScoreList: ', inputVal);
				console.log('score from getScoreList: ', scoreThisRound);
				document.querySelector('.leaderboard').innerHTML = ``;
			
				fetch('/index.html', {
					method: 'POST',
					headers: {
						'Content-Type' : 'application/json',
					},
					body: JSON.stringify({'name': inputVal, 'score': scoreThisRound}),
				})
					.then(res => res.json())
					.then(data => {
					
						console.log('here is the response from the fetch in newMovieLower: ', data);
						console.log('here is the first place from the scorelist in newMovieLower: ', data.scoreList[0]);
						console.log('here is the name of first place from the scorelist in newMovieLower: ', data.scoreList[0].name);

						let scoreList = data.scoreList;
						scoreList.sort((a,b) => (a.score > b.score) ? -1 : 1);

						console.log('sorted scoreList in newMovieLower: ', scoreList);

						document.querySelector('.leaders').innerHTML = '';
						document.querySelector('.leaders').innerHTML += '<h1>Leaderboard</h1>';
					for(let i = 0; i < data.scoreList.length; i++){
						addToLeaderBoard += `<div class="row"><div class="playerName">${data.scoreList[i].name} : ${data.scoreList[i].score}</div>`
					}
					console.log('here is the leaderBoard in newMovieLower: ', addToLeaderBoard);
					// document.querySelector('.leaders').innerHTML += `<h1>Leaderboard</h1>`
					document.querySelector('.leaders').innerHTML += addToLeaderBoard;
					
					})
					.catch(err => console.log('error in getScoreList fetch: ', err))
			
			}
			
			
			const scoreListGenerator = document.getElementById("scoreList");
			scoreListGenerator.addEventListener("click", getScoreList);
														
		}

	}
}




async function fetchPopularFilms(i){
	const response = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=9a741eedc883eb2485313658de855d23&language=en-US&page=${i}`)
	const movie = await response.json();
	return movie;
}

async function fetchTopRatedFilms(i){
	const response = await fetch(`https://api.themoviedb.org/3/movie/top_rated?api_key=9a741eedc883eb2485313658de855d23&language=en-US&page=${i}`)
	const movie = await response.json();
	return movie;
}

function clearMovies() {
	document.querySelector('.movies').innerHTML = '';
	document.querySelector('.score').innerHTML = 'Game cleared. Hit Start to play again!';
	document.querySelector('.leaderboard').innerHTML = '';
	document.querySelector('.leaders').innerHTML += '';
	// document.querySelector('.row').innerHTML = '';
	document.querySelector('.h1').innerHTML = '';

}






//  async function getMovie() {
	
// 		const random = Math.floor(Math.random()* 1000000);

// 		const response = await fetch(`https://api.themoviedb.org/3/movie/${random}?api_key=9a741eedc883eb2485313658de855d23&language=en-US`)

// 		if(response.status === 200){
// 			const movie = await response.json();
	
// 			if (movie !== undefined && movie.adult !== true && movie.original_language === 'en' && movie.poster_path !== null && movie.vote_average > 5) {
// 				return movie;
// 			 }else{
// 				 getMovie();
// 			 }
// 		}

// 		// .then(response => response.json())
// 		// .then(response => {
			
// 			// if (response !== undefined && response.adult !== true && response.original_language === 'en' && response.poster_path !== null) {
			
// 			// 	console.log(response);
// 			// 	const name = response.original_title;
// 			// 	const poster = `https://image.tmdb.org/t/p/original${response.poster_path}`
				
// 			// 	const movie = `<li><img class="poster" src="${poster}"/> <h4>${name}</h4></li>`
				
// 			// 	document.querySelector('.movies').innerHTML += movie;
				
// 			// }
// 			// else {
// 			// 	console.log('bad movie!');
// 			// }
			
// 		// })
// 		// .catch(err =>ß console.log(err));
		
	
// }

// async function getMovieList(){
// 	let movieList = [];
			
// 	while(movieList.length < 2){
// 		let movie = await getMovie();
// 		if (movie !== undefined) movieList.push(movie);
// 	}

// 	console.log(movieList);

// 	for(let i = 0; i < movieList.length; i++){
// 		let film = movieList[i];
// 		const name = film.original_title;
// 		const rating = film.vote_average;
// 		const poster = `https://image.tmdb.org/t/p/original${film.poster_path}`
// 		let movieFromList;
// 		if (i === 0){
// 			 movieFromList = `<li><img class="poster" src="${poster}"/> <h2>${name} (${rating})</h2></li>`
// 		}
// 		else {
// 			 movieFromList = `<li><img class="poster" src="${poster}"/> <h2>${name}</h2><button id="higher" class="custom-btn btn-1" onClick=newMovie()>Higher</button><Button id="lower" class="custom-btn btn-5" onClick=newMovie()>Lower</button></li>`
// 		}
// 		document.querySelector('.movies').innerHTML += movieFromList;
// 	}

	
			
// 	return movieList
// }

// function newMovie(){
// 	/*

// 	*/
// }

		

/*
I want the fetch to run until I have the response with my required parameters.
The reason for this is that I am receiving random data that I cannot filter until after I have 
*/

