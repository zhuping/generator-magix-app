define(
	'app/exts/inplaceeditor/index',
	[
		'jquery',
		'underscore',
		'brix/base',
		'app/exts/align/index',
		'app/exts/iform/validation',
		'css!app/exts/inplaceeditor/index.css'
	],
	function (
		$, _, Brick, Align, Validation
	) {
		// body...
		var EMPTY = '';
		var Util = Validation.Util;
		var Rule = Validation.Rule;
		var symbol = Util.symbol;
		var HiddenCls = 'inplaceeditor-hidden';

		var Rules = {
			required: [true, '请输入编辑的内容']
		};

		return Brick.extend({
			options: {
				/**
				* [就地编辑框的对其方式]
				* @cfg {Object} 默认为居中对齐
				*/
				align: {
					node: null,
					offset: [0, 0]
				},
				/**
				 * [content description]
				 * @cfg {String} 文本框内容
				 */
				 content: EMPTY,
				 tooltip: EMPTY,
				 zIndex: 1000,
				 rules: _.extend({}, Rules),
				 template: '<div class="inplaceeditor-popup"><input class="form-control" type="text" value=""/></div>'
			},
			init: function() {
				var me = this;
				me.rule = new Util.storage();
				me._v = null;
				me.$element = $(me.element);
			},
			render: function() {
				var me = this;
				var options = me.options;
				if (!me.$relatedElement) {
					me.$relatedElement = $(options.template).appendTo(document.body);
					me.$tooltip = me._initTooltip();
				}
				me.$inputElement = me.$relatedElement.find('input');
				me._bindUI();
			},
			destroy: function() {
				var me = this;
				me.$inputElement.off('focusout');
				me.$tooltip.remove();
				me.$relatedElement.remove();
			},
			show: function(cfg) {
				var me = this;
				var options = me.options;
				var inputNode = me.$inputElement;

				cfg = cfg || {};
				options = $.extend(true, options, cfg);
				if (options.content !== undefined) {
					me._v = options.content;
					inputNode.val(me._v);
				}

				me._renderUI();
				me._getTextRange();

				// 清空inputNode之前的结果
				inputNode.removeClass('input-error');
				inputNode.val(this._v);

				if (options.tooltip) {
					me._showMessage(symbol.hint, options.tooltip);
				}

				// 解绑valueChange方法，防止valueChanges事件触发后对其他节点的修改
				//me.off('valuechange.inplaceeditor');
			},

			/**
			 * [hide description] overridden method
			 */
			hide: function() {
				var me = this;
	            var inputNode = me.$inputElement;
	            var flag, v;

	            //1. 首先进行前端校验
	            //2. 其次绑定valueChange事件的校验
	            if(inputNode.hasClass('input-error')) {
	            	flag = true;
	            } else {
	            	v = inputNode.val();
	            	if(this._v != v) {
						var validate = $.Event('valuechange.inplaceeditor');
						me.trigger(validate, [v]);
						if (validate.isDefaultPrevented()) {
							me._v = v;
							flag = true;
						}
	            	}
	            }

	            //如果值验证不通过，则直接跳出
	            if(flag) {
	                return; 
	            }

	            this.hideImmediately();
	            this.trigger('hide.inplaceeditor');
			},
			hideImmediately: function() {
				var el = this.$relatedElement;
				var alignNode = this.options.align.node;
				el.css({
	                visibility: 'hidden',
	                left: '-9999px',
	                top: '-9999px'
	            });
				this._hideToolTip();
				if (alignNode) {
					alignNode.removeClass(HiddenCls);
				}
			},

			_initTooltip: function() {
				var me = this;
				if (!me.$tooltip) {
					me.$tooltip = $('<div class="inplaceeditor-tooltip"></div>').appendTo(document.body);
				}
				return me.$tooltip;
			},

			_hideToolTip: function() {
				var me = this;
				if (me.$tooltip) {
					me.$tooltip.css({
						visibility: 'hidden',
						left: -9999,
						top: -9999
					});
				}
			},
			_renderUI: function() {
				this._setAlign();
				this._hideToolTip();
			},
			
			_setAlign: function() {
				var me = this;
				var el = me.$relatedElement;
				var options = me.options;
				var align = options.align;
				var node = align.node;
				var offset = align.offset || [0, 0];
				var left = 0, top = 0, o;

	            if(node && (node = $(node)) && node.length) {
	            	o = node.offset();

	            	left = o.left;
	            	top = o.top + node.innerHeight() / 2 - el.height() / 2;

	            	me.$relatedElement.css({
						left: (left + offset[0]) + 'px',
	                    top: (top + offset[1]) + 'px',
	                    visibility: 'visible',
						width: node.outerWidth()
					});

					if (me.$lastElement != align.node) {
						if (me.$lastElement) {
							me.$lastElement.removeClass(HiddenCls);
						}
						me.$lastElement = align.node;
						me.$lastElement.addClass(HiddenCls);
					}
	            }

			},

			_getTextRange: function() {
				// 获取文本范围
				var me = this;
				var inputNode = me.$inputElement;
				var inputDOM = inputNode[0];
				var len = inputNode.val().length;

				if(inputDOM.setSelectionRange) {
				 	//将光标定位在input的结尾
			        inputDOM.setSelectionRange(len, len); 
			      	inputDOM.focus();
			    } else if (inputDOM.createTextRange) {
			         var ie_range = inputDOM.createTextRange();
			         //将光标定位在textarea的结尾，false该为true则定到开头
			         ie_range.collapse(false); 
			         ie_range.select();
			    } 
			},

			_bindUI: function() {
				var me = this;
				var inputNode = me.$inputElement;
				inputNode.on('focusout', function(ev) {
					me.valid($(ev.currentTarget).val());
					me.hide();
				});
				inputNode.on('keydown', function(ev) {
					//ev.preventDefault();
					if (ev.keyCode == 13) {
						try {
							ev.target.blur();
						} catch(ex) {}
					}
				});
			},

			valid: function(value) {
				this._initRules();
				var result = this._validateValue(value);
				this._showMessage(result[1], result[0]);
			},

			/**
	         * @description 给当前field对象增加一条验证规则
	         * 如果Auth.Rule中存在直接增加
	         * @param {String} name 规则名称
	         * @param {Object} argument 规则可配置
	         */
	        _addRules: function (name, argument) {
	            var self = this;
	            var rule = self.rule;
	            var r;

	            //通过实例方法直接增加函数
	            if (_.isFunction(name)) {
	                rule.add(+new Date(), name);
	                return;
	            }

	            //增加预定义规则
	            r = Rule.get(name, argument);
	            if (r) {
	                rule.add(name, r);
	            }

	        },
	        _initRules: function() {
	        	var me = this;
	        	var rule = me.rule;
				var rules = me.options.rules;
				var rs = rule.getAll();
				var k;

				for (k in rs) {
					if (Object.hasOwnProperty.call(rs, k)) {
						rule.remove(k);
					}
				}

				for(k in rules) {
					if(Object.hasOwnProperty.call(rules, k)) {
						me._addRules(k, rules[k]);
					}
				}

	        },
			_validateValue: function(value) {

				var self = this;
	            var rule = self.rule;
	            var rs = rule.getAll();
	            //格式化返回数据
	            var make = function (estate, msg) {
	                return [msg, estate]
	            };
	            //执行所有校验
	            for (var v in rs) {
	            	var result = rs[v].call(this, value);
	            	if (!Util.isEmpty(result)) {
	                    return make(symbol.error, result);
	                }
	            }

	            return make(symbol.ok, undefined);
			},
			_showMessage: function(estate, msg) {
				var me = this;
				var tooltip = me.$tooltip;
				var inputNode = me.$inputElement;

				if(estate == symbol.error) {
					inputNode.addClass('input-error');
				} else {
					inputNode.removeClass('input-error');
				}

				if (msg) {
					var rect = Align.getBoundingRect(tooltip, {
						node: inputNode,
						points: ['bl', 'tl'],
						offset: [0, 0]
					});
					tooltip.css({
						visibility: 'visible',
						left: rect.x,
						top: rect.y
					});

					tooltip.html(msg);
				}
			}

		});

	}
);