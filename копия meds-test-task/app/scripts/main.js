"use strict";
console.log('\'Allo \'Allo!');

require(['Helpers'], function (help) {
    console.warn(help.$('body'));
});
