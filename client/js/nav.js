// Checks if user is logged in. Sets "login/signup || log out" nav tag button accordingly

$(document).ready( () => {
  let userIdCheck = sessionStorage.getItem('movieMasterId');
  if (userIdCheck !== null) {
    $('#navLogin').html(`<div class='nav-link'><button type='button' id='navLoginButton' class='btn btn-sm btn-danger'>Log Out</button></div>`);
    $('#navMyMovies').show();
  } else {
    $('#navLogin').html(`<a href='/' class='nav-link'><button type='button' class='btn btn-sm btn-primary'>Login / Signup</button></a>`);
  }

  // If logout clicked, reset session storage and reload page
  $('#navLoginButton').on('click', () => {
    sessionStorage.removeItem('movieMasterId');
    location.reload();
  })
});
