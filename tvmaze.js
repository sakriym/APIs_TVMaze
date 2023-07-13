"use strict";

const $showsList = $("#showsList");
const $episodesArea = $("#episodesArea");
const $searchForm = $("#searchForm");
const API_BASE_URL = "http://api.tvmaze.com"
const MOVIE_URL = "http://api.tvmaze.com/search/shows";
const MISSING_IMAGE = "https://tinyurl.com/tv-missing";
const EPISODE_URL= "http://api.tvmaze.com/shows/%5Bshowid%5D/episodes"

/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */
//TODO: naming from movie to tv
async function getShowsByTerm(term) {
  // ADD: Remove placeholder & make request to TVMaze search shows API
  // grab the movie from api
  //TODO: for future reference - use Axios and not fetch to get the data
  // CHANGE 'api key' to movie sits api key
  // grab movieData
  const config = { params: { q: term } };
  const response = await axios.get(MOVIE_URL, config);
  console.log('Response: ', response);
  //TODO: for future reference - response data is returned object
  // (only one .data in this case)
  // naming plural - shows
  let shows = response.data.map((shows) => {
    return {
      id: shows.show.id,
      name: shows.show.name,
      summary: shows.show.summary,
      image: shows.show.image ? shows.show.image.original : MISSING_IMAGE
    };
  });
  console.log('Movie Result: ', shows);
  return shows;
};


/** Given list of shows, create markup for each and append to DOM.
 *
 * A show is {id, name, summary, image}
 * */
//TODO: update alt text for src image
function displayShows(shows) {
  $showsList.empty();
  // src="http://static.tvmaze.com/uploads/images/medium_portrait/160/401704.jpg"
  for (const show of shows) {
    const $show = $(`
        <div data-show-id="${show.id}" class="Show col-md-12 col-lg-6 mb-4">
         <div class="media">
           <img
              src = ${show.image}
              alt="show image"
              class="w-25 me-3">
           <div class="media-body">
             <h5 class="text-primary">${show.name}</h5>
             <div><small>${show.summary}</small></div>
             <button class="btn btn-outline-light btn-sm Show-getEpisodes">
               Episodes
             </button>
           </div>
         </div>
       </div>
      `);

    $showsList.append($show);
  }
}


/** Handle search form submission: get shows from API and display.
 *    Hide episodes area (that only gets shown if they ask for episodes)
 */

async function searchShowsAndDisplay() {
  const term = $("#searchForm-term").val();
  const shows = await getShowsByTerm(term);

  $episodesArea.hide();
  displayShows(shows);
}

$searchForm.on("submit", async function handleSearchForm(evt) {
  evt.preventDefault();
  await searchShowsAndDisplay();
});


/** Given a show ID, get from API and return (promise) array of episodes:
 *      { id, name, season, number }
 */

async function getEpisodesOfShow(id) {
  // const config = { params: { q: id } }
  const response = await axios.get(`${API_BASE_URL}/shows/${id}/episodes`)
  console.log('reponse:' ,response)
  let episodes = response.data.map((episodes)=>{
    console.log(episodes)
    return {
      id: episodes.id.id,
      name: episodes.id.name,
      season: episodes.id.season,
      number: episodes.id.number,
    }
  })
  return episodes
}

/** Write a clear docstring for this function... */

function displayEpisodes(episodes) {
  console.log(episodes)
  const $episodesList = $('#episodesList')
  console.log('episodelist:',$episodesList)
  $episodesList.empty()

  episodes.forEach((episode)=>{
    $episodesList.append(
      $('<li>').text(`${episode.name} (season ${episode.season}), number ${episode.number}`)
    )
  })
  $('#episodeArea').show()
 }

// add other functions that will be useful / match our structure & design
