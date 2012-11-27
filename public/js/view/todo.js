sd.view.TodoView = Backbone.View.extend({

  // template is just a shurtcut to the right JST template.
  template: JST.todo,

  // react to user events
  events: {
    "click .button": "todo"
  },

  todo: function(){
    console.log("TODO", this);
  },

  // Populate the template.
  // Then we will use the reference `el` (or the jquery version `$el`)
  // to attach this HTML portion into the DOM.
  render: function(text) {
    this.$el.html(this.template({
      name: 'TODO',
      text: text
    }));
    // Never forget to return this, very usefull with nested views.
    return this;
  }
});
