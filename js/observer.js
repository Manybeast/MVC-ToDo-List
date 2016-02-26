/**
 * Created by IlyaLitvinov on 15.01.16.
 */
(function () {
    function Observer() {
        this.subscribers = {};

        this.on = function (event, callback) {
            if(typeof this.subscribers[event] === 'undefined') {
                this.subscribers[event] = [];
            }
            this.subscribers[event].push(callback);
        };

        this.emit = function (event, data, context) {
            var _context = context || window;

            if(typeof this.subscribers[event] === 'undefined') {
                this.subscribers[event] = [];
            }

            this.subscribers[event].forEach(function (item) {
                item.call(_context, data);
            });
        };

    }

    Object.assign(Object.prototype, new Observer());
})();
