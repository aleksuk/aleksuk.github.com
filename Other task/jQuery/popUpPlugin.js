(function ($) {
	"use srtict";

	function isType(elem, type) {
		return Object.prototype.toString.call(elem) === '[object ' + type + ']';
	}

	$.fn.makePopup = function (data) {
		var body = $('body'),
			style,
			defaultOptions = {
				'width': this.width()
			},
			methods = {
				open: function () {
					var content = $('.popup .content'),
						popupBackground = $('.popupBackground'),
						$this = $(this);

					if (popupBackground.is(':animated')) {
						return;
					}

					body.css('overflow', 'hidden');
					content.empty();
					content.append($this.clone().css($this.prop('data')));

					$('.popup').css($this.prop('data'));
					popupBackground.animate({
						height: 'toggle',
						width: 'toggle',
						top: '0',
						left: '0'
					});
				},

				close: function () {
					var popupBackground = $('.popupBackground');

					if (popupBackground.is(':animated')) {
						return;
					}

					body.css('overflow', '');
					// $('.popup .content').children().remove();
					popupBackground.animate({
						height: 'toggle',
						width: 'toggle',
						top: '50%',
						left: '50%'
					});
				}
			},
			handler = function () {
				methods.open.call(this);
			}
			
		if (!body.find('.popupBackground').length) {
			style = '<style>.popupBackground {position: fixed; height: 100%; overflow-y: scroll; width: 100%; left: 50%; top: 50%; background: rgba(220, 220, 220, 0.8); display: none; } .popup { background: white; border-radius: 5px; position: relative; margin: 5% auto;  } .close {width: 15px; height: 15px; font-size: 10px; text-align: center; color: red; opacity: .5; border-radius: 50%; position: absolute; right: 0px; cursor: pointer; background: grey; z-index: 5;} .close:hover { opacity: 1 } .content {position: relative; } </style>';
			body.append('<div class="popupBackground">'
						+ '<div class ="popup">' 
						+ '<div class ="close" title="Close">x</div>'
						+ '<div class ="content"></div></div></div></div>');

			$('head').append(style);
			$('.close').on('click', function () {
				methods.close();
			}); 
		}
	
		if (!this.hasClass('__isPopup')) {
			this.on('click', handler);
			this.addClass('__isPopup');

			(isType(data, 'Object')) ? this.prop('data', $.extend(defaultOptions, data)) : this.prop('data', defaultOptions);
		}

		if (isType(data, 'String') && methods[data]) {
			methods[data].call(this);
		}
	}

})(jQuery);