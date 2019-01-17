console.log('Lieutenant, we are connected and ready to rumble.');

$(document).ready(handleMoviesOnLoad());


async function handleMoviesOnLoad() {
  let unwatchedMovies = await pullMoviesFromDb('unwatched');
  let watchedMovies = await pullMoviesFromDb('watched');
  displayMovies(unwatchedMovies,'unwatched');
  displayMovies(watchedMovies,'watched');
}

function displayMovies(array,type) {
  let $movieDiv = $('<div>');
  for (let n=0; n < array.length; n++) {
    let $movie = $('<div>');
    $movie.html(`
      <div class='row' style='background-color:white; border:1px solid black; border-radius:15px; margin:0 0 10px 0; padding: 5px'>
        <div class='col-3 text-center'>
          <img src=${array[n].posterUrl} width='100%' style='margin:10px 0'>
        </div>
        <div class='col-9'>
          <div class='row'>
            <div class='col-6'>
              <h4 style="display:inline-block"><a href=${array[n].imdbUrl} target='_blank'><strong>${array[n].title}</strong></a></h4> <h5 style="display:inline-block">(${array[n].year})</h5>
              <p>${array[n].maturityRating} | ${array[n].lengthInMinutes} min | ${array[n].genre}</p>
            </div>
            <div class='col-6 text-right'>
              <p>IMDB Rating: <i class="fas fa-star"></i> ${array[n].imdbRating}</p>
              ${getUserRating(array[n].userRating,array[n].id)}
            </div>
          </div>
          <p>${array[n].plot}</p>
          <p>Director: ${array[n].director} | Stars: ${getActors(array[n].actors)}</p>
        </div>
      </div>
    `)
    $movieDiv.append($movie);
  }
  $(`#${type}-movies`).append($movieDiv);
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
    $(`#div${id}`).append(`<p class='error${id}' style='clear:both'>${errorObj.error}</p>`);
  }
}

function validateUserRating(rating) {
  let errorObj = {
    isError: null,
    error: null
  }
  if (rating > 0 && rating < 10) {
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
    data: queryObj
  })
  .then( data => console.log('data',data))
  .catch( err => console.log('err',err))
}

function getActors(actors) {
  // console.log('actors',actors);
  return actors
}

function pullMoviesFromDb(type) {
  let queryObj = {
    isWatched: null
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


// postMovie();

function postMovie() {
  let userId = sessionStorage.getItem('movieMasterId');
  let movie = {
    UserId: userId,
    title: 'godfather',
    imdbUrl: 'something.com',
    posterUrl: 'https://m.media-amazon.com/images/M/MV5BMTg2MzI1MTg3OF5BMl5BanBnXkFtZTgwNTU3NDA2MTI@._V1_SX300.jpg',
    year: '1999',
    maturityRating: 'R',
    lengthInMinutes: 100,
    imdbRating: 9.5,
    plot: 'Pysch Joker emerges from his mysterious past, he wreaks havoc and chaos on the people of Gotham. The Dark Knight must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
    director: 'Someone',
    actors: 'guy1 ayo, some guy3, guy4',
    genre: 'action',

    isWatched: false,
    userRating: 8.5
  }
  $.post('/api/get-movies',movie)
    .then( () => {
      console.log('posted!');
    })
    .catch( err => console.log(err))
}
