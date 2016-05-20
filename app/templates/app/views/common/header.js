define(
  'app/views/common/header', [
    'jquery',
    'brix/loader/util',
    'magix'
  ],
  function($, _, Magix) {
    var EMPTY = '';
    var DEFAULT = {
      menuList: [{
        path: '/home/index',
        text: '首页'
      }, {
        path: '/manage/index',
        text: '管理'
      }]
    };
    return Magix.View.extend({
      init: function() {
        var me = this;
        me.observeLocation({
          path: true
        });
      },
      render: function() {
        var me = this;
        var menuList = $.extend(true, [], DEFAULT.menuList);
        var path = me.location.path || EMPTY;
        var i, menu;
        for (i = 0;
          (menu = menuList[i]) !== undefined; i++) {
          if (!path.indexOf('/' + menu.path.substr(1).split('/')[0])) {
            menu.active = true;
            break;
          }
        }

        if (!menu) {
          menuList[0].active = true;
        }
        
        me.data = {
          menuList: menuList,
          loginUser: UserInfo
        };

        me.setView();
      }
    });
  });