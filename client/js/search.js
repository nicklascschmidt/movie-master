// All logic for the Search page.
// Scrape button, search input, load watchlist + user rating.


const omdbApiKey = config.OMDB_API_KEY; // for OMDB access

// ------------------------------------------------------------------
//              Scrape
// ------------------------------------------------------------------

$('body').on('click', '.scrapeImdb', scrapeDropdownClicked);

// Grab page # and scrape IMDB.
function scrapeDropdownClicked() {
  $('#scrapeDisplay').html('<h4>Scraping movies...</h4>'); // loading message
  const pageStart = $(this).attr('data-pageStart'); // grab page
  scrapeImdb(pageStart);
}

// Scrape, then display results.
function scrapeImdb(page) {
  $.get(`/scrape/imdb/${page}`, data => {
    displayMovies(data, 'scrapeDisplay');
  });
}

// Loop through each array element and display movie info (rolling basis)
function displayMovies(array, element) {
  $(`#${element}`).empty();

  for (item of array) {
    printMovieToPage(item);
  }

  async function printMovieToPage(arrayId) {
    const movie = await pullMovieFromOmdb(arrayId,'id');
    const watchlistButton = await loadAddToWatchlistButton(movie.Title, movie.imdbID);
    let $movie = $('<div>');
    $movie.html(`
      <div class='row p-2 mb-2 movie-custom'>
        <div class='col-12 col-sm-3 text-center'>
          <img src=${movie.Poster} class='img-custom' alt='missing movie image'>
        </div>
        <div class='col-12 col-sm-9'>
          <div class='row'>
            <div class='col-8'>
              <h4 class='d-inline-block'><a href=https://www.imdb.com/title/${movie.imdbID}/ target='_blank'><strong>${movie.Title}</strong></a></h4> <h5 class='d-inline-block'>(${movie.Year})</h5>
              <p>${movie.Rated} | ${movie.Runtime} | ${movie.Genre}</p>
            </div>
            <div class='col-4 text-right'>
              ${watchlistButton}
              <p>IMDB <i class="fas fa-star"></i> ${movie.imdbRating}</p>
            </div>
          </div>
          <p>${movie.Plot}</p>
          <p>Director: ${movie.Director} | Stars: ${movie.Actors}</p>
        </div>
      </div>
    `)
    $(`#${element}`).append($movie);
  }
}

// Load text or button based on if the movie exists on watchlist already
async function loadAddToWatchlistButton(title, imdbID) {
  const userId = sessionStorage.getItem('movieMasterId');
  const duplicateBoolean = await checkIfExists(userId, title);
  if (!duplicateBoolean) {
    return `<button class='btn btn-success btn-sm mt-2 mb-2 handleAddToWatchlist' data-imdbId='${imdbID}' data-title='${title}'><i class="fas fa-plus-circle"></i> Watchlist</button>`
  } else {
    return '<p>On Watchlist</p>'
  }
}

// Check if the movie is on the watchlist. If Ajax response is true, then it's a duplicate.
function checkIfExists(UserId, title) {
  const queryObj = { UserId, title };
  return $.getJSON('/api/movies/find', queryObj)
    .catch( err => console.log(err));
}

// Type = 'id' or 'title'
function pullMovieFromOmdb(searchValue, type) {
  const searchType = (type === 'id') ? 'i' : 's';
  return $.getJSON(`https://www.omdbapi.com/?apikey=${omdbApiKey}&${searchType}=${searchValue}`)
    .catch( err => console.log(err));
}




// ------------------------------------------------------------------
//              Search
// ------------------------------------------------------------------

$('body').on('click', '#searchInputSubmit', submitSearch);

// Get array of movies (max 10) based on search input
// Pass array of imdbIds into displayMovies func
// Use array of IDs to get full movie objects
async function submitSearch() {
  event.preventDefault();
  const searchTerm = $('#searchInput').val().trim();
  let omdbMovieArray = await pullMovieFromOmdb(searchTerm, 'title'); // search results don't give the full object
  const splicedOmdbMovieArray = (omdbMovieArray.Search.length > 10) ? omdbMovieArray.Search.splice(0, 10) : omdbMovieArray.Search; // limit the search results to 10
  const imdbIdArray = splicedOmdbMovieArray.map(movie => movie.imdbID)
  
  $('#searchDisplay').html('<h4>Loading search results...</h4>');
  displayMovies(imdbIdArray, 'searchDisplay');
}




// ------------------------------------------------------------------
//              Add to watchlist
// ------------------------------------------------------------------

// 'Add to Watchlist' button handler
$('body').on('click', '.handleAddToWatchlist', handleAddToWatchlist);

// If user is signed in, add movie to watchlist. If not, notify user.
function handleAddToWatchlist() {
  const imdbId = $(this).attr('data-imdbId') // get movie ID to search IMDB db (via unique URL)
  const userId = sessionStorage.getItem('movieMasterId'); // check if user is signed in
  if (userId !== null) {
    addMovieToDb(imdbId, userId);
    $(this).replaceWith(`<p style='color:green'>Added to Watchlist</p>`);
  } else {
    $(this).replaceWith(`<p style='color:red'>Need to create an account</p>`);
  }
}

// Pull movie from OMDB, create movie object, submit to DB
async function addMovieToDb(imdbId, userId) {
  const omdbMovie = await pullMovieFromOmdb(imdbId, 'id');
  const runtimeUpdated = omdbMovie.Runtime.replace(/\D+/g, ''); // removes all non digits - in this case " min"
  const movie = {
    UserId: Number(userId),
    title: omdbMovie.Title,
    imdbUrl: `https://www.imdb.com/title/${omdbMovie.imdbID}/`,
    posterUrl: omdbMovie.Poster,
    year: Number(omdbMovie.Year),
    maturityRating: omdbMovie.Rated,
    lengthInMinutes: Number(runtimeUpdated),
    imdbRating: Number(omdbMovie.imdbRating),
    plot: omdbMovie.Plot,
    director: omdbMovie.Director,
    actors: omdbMovie.Actors,
    genre: omdbMovie.Genre,

    isWatched: false
  }
  $.post('/api/movies/add', movie)
    .then(data => data)
    .catch( err => console.log(err));
}
