console.log('Lieutenant, we are connected and ready to rumble.');

// $(document).ready();

const omdbApiKey = config.OMDB_API_KEY;

$('body').on('click','#scrapeImdb',scrapeImdb);

function scrapeImdb() {
  console.log('this happened')
  $.ajax({
    url: '/scrape/imdb',
    method: 'GET',
    // data: queryObj,
    timeout: 1000 * 3,
    error: function(jqXHR, textStatus, errorThrown) {
      console.log('ajax error',textStatus, errorThrown);
    },
    success: data => {
      console.log('data',data)
    }
  })
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
