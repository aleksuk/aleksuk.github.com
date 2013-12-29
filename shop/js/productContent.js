var ProductContent = (function (Mediator, $, location) {
    function ProductContent(productList) {
        var self = this;

        this.productList = productList;
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
        this.productList.find('ul').remove();

        for (var i = 0; i < data.length; i += 1) {
            listItems[i] = document.createElement('li');
            this.editContent(data[i], listItems[i], typeOfGoods + i);
            list.appendChild(listItems[i]);
        }
        this.productList.append(list);
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
        this.productList.find('ul').remove();
        this.addContent(this.contentArr);
    }

    return ProductContent;
})(Mediator, window.jQuery, window.location);
