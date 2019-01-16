console.log('Lieutenant, we are connected and ready to rumble.');

$(document).ready(showUnwatchedMovies);

function showUnwatchedMovies() {
  
}


$(document).on("click", ".scrape-button", scrapeArticle);
$(document).on("click", ".clear-button", clearArticles);
$('body').on("click",'.article-card', articleClickHandler);
$('body').on("click", "#save-note", saveNote);

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
