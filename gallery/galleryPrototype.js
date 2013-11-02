/*  Задание: релизовать галерею на прототипах, без использования библиотек.

	Требования:

	-Использовать разные изображения для превьюшек и большого изображения (в этом и заключается цимес)
	-Автоматически листать на следующее изображение через 5 секунд
	-Не листать галерею после того, как пользователь кликнул на одну из превьюшек
	-Количество галерей на странице может быть любым
	-Количество изображений в галерее может быть любым
	-Галерею можно листать с клавиатуры. Но только одну из всех галерей на странице. Листается та, с которой пользователь работал в последний раз. Или над которой находится мышка в данный момент.
	-Должно работать в 8 ие.
*/

"use strict";

if (!Array.prototype.filter) {
	Array.prototype.filter = function (filterFunction) {
		var res = [];

		for (var i = 0; i < this.length; i += 1) {
			if (filterFunction(this[i])) {
				res.push(this[i]);
			}
		}
		return res;
	}
}

function preventDef(event) {
	if (event.preventDefault) {
		event.preventDefault();
	} else {
		event.returnValue = false;
	}
}

function closest(nodeName, func) {
	var parent = nodeName;

	while (parent && !func(parent)) {
		parent = parent.parentNode;
	}
	return parent;
}

function addEvent(node, eventName, handler) {
	if (node.addEventListener) {
		node.addEventListener(eventName, handler, false);
	} else if (node.attachEvent) {
		node.attachEvent('on' + eventName, handler);
	}
}

function contains(original, toMatch) {
	for (var i = 0; i < toMatch.length; i += 1) {
		if (original.indexOf(toMatch[i]) === -1) {
			return false;
		}
	}
	return true;
}

function isArray(obj) {
	return Object.prototype.toString.call(obj) === '[object Array]';
}

function hasClass(node, className) {
	var elemClass = node.className.split(' ');

	if (isArray(className)) {
		return contains(elemClass, className);
	} else {
		for (var i = 0; i < elemClass.length; i += 1) {
			if (elemClass[i] === className) {
				return true;
			}
		}
	}
	return false;
}

function addClass(node, className) {

	if (!hasClass(node, className)) {
		(node.className) ? (node.className += ' ' + className) : (node.className = className);
	}
}

function removeClass(node, className) {
	var elemClass = node.className.split(' '),
		newClass;

	if (isArray(className)) {
		newClass = elemClass.filter(function (value) {
			return className.indexOf(value) === -1;
		});
	} else {
		newClass = elemClass.filter(function (value) {
			return value !== className;
		});
	}
	node.className = newClass.join(' ');
}

var Gallery = (function () {
	var activeGallery;

	function Gallery(node, largePic) {
		var navigation = node.querySelectorAll('.navigation a'),
			self = this;

		this.previews = node.querySelector('.previews');
		this.large = node.querySelector('.big-picture img');
		this.largeImgPath = 'img/large/';
		this.rotateTimer = null;
		this.largePicNames = largePic;
		this.galleryNode = node;
		this.FEATURED_PREVIEWS = 4;

		if (!activeGallery) {
			activeGallery = this;
		}

		var handler = {
				next: function (event) {
					event = event || window.event;
					preventDef(event);
					self.nextPicture();
				},

				prev: function (event) {
					event = event || window.event;
					preventDef(event);
					self.prevPicture();
				},

				select: function (event) {
					event = event || window.event;
					var target = event.target || event.srcElement;

					preventDef(event);

					if (target.nodeName !== 'UL') {
						target = closest(target, function (node) {
							return node.nodeName === 'LI';
						});
					}

					self.selectPicture(target);
				},

				start: function () {
					self.startAutorotating();
				},

				press: function (event) {
					event = event || window.event;

					self.scrolling(event);
				},

				setActiveGallery: function (event) {
					activeGallery = self;
				}
			}

		addEvent(navigation[1], 'click', handler.next);
		addEvent(navigation[0], 'click', handler.prev);
		addEvent(this.previews, 'click', handler.select);
		addEvent(document.documentElement, 'keydown', handler.press);
		addEvent(this.galleryNode, 'mouseover', handler.setActiveGallery);

		this.startAutorotating();
	}

	Gallery.prototype.nextPicture = function () {
		var width = 160,
			position = this.previews.style.marginLeft || 0,
			nextCurrentImg = 0;

		position = parseInt(position, 10);

		for (var i = 0; i < this.previews.children.length; i += 1) {
			if (hasClass(this.previews.children[i], 'current')) {
				removeClass(this.previews.children[i], 'current');
				nextCurrentImg = i + 1;
			}
		}

		if (nextCurrentImg < this.previews.children.length) {
			addClass(this.previews.children[nextCurrentImg], 'current');
			this.large.src = this.largeImgPath + this.largePicNames[nextCurrentImg];
		} else {
			addClass(this.previews.children[0], 'current');
			this.large.src = this.largeImgPath + this.largePicNames[0];
		}

		this.restartAutorotating();

		if (position <= -width * (this.previews.children.length - this.FEATURED_PREVIEWS) && nextCurrentImg >= this.previews.children.length) {
			this.previews.style.marginLeft = 0 + 'px';
			return;
		};

		if (position > -width * (this.previews.children.length - this.FEATURED_PREVIEWS) && position <= (nextCurrentImg - this.FEATURED_PREVIEWS) && nextCurrentImg >= (-position / width + this.FEATURED_PREVIEWS)) {
			this.previews.style.marginLeft = position - width + 'px';
		};
	}

	Gallery.prototype.prevPicture = function () {
		var prevCurrentImg = 0,
			width = 160,
			position = this.previews.style.marginLeft || 0;

		position = parseInt(position, 10);

		for (var i = 0; i < this.previews.children.length; i += 1) {
			if (hasClass(this.previews.children[i], 'current')) {
				removeClass(this.previews.children[i], 'current');
				prevCurrentImg = i - 1;
			}
		}

		if (prevCurrentImg < 0) {
			addClass(this.previews.children[this.previews.children.length - 1], 'current');
			this.large.src = this.largeImgPath + this.largePicNames[this.previews.children.length - 1];
		} else {
			addClass(this.previews.children[prevCurrentImg], 'current');
			this.large.src = this.largeImgPath + this.largePicNames[prevCurrentImg];
		};

		this.restartAutorotating();

		if (position === 0 && prevCurrentImg < 0) {
			this.previews.style.marginLeft = -width * (this.previews.children.length - this.FEATURED_PREVIEWS) + 'px';
			return;
		};

		if (position >= -width * (this.previews.children.length - this.FEATURED_PREVIEWS) && position < -width * prevCurrentImg && position < 0) {
			this.previews.style.marginLeft = position + width + 'px';
		};
	}

	Gallery.prototype.selectPicture = function (target) {

		for (var i = 0; i < this.previews.children.length; i += 1) {
			if (hasClass(this.previews.children[i], 'current')) {
				removeClass(this.previews.children[i], 'current');
			}
			if (target === this.previews.children[i]) {
				addClass(this.previews.children[i], 'current');
				this.large.src = this.largeImgPath + this.largePicNames[i];
			}
		}
		this.restartAutorotating();
	}

	Gallery.prototype.startAutorotating = function () {
		var self = this;

		this.rotateTimer = setInterval(function () {
			self.nextPicture()
		}, 5000);
	}

	Gallery.prototype.restartAutorotating = function () {
		clearInterval(this.rotateTimer);
		this.startAutorotating();
	}

	Gallery.prototype.scrolling = function (target) {
		var LEFT_ARROW = 37,
			RIGHT_ARROW = 39;

		if (activeGallery === this) {
			if (target.keyCode === LEFT_ARROW) {
				this.prevPicture();
				this.restartAutorotating();
			} else if (target.keyCode === RIGHT_ARROW) {
				this.nextPicture();
				this.restartAutorotating();
			}
		}
	}

	return Gallery;
})();

function windowOnLoad() {
	// порядковый номер имени большой картинки в массиве, соответсвует порядковому картинки в списке превьюшек
	var bigPictures = ['pic1.jpg', 'pic2.jpg', 'pic3.jpg', 'pic4.jpg', 'pic5.jpg', 'pic6.jpg'],
		gallery = new Gallery(document.getElementById('first'), bigPictures),
		gallery2 = new Gallery(document.getElementById('second'), bigPictures);
}
addEvent(window, 'load', windowOnLoad);