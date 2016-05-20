(function() {
  var script = function() {
    var scripts = document.getElementsByTagName('script')
    return scripts[scripts.length - 1]
  }();

  var base = function() {
    var src = script.getAttribute('src')
    var base = /(.+\/)(.+\/.+)/.exec(src)[1]
    return base
  }();

  require.config({
    paths: {
      app: base + (UserInfo.debug ? 'app_debug/' : 'app/'),
      magix: '//g.alicdn.com/thx/magix/2.0/requirejs-magix',
      pat: '//g.alicdn.com/mm/pat/1.1/pat' + (UserInfo.debug ? '' : '-min')
    }
  });

  require(['magix', 'jquery', 'pat'], function(Magix, $, Pat) {
    Magix.start({
      error: function(e) {
        if (console) {
          console.error(e.stack) //将错误抛出来
        }
      },
      iniFile: 'app/ini' //配置在ini.js里
    });

    Pat.config({
      debug: UserInfo.debug ? true : false
    })

  })
})()