define(
  'app/views/common/footer', [
    'jquery',
    'underscore',
    'magix'
  ],
  function($, _, Magix) {
    return Magix.View.extend({
      render: function() {
        var me = this
        $.ajax({
            url: '//www.taobao.com/go/rgn/mm/footer.php',
            dataType: 'jsonp',
            data: {
              mode: 'simple'
            }
          })
          .done(function(html) {
            me.data = {
              html: _.unescape(html)
            }
            me.setViewHTML()
          })
      }
    })
  }
)