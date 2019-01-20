console.log('Lieutenant, we are connected and ready to rumble.');


const omdbApiKey = config.OMDB_API_KEY;
// const omdbApiKey = process.env.OMDB_API_KEY;


// ------------------------------------------------------------------
//              Scrape
// ------------------------------------------------------------------

// Dropdown clicked
$('body').on('click','.scrapeImdb', function() {
  let pageStart = $(this).attr('data-pageStart'); // grab page
  $('#scrapeDisplay').html('<h4>Loading movies (takes a few seconds)...</h4>'); // loading message
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
      displayMovies(imdbArray,'scrapeDisplay')
    }
  })
}

async function displayMovies(array,element) {
  let $movieDiv = $('<div>');
  for (let n=0; n < array.length; n++) {
    // console.log('array[n]',array[n])
    let movie = await pullMovieFromOmdb(array[n],'id');
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

  $(`#${element}`).empty().append($movieDiv); // clear loading message then add movies
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

function pullMovieFromOmdb(searchValue,type) {
  let searchType = null;
  if (type === 'id') {
    searchType = 'i';
  } else if (type === 'title') {
    searchType = 's'
  } else {
    // nothing
  }
  return $.get(`https://www.omdbapi.com/?apikey=${omdbApiKey}&${searchType}=${searchValue}`)
    .then(response => response)
    .catch(err => console.log('err',err));
}

// ------------------------------------------------------------------
//              Add to watchlist
// ------------------------------------------------------------------

// Add to watchlist button handler
$('body').on('click','.handleAddToWatchlist',handleAddToWatchlist);

async function handleAddToWatchlist() {
  let imdbId = $(this).attr('data-imdbId') // get movie ID to search IMDB db (via unique URL)
  let userId = sessionStorage.getItem('movieMasterId');
  console.log('userId',userId);
  if (userId !== null) {
    addMovieToDb(imdbId,userId);
    $(this).replaceWith(`<p style='color:green'>Added to Watchlist</p>`);
  } else {
    $(this).replaceWith(`<p style='color:red'>Need to create an account</p>`);
  }
}

async function addMovieToDb(imdbId,userId) {
  let omdbMovie = await pullMovieFromOmdb(imdbId,'id');
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

// ------------------------------------------------------------------
//              Search
// ------------------------------------------------------------------

$('body').on('click','#searchInputSubmit',submitSearch);


async function submitSearch() {
  event.preventDefault();

  // first get array of movies and grab the imdbId
  let searchTerm = $('#searchInput').val().trim();
  let omdbMovieArray = await pullMovieFromOmdb(searchTerm,'title'); // search results don't give the full object
  // console.log('omdbMovieArray.Search',omdbMovieArray.Search)
  let splicedArray = (omdbMovieArray.Search.length > 10) ? omdbMovieArray.Search.splice(0,10) : omdbMovieArray.Search; // limit the search results to 10
  
  let imdbIdArray = [];
  for (let n=0; n < splicedArray.length; n++) {
    imdbIdArray.push(splicedArray[n].imdbID);
  }
  
  // then use the array of imdbIds to get an array of Movies with full props
  $('#searchDisplay').html('<h4>Loading movies (takes a second)...</h4>'); // loading message
  displayMovies(imdbIdArray,'searchDisplay');
}
