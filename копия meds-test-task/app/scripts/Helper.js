"use strict";
define('Helpers', function () {
    return {
        '$': function (selector, context) {
            context = context || document;

            return context.querySelectorAll(selector);
        },

        each: function (obj, callback) {
            var key;

            for (key in obj) {
                if (obj.hasOwnProperty(key)) {
                    callback(obj[key], key, obj);
                }
            }
        }
    }
});