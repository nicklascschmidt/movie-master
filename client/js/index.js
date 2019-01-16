console.log('Lieutenant, we are connected and ready to rumble.');

function captureUserInputs(type) {
  let user = {
    username: null,
    password: null
  }
  if (type === 'signup') {
    user.username = $('#signupUsernameInput').val();
    user.password = $('#signupPasswordInput').val();
  } else if (type === 'login') {
    user.username = $('#loginUsernameInput').val();
    user.password = $('#loginPasswordInput').val();
  } else {
    // nothing
  }
  return user
}

// --------- Signup ---------
$('#submitSignup').on('click',handleSignup);

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
      $('#signupInputError').append(`<p>${errorResult.errors[n]}</p>`);
    }
  }
}

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
  let usernameSpaceIsFound = findSpaces(user.username);
  if (usernameSpaceIsFound) {
    errorObj.errors.push('Username cannot contain spaces.');
    errorObj.isError = true;
  }
  
  // Password validation
  if (user.password.length < 5 || user.password.length > 30) {
    errorObj.errors.push('Password must be between 5-30 characters.');
    errorObj.isError = true;
  }
  let passwordSpaceIsFound = findSpaces(user.password);
  if (passwordSpaceIsFound) {
    errorObj.errors.push('Password cannot contain spaces.');
    errorObj.isError = true;
  }
  
  return errorObj
}

function findSpaces(word) {
  for (let n=0; n < word.length; n++) {
    if (word[n] === ' ') {
      return true
    }
  }
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

async function validateLogin() {
  event.preventDefault();

  let user = captureUserInputs('login');

  let userObj = await checkDbForLoginCredentials(user);

  if (userObj !== null) {
    welcomeUser(userObj);
  } else {
    $('#loginInputError').html(`<p>User profile not found. Please re-enter login credentials or sign up for an account.</p>`);
  }
}

function checkDbForLoginCredentials(user) {
  return $.get('/api/find-user',user)
    .then(response => response)
    .catch(err => console.log('err',err));
}

function welcomeUser(user) {
  $('#userForms').html(`<div class="container-fluid text-center"><h2>Welcome ${user.username}!</h2><h4>Taking you to the My Movies page...</h4></div>`);

  sessionStorage.setItem('movieMasterId',user.id); // stores user's ID in session storage - accessible on other pages
  setTimeout(rerouteUser,3 * 1000);
}

function rerouteUser() {
  window.location = '/my-movies.html'; // bring user to the my movies page
}

