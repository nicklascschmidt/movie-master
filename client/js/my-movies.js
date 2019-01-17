console.log('Lieutenant, we are connected and ready to rumble.');

$(document).ready(handleMoviesOnLoad());
$('body').on('click','.addUserRating',addUserRating);


async function handleMoviesOnLoad() {
  let unwatchedMovies = await pullMoviesFromDb('unwatched');
  let watchedMovies = await pullMoviesFromDb('watched');
  displayMovies(unwatchedMovies,'unwatched');
  displayMovies(watchedMovies,'watched');
}

function displayMovies(array,type) {
  console.log('array',array);
  let $movieDiv = $('<div>');
  for (let n=0; n < array.length; n++) {
    let movie = {
      title: array[n].title,
      imdbUrl: array[n].imdbUrl,
      posterUrl: array[n].posterUrl,
      year: array[n].year,
      maturityRating: array[n].maturityRating,
      lengthInMinutes: array[n].lengthInMinutes,
      imdbRating: array[n].imdbRating,
      plot: array[n].plot,
      director: array[n].director,
      actors: array[n].actors,
      genre: array[n].genre,
      userRating: array[n].userRating
    }
    console.log(movie);
    let $movie = $('<div>');
    $movie.html(`
      <div class='row' style='background-color:white; border:1px solid black; border-radius:15px; margin:0 0 10px 0; padding: 5px'>
        <div class='col-3'>
          <img src=${array[n].posterUrl} width='100%'>
        </div>
        <div class='col-9'>
          <div class='row'>
            <div class='col-6'>
              <h4 style="display:inline-block"><a href=${array[n].imdbUrl} target='_blank'><strong>${array[n].title}</strong></a></h4> <h5 style="display:inline-block">(${array[n].year})</h5>
              <p>${array[n].maturityRating} | ${array[n].lengthInMinutes} min | ${array[n].genre}</p>
            </div>
            <div class='col-6 text-right'>
              <p>IMDB Rating: <i class="fas fa-star"></i> ${array[n].imdbRating}</p>
              ${getUserRating(array[n].userRating)}
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

function getUserRating(rating) {
  if (rating !== null) {
    return `<p>My Rating: <i class="far fa-star"></i> ${rating}</p>`
  } else {
    return `<button class='btn btn-info btn-sm addUserRating'>rate</button>`
  }
}

function getActors(actors) {
  console.log('actors',actors);
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


function addUserRating() {
  console.log('adding user rating...');
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


// $(document).on("click", ".scrape-button", scrapeArticle);
// $(document).on("click", ".clear-button", clearArticles);
// $('body').on("click",'.article-card', articleClickHandler);
// $('body').on("click", "#save-note", saveNote);

function scrapeArticle() {
    console.log('scraping...');
    $.get("/scrape")
        .then(function(data) {
          console.log(data);
          renderArticles();
        })
        .catch(function(err) {
          return console.log(err);
        })
        // .then(renderArticles);

    setTimeout(renderArticles,1000);
    
}

function renderArticles() {
    console.log('Articles rendering...');

    // Grab the articles as a json
    $.getJSON("/articles", function(data) {
      console.log("here's some data", data[0]);
      if (data[0]) {
        $("#articleInput").empty();
      }
      
      // For each one
      for (var n = 0; n < data.length; n++) {
        // console.log('this is data',data);

        var $articleCard = '\
          <div class="card article-card" data-id="' + data[n]._id + '">\
            <div class="card-header d-flex">\
              <img src="' + data[n].imgLink + '" alt="Picture Not Found" class="d-inline-block img-fluid">\
              <h3 class="d-inline-block text-justify flex-fill header-padding">\
                <a target="_blank" href="' + data[n].link + '">' + data[n].title + '</a>\
              </h3>\
            </div>\
          </div>'
        
        $("#articleInput").append($articleCard);
      }
    });
}

function clearArticles() {
  console.log('clearing articles...');
  
  $.get('/clear')
    .then(function(data) {
      console.log('cleared data',data);
    })
    .catch(function(err) {
      return console.log('cleared data error',err);
    })
    // .then(renderArticles);
  
  $("#articleInput").html('<h3>No Articles To Show</h3>');

}

  
function articleClickHandler() {
  console.log('article clicked...');
  console.log('this is this: ',this);

  // Empty the notes from the note section
  $("#notes-card").empty();
  // Save the id from the element
  var thisId = $(this).attr("data-id");
  
  // Now make an ajax call for the Article
  $.ajax({
      method: "GET",
      url: "/articles/" + thisId
    })
    // With that done, add the note information to the page
    .then(function(data) {
      console.log('this is ajax data',data);

      $('.article-title').text(data.title);
      $('#note-user-input').html('\
        <h6 class="card-text" id="note-title"></h6>\
        <textarea type="text" id="note-input" style="width: 100%"></textarea>\
        <button class="btn btn-submit" data-id="' + data._id + '" id="save-note">Submit</button>\
        ');

      // If there's a note in the article
      if (data.note) {
        // Place the title of the note in the title input
        $("#note-title").val(data.note.title);
        // Place the body of the note in the body textarea
        $("#note-input").val(data.note.body);
      }
    })
    .catch(function(err) {
      if (err) throw err;
    });
}

function saveNote() {
  console.log('saving note...');
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      // Value taken from title input
      title: $("#note-title").val(),
      // Value taken from note textarea
      body: $("#note-input").val()
    }
  })
    // With that done
    .then(function(data) {
      // Log the response
      console.log(data);
      // Empty the notes section
      $("#note-user-input").empty();
    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#note-title").val("");
  $("#note-input").val("");
}  
