// Checks if user is logged in. Sets "login/signup || log out" nav tag button accordingly

$(document).ready( () => {
  let userIdCheck = sessionStorage.getItem('movieMasterId');
  if (userIdCheck === null) {
    $('#navLogin').html(`<a href='/' class='btn btn-info nav-button'>Login / Signup</a>`);
  } else {
    $('#navLogin').html(`<button type='button' id='navLoginButton' class='btn btn-info nav-button'>Log Out</button>`);
  }

  // If logout clicked, reset session storage and reload page
  $('#navLoginButton').on('click', () => {
    sessionStorage.removeItem('movieMasterId');
    location.reload();
  })
});