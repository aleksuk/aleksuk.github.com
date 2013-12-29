/*	Задание: реализовать функционал подобный этому: http://jscourses.github.io/simple-shop/. Плюс, дополнить его следующими возможностями:
	-сортировка таблицы продуктов (по имени, цене)
	-запоминание открытой вкладки через url
	-удаление продуктов из корзины
	-запоминание продуктов в корзине (после перезагрузки корзина не должна сбрасываться)

	Можно использовать любые библиотеки, а также существующие описания продуктов https://github.com/jscourses/jscourses.github.com/tree/master/simple-shop/data

*/

function storeManagement() {
	"use strict";

	var navigationNode = $('.navigation'),
		productList = $('.product'),
		basketNode = $('.basket');

	var Mediator = (function () {
		var events = {},
			handlers = [],
			instance = {
				subscriber: function (eventName, handler) {
					if (!events[eventName]) {
						events[eventName] = [];
					}
					events[eventName].push(handler);
				},

				unsubscribe: function (eventName, handler) {
					if (eventName && handler === undefined) {
						delete events[eventName];
					} else {
						if (events[eventName]) {
							events[eventName] = events[eventName].filter(function (handler_) {
								return handler_ !== handler;
							});
						}
					}
				},

				publish: function (eventName, data) {
					if (events[eventName] && events[eventName].length) {
						for (var i = 0; i < events[eventName].length; i += 1) {
							events[eventName][i](data);
						}
					}
				}
			};

		return function () {
			return instance;
		};
	})();

	var Sorting = (function (Mediator) {
		function Sorting() {
			var self = this;
			this.mediator = new Mediator();
			this.mediator.subscriber('sorting', function (data) {
				self.sorting(data);
			});
		}

		Sorting.prototype.sorting = function (obj) {
			var sortingType = obj['sortingType'],
				sortingFunction = obj['sortingFunction'],
				sortingEventName = obj['sortingEventName'],
				sortingDataNames = obj['sortingDataNames'],
				sortNode = obj['sortNode'],
				sortingTypes = ['__sortName', '__sortPrice', '__sortQuantity'];

			if (sortNode.hasClass('__' + sortingType)) {
				sortingDataNames.sort(sortingFunction).reverse();
				sortNode.removeClass('__' + sortingType);
			} else {
				for (var i = 0; i < sortingTypes.length; i += 1) {
					if (sortNode.hasClass(sortingTypes[i])) {
						sortNode.removeClass(sortingTypes[i]);
					}
				}

				sortingDataNames.sort(sortingFunction);
				sortNode.addClass('__' + sortingType);
			}
			this.mediator.publish(obj['sortingEventName']);
		}

		return Sorting;
	})(Mediator);

	var Cookie = (function (Mediator, $) {
		function Cookie() {
			this.cookieName = 'basketItems';
			var self = this,
				defaultCookieValue = {
					'TotalPrice': 0,
					'TotalItems': 0
				},
				cookieValue = ($.cookie(this.cookieName)) ? JSON.parse($.cookie(this.cookieName)) : defaultCookieValue;

			this.mediator = new Mediator();
			this.mediator.publish('giveCookieValue', cookieValue);
			this.mediator.subscriber('saveInCookie', function (data) {
				self.editCookie(data);
			});
		}

		Cookie.prototype.editCookie = function (obj) {
			var data = JSON.stringify(obj);
			$.cookie(this.cookieName, data);
		}

		return Cookie;
	})(Mediator, window.jQuery);

	var Navigation = (function (navigationNode, location, Mediator, $) {
		function Navigation() {
			var self = this;

			this.mediator = new Mediator();
			this.setActiveTab();

			function changeDepartment(event) {
				self.setActiveTab(this);
				self.mediator.publish('processedContent', this.href);
			}

			navigationNode.on('click', 'a', changeDepartment);
		}

		Navigation.prototype.setActiveTab = function (link) {
			var linksNode = navigationNode.find('a');
			navigationNode.find('li').removeClass('active');

			if (link) {
				$(link).parent().addClass('active');
			} else {
				for (var i = 0; i < linksNode.length; i += 1) {
					if (linksNode.get(i).href === location.href) {
						linksNode.eq(i).parent().addClass('active');
						return;
					} 
				}
				linksNode.eq(0).parent().addClass('active');
			}
		}

		return Navigation;
	})(navigationNode, location, Mediator, window.jQuery);

	var ProductContent = (function (productList, basket, Mediator, $, location) {
		function ProductContent() {
			var self = this;

			this.eventName = 'productList sorted';
			this.LOAD_PRODUCT_LIST_URL = location.href;
			this.mediator = new Mediator();
			this.mediator.subscriber('processedContent', function (data) {
				self.getContent(data);
			});
			this.mediator.subscriber(this.eventName, function () {
				self.addContentAfterSorting();
			});
			this.getContent(self.LOAD_PRODUCT_LIST_URL);
			this.sortNode = productList.find('.sort');

			function changeProduct(event) {
				self.mediator.publish('changeProduct', this);
			}

			function sortProduct(event) {
				self.sorting(this);
			}

			productList.on('click', 'li', changeProduct);
			this.sortNode.on('click', 'span', sortProduct);
		}

		ProductContent.prototype.editContent = function (obj, listItem, id) {
			var info,
				listItemNode = $(listItem);

			for (var key in obj) {
				listItemNode.append('<span class ="' + key + '" ' 
					+ (function (key, id) {
						return (key === 'name') ? 'id="' + id + '"' : '';
					})(key, id) + '>' 
					+ obj[key] 
					+ (function (key) {
						return (key === 'price') ? '$ ' : ' ';
					})(key) + '</span>');
			}
		}

		ProductContent.prototype.addContent = function (data, typeOfGoods) {
			var list = document.createElement('ul'),
				listItems = [];

			this.contentArr = data;
			productList.find('ul').remove();

			for (var i = 0; i < data.length; i += 1) {
				listItems[i] = document.createElement('li');
				this.editContent(data[i], listItems[i], typeOfGoods + i);
				list.appendChild(listItems[i]);
			}
			productList.append(list);
		}

		ProductContent.prototype.getContent = function (contentUrl) {
			var self = this, 
				typeOfGoods;

			if (contentUrl && contentUrl.indexOf('#') !== -1) {
				contentUrl = contentUrl.slice(contentUrl.indexOf('#') + 1);
			} else {
				contentUrl = 'food';
			}
			typeOfGoods = contentUrl;
			contentUrl = '/shop/base/' + contentUrl + '.json';

			$.ajax({
				url: contentUrl,
				dataType: 'json',
				success: function (data) {
					self.addContent(data, typeOfGoods);
				}
			});
		}

		ProductContent.prototype.sorting = function (node) {
			var sortingSpanNode = $(node),
				dataFromSorting = {},
				sort = {
					'sortName': function (a, b) {
						if (a['name'] > b['name']) return 1;
						if (a['name'] < b['name']) return -1;
					},

					'sortPrice': function (a, b) {
						if (a['price'] > b['price']) return 1;
						if (a['price'] < b['price']) return -1;
					},

					'sortQuantity': function (a, b) {
						if (a['quantity'] > b['quantity']) return 1;
						if (a['quantity'] < b['quantity']) return -1;
					}
				};

			for (var key in sort) {
				if (sortingSpanNode.hasClass(key)) {
					dataFromSorting['sortingType'] = key;
					dataFromSorting['sortingFunction'] = sort[key];
					dataFromSorting['sortingDataNames'] = this.contentArr;
					dataFromSorting['sortingEventName'] = this.eventName;
					dataFromSorting['sortNode'] = this.sortNode;
					this.mediator.publish('sorting', dataFromSorting);
					break;
				}
			}
		}

		ProductContent.prototype.addContentAfterSorting = function () {
			productList.find('ul').remove();
			this.addContent(this.contentArr);
		}

		return ProductContent;
	})(productList, basketNode, Mediator, window.jQuery, location);

	var BasketContent = (function (Mediator, basket, $) {
		function BasketContent() {
			var self = this;
			//
			this.eventName = 'basket sorted';
			this.mediator = new Mediator();
			this.totalPrice = basket.find('.price');
			this.totalItems = basket.find('.items');
			this.basketListNode = basket.find('ul');
			this.sortNode = basket.find('.sort');
			this.mediator.subscriber('changeProduct', function (data) {
				self.editProductInBasket(data);
			});
			this.mediator.subscriber('giveCookieValue', function (data) {
				self.savedBasketItems = data;
				self.restoreWithCookie();
			});
			this.mediator.subscriber(this.eventName, function (data) {
				self.addContentAfterSorting();
			});

			function pullWithBasket(event) {
				self.editProductInBasket(this, true);
			}

			function sortProduct(event) {
				self.getDataFromSorting(this);
			}

			basket.on('click', 'li', pullWithBasket);
			this.sortNode.on('click', 'span', sortProduct);

		}

		BasketContent.prototype.editInfoInObject = function (node, isDeduction) {
			var obj = this.savedBasketItems,
				price = parseInt(node.children[1].innerHTML, 10),
				quantity = parseInt(node.children[2].innerHTML, 10),
				namePosition = node.children[0].innerHTML + node.children[0].getAttribute('id');

			if (!isDeduction) {
				if (obj[namePosition]) {
					obj[namePosition]['quantity'] += obj[namePosition]['singleQuantity'];
					obj[namePosition]['price'] += obj[namePosition]['singlePrice'];
				} else {
					obj[namePosition] = {
						'price': price,
						'quantity': quantity,
						'singlePrice': price,
						'singleQuantity': quantity,
						'id': node.children[0].getAttribute('id')
					};
				}

				obj['TotalPrice'] += obj[namePosition]['singlePrice'];
				obj['TotalItems'] += 1;
			} else {
				obj[namePosition]['quantity'] -= obj[namePosition]['singleQuantity'];
				obj[namePosition]['price'] -= obj[namePosition]['singlePrice'];
				obj['TotalPrice'] -= obj[namePosition]['singlePrice'];
				obj['TotalItems'] -= 1;

				if (obj[namePosition]['price'] === 0) {
					delete obj[namePosition];
				}
			}

		}

		BasketContent.prototype.editProductInBasket = function (node, isDeduction) {
			var product,
				productName = basket.find('.name'),
				price = parseInt(node.children[1].innerHTML, 10),
				productsInBasket = basket.find('li'),
				obj = this.savedBasketItems,
				namePosition = node.children[0].innerHTML + node.children[0].getAttribute('id');
			this.editInfoInObject(node, isDeduction);
			if (obj[namePosition]) {
				for (var i = 0; i < productName.length; i += 1) {
					if (productName.get(i).innerHTML === node.children[0].innerHTML && productName.get(i).getAttribute('id') === node.children[0].getAttribute('id')) {
						product = productsInBasket.eq(i).children();
						product.get(1).innerHTML = obj[namePosition]['price'] + '$ ';
						product.get(2).innerHTML = obj[namePosition]['quantity'] + ' ';
						this.totalPrice.get(0).innerHTML = obj['TotalPrice'];
						this.totalItems.get(0).innerHTML = obj['TotalItems'];
						this.mediator.publish('saveInCookie', obj);
						return;
					}
				}
			}

			if (!isDeduction) {
				this.basketListNode.append(node.cloneNode(true));
			} else {
				$(node).remove();
			}

			this.totalPrice.get(0).innerHTML = obj['TotalPrice'];
			this.totalItems.get(0).innerHTML = obj['TotalItems'];
			this.mediator.publish('saveInCookie', obj);
		}

		BasketContent.prototype.restoreWithCookie = function () {
			var obj = this.savedBasketItems;

			this.totalPrice.get(0).innerHTML = obj['TotalPrice'];
			this.totalItems.get(0).innerHTML = obj['TotalItems'];

			for (var key in obj) {
				if (key !== 'TotalItems' && key !== 'TotalPrice') {
					this.basketListNode.append(this.restoreProductList(obj[key], key));
				}
			}
		}

		BasketContent.prototype.restoreProductList = function (obj, name) {
			var listNode = document.createElement('li'),
				nameProductNode = document.createElement('span');

			nameProductNode.className = 'name';
			nameProductNode.id = obj['id'];
			nameProductNode.innerHTML = name.slice(0, - obj['id'].length);
			listNode.appendChild(nameProductNode);

			for (var key in obj) {
				if (key !== 'singlePrice' && key !== 'singleQuantity' && key !== 'id') {
					var tempNode = document.createElement('span');
					tempNode.className = key;

					if (key === 'price') {
						tempNode.innerHTML = obj[key] + '$ ';
					} else {
						tempNode.innerHTML = obj[key] + ' ';
					}
					listNode.appendChild(tempNode);
				}
			}
			return listNode;
		}

		BasketContent.prototype.getDataFromSorting = function (node) {
			var obj = this.savedBasketItems,
				sortingSpanNode = $(node),
				self = this,
				sort = {
					'sortName': function (a, b) {
						if (a > b) return 1;
						if (a < b) return -1;
					},

					'sortPrice': function (a, b) {
						if (obj[a]['price'] > obj[b]['price']) return 1;
						if (obj[a]['price'] < obj[b]['price']) return -1;
					},

					'sortQuantity': function (a, b) {
						if (obj[a]['quantity'] > obj[b]['quantity']) return 1;
						if (obj[a]['quantity'] < obj[b]['quantity']) return -1;
					}
				},
				dataFromSorting = {};

			this.productNamesArr = [];

			for (var key in obj) {
				if (key !== 'TotalItems' && key !== 'TotalPrice') {
					this.productNamesArr.push(key);
				}
			}

			for (var key in sort) {
				if (sortingSpanNode.hasClass(key)) {
					dataFromSorting['sortingType'] = key;
					dataFromSorting['sortingFunction'] = sort[key];
					dataFromSorting['sortingDataNames'] = this.productNamesArr;
					dataFromSorting['sortingEventName'] = this.eventName;
					dataFromSorting['sortNode'] = this.sortNode;
					this.mediator.publish('sorting', dataFromSorting);
					break;
				}
			}
		}

		BasketContent.prototype.addContentAfterSorting = function () {
			var obj = this.savedBasketItems;

			basket.find('li').remove();

			for (var i = 0; i < this.productNamesArr.length; i += 1) {
				this.basketListNode.append(this.restoreProductList(obj[this.productNamesArr[i]], this.productNamesArr[i]));
			}

		}
		return BasketContent;
	})(Mediator, basketNode, window.jQuery);

	function initialization() {
		new Navigation();
		new ProductContent();
		new BasketContent();
		new Cookie();
		new Sorting();
	}

	initialization();
}

$(storeManagement);