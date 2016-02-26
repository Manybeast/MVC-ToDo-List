/**
 * Created by IlyaLitvinov on 14.01.16.
 */
var Controller = (function () {
    function Controller(model, view) {
        console.log('init Controller');
        var self = this;

        this.view = view;
        this.model = model;

        this.emit('controller:start');

        this.on('view:addItem', function (data) {
            self.emit('controller:addItem', data);
        });

        this.on('view:destroy', function (id) {
            self.emit('controller:destroy', id);
        });

        this.on('view:completed', function (id) {
            self.emit('controller:completed', id);
        });

        this.on('view:filter', function (filter) {
            self.emit('controller:filter', filter);
        });
        this.on('view:clearCompleted', function () {
            self.emit('controller:clearCompleted');
        });
    }

    return Controller;
})();
