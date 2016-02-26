/**
 * Created by IlyaLitvinov on 14.01.16.
 */
var Model = (function () {
    function Model() {
        var self = this;

        this.items = JSON.parse(localStorage.getItem('TodoList')) || [
            {
                id: 0,
                title: "Test",
                completed: true
            },
            {
                id: 1,
                title: 'test1',
                completed: false
            },
            {
                id: 2,
                title: 'test2',
                completed: false
            }
        ];
        this.filter = 'all';

        this.on('controller:start', function () {
            self.change();
        });

        this.on('controller:addItem', function (data) {
            self.addItem(data);
            self.change();
        });

        this.on('controller:destroy', function (id) {
            self.deleteItem(id);
            self.change();
        });

        this.on('controller:completed', function (id) {
            self.completeItem(id);
            self.change();
        });

        this.on('controller:filter', function (filter) {
            self.filter = filter;
            self.change();
        });

        this.on('controller:clearCompleted', function () {
            self.clearCompleted();
            self.change();
        });
    }

    Model.prototype.getItems = function () {
        var self = this,
            filters = {
                'all': function () {
                    return self.items;
                },
                'active': function () {
                    return self.items.filter(function (item) {
                        return item.completed === false;
                    });
                },
                'completed': function () {
                    return self.items.filter(function (item) {
                        return item.completed === true;
                    });
                }
            };


        return filters[this.filter]();
    };

    Model.prototype.change = function () {
        this.emit('data:loaded', this.getItems());
        this.emit('items:left', this.leftItems());
    };

    function generateId() {
        return Math.floor((1 + Math.random()) * 0x10000);
    }

    Model.prototype.addItem = function (title) {
        var newItem =  {
            id: generateId(),
            title: title,
            completed: false
        };

        this.items.push(newItem);

        localStorage.removeItem('TodoList');
        localStorage.setItem('TodoList', JSON.stringify(this.items));
    };

    Model.prototype.deleteItem = function (id) {
        var currentIndex = this.items.indexOf(this.items.filter(function (item) {

            return item.id === parseInt(id);

        })[0]);

        this.items.splice(currentIndex, 1);

        localStorage.removeItem('TodoList');
        localStorage.setItem('TodoList', JSON.stringify(this.items));
     };

     Model.prototype.completeItem = function (id) {
        var currentIndex = this.items.indexOf(this.items.filter(function (item) {

            return item.id === parseInt(id);

        })[0]);

        this.items[currentIndex].completed = !this.items[currentIndex].completed;

        localStorage.removeItem('TodoList');
        localStorage.setItem('TodoList', JSON.stringify(this.items));
     };

     Model.prototype.leftItems = function () {
        return this.items.filter(function (item) {
            return item.completed === false;
        }).length;
     };

     Model.prototype.clearCompleted = function () {
        this.items = this.items.filter(function (item) {
            return item.completed === false;
        });

        localStorage.removeItem('TodoList');
        localStorage.setItem('TodoList', JSON.stringify(this.items));
     };

    return Model;
})();
