define(
	'app/exts/mask/index',
	[
		'jquery',
		'underscore',
		'handlebars',
		'brix/base',
		'brix/event',
		'app/exts/align/index',
		'css!app/exts/mask/index.css'
	],
	function (
		$, _, Handlebars, Brick, EventManager, Align
	) {
		var EMPTY = '';
		var $WIN = $(window);
		// body...
		return Brick.extend({
			options: {
				autoRender: false,
				container: document.body,
				align: {
					node: null,
					points: ['bl', 'tl'],
					offsets: [0, 0]
				},
				tip: EMPTY,
				/*jshint multistr:true*/
				template: 
				'\
					<div class="table-operation-mask">\
						<div class="mask-content"></div>\
						<div class="operation">\
							<button class="btn btn-green w100" bx-click="confirm" type="button">确认</button>\
					    	<button class="btn btn-gray w100" bx-click="cancel" type="button">取消</button>\
						</div>\
					</div>\
				'
			},
			init: function() {
				var me = this;
				me.$element = $(me.element);
				me.manager = new EventManager();
				me._resize = _.throttle(function() {
					if(me.$relatedElement && me.$relatedElement.css('visibility') != 'hidden') {
						me._align();
					}
				}, 100);
				$WIN.on('resize', me._resizeFn = function() {
					me._resize();
				});
			},
			render: function() {
				var me = this;
				var options = me.options;
				var $container = $(options.container);

				if (!me.$relatedElement) {
					me.$relatedElement = $(options.template).appendTo($container);
					me.$contentElement = me.$relatedElement.find('.mask-content');
					me.$operationElement = me.$relatedElement.find('.operation');
				}

				me.manager.delegate(me.$relatedElement, me);

				if (!options.autoRender) {
					return;
				}

				me.show();
			},

			show: function(cfg) {
				var me = this;
				var options = me.options;
				_.extend(options, cfg || {});
				me.$contentElement.html(options.tip);
				me._align(options.align);
			},

			hide: function() {
				var me = this;
				me.$relatedElement.css({
					visibility: 'hidden',
					left: -9999,
					top: -9999
				});
			},

			_align: function(align) {
				var me = this;
				var options = me.options;
				align = align || options.align;

				if (!align.node) {
					return;
				}

				_.extend(options, {
					align: align
				});

				var rect = Align.getBoundingRect(me.$relatedElement, align);
				var $alignElement =  $(align.node || window);
				var w = $alignElement.outerWidth();
				var h = $alignElement.outerHeight();

				me.$contentElement.css({
					width: w - me.$operationElement.outerWidth(true)-30
				});

				me.$relatedElement.css({
					visibility: 'visible',
					left: rect.x,
					top: rect.y,
					width: w,
					height: h,
					lineHeight: (h + 'px')
				});

			},
			cancel: function(ev) {
				var me = this;
				me.hide();
				me.trigger('cancel.mask');
			},
			confirm: function(ev) {
				var me = this;
				me.hide();
				me.trigger('confirm.mask');
			},
			destroy: function() {
				var me = this;
				me.$relatedElement.remove();
				$WIN.off('resize', me._resizeFn);
			}
		});
	}
)