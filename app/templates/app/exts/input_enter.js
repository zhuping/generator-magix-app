/**
 * 搜索组件
 * @author 宫晴
 */
define('app/exts/input_enter', ['magix'], function(Magix) {

    function InputEnter(selector, callback) {
        var $selector = $(selector)
        var $icon = $selector.siblings('.input_enter_icon')
        $selector.on('focusin', _focusin)
        $selector.on('focusout', _focusout)
        $selector.on('keyup', function(e) {
            _keyup(e, callback)
        })
        $icon.on('click', function(e) {
            _iconClick(e, $selector, callback)
        })
    }

    function _focusin(e) {
        var target = $(e.target)
        if (target.hasClass('input_enter_placeholder')) {
            target.val('').removeClass('input_enter_placeholder')
        }
    }

    function _focusout(e) {
        var target = $(e.target)
        var holder = target.attr('data-placeholder')
        if (target.val() === '') {
            target.val(holder).addClass('input_enter_placeholder')
        }
    }

    function _keyup(e, callback) {
        e.preventDefault()
        var target = $(e.target)
        if (e.target.nodeName === 'INPUT' && e.keyCode == 13) {
            var val = target.val()
            callback(val)
        }
    }

    function _iconClick(e, input, callback) {
        e.preventDefault()
        // var target = $(e.target)
        if (input.hasClass('input_enter_placeholder')) return

        var val = input.val()
        callback(val)
    }
    return InputEnter;
});