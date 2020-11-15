// variable for placeholder image:
const MISSING_IMAGE_URL = "http://tinyurl.com/missing-tv";

// axias get request returns array of objects as showData:
async function searchShows(query) {
	const res = await axios.get(
		`https://api.tvmaze.com/singlesearch/shows?q=${query}`
	);
	const showData = [
		{
			id: res.data.id,
			name: res.data.name,
			summary: res.data.summary,
			image: res.data.image ? res.data.image : MISSING_IMAGE_URL,
		},
	];
	return showData;
}

/** Populate shows list:
 *     - given list of shows, add shows to DOM
 */
function populateShows(shows) {
	const $showsList = $("#shows-list");
	$showsList.empty();
	for (let show of shows) {
		let $item = $(
			`<div class="col-md-6 col-lg-3 Show text-dark" data-show-id="${show.id}">
         <div class="card" data-show-id="${show.id}">
           <div class="card-body">
             <h5 class="card-title">${show.name}</h5>
             <img src="${show.image.medium}" class="card-img-top"></img>
             <p class="card-text">${show.summary}</p>
             <button type="button" id="episode-btn" class="btn btn-primary">Show Episodes</button>
           </div>
         </div>
       </div>
      `
		);
		$showsList.append($item);
	}
}

// adds episodes li elements to row below tv show card:
function populateEpisodes(episodes) {
	const $episodesList = $("#episodes-list");
	$episodesList.empty();
	$episodesList.append(`<h2 class="my-3">Episodes</h2>`);
	for (let episode of episodes) {
		let $item = $(
			`<li class="list-group-item">${episode.name} - (Season: ${episode.season}, Episode: ${episode.number})</li>`
		);
		console.log($item);
		$episodesList.append($item);
	}
}

/** Handle search form submission:
 *    - get list of matching shows and show in shows list
 */
$("#search-form").on("submit", async function handleSearch(evt) {
	evt.preventDefault();

	let query = $("#search-query").val();
	if (!query) return;

	let shows = await searchShows(query);
	populateShows(shows);
});

// adds event delgation to button on show card to show episodes:
$("#shows-list").on("click", "#episode-btn", async function showEpisodes(e) {
	e.preventDefault();
	let showId = $(e.target).closest(".Show").data("show-id");
	let episodes = await getEpisodes(showId);
	populateEpisodes(episodes);
});

/** Given a show ID, return list of episodes:
 *      { id, name, season, number }
 */
async function getEpisodes(id) {
	const res = await axios.get(`http://api.tvmaze.com/shows/${id}/episodes`);
	const episodeData = [];
	for (let i = 0; i < res.data.length; i++) {
		episodeRes = {
			id: res.data[i].id,
			name: res.data[i].name,
			season: res.data[i].season,
			number: res.data[i].number,
		};
		episodeData.push(episodeRes);
	}
	return episodeData;
}
