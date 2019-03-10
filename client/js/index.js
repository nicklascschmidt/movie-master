// Login/signup page, frontend validation, rerouting to My Movies page

// On doc load--
// if user is already logged in, hide signup/login form.
// If not, hide the "already signed in" message.
$(document).ready(handleOnLoad);

function handleOnLoad() { 
  let userId = sessionStorage.getItem('movieMasterId');
  if (userId !== null) {
    $('#alreadyLoggedIn').show();
  } else {
    $('#userForms').show();
  }
}

// type = signup || login
function captureUserInputs(type) {
  let user = {
    username: $(`#${type}UsernameInput`).val(),
    password: $(`#${type}PasswordInput`).val()
  }
  return user
}

// --------- Signup ---------
$('#submitSignup').on('click',handleSignup);

// Grabs and validates signup inputs
// If success, send user info to DB. If not, show frontend validation errors.
function handleSignup() {
  event.preventDefault();

  let user = captureUserInputs('signup');

  let errorResult = validateSignup(user);
  
  $('#signupInputError').text('');
  if (!errorResult.isError) {
    clearSignupForm();
    submitSignupToDb(user);
  } else {
    for (let n=0; n < errorResult.errors.length; n++) {
      $('#signupInputError').append(`<p style='color:red'>${errorResult.errors[n]}</p>`);
    }
  }
}

// Validation (simple), return object with errors and boolean
// Username: between 3-30 chars, no spaces
// Password: between 5-30 chars, no spaces
function validateSignup(user) {
  let errorObj = {
    errors: [],
    isError: null
  };
  
  // Username validation
  if (user.username.length < 3 || user.username.length > 30) {
    errorObj.errors.push('Username must be between 3-30 characters.');
    errorObj.isError = true;
  }
  if (user.username.includes(' ')) {
    errorObj.errors.push('Username cannot contain spaces.');
    errorObj.isError = true;
  }
  
  // Password validation
  if (user.password.length < 5 || user.password.length > 30) {
    errorObj.errors.push('Password must be between 5-30 characters.');
    errorObj.isError = true;
  }
  if (user.password.includes(' ')) {
    errorObj.errors.push('Password cannot contain spaces.');
    errorObj.isError = true;
  }
  
  return errorObj;
}

function clearSignupForm() {
  $('#signupUsernameInput').text('');
  $('#signupPasswordInput').text('');
  $('#signupInputError').text('');
}

function submitSignupToDb(user) {
  $.post('/api/new-user',user)
    .then( () => {
      $('#signupForm').html('<div class="text-center"><h4>User submitted! Please login now.</h4></div>');
    })
    .catch(err => console.log('err',err));
}
 

// --------- Login ---------
$('#submitLogin').on('click',validateLogin);

// Grabs and validates login inputs
// If success, run welcomeUser (say welcome and redirect). If not, show login error.
async function validateLogin() {
  event.preventDefault();

  let user = captureUserInputs('login');

  let userObj = await checkDbForLoginCredentials(user);

  if (userObj !== null) {
    welcomeUser(userObj);
  } else {
    $('#loginInputError').html(`<p style='color:red'>User profile not found. Please re-enter login credentials or sign up for an account.</p>`);
  }
}

function checkDbForLoginCredentials(user) {
  return $.get('/api/find-user',user)
    .then(response => response)
    .catch(err => console.log('err',err));
}

// Show welcome message and initiate countdown (to redirect)
// Save user's ID in session storage - makes it accessible throughout the application
function welcomeUser(user) {
  sessionStorage.setItem('movieMasterId',user.id);
  
  let countdownNum = 5;
  $('#userForms').html(`<div class="container-fluid text-center"><h2>Welcome ${user.username}!</h2><h4 id='countdownRedirect'>Taking you to the Movie Search page in ${countdownNum}</h4></div>`);
  setInterval(countdownRedirect,1000);
  
  // Decrement countdown #. Redirect when countdown is over.
  function countdownRedirect() {
    countdownNum--;
    if (countdownNum === 0) {
      window.location = '/search'; // bring user to the search page
    } else {
      $('#countdownRedirect').text(`Taking you to the Movie Search page in ${countdownNum}`);
    }
  }
}

