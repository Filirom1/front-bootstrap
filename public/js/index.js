// The router is a Singleton.
// It is responsible of displaying your page given an URL.
//
// Some views in the application are always rendered: the AppViews.
sd.Router = Backbone.Router.extend({

  routes: {
    "":                     "home",    // index.html
    "search/:query":        "search",  // index.html#search/kiwis
    "search/:query/p:page": "search"   // index.html#search/kiwis/p7
  },

  initialize: function(){
    $('header').append(new sd.view.HeaderView().render().el);
  },

  // Index page
  home: function() {
    $('#main').append(new sd.view.TodoView().render('Welcome home').el);
  },

  // Search page
  search: function(query, page) {
    $('#main').append(new sd.view.TodoView().render('Welcome search ' + query + ' ' + page).el);
  }

});

$(function(){
  sd.router = new sd.Router();
  Backbone.history.start();
});
