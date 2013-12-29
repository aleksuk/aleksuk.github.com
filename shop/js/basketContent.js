var BasketContent = (function (Mediator, $) {
    function BasketContent(basket) {
        var self = this;
        //
        this.basket = basket;
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
            productName = this.basket.find('.name'),
            price = parseInt(node.children[1].innerHTML, 10),
            productsInBasket = this.basket.find('li'),
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

        this.basket.find('li').remove();

        for (var i = 0; i < this.productNamesArr.length; i += 1) {
            this.basketListNode.append(this.restoreProductList(obj[this.productNamesArr[i]], this.productNamesArr[i]));
        }

    }
    return BasketContent;
})(Mediator, window.jQuery);
