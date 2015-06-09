define('gallery', ['helpers'], function (h) {

    function BaseGallery(el) {
        this.el = el || document;
        this.initialize();

        return this;
    }

    BaseGallery.prototype.extend = function (obj) {
        var proto = Object.create(this.constructor.prototype),
            Gallery = function () {
                this.constructor.apply(this, arguments);
            };

        Gallery.prototype = Object.create(proto);
        Gallery.prototype.constructor = Gallery;
        Gallery.prototype.super = proto;

        h.each(obj, function (value, key) {
            Gallery.prototype[key] = value;
        });

        return Gallery;
    };

    BaseGallery.prototype.initialize = function () {};

    BaseGallery.prototype.addEvent = function (event, callback, phase) {
        this.el.addEventListener(event, callback, phase);
    };

    BaseGallery.prototype.removeEvent = function (event, callback, phase) {
        this.el.removeEventListener(event, callback, phase);
    };

    return new Gallery();
});