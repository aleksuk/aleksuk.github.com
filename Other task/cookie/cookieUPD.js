/* Задание: 
	Для всех страниц сайта посчитать на какую ссылку пользователь навел мышку, но не кликнул. 
	Надо запомнить как страницу, где действие происходило, так и url ссылки, на которую не был произведен клик. 
	Анализ проводится для всех страниц сайта.

	Технический момент:
	Скрипт прийдется запускать каждый раз, как происходит переход на новую страницу сайта 
	(таким образом мы эмулируем поведение, когда наш скрипт работает на сайте постоянно).
*/

// При переполнении куки, создается новая куки. Массив имен кук, в которых хранятся данные,
// о ссылках, в свою очередь тоже хранятся в куки. 

(function () {
	"use strict";
	function addEvent (node, eventName, handler) {
		if (node.addEventListener) {
			node.addEventListener(eventName, handler, false);
		} else if (node.attachEvent) {
			node.attachEvent('on' + eventName, handler);
		}
	}

	function removeEvent (node, eventName, handler) {
		if (node.removeEventListener) {
			node.removeEventListener(eventName, handler, false);
		} else if (node.detachEvent) {
			node.detachEvent('on' + eventName, handler);
		}
	}

	function getCookie(name) {
		var matches = document.cookie.match( new RegExp(
			"(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
			) );

		return matches ? matches[1] : undefined;
	}

	function closest (nodeName, func) {
		var parent = nodeName;

		while ( parent && !func(parent) ) {
			parent = parent.parentNode;
		}
		return parent;
	}

	var cookieNamesList = '__cookieNames',
		cookieName = '__linksInfo',
		hostname,
		allCookiesNames = [],
		TIME_OVER_THE_LINK = 1000;

	if (location.host.indexOf('www.') !== -1) {
		hostname = location.host.slice(location.host.indexOf('www.') + 4);
	} 

	var options = {
			'domain' : hostname
		}

	function setCookie(name, value, options) {
		var optionsStr;
		for (var key in options) {
			if ( (key === 'expires' || key === 'path' || key === 'domain' || key === 'secure') && options[key]) {
				optionsStr = key + '=' + options[key] + ';';
			}
		}

		document.cookie = name + '=' + value + ';' + optionsStr;
	}

	//ф-ция извлекает последнее имя куки из массива имен кук (если массив имен уже существует)
	function getCookieName(cookieList, cookieName, createNewCookie) {
		var cookieListValue = getCookie(cookieList);
		if (cookieListValue) {
			cookieListValue = JSON.parse(cookieListValue);

			if (createNewCookie) {
				cookieListValue.push(cookieName + cookieListValue.length);
				setCookie(cookieList, JSON.stringify(cookieListValue), options);
			} 

			return cookieListValue[cookieListValue.length - 1];
		} else {
			setCookie(cookieList, JSON.stringify([cookieName]), options);
			return cookieName;
		}
	}

	function pageLocation(obj) {
		for (var i = 0; i < obj['pageLocation'].length; i += 1) {
			if (obj['pageLocation'][i] === document.URL) {
				return;
			}
		}

		obj['pageLocation'].push(document.URL);
	}

	function addLinkInfo(value, linkName) {
		var thisCookieName;
		if (value[linkName]) {
			value[linkName]['numberOfHover'] += 1;
			pageLocation(value[linkName]);
		} else {
			value[linkName] = {};
			value[linkName]['pageLocation'] =  [document.URL];
			value[linkName]['numberOfHover'] = 1;
		}

		if (JSON.stringify(value).length > 4090) {
			thisCookieName = getCookieName(cookieNamesList, cookieName, true);
			setCookie(thisCookieName, JSON.stringify(value), options);
		} else {
			thisCookieName = getCookieName(cookieNamesList, cookieName, false);
			setCookie(thisCookieName, JSON.stringify(value), options);
		}
	}

	function editInfoInCookie(targetLink) {
		var lastActiveCookie = getCookieName(cookieNamesList, cookieName, false),
			cookieValue =  getCookie(lastActiveCookie),
			linkName = targetLink.href;

		cookieValue = (cookieValue) ? JSON.parse(cookieValue) : {};

		addLinkInfo(cookieValue, linkName);
	}

	function aboutLinkHover(event) {
		event = event || window.event;
		var target = event.target || event.srcElement,
			type = event.type;

		if (target !== this) {
			target = closest(target, function (node) {
				return node.nodeName === 'A';
			})
		} else {
			return;
		}

		var timer = setTimeout(function() {
			editInfoInCookie(target);
		}, TIME_OVER_THE_LINK);
		
		function mouseoutHander() {
			clearTimeout(timer);
		}

		addEvent(document, 'mouseout', mouseoutHander);	
	}
	addEvent(document, 'mouseover', aboutLinkHover);

})();