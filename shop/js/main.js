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

				unsubscribe : function (eventName, handler) {
					if (eventName && handler === undefined) {
						delete events[eventName];
					} else {
						if (events[eventName]) {
							events[eventName] = events[eventName].filter(function (handler_) {
								return handler_ !== handler;
							})
						}
					}
				},

				publish : function (eventName, data) {
					if (events[eventName] && events[eventName].length) {
						for (var i = 0; i < events[eventName].length; i +=1) {
							events[eventName][i](data);
						}
					}
				}
			};

		return function () {
			return instance;
		}
	})();

	var CookieModule = (function (Mediator, $) {
		function CookieModule() {
			this.cookieName = 'basketItems';
			var self = this,
				defaulCookieValue = {
					'TotalPrice' : 0,
					'TotalItems' : 0
				},
				cookieValue = ( $.cookie(this.cookieName) ) ? JSON.parse( $.cookie(this.cookieName) ) : defaulCookieValue;

			this.mediator = new Mediator();
			this.mediator.publish('giveCookieValue', cookieValue);
			this.mediator.subscriber('saveInCookie', function (data) {
				self.editCookie(data);
			});
		}

		CookieModule.prototype.editCookie = function (obj) {
			var data = JSON.stringify(obj);
	 		$.cookie(this.cookieName, data);
		}

		return CookieModule;
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
					}
				}
			}
		}

		return Navigation;
	})(navigationNode, location, Mediator, window.jQuery);

	var ProductContent = (function (productList, basket, Mediator, $, location) {
		function ProductContent () {
			var self = this;

			this.LOAD_PRODUCT_LIST_URL = location.href;
			this.mediator = new Mediator();
			this.mediator.subscriber('processedContent', function (data) {
				self.getContent(data);
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

		ProductContent.prototype.editContent = function (obj, listItem) {
			var info;

			for (var key in obj) {
				info = document.createElement('span');
				info.className = key;

				if (key === 'price') {
					info.innerHTML = obj[key] + '$ '
				} else {
					info.innerHTML = obj[key] + ' ';
				}
				listItem.appendChild(info);
			}
		}

		ProductContent.prototype.addContent = function (data) {
			var list = document.createElement('ul'),
				listItems = [];

			this.contentArr = data;
			productList.find('ul').remove();

			for (var i = 0; i < data.length; i += 1) {
				listItems[i] = document.createElement('li');
				this.editContent(data[i], listItems[i]);
				list.appendChild(listItems[i]);
			}
			productList.append(list);
		}

		ProductContent.prototype.getContent = function (contentUrl) {
			var self = this;

			if (contentUrl && contentUrl.indexOf('#') !== -1) {
				contentUrl = contentUrl.slice(contentUrl.indexOf('#') + 1);
			} else {
				contentUrl = 'food';
			}
			
			contentUrl = '/shop/base/' + contentUrl + '.json';

			$.ajax({
				url: contentUrl,
				dataType: 'json',
				success: function (data) {
					self.addContent(data);
				}
			})
		}

		ProductContent.prototype.sorting = function (node) {
			var sortingSpanNode = $(node);

			function sortName(a, b) {
				if (a['name'] > b['name']) return 1;
				if (a['name'] < b['name']) return -1;
			}

			function sortPrice(a, b) {
				if(a['price'] > b['price']) return 1;
				if(a['price'] > b['price']) return -1;
			}

			if ( sortingSpanNode.hasClass('sortName') && !this.sortNode.hasClass('__sortedName') ) {
				this.contentArr.sort(sortName);
				this.sortNode.addClass('__sortedName').removeClass('__sortedPrice');
			} else if ( sortingSpanNode.hasClass('sortPrice') && !this.sortNode.hasClass('__sortedPrice') ) {
				this.contentArr.sort(sortPrice);
				this.sortNode.addClass('__sortedPrice').removeClass('__sortedName');
			} else if ( sortingSpanNode.hasClass('sortName') && this.sortNode.hasClass('__sortedName') ) {
				this.contentArr.sort(sortName).reverse();
				this.sortNode.removeClass('__sortedName');
			} else if ( sortingSpanNode.hasClass('sortPrice') && this.sortNode.hasClass('__sortedPrice') ) {
				this.contentArr.sort(sortPrice).reverse();
				this.sortNode.removeClass('__sortedPrice');
			}

			productList.find('ul').remove();
			this.addContent(this.contentArr);
		}

		return ProductContent;
	})(productList, basketNode, Mediator, window.jQuery, location);

	var BasketModule = (function (Mediator, basket, $) {
		function BasketModule () {
			var self = this;

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

			function pullWithBasket(event) {
				self.editProductInBasket(this, true);
			}

			function sortProduct(event) {
				self.sorting(this);
			}

			basket.on('click', 'li', pullWithBasket);
			this.sortNode.on('click', 'span', sortProduct);

		}

		BasketModule.prototype.editInfoInObject = function (node, isDeduction) {
			var obj = this.savedBasketItems,
				price = parseInt(node.children[1].innerHTML, 10),
				quantity = parseInt(node.children[2].innerHTML, 10),
				namePosition = node.children[0].innerHTML;

			if (!isDeduction) {
				if (obj[namePosition]) {
					obj[namePosition]['quantity'] += obj[namePosition]['singleQuantity'];
					obj[namePosition]['price'] += obj[namePosition]['singlePrice'];
				} else {
					obj[namePosition] = {
						'price' : price,
						'quantity' : quantity,
						'singlePrice' : price,
						'singleQuantity' : quantity
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

		BasketModule.prototype.editProductInBasket = function (node, isDeduction) {
			var product,
				productName = basket.find('.name'),
				price = parseInt(node.children[1].innerHTML, 10),
				productsInBasket = basket.find('li'),
				obj = this.savedBasketItems,
				namePosition = node.children[0].innerHTML;
				this.editInfoInObject(node, isDeduction);
		
			if (obj[namePosition]) {
				for (var i = 0; i < productName.length; i += 1) {
					if (productName.get(i).innerHTML === node.children[0].innerHTML) {
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
				this.basketListNode.append( node.cloneNode(true) );
			} else {
				$(node).remove();
			}

			this.totalPrice.get(0).innerHTML = obj['TotalPrice'];
			this.totalItems.get(0).innerHTML = obj['TotalItems'];
			this.mediator.publish('saveInCookie', obj);
		}

		BasketModule.prototype.restoreWithCookie = function () {
			var obj = this.savedBasketItems;

			this.totalPrice.get(0).innerHTML = obj['TotalPrice'];
			this.totalItems.get(0).innerHTML = obj['TotalItems'];

			for (var key in obj) {
				if (key !== 'TotalItems' && key !== 'TotalPrice') {
					this.basketListNode.append( this.restoreProductList(obj[key], key) );
				}
			}
		}

		BasketModule.prototype.restoreProductList = function (obj, name) {
			var listNode = document.createElement('li'),
				nameProductNode = document.createElement('span');

			nameProductNode.className = 'name';
			nameProductNode.innerHTML = name;
			listNode.appendChild(nameProductNode);

			for (var key in obj) {
				if (key !== 'singlePrice' && key !== 'singleQuantity') {
					var tempNode = document.createElement('span');
					tempNode.className = key;

					if (key === 'price') {
						tempNode.innerHTML = obj[key] + '$ '
					} else {
						tempNode.innerHTML = obj[key] + ' ';
					}
					listNode.appendChild(tempNode);
				}
			}
			return listNode;
		}

		BasketModule.prototype.sorting = function (node) {
			var obj = this.savedBasketItems,
				sortingSpanNode = $(node),
				self = this;

			this.productNamesArr = [];

			function sortName(a, b) {
				if (a > b) return 1;
				if (a < b) return -1;
			}

			function sortPrice(a, b) {
				if (obj[a]['price'] > obj[b]['price']) return 1;
				if (obj[a]['price'] < obj[b]['price']) return -1;
			}
			
			for (var key in obj) {
				if (key !== 'TotalItems' && key !== 'TotalPrice') {
					this.productNamesArr.push(key);
				} 
			}
		
			if ( sortingSpanNode.hasClass('sortName') && !this.sortNode.hasClass('__sortedName') ) {
				this.productNamesArr.sort(sortName);
				this.sortNode.addClass('__sortedName').removeClass('__sortedPrice');
			} else if (sortingSpanNode.hasClass('sortPrice') && !this.sortNode.hasClass('__sortedPrice') ) {
				this.productNamesArr.sort(sortPrice);
				this.sortNode.addClass('__sortedPrice').removeClass('__sortedName');
			} else if (sortingSpanNode.hasClass('sortName') && this.sortNode.hasClass('__sortedName') ) {
				this.productNamesArr.sort(sortName).reverse();
				this.sortNode.removeClass('__sortedName');
			} else if (sortingSpanNode.hasClass('sortPrice') && this.sortNode.hasClass('__sortedPrice') ) {
				this.productNamesArr.sort(sortPrice).reverse();
				this.sortNode.removeClass('__sortedPrice');
			}

			basket.find('li').remove();

			for (var i = 0; i < this.productNamesArr.length; i += 1) {
				this.basketListNode.append( this.restoreProductList(obj[self.productNamesArr[i]], this.productNamesArr[i]) );
			}
		}

		return BasketModule;
	})(Mediator, basketNode, window.jQuery);

	function initialization() {
		new Navigation();
		new ProductContent();
		new BasketModule();
		new CookieModule();
	}
	
	initialization();
}

$(storeManagement);