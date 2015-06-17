define('gallery', ['helpers'], function (help) {
 
    function BaseGallery(el) {
        this.el = el || document;
        this.initialize();
 
        return this;
    }
 
    BaseGallery.extend = function (obj) {
        var ParentConstructor = this,
            proto = Object.create(this.prototype),
            Gallery = function () {
                ParentConstructor.apply(this, arguments);
            };
 
        Gallery.prototype = proto;
        Gallery.prototype.constructor = Gallery;
        Gallery.prototype.super = this.prototype;
        Gallery.extend = this.extend;
 
        help.each(obj, function (value, key) {
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
 
    return BaseGallery;
});

// var g = require('gallery');

// var a = g.extend({
//     sayHello: function () {
//         console.warn('hello A');
//     }
// });

// var b = a.extend({
//     sayGoodBye: function () {
//         console.warn('sayGoodBye B');
//     }
// });

// var c = b.extend({
//     cMethod: function () {
//         console.warn('c method')
//     }
// });

// var d  = new c();