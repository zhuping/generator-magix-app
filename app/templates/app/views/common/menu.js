/**
 * [common menu提供最基本的功能 sticky, 仅此而已]
 */
define(
  'app/views/common/menu', [
    'jquery',
    'brix/loader/util',
    'magix',
    'app/exts/local-storage'
  ],
  function($, _, Magix, Storage) {
    var W = window;
    var $W = $(W);

    return Magix.View.extend({
      init: function() {
        var me = this;
        var isFullNav = Storage.getItem('isFullNav');
        var c = me.cache = {
          duration: 250,
          isFullNav: isFullNav === null ? 1 : isFullNav
        };
        me.data = {
          viewId: me.id
        };
        $W.on('resize', c.resizeFn = function() {
          me._resize();
        });
        $W.on('scroll', c.scrollFn = function() {
          me._scroll();
        });
        me.on('destroy', function() {
          $W.off('resize', c.resizeFn);
          $W.off('scroll', c.scrollFn);
          clearTimeout(c.resizeT);
          clearTimeout(c.scrollT);
        });
        me.observeLocation({
          path: true
        });
      },
      render: function() {
        var me = this;
        me.setViewHTML();
        me.setInitialState();
      },

      setInitialState: function() {
        var me = this;
        var c = me.cache;
        var $nav = $('#J_' + me.id + '_nav');

        _.extend(c, {
          navInfo: {
            n: $nav,
            i: $nav.find('.menu-icon'),
            h: $nav.find('.menu-hold-btn'),
            m: $nav.find('.menu-hold'),

            'menu-ct': $nav.find('.menu-ct'),
            'menu-ctnr': $nav.find('.menu-ctnr'),
            //w: fixedWidth,
            o: $nav.offset(),
            ps: $nav.css('position')
          },
          main: $('#inmain')
        });

        if (+c.isFullNav === 1) {
          c.main.css('margin-left', 200);
          c.navInfo.n.css('width', 200);
          c.navInfo.i.hide();
          me._fadeOutIcon();
        } else if (+c.isFullNav === 0) {
          c.main.css('margin-left', 40);
          c.navInfo.n.css('width', 40);
          c.navInfo.i.show();
          me._fadeInIcon();
        }

        me._setNavHeight();

      },

      _setNavHeight: function() {
        var me = this;
        var c = me.cache;
        var nf = c.navInfo;
        // header 高度
        var headerH = 50;
        // 页脚高度
        var footerH = 0;
        // 为设置menuH准备的常量，固定的空白边距
        var gapH = 150;

        // 浏览器视窗高度
        var vpH;
        // 滚动条高度
        var scrollT;
        // nav 高度
        var H;
        // 需要滚动menu 高度 .menu-ct
        var menuH;

        // 区分当前状态是否是fixed状态
        if (!nf.isFixed) {
          vpH = $W.height();
          scrollT = $W.scrollTop();
          H = vpH + scrollT - headerH - footerH;
          nf.n.height(H);
        } else {
          H = nf.n.height();
        }

        menuH = nf['menu-ct'].height();

        if (H < (menuH + gapH)) {
          nf['menu-ctnr'].css({
            overflowY: 'auto',
            overflowX: 'hidden',
            height: (H - gapH)
          });
        } else {
          nf['menu-ctnr'].css({
            overflow: 'visible',
            height: 'auto'
          });
        }
      },
      _resize: function() {
        var me = this;
        var c = me.cache;
        var nf = c.navInfo;

        if (!nf || !nf.n) {
          return;
        }

        if (c.resizeT) {
          clearTimeout(c.resizeT);
        }
        c.resizeT = setTimeout(function() {
          me._setNavHeight();
        }, 50);
      },
      _scroll: function() {
        var me = this;
        var c = me.cache;
        var nf = c.navInfo;
        var scrollT = $W.scrollTop();
        var needFixed;

        if (!nf || !nf.n) {
          return;
        }

        if (c.scrollT) {
          clearTimeout(c.scrollT);
        }

        c.scrollT = setTimeout(function() {
          needFixed = nf.o.top < scrollT;
          if (needFixed) {
            if (!nf.isFixed) {
              nf.isFixed = 1;
              me._static2fixed();
              me._setNavHeight();
            }

          } else if (nf.isFixed) {
            nf.isFixed = 0;
            me._fixed2static();
            me._setNavHeight();
          } else {
            me._setNavHeight();
          }
        }, 10);
      },
      _static2fixed: function() {
        var me = this;
        var c = me.cache;
        var nf = c.navInfo;
        nf.n.css({
          float: 'none',
          position: 'fixed',
          left: nf.o.left,
          top: 0,
          //width: nf.w,
          height: '100%'
        });
      },
      _fixed2static: function() {
        var me = this;
        var c = me.cache;
        var nf = c.navInfo;
        nf.n.css({
          float: 'left',
          position: nf.ps,
          left: 'auto',
          top: 'auto'
        });
      },

      //子菜单收缩
      _collapseNav: function() {
        var me = this;
        var c = me.cache;
        var nf = c.navInfo;
        var defer = $.Deferred();
        var promise = defer.promise();

        if (!nf || !nf.n || !c.main) {
          defer.reject();
          return promise;
        }

        nf.n.animate({
          'width': '40px'
        }, c.duration, function() {
          defer.resolve();
        });

        /**
         *main width setting
         */

        c.main.animate({
          'margin-left': '40px'
        }, c.duration);

        return promise;
      },

      //子菜单打开
      _expandNav: function() {

        var me = this;
        var c = me.cache;
        var nf = c.navInfo;
        var defer = $.Deferred();
        var promise = defer.promise();

        if (!nf || !nf.n || !c.main) {
          defer.reject();
          return promise;
        }

        nf.n.animate({
          'width': '200px'
        }, c.duration, function() {
          defer.resolve();
        });

        /**
         *main width setting
         */

        c.main.animate({
          'margin-left': '200px'
        }, c.duration); //main动画太快会导致main的maring-left太多引起抖动，故减少些

        return promise;
      },

      // 显示icon
      _fadeInIcon: function() {
        var icons = $('.common-menu .icon');
        if (icons.length) {
          _.each(icons, function(v, i) {
            $(v).show();
          });
        }
      },

      // 隐藏icon
      _fadeOutIcon: function() {
        var icons = $('.common-menu .icon');
        if (icons.length) {
          _.each(icons, function(v, i) {
            $(v).hide(0.1);
          });
        }
      },

      //events
      close: function(e) {
        var me = this;
        var c = me.cache;
        var nf = c.navInfo;

        if (c.isFullNav == 1) {
          me._collapseNav()
            .then(function() {
              nf.i.show();
              Storage.setItem('isFullNav', (c.isFullNav = 0));
            })
            .then(function() {
              me._fadeInIcon();
            });
        }
      },
      open: function(e) {
        var me = this;
        var c = me.cache;
        var nf = c.navInfo;

        if (c.isFullNav === 0 || c.isFullNav === '0') {
          me._fadeOutIcon();
          me._expandNav()
            .then(function() {
              nf.i.hide();
              Storage.setItem('isFullNav', (c.isFullNav = 1));
            });
        }
      },
      toggleTab: function(e, tab) {
        var me = this;
        var curNode = $(e.currentTarget);

        if (curNode.hasClass('active')) {
          return;
        }
        me.clearUrl();
        me.navigate('tab=' + tab);
      },
      clearUrl: function() {
        var me = this
        me.navigate('pageSize=&pageNo=&startTime=&endTime=&taskId=&creativeId=&type=');
      }
    });
  });