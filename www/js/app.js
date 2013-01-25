
// This uses require.js to structure javascript:
// http://requirejs.org/docs/api.html#define

define(function(require) {
    // Receipt verification (https://github.com/mozilla/receiptverifier)
    require('receiptverifier');

    // Installation button
    require('./install-button');

    // Install the layouts
    require('layouts/layouts');

    // Passing a function into $ delays the execution until the
    // document is ready
    $(function() {

        // List view
        var list = $('.list').get(0);
        list.nextView = 'x-view.detail';

        // Detail view
        var detail = $('.detail').get(0);
        detail.render = function(item) {
            window.item = item;
            var ingredients = (item.get('ingredients') || '').split(/\n+/);
            var instructions = (item.get('instructions') || '').split(/n+/);
            var ingList = $('.ingredients', this);
            var insList = $('.instructions', this);
            $('.title', this).text(item.get('title'));
            for (var i = 0; i < ingredients.length; i++) {
                ingList.append($('<li>').text(ingredients[i]));
            }
            for (var i = 0; i < instructions.length; i++) {
                insList.append($('<li>').text(instructions[i]));
            }

        };

        var edit = $('.edit').get(0);
        edit.render = function(item) {
            item = item || {get: function() { return ''; }};
            $('input[name=title]', this).val(item.get('title'));
            $('input[name=ingredients]', this).val(item.get('ingredients'));
            $('input[name=instructions]', this).val(item.get('instructions'));
        };

        $('button.add', list).click(function() {
            edit.open();
        });

        edit.getTitle = function() {
            var model = this.view.model;

            if (model) {
                return model.get('title');
            }
            return 'New';
        };

        $('button.add', edit).click(function() {
            var el = $(edit);
            var title = el.find('input[name=title]');
            var ing = el.find('input[name=ingredients]');
            var ins = el.find('input[name=instructions]');
            var model = edit.model;

            if (model) {
                model.set({
                    'title': title.val(),
                    'ingredients': ing.val(),
                    'instructions': ins.val()
                });
            }
            else {
                list.add({
                    'title': title.val(),
                    'ingredients': ing.val(),
                    'instructions': ins.val()
                });
            }

            edit.close();
        });
    });
});
