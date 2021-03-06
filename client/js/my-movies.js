// Loads movies from user's watchlist (watched + unwatched).
// Sets logic to handle changes to user movie rating, watch/unwatched, remove from watchlist.

// TODO: update rating system to show edit button and allow editing (orange)

$(document).ready(handleMoviesOnLoad());

// If user is logged in, displays watchlist movies on page. If not, displays message.
async function handleMoviesOnLoad() {
  const userId = sessionStorage.getItem('movieMasterId');
  const unwatchedMovies = await pullMoviesFromDb('unwatched',userId);
  const watchedMovies = await pullMoviesFromDb('watched',userId);
  if (userId) {
    $(`#movie-container`).show();
    displayMovies(unwatchedMovies,'unwatched');
    displayMovies(watchedMovies,'watched');
  } else {
    $(`#movie-container`).show().html(`<h4 class='mx-auto'>Please signup and/or login to start tracking movies.</h4>`);
  }
}

// Pull movies for a certain type (watched/unwatched), return an array of movie objects.
function pullMoviesFromDb(type,userId) {
  const queryObj = {
    UserId: userId,
    isWatched: (type === 'watched') ? 1 : 0
  }
  return $.get('/api/movies',queryObj)
    .then(data => data)
    .catch(err => console.log(err));
}

// Build div for each movie, append to HTML.
// If no movies on watchlist, show message.
function displayMovies(array,type) {
  $(`#${type}-movies`).empty();
  if (array.length > 0) {
    for (let n=0; n < array.length; n++) {
      const $movie = $(`
        <div id='movie${array[n].id}' class='row p-2 mb-2 movie-custom'>
          <div class='col-12 col-sm-3 text-center'>
            <img src=${array[n].posterUrl} class='img-custom' alt='missing movie image'>
          </div>
          <div class='col-12 col-sm-9'>
            <div class='row'>
              <div class='col-8'>
                <h4 class='d-inline-block'><a href=${array[n].imdbUrl} target='_blank'><strong>${array[n].title}</strong></a></h4> <h5 class='d-inline-block'>(${array[n].year})</h5>
                <p>${array[n].maturityRating} | ${array[n].lengthInMinutes} min | ${array[n].genre}</p>
              </div>
              <div class='col-4 text-right'>
                <p>IMDB <i class="fas fa-star"></i> ${array[n].imdbRating}</p>
                ${getUserRating(array[n].userRating,array[n].id)}
              </div>
            </div>
            <p>${array[n].plot}</p>
            <p>Director: ${array[n].director} | Stars: ${array[n].actors}</p>
          </div>
          <div class='col-12 d-inline-flex p-1 justify-content-around'>
            <button class='btn btn-primary btn-sm markAsWatched' data-isWatched='${array[n].isWatched}' data-id='${array[n].id}'>${watchedOrUnwatched(array[n].isWatched)}</button>
            <button class='btn btn-danger btn-sm removeFromList' data-id='${array[n].id}'><i class="fas fa-trash-alt"></i> Remove</button>
          </div>
        </div>
      `);
      $(`#${type}-movies`).append($movie);
    }
  } else {
    const message = (type === 'unwatched') ? 'No movies on your watchlist. Please add movies to your watchlist on the Movie Search page.' : 'No movies to show.';
    $(`#${type}-movies`).html(`<h5 class='text-center'>${message}</h5>`);
  }
}


// When remove button is clicked, delete from DB and reload items.
// (Have to reload to show message if empty - can't just remove the movie)
$('body').on('click','.removeFromList',removeFromList);

async function removeFromList() {
  const movieId = $(this).attr('data-id');
  $.ajax({
    url: `/api/movies/delete/${movieId}`,
    method: 'DELETE',
    success: data => {
      (data === 1) ? handleMoviesOnLoad() : null;
    },
    error: (jqXHR, textStatus, errorThrown) => {
      console.log('ajax error', textStatus, errorThrown);
    }
  });
}

// When movies are loaded, shows diff message for each movie.
function watchedOrUnwatched(isWatched) {
  if (isWatched) {
    return `<i class="fas fa-eye-slash"></i> Mark as unwatched`
  } else {
    return `<i class="fas fa-eye"></i> Mark as watched`
  }
}

// When mark as watched button is clicked, update the DB and reload the movies.
$('body').on('click','.markAsWatched',markAsWatched);

function markAsWatched() {
  const isWatched = $(this).attr('data-isWatched');
  const movieId = $(this).attr('data-id');
  $.ajax({
    url: `/api/movies/update-watched/${movieId}`,
    method: 'PUT',
    data: { isWatched },
    success: data => (data) ? handleMoviesOnLoad() : null,
    error: (jqXHR, textStatus, errorThrown) => {
      console.log('ajax error', textStatus, errorThrown);
    }
  });
}

// Reformat the user rating to a # with one decimal.
function getUserRating(rating,id) {
  const ratingFormatted = parseFloat(rating).toFixed(1);
  if (rating !== null) {
    return `<p>My <i class="far fa-star"></i> ${ratingFormatted}</p>`
  } else {
    return `<div class='switchToUserRatingForm text-right' data-id='${id}'><button class='btn btn-warning btn-sm'>rate</button></div>`
  }
}

// When "Rate" button is clicked, replace the button with a form.
$('body').on('click','.switchToUserRatingForm',switchToUserRatingForm);

function switchToUserRatingForm() {
  const id = $(this).attr('data-id');
  $(this).replaceWith(`
    <div id='div${id}' class='input-group ml-auto' style='width:70px'>
      <input type='text' class='form-control form-control-sm p-1' placeholder='# /10' aria-label='testing' id='input${id}'>
      <div class='input-group-append ml-1'>
        <button type='button' class='submitUserRating btn btn-success btn-sm' data-id='${id}'><i class="fas fa-check"></i></button>
      </div>
    </div>
  `);
}

// When user rating is submitted, validate inputs.
// If valid, update rating in DB and replace the form with the user's rating.
$('body').on('click','.submitUserRating',submitUserRating);

function submitUserRating() {
  event.preventDefault();

  const id = $(this).attr('data-id'); // grab data-id (#) from the button
  const inputRating = $(`#input${id}`).val() // grab user input

  const errorObj = validateUserRating(inputRating);

  if (!errorObj.isError) {
    submitUserRatingToDb(inputRating,id);
    const userRatingHtml = getUserRating(inputRating,id); // get new html
    $(`#div${id}`).html(userRatingHtml); // append new html to the container div
  } else {
    $(`.error${id}`).empty();
    $(`#div${id}`).append(`<p class='error${id}' style='color:red'>${errorObj.error}</p>`);
  }
}

// User rating validation (simple) - must be a # between 0 and 10.
function validateUserRating(rating) {
  const errorObj = {
    isError: null,
    error: null
  }
  if (rating >= 0 && rating <= 10) {
    errorObj.isError = false;
  } else {
    errorObj.isError = true;
    errorObj.error = 'Rating must be a # between 0 and 10.';
  }
  return errorObj;
}

function submitUserRatingToDb(rating,id) {
  $.ajax({
    url: `/api/movies/update-rating/${id}`,
    method: 'PUT',
    data: { rating },
    success: data => data,
    error: (jqXHR, textStatus, errorThrown) => {
      console.log('ajax error', textStatus, errorThrown);
    }
  });
}
