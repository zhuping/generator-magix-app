define(
  "app/views/home/menu", [
    'jquery',
    'underscore',
    'magix',
    'app/views/common/menu'
  ],
  function($, _, Magix, CommonMenu) {
    return CommonMenu.extend({
      init: function() {
        var me = this;
        CommonMenu.prototype.init.apply(me, arguments);
        me.observeLocation(['tab']);
      },
      render: function() {
        var me = this;
        var loc = me.location;
        var tab = loc.get('tab') || 'plan';
        var tabs = me.wrapTab(tab);
        _.extend(me.data, {
          tabs: tabs
        });

        me.setViewHTML();
        me.setInitialState();
      },
      wrapTab: function(tab) {
        var tabs = [{
          icon: '&#xe612;',
          key: 'plan',
          label: '计划管理'
        }, {
          icon: '&#xe609;',
          key: 'creative',
          label: '创意管理'
        }];

        _.each(tabs, function(item, i) {
          if (tab === item.key) {
            item.selected = true;
          } else {
            item.selected = false;
          }
        });
        return tabs;
      }
    });
  });