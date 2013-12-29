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
