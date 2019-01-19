console.log('Lieutenant, we are connected and ready to rumble.');

$(document).ready(handleMoviesOnLoad());


async function handleMoviesOnLoad() {
  let userId = sessionStorage.getItem('movieMasterId')
  let unwatchedMovies = await pullMoviesFromDb('unwatched');
  let watchedMovies = await pullMoviesFromDb('watched');
  if (userId) {
    displayMovies(unwatchedMovies,'unwatched');
    displayMovies(watchedMovies,'watched');
  } else {
    $(`#movie-container`).html(`<h4 style='margin:auto'>Please signup and/or login to start tracking movies.</h4>`);
  }
}

function displayMovies(array,type) {
  $(`#${type}-movies`).empty();
  let $movieDiv = $('<div>');
  if (array.length > 0) {
    for (let n=0; n < array.length; n++) {
      let $movie = $('<div>');
      $movie.html(`
        <div class='row' style='background-color:white; border:1px solid black; border-radius:15px; margin:0 0 10px 0; padding: 5px'>
          <div class='col-3 text-center'>
            <img src=${array[n].posterUrl} width='100%' style='margin:10px 0'>
          </div>
          <div class='col-9'>
            <div class='row'>
              <div class='col-7'>
                <h4 style="display:inline-block"><a href=${array[n].imdbUrl} target='_blank'><strong>${array[n].title}</strong></a></h4> <h5 style="display:inline-block">(${array[n].year})</h5>
                <p>${array[n].maturityRating} | ${array[n].lengthInMinutes} min | ${array[n].genre}</p>
              </div>
              <div class='col-5 text-right'>
                <p>IMDB Rating: <i class="fas fa-star"></i> ${array[n].imdbRating}</p>
                ${getUserRating(array[n].userRating,array[n].id)}
              </div>
            </div>
            <p>${array[n].plot}</p>
            <p>Director: ${array[n].director} | Stars: ${getActors(array[n].actors)}</p>
          </div>
          <div class='col-12 d-inline-flex p-1 justify-content-around'>
            <button class='btn btn-info btn-sm markAsWatched' data-isWatched='${array[n].isWatched}' data-id='${array[n].id}'>${watchedOrUnwatched(array[n].isWatched)}</button>
            <button class='btn btn-info btn-sm removeFromList' data-id='${array[n].id}'><i class="fas fa-trash-alt"></i> Remove from List</button>
          </div>
        </div>
      `)
      $movieDiv.append($movie);
    }
  } else {
    $movieDiv.text('No movies to show.');
  }
  $(`#${type}-movies`).append($movieDiv);
}

$('body').on('click','.removeFromList',removeFromList);

function removeFromList() {
  let id = $(this).attr('data-id');
  let queryObj = {
    id: id
  }
  $.ajax({
    url: '/api/remove-movie-from-db',
    method: 'DELETE',
    data: queryObj,
    timeout: 1000 * 3,
    error: function(jqXHR, textStatus, errorThrown) {
      console.log('ajax error',textStatus, errorThrown);
    }
  })
  handleMoviesOnLoad();
}

function watchedOrUnwatched(isWatched) {
  if (isWatched) {
    return `<i class="fas fa-eye-slash"></i> Mark as unwatched`
  } else {
    return `<i class="fas fa-eye"></i> Mark as watched`
  }
}

$('body').on('click','.markAsWatched',markAsWatched);

function markAsWatched() {
  let id = $(this).attr('data-id');
  let isWatched = $(this).attr('data-isWatched');

  let queryObj = {
    id: id,
    isWatched: isWatched
  }
  $.ajax({
    url: '/api/update-isWatched',
    method: 'PUT',
    data: queryObj,
    timeout: 1000 * 5,
    // error: function(jqXHR, textStatus, errorThrown) {
    //   console.log('ajax error',textStatus, errorThrown);
    // }
  })
  .catch( err => console.log('err',err))
  handleMoviesOnLoad();
}

function getUserRating(rating,id) {
  if (rating !== null) {
    return `<p>My Rating: <i class="far fa-star"></i> ${rating}</p>`
  } else {
    return `<div class='switchToUserRatingForm text-right' data-id='${id}'><button class='btn btn-info btn-sm'>rate</button></div>`
  }
}

$('body').on('click','.switchToUserRatingForm',switchToUserRatingForm);

function switchToUserRatingForm() {
  let id = $(this).attr('data-id');
  $(this).removeClass(); // allows user to access input field
  $(this).attr('id',`div${id}`); // set ID so we can clear the form after submitting
  $(this).html(`
    <form class='form-inline float-right'>
      <label class="sr-only" for="inlineFormInputName2">Name</label>
      <input type='text' class='form-control form-control-sm' placeholder='#' id='input${id}' style='width:30px'>
      <button type='submit' class='submitUserRating btn btn-info btn-sm ml-3' data-id='${id}'>Submit</button>
    </form>
  `)
}

$('body').on('click','.submitUserRating',submitUserRating);

function submitUserRating() {
  event.preventDefault();

  let id = $(this).attr('data-id'); // grab data-id (#) from the button
  let inputRating = $(`#input${id}`).val() // grab user input

  let errorObj = validateUserRating(inputRating);

  if (!errorObj.isError) {
    submitUserRatingToDb(inputRating,id);
    let userRatingHtml = getUserRating(inputRating,id); // get new html
    $(`#div${id}`).html(userRatingHtml); // append new html to the container div
  } else {
    $(`.error${id}`).empty();
    $(`#div${id}`).append(`<p class='error${id}' style='clear:both; color:red'>${errorObj.error}</p>`);
  }
}

function validateUserRating(rating) {
  let errorObj = {
    isError: null,
    error: null
  }
  if (rating >= 0 && rating <= 10) {
    errorObj.isError = false;
  } else {
    errorObj.isError = true;
    errorObj.error = 'Rating must be a # between 0 and 10.';
  }
  return errorObj
}

function submitUserRatingToDb(rating,id) {
  let queryObj = {
    rating: rating,
    id: id
  }
  $.ajax({
    url: '/api/update-user-rating',
    method: 'PUT',
    data: queryObj,
    error: function(jqXHR, textStatus, errorThrown) {
      console.log('ajax error',textStatus, errorThrown);
    }
  })
  .catch( err => console.log('err',err))
}

function getActors(actors) {
  // console.log('actors',actors);
  return actors
}

function pullMoviesFromDb(type) {
  let queryObj = {
    isWatched: null,
    UserId: sessionStorage.getItem('movieMasterId')
  }
  if (type === 'watched') {
    queryObj.isWatched = 1
  } else if (type === 'unwatched') {
    queryObj.isWatched = 0
  } else {
    // nothing
  }
  return $.get('/api/get-all-movies',queryObj)
    .then( response => response)
    .catch( err => console.log('err',err))
}
