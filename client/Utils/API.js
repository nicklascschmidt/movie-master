const API = {
  // Gets users from the NYT API
  getUsers: function() {
    console.log('API - this happened')
    // return $.get("/api/users");
  },
  // getUsers: function(params) {
  //   return axios.get("/api/users", { params });
  // },
  // // Gets all saved articles
  // getSavedArticles: function() {
  //   return axios.get("/api/articles");
  // },
  // // Deletes the saved article with the given id
  // deleteArticle: function(id) {
  //   return axios.delete("/api/articles/" + id);
  // },
  // // Saves an article to the database
  // saveArticle: function(articleData) {
  //   return axios.post("/api/articles", articleData);
  // }
};

module.exports = API;
