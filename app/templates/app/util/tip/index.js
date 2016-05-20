define(
  'app/util/tip/index', [
    'jquery',
    'underscore'
  ],
  function($, _) {
    var tip = {
      showMessage: function(node, msg) {
        function _initHelpUI(node) {
          $("<span class='help-inline'></span>").appendTo(parent);
        }

        var parent = node.parent();
        var info = parent.find('.help-inline');
        if (!info.length) {
          _initHelpUI(node);
          info = parent.find('.help-inline');
        }
        parent.addClass('error');
        info.html(msg);
      },
      cleanMessage: function(node) {
        var parent = node.parent();
        var info = parent.find('.help-inline');
        if (!info.length) return;
        parent.removeClass('error');
        info.html('');
      }
    };
    return tip;
  }
)