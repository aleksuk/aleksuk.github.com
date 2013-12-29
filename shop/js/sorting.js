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
