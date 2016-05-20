define(
  'app/views/home/index', [
    'jquery',
    'underscore',
    'magix'
  ],
  function($, _, Magix) {

    return Magix.View.extend({
      render: function() {
        var me = this;
        me.setView();
      }
    })
  }
);