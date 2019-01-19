console.log('Lieutenant, we are connected and ready to rumble.');

const omdbApiKey = config.OMDB_API_KEY;

// Dropdown clicked
$('body').on('click','.scrapeImdb', function() {
  let pageStart = $(this).attr('data-pageStart'); // grab page
  $('#scrapeDisplay').html('<h4>Loading movies...</h4>'); // loading message
  scrapeImdb(pageStart);
});

function scrapeImdb(page) {
  let queryObj = {
    pageStart: page
  }
  $.ajax({
    url: '/scrape/imdb',
    method: 'GET',
    data: queryObj,
    timeout: 1000 * 3,
    error: function(jqXHR, textStatus, errorThrown) {
      console.log('ajax error',textStatus, errorThrown);
    },
    success: data => {
      let imdbArray = data;
      displayMovies(imdbArray)
    }
  })
}

async function displayMovies(array) {
  let $movieDiv = $('<div>');
  for (let n=0; n < array.length; n++) {
    let movie = await pullMovieFromOmdb(array[n]);
    let watchlistButton = await loadAddToWatchlistButton(movie.Title,movie.imdbID);
    let $movie = $('<div>');
    $movie.html(`
      <div class='row' style='background-color:white; border:1px solid black; border-radius:15px; margin:0 0 10px 0; padding: 5px'>
        <div class='col-3 text-center'>
          <img src=${movie.Poster} width='100%' style='margin:10px 0'>
        </div>
        <div class='col-9'>
          <div class='row'>
            <div class='col-7'>
              <h4 style="display:inline-block"><a href=https://www.imdb.com/title/${movie.imdbID}/ target='_blank'><strong>${movie.Title}</strong></a></h4> <h5 style="display:inline-block">(${movie.Year})</h5>
              <p>${movie.Rated} | ${movie.Runtime} | ${movie.Genre}</p>
            </div>
            <div class='col-5 text-right'>
              ${watchlistButton}
              <p>IMDB Rating: <i class="fas fa-star"></i> ${movie.imdbRating}</p>
            </div>
          </div>
          <p>${movie.Plot}</p>
          <p>Director: ${movie.Director} | Stars: ${movie.Actors}</p>
        </div>
      </div>
    `)
    $movieDiv.append($movie);
  }

  $(`#scrapeDisplay`).empty().append($movieDiv); // clear loading message then add movies
}

async function loadAddToWatchlistButton(title,imdbID) {
  let userId = sessionStorage.getItem('movieMasterId');
  let duplicateBoolean = await checkIfDuplicate(userId,title);
  // console.log('duplicateBoolean',duplicateBoolean)
  if (!duplicateBoolean) {
    return `<button class='btn btn-info btn-sm mt-2 mb-2 handleAddToWatchlist' data-imdbId='${imdbID}' data-title='${title}'><i class="fas fa-plus-circle"></i> Add to Watchlist</button>`
  } else {
    return '<p>Added to Watchlist</p>'
  }
}

function checkIfDuplicate(userId,title) {
  let queryObj = {
    UserId: userId,
    title: title
  }
  return $.get('/api/check-duplicate',queryObj)
    .then( data => {
      // if data is true, then it's a duplicate entry
      return data
    })
    .catch( err => console.log(err))
}

function pullMovieFromOmdb(imdbId) {
  return $.get(`http://www.omdbapi.com/?apikey=${omdbApiKey}&i=${imdbId}`)
    .then(response => response)
    .catch(err => console.log('err',err));
}

// Add to watchlist button handler
$('body').on('click','.handleAddToWatchlist',handleAddToWatchlist);

async function handleAddToWatchlist() {
  let imdbId = $(this).attr('data-imdbId') // get movie ID to search IMDB db (via unique URL)
  let userId = sessionStorage.getItem('movieMasterId');
  addMovieToDb(imdbId,userId);
  
  let title = $(this).attr('data-title');
  let watchlistButton = await loadAddToWatchlistButton(title,imdbId);
  console.log('$(this)',$(this))
  console.log('watchlistButton',watchlistButton);
  // $(this).empty().html('<p>Added to Watchlist</p>');
  $(this).replaceWith('<p>Added to Watchlist</p>');
}

async function addMovieToDb(imdbId,userId) {
  let omdbMovie = await pullMovieFromOmdb(imdbId);
  let runtimeUpdated = omdbMovie.Runtime.replace(/\D+/g, '');
  let movie = {
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
  $.post('/api/add-movie-to-watchlist',movie)
    .then( () => {
      // console.log('posted!');
    })
    .catch( err => console.log(err))
}
