/**
 * Created by IlyaLitvinov on 14.01.16.
 */
//globals observer app

var View = (function () {
    function View(model) {
        console.log('View');
        var self = this;

        this.model = model;

        this.activeBtn = $('#active');
        this.input = $('.new-todo');
        this.output = $('.todo-list');
        this.filters = $('.filters a');
        this.clearCompleted = $('.clear-completed');

        this.on('data:loaded', function (data) {
            console.log('Intercepted in view');

            self.render(data);
        });

        this.handleEvents();

        this.on('items:left', function (left) {
            self.leftItems(left);
        });
    }

    View.prototype.render = function (todos) {
        var self = this;

        this.view = '';

        todos.forEach(function (item) {
            self.renderOne(item);
        });

        this.output.html(this.view);
    };

    View.prototype.renderOne = function (item) {
        //Шаблон для отрисовки одного элемента списка
        var defaultTemplate = '<li data-id="{{id}}" class="{{completed}} ">'
                + '<div class="view">'
                + '<input class="toggle" type="checkbox" {{checked}}>'
                + '<label class = "title">{{title}}</label>'
                + '<button class="destroy"></button>'
                + '</div>'
                + '</li>',
            template = defaultTemplate.replace('{{id}}', item.id);

        template = template.replace('{{completed}}', item.completed);
        template = template.replace('{{checked}}', item.completed ? 'checked' : '');
        template = template.replace('{{title}}', item.title);

        this.view = this.view + template;
    };

    View.prototype.handleEvents = function () {
        var self = this,
            target = null,
            id = null;

        this.input.on('keypress', function (e) {
            if (e.which === 13) {
                self.emit('view:addItem', $(this).val());

                $(this).val('');
            }
        });

        this.output.on('click', function (e) {
            if($(e.target).hasClass('destroy')) {
                console.log('Destroy');

                id = $(e.target).closest('li').attr('data-id');

                self.emit('view:destroy', id);
            }
        });

        this.output.on('click', function (e) {
            if($(e.target).hasClass('toggle')) {
                console.log('toggle');

                id = $(e.target).closest('li').attr('data-id');

                self.emit('view:completed', id);
            }
        });

        this.filters.on('click', function (e) {
            var filter = null;

            if ($(e.target).hasClass('selected')) {
                e.stopPropagation();
                return;
            }

            $(self.filters).removeClass('selected');
            $(e.target).addClass('selected');

            filter = $(e.target).attr('data-filter');

            self.emit('view:filter', filter);
        });

        $('.clear-completed').on('click', function () {
            self.emit('view:clearCompleted');
        });
    };

    View.prototype.leftItems = function (left) {
        $('.todo-count')
            .html('<strong>'
                + left
                + '<strong>'
                + ' items left');
    };

    return View;
})();
