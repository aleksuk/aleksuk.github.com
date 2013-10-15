"use strict";

(function () {
	function addIframe(node, url) {
		var iframe = document.createElement('iframe');

		iframe.src = url;
		iframe.className = '__iframe';
		node.append(iframe);
	}

	function getCookie(name) {
		var matches = document.cookie.match(new RegExp(
			"(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
		));

		return matches ? decodeURIComponent(matches[1]) : undefined;
	}

	function setCookie(name, value, options) {
		value = encodeURIComponent(value);

		if (options) {
			document.cookie = name + '=' + value + ';' + options;
		} else {
			document.cookie = name + '=' + value + ';'
		}	
	}

	function editSessionInfo(cookieName, value) {
		var value = 'activeTabIndex=' + value;
		setCookie(cookieName, value);
	}

	function restoreActiveTab(cookieName, tab, iframe) {
		var cookieValue = getCookie(cookieName);

		if (cookieValue) {
			cookieValue = parseInt(cookieValue.slice(cookieValue.indexOf('=') + 1), 10);
			tab.removeClass('active');
			tab.eq(cookieValue).addClass('active');
			iframe.removeClass('__visible');
			iframe.eq(cookieValue).addClass('__visible');
		} else {
			editSessionInfo(cookieName, 0);
			tab.eq(0).addClass('active');
			iframe.eq(0).addClass('__visible');
		}
	}

	var style = document.createElement('style'),
		cookieName = '__sessionInfo';

	style.innerHTML = '.__iframe {'
					+ 'display: none;'
					+ 'width: 100%;'
					+ 'overflow: hidden;'
					+ 'height: 0px;'
					+ '}'
					+ '.__visible {'
					+ 'display: block;'
					+ '}';

	document.querySelector('head').appendChild(style);

	var contentColumn = $('.content_left'),
		mainMenu = $('.main_menu a');

	contentColumn.children().addClass('__remove');

	mainMenu.each(function () {
		addIframe(contentColumn, this.href);
	});

	var	iframe = $('.__iframe');
	var iframeLoad = 0;
	iframe.load(function () {
		var iframeContent = $(this).contents(),
			width = $('.content_left').width(),
			$this = $(this); 
	
		$('.content_left').css('height', '');

		iframeContent.find('#header').remove();
		iframeContent.find('.sidebar_right').remove();
		iframeContent.find('.rotated_posts').remove();
		iframeContent.find('#footer').remove();
		iframeContent.find('.footer_logos').remove();
		iframeContent.find('#layout').css('padding', '0');
		iframeContent.find('.content_left').css('width', width);
		iframeContent.find('html').css('overflow', 'hidden');
		iframeContent.find('body').on('click', 'a', function () {
				$('.content_left').css('height', '1px');
				$this.css('height', 0);		
		});

		iframeLoad += 1;

		//Без этой проверки в ФФ отрабатывает некорректно, получает высоту элемента === 0
		if( iframeContent.find('.content_left').height() ) {
			$this.css('height', iframeContent.find('.content_left').height());
		}

		if (iframeLoad === iframe.length) {
			$('.content_left').children('.__remove').remove();	
		}

		//Изменение ифрейма, если был изменен размер окна браузера
		function resizeIframe() {
			var width = $('.content_left').width();

			iframeContent.find('.content_left').css('width', width);
			$this.css('height', iframeContent.find('.content_left').height());	
		}

		$(window).on('resize', resizeIframe);
	});

	mainMenu.each(function (index) {
		$(this).on('click', function (event) {
			var $this = $(this);

			event.preventDefault();
			editSessionInfo(cookieName, index);

			if ( $this.hasClass('active') ) {
				iframe.get(index).contentWindow.location.href = iframe.get(index).contentWindow.location.href;
			} else {
				mainMenu.removeClass('active');
				$(this).addClass('active');

				iframe.removeClass('__visible')
					.eq(index)
					.addClass('__visible')
					.css('height', iframe.eq(index)
						.contents()
						.find('.content_left')
						.height()
					);		
			}		
		})
	})

	restoreActiveTab(cookieName, mainMenu, iframe);
})();