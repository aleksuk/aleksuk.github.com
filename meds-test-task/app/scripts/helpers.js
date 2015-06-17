define('helpers', function () {
    return {
        '$': function (selector, context) {
            context = context || document;

            return context.querySelectorAll(selector);
        },

        each: function (obj, callback) {
            var key;

            if (obj.forEach) {
                return obj.forEach(callback);
            }

            for (key in obj) {
                if (obj.hasOwnProperty(key)) {
                    callback(obj[key], key, obj);
                }
            }
        },

        // extend: function (Child, Parent) {
        //     var proto = Parent.prototype;

        //     Child.prototype = Object.create(proto);
        //     Child.prototype.constructor = Child;
        //     Child.prototype.super = proto;
        // },

        // extend: function (obj) {
        //     var args = arguments.slice(1);
        //     var sourceObj = arguments[0],
        //         objects = arguments.slice(1);

        //     if (sourceObj) {
        //         objects.forEach(function() {

        //         })
        //     }
        // }
    }
});