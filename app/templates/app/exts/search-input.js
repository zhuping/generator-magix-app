/**
 * 搜索组件
 * @author 宫晴
 */
define('app/exts/search-input', ['jquery', 'underscore', 'brix/base'], function($, _, Brick) {

    function InputEnter(selector, callback) {
        if (arguments.length === 2) {
            this.options = _.extend({}, this.options, {
                element: selector,
                callback: callback
            })
            this.init();
        } 
    }

    function _focusin(e) {
        var target = $(e.target)
        var val = $.trim(target.val())
        var placeholder = target.attr('data-placeholder')
        target.removeClass('input_enter_placeholder')
        if (val === placeholder) {
            target.val('')
        }

        //@宫晴
        // if (target.hasClass('input_enter_placeholder') ) {
        //     target.val('').removeClass('input_enter_placeholder')
        // }
    }

    function _focusout(e) {
        var target = $(e.target)
        var holder = target.attr('data-placeholder')
        target.addClass('input_enter_placeholder')
        if (target.val() === '') {
            target.val(holder)
        }
    }

    function _keyup(e, callback) {
        e.preventDefault()
        var target = $(e.target)
        if (e.target.nodeName === 'INPUT' && e.keyCode == 13) {
            var val = target.val()
            callback(val)
            return false;
        }
    }

    function _iconClick(e, input, callback) {
        e.preventDefault()
        //var target = $(e.target)
        if (input.hasClass('input_enter_placeholder')) return

        var val = input.val()
        callback(val)
    }

    _.extend(InputEnter.prototype, Brick.prototype, {
        init: function() {
            var that = this
            var callback = that.options.callback || $.noop
            that.$element = $(that.element || that.options.element)
            that.$relatedElement = that.$element.siblings('.input_enter_icon')

            //初始状况下，如果value为空，显示placeholder信息
            if (!$.trim(that.$element.val())) {
                that.$element.val(that.options.placeholder)
            }

            that.$element
                .on('focusin', _focusin)
                .on('focusout', _focusout)
                .on('keyup', function(e) {
                    _keyup(e, callback)
                })
            that.$relatedElement.on('click', function(e) {
                _iconClick(e, that.$element, callback)
            })
        },
        destroy: function() {
            var that = this
            that.$element.off()
            that.$relatedElement.off()
        }
    })

    return InputEnter;
});