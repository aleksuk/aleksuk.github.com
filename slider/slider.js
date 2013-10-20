"use strict";

function preventDef(event) {
	if (event.preventDefault) {
		event.preventDefault();
	} else {
		event.returnValue = false;
	}
}

function addEvent(node, eventName, handler) {
	if (node.addEventListener) {
		node.addEventListener(eventName, handler, false);
	} else if (node.attachEvent) {
		node.attachEvent('on' + eventName, handler);
	}
}

function removeEvent(node, eventName, handler) {
	if (node.removeEventListener) {
		node.removeEventListener(eventName, handler, false);
	} else if (node.detachEvent) {
		node.detachEvent('on' + eventName, handler);
	}
}

var Observer = (function () {
	function Observer() {
		this.subscribes = [];
	}

	Observer.prototype.subscriber = function (callback) {
		for (var i = 0; i < this.subscribes.length; i += 1) {
			if (this.subscribes[i] === callback) {
				return;
			}
		}
		this.subscribes.push(callback);
	}

	Observer.prototype.publish = function (data) {
		for (var i = 0; i < this.subscribes.length; i += 1) {
			this.subscribes[i](data);
		}
	}
	return Observer;
})();

var Slider = (function () {

	function Slider(node, sliderFullWidth, smallSliderWidth) {
		this.slideValue = new Observer();
		this.changeValue = new Observer();
		this.node = node;
		this.nodeCoords = this.getCoordsOfBeginning(node);
		this.factor = this.SLIDER_WIDTH / 100;
		//SLIDER_WIDTH = длина_слайдера - длина_ползунка;
		this.SLIDER_WIDTH = sliderFullWidth - smallSliderWidth;
		var self = this;

		function handlerMove(event) {
			event = event || window.event;
			var sliderCoordsNow = self.getCoordsSlider() || 0;

			//Вычислям координату (относительно ползунка) на которой произошел клинк, для фикса
			//смещения ползунка при скроле 
			var shift = event.pageX - self.nodeCoords.left - sliderCoordsNow;
			preventDef(event);

			function moveSlider(event) {
				event = event || window.event;

				var coords = event.pageX - shift;
				if (coords >= self.nodeCoords.left && coords <= (self.nodeCoords.left + self.SLIDER_WIDTH)) {
					self.setCoordsSlider(coords - self.nodeCoords.left);
					self.slideValue.publish(self.getValueSlider());
				} else if (coords < self.nodeCoords.left) {
					self.setCoordsSlider(0);
					self.slideValue.publish(self.getValueSlider());
				} else if (coords > self.nodeCoords.left + self.SLIDER_WIDTH) {
					self.setCoordsSlider(self.SLIDER_WIDTH);
					self.slideValue.publish(self.getValueSlider());
				}
			}

			function ifMouseUp() {
				removeEvent(document, 'mousemove', moveSlider);
				self.changeValue.publish(self.getValueSlider());
			}

			addEvent(document, 'mousemove', moveSlider);
			addEvent(self.node.children[0], 'mouseup', ifMouseUp)
			addEvent(document, 'mouseup', ifMouseUp);
		}
		addEvent(this.node.children[0], 'mousedown', handlerMove);
	}

	Slider.prototype.getCoordsOfBeginning = function (elem) {
		var box = elem.getBoundingClientRect();

		var body = document.body;
		var docEl = document.documentElement;

		var scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
		var scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft;

		var clientTop = docEl.clientTop || body.clientTop || 0;
		var clientLeft = docEl.clientLeft || body.clientLeft || 0;

		var top = box.top + scrollTop - clientTop;
		var left = box.left + scrollLeft - clientLeft;

		return {
			top: Math.round(top),
			left: Math.round(left)
		};
	}

	Slider.prototype.setCoordsSlider = function (value) {
		this.node.children[0].style.left = value + 'px';
	}

	Slider.prototype.getCoordsSlider = function () {
		return parseInt(this.node.children[0].style.left, 10);
	}

	Slider.prototype.getValueSlider = function () {
		var factor = this.SLIDER_WIDTH / 100,
			coords = this.getCoordsSlider() || 0;
		return (coords / factor).toFixed();
	}

	Slider.prototype.on = function (obj) {
		this.slideValue.subscriber(obj.slide);
		this.changeValue.subscriber(obj.change);
	}

	return Slider;
})();

var getSliderValues = {
	slide: function (value) {
		var slide = document.querySelector('.slide');
		slide.innerHTML = value;
	},
	change: function (value) {
		var change = document.querySelector('.change');
		change.innerHTML = value;
	}
}

	function windowLoad() {
		var sliderNode = document.querySelector('div.slider'),
			//Длина всего слайдера
			FULL_SLIDER_WIDTH = 210,
			//Длина ползунка
			SMALL_SLIDER_WIDTH = 10;

		var slider = new Slider(sliderNode, FULL_SLIDER_WIDTH, SMALL_SLIDER_WIDTH);
		slider.on(getSliderValues);

	}
addEvent(window, 'load', windowLoad);