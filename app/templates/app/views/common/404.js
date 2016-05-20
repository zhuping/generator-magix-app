define(
  'app/views/common/404', [
    'magix'
  ],
  function(Magix) {
    return Magix.View.extend({
      render: function() {
        var me = this;
        me.setView();
      },
      goBack: function(e) {
        e.preventDefault();
        history.back();
      }
    });
  });