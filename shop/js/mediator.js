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

            unsubscribe: function (eventName, handler) {
                if (eventName && handler === undefined) {
                    delete events[eventName];
                } else {
                    if (events[eventName]) {
                        events[eventName] = events[eventName].filter(function (handler_) {
                            return handler_ !== handler;
                        });
                    }
                }
            },

            publish: function (eventName, data) {
                if (events[eventName] && events[eventName].length) {
                    for (var i = 0; i < events[eventName].length; i += 1) {
                        events[eventName][i](data);
                    }
                }
            }
        };

    return function () {
        return instance;
    };
})();