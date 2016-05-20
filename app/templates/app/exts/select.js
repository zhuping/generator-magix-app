/**
 * 下拉组件
 * @author 宫晴
 */
define('app/exts/select', ['magix', 'app/exts/input_enter', ], function(Magix, InputEnter) {

    function Selector(selector) {
        var that = this
        var $selector = $(selector)
        $('body').on('click', function(e) {
            if ($(e.target).parents('.dropdown_checkbox .dropdown_options').length) {
                return
            }
            _dropdownHide()
        })

        $selector.on('click', '.radio_select', function(e) {
            //单选
            _radioSelect(e, $selector, that.radioSelect, that.stopChangeTitle)
        })
        $selector.on('click', '.checkbox_sure', function(e) {
            //多选确认
            _checkboxSure(e, $selector, that.checkboxSure)
        })
        $selector.on('click', '.dropdown_title', function(e) {
            //标题点击
            _dropdownTitle(e, $selector)
        })
        $selector.on('click', '.dropdown_addOption', function(e) {
            e.stopPropagation()
        })
        $selector.on('click', '.input_enter_icon', function(e) {
            e.stopPropagation()
        })

        var $addOption = $selector.find('.dropdown_addOption')
        new InputEnter($addOption, function(val) {
            /*jshint -W030 */
            that.addOption && that.addOption(val, $addOption)
        })
    }

    function _checkboxSure(e, $parent, callback) {
        e.stopPropagation()
        var values = []
        var $optionsNum = $parent.find('.option_num')
        var $filterName = $parent.find('.filter_name')
        var $filterAbbrName = $parent.find('.filter_abbr_name')
        var $options = $parent.find('.dropdown_item:checked')

        $options.each(function(index, item) {
            values.push($(item).val())
        })
        _dropdownHide()

        var length = values.length

        if (length) {
            $optionsNum.text(length)
            $filterName.addClass('hide')
            $filterAbbrName.removeClass('hide')
        } else {
            $filterName.removeClass('hide')
            $filterAbbrName.addClass('hide')
        }
        /*jshint -W030 */
        callback && callback(values, e.target)
    }

    function _radioSelect(e, $parent, callback, stopChangeTitle) {
        var $target = $(e.currentTarget)
        var $titleName = $parent.find('.dropdown_title .filter_name')
        var value = $target.attr('data-value')
        var name = $target.attr('data-name')
        /*jshint -W030 */
        callback && callback(value, $parent, name, $target)

        if (stopChangeTitle) return //是否改变title的值
        $titleName.text(name)
    }

    function _dropdownTitle(e, $parent) {
        e.stopPropagation()
        var $target = $(e.currentTarget)
        var $list = $parent.find('.dropdown_options')
        var $arrow = $parent.find('.dropdown_arrow')
        _dropdownHide()
        $list.show()
        $arrow.html('&#xe601;')
        $target.addClass('dropdown_title_active')
    }

    function _dropdownHide() {
        $('.dropdown_options').hide()
        $('.dropdown_arrow').html('&#xe621;')
        $('.dropdown_title_active').removeClass('dropdown_title_active')
    }
    return Selector;
});