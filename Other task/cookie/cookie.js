"use strict";

(function () {

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

	var cookieName = 'linksInfo ' + new Date(),
		hostname,
		TIME_OVER_THE_LINK = 1000;

	if (location.host.indexOf('www.') !== -1) {
		hostname = location.host.slice(location.host.indexOf('www.') + 4);
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

	function addLinkInfo(value, linkName) {
		if (value[linkName]) {
			value[linkName]['numberOfHover'] += 1;
		} else {
			value[linkName] = {};
			value[linkName]['pageLocation'] =  document.URL;
			value[linkName]['numberOfHover'] = 1;
		}

		setCookie(cookieName, JSON.stringify(value), {'domain' : hostname});
	}

	function removeLinkInfo(value, linkName) {
		if (value[linkName]) {
			delete value[linkName];
		} 
		setCookie(cookieName, JSON.stringify(value), {'domain' : hostname});
	}

	function editInfoInCookie(targetLink, actionWithCookie) {
		var cookieValue =  getCookie(cookieName),
			linkName = targetLink.href;

		cookieValue = (cookieValue) ? JSON.parse(cookieValue) : {};

		actionWithCookie(cookieValue, linkName);
	}

	function aboutLinkHover(event) {
		event = event || window.event;
		var target = event.target || event.srcElement,
			type = event.type;
			event.preventDefault();

		if (target !== this) {
			target = closest(target, function (node) {
				return node.nodeName === 'A';
			})
		} else {
			return;
		}

		if (target && type === 'mouseover') { 
			var timer = setTimeout(function() {
				editInfoInCookie(target, addLinkInfo);
			}, TIME_OVER_THE_LINK)
		} else if (target && type === 'click') {
			editInfoInCookie(target, removeLinkInfo);
		}

		function mouseoutHander() {
			clearTimeout(timer);
		}

		addEvent(document.body, 'mouseout', mouseoutHander);	
	}
	addEvent(document.body, 'mouseover', aboutLinkHover);
	addEvent(document.body, 'click', aboutLinkHover);
})();