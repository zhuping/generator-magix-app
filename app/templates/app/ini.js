define('app/ini', [
  'jquery',
  'magix'
], function($, Magix) {
  var MainView = 'app/views/default'
  var T = {
    routes: {
      'app/views/default': [
        
      ]
    }
  }

  return {
    defaultView: MainView,
    defaultPath: '',
    unfoundView: 'app/views/common/404',
    tagName: 'div',
    extensions: [
      'app/view'
    ],
    routes: function(pathname) {
      if (!$.isEmptyObject(T.routes)) {
        var s
        $.each(T.routes, function(k, item) {
          if ($.inArray(pathname, item) !== -1) {
            s = k
            return false
          }
        })
        if (s) return s
        return this.unfoundView
      }
      return this.defaultView
    },
    error: function(e) {
      if (window.JSTracker2) {
        window.JSTracker2.error(e.message)
      } else if (window.console) {
        window.console.error(e.stack)
      }
    }
  }
})