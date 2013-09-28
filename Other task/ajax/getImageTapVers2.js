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
		//Запоминаем узел <br> который находится после блока с изображением, блоки изображений будут вставляться перед ним
		this.whereToInsert = document.getElementById('maincontent').children[3];
		this.mainNode = document.getElementById('maincontent');
		this.arrImg = [];
		var self = this;
		this.getQueryResult();

		this.handler = function (event) {
			var scrolled = window.pageYOffset || document.documentElement.scrollTop;

			if (scrolled >= self.mainNode.scrollHeight - 1000) {
				removeEvent(window, 'scroll', self.handler)
				self.addImgBlocks();
			}
		}
		addEvent(window, 'scroll', this.handler);
	}

	ImageTape.prototype.getImgBlock = function (page) {
		return page.querySelector('#maincontent').children[2];
	}

	ImageTape.prototype.addImgBlocks = function () {
		var self = this;
		
		if (this.arrImg.length === 5){
			for (var i = 0; i < 5; i += 1) {
				this.mainNode.insertBefore(this.arrImg[i], this.whereToInsert);
			}

			this.arrImg.splice(0, this.arrImg.length);
			this.getQueryResult();
			addEvent(window, 'scroll', this.handler);
		} else {
			setTimeout(function () {
				self.addImgBlocks();	
			}, 300);	
		}
	}

	ImageTape.prototype.setUrl = function() {
		return '/comics/' + pageNumber;
	}

	ImageTape.prototype.makeAnInquiry = function (url) {
		var self = this;
		var xhr = new getXmlHttp();
		xhr.open('GET', url, true);

		xhr.onreadystatechange = function () {
			if (this.readyState === 4) {
				if (this.status === 200) {
					self.createImgBlock(xhr.responseText);
				};
			};
		};

		xhr.send(null);
	}

	ImageTape.prototype.getQueryResult = function () {
		for (var i = 0; i < 5; i += 1) {
			pageNumber -= 1;
			this.makeAnInquiry( this.setUrl() );
		}
	}

	ImageTape.prototype.createImgBlock =  function (htmlText) {
		var reg = /<body>([\s\S]*)<\/body>/,
			tempDOM = document.createElement('html');

		tempDOM.innerHTML = htmlText.match(reg)[0].trim();
		this.arrImg.push( this.getImgBlock(tempDOM) );
	}

	var imageTape = new ImageTape();
})();