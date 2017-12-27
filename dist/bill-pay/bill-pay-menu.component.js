'use strict';

window.billPayMenuComponent = Vue.extend({
    template: '\n   <nav>\n        <ul v-for="o in menus">\n            <li><a v-link="{name: o.nameRouter}">{{o.name}}</a></li>\n        </ul>\n    </nav>\n   ',
    data: function data() {
        return {
            menus: [{ id: 0, name: 'Listar contas', nameRouter: 'bill-pay.list' }, { id: 1, name: 'Criar contas', nameRouter: 'bill-pay.create' }]
        };
    }
});