sd.view.HeaderView = Backbone.View.extend({

  template: JST.header,

  render: function() {
    this.$el.html(this.template());
    return this;
  }
});
