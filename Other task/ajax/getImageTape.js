"use strict";
window.onerror = null;
(function() {
	var pageNumber = parseInt(location.href.match(/[^http\:\/\/www\.explosm\.net\/comics\/][\d]*/), 10);

	function getXmlHttp(){
		var xmlhttp;
		try {
			xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");
		} catch (e) {
			try {
				xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
			} catch (E) {
				xmlhttp = false;
			}
		}

		if (!xmlhttp && typeof XMLHttpRequest!='undefined') {
		xmlhttp = new XMLHttpRequest();
		}
		return xmlhttp;
	}

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
	function ImageTape() {
		//Запоминаем узел <br>, блоки изображений будут вставляться перед ним
		this.whereToInsert = document.getElementById('maincontent').children[3];
		this.mainNode = document.getElementById('maincontent');
		var self = this;

		function handler (event) {
			var scrolled = window.pageYOffset || document.documentElement.scrollTop;

			if (scrolled >= self.mainNode.scrollHeight - 800) {
				removeEvent(window, 'scroll', handler);
				for (var i = 0; i < 5; i += 1) {
					pageNumber -= 1;
					self.makeAnInquiry( self.setUrl() );
				}
			setTimeout(function () {
				addEvent(window, 'scroll', handler);
			}, 800);

			}
		}

		addEvent(window, 'scroll', handler);
	}

	ImageTape.prototype.getImgBlock = function (page) {
		return page.querySelector('#maincontent').children[2];
	}

	ImageTape.prototype.setUrl = function() {
		return '/comics/' + pageNumber;
	}

	ImageTape.prototype.addImgBlock =  function (htmlText) {
		var reg = /<body>([\s\S]*)<\/body>/,
			tempDOM = document.createElement('html');

		tempDOM.innerHTML = htmlText.match(reg)[0].trim();

		var div = this.getImgBlock(tempDOM);
		this.mainNode.insertBefore(div, this.whereToInsert);
	}

	ImageTape.prototype.makeAnInquiry = function (url) {
		var self = this;
		var xhr = getXmlHttp();
		xhr.open('GET', url, true);

		xhr.onreadystatechange = function () {
			if (this.readyState === 4) {
				if (this.status === 200) {
					self.addImgBlock(xhr.responseText);
				};
			};
		};
		xhr.send(null);
	}

	var imageTape = new ImageTape();
})();