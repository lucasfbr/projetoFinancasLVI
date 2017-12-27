"use strict";

window.billComponent = Vue.extend({
    template: "\n        <ul v-bind:id=\"o.id\" class=\"dropdown-content\" v-for=\"o in menuDropDown\">\n            <li v-for=\"item in o.items\">\n                <a v-link=\"{name: item.nameRouter}\">{{item.name}}</a>\n            </li>\n        </ul>\n        <nav class=\"teal lighten-2\">\n            <div class=\"nav-wrapper container\">\n                <a href=\"#\" class=\"brand-logo\">Code Contas</a>\n                \n                <a href=\"#\" data-activates=\"nav-mobile\" class=\"button-collapse\">\n                    <i class=\"material-icons\">menu</i>\n                </a>\n\n                <ul class=\"right hide-on-med-and-down\">\n                    <li v-for=\"o in menus\">\n                        <a v-if=\"o.dropDownId\" class=\"dropdown-button\" href=\"!#\" \n                        v-bind:data-activates=\"o.dropDownId\" >\n                            {{o.name}} <i class=\"material-icons right\">arrow_drop_down</i>\n                        </a>\n\n                        <a v-else v-link=\"{name: o.nameRouter}\" >\n                            {{o.name}}\n                        </a>\n                    </li>\n                </ul>\n\n                <ul id=\"nav-mobile\" class=\"side-nav\">\n                    <li v-for=\"o in menus\">\n                        <a v-link=\"{name: o.nameRouter}\">{{o.name}}</a>\n                    </li>\n                </ul>\n\n            </div>\n        </nav>\n\n    <router-view></router-view>\n     \n   ",
    created: function created() {

        $(document).ready(function () {
            $(".button-collapse").sideNav();
            $(".dropdown-button").dropdown();
        });
    },

    data: function data() {
        return {
            menus: [{ name: 'Contas a pagar', nameRouter: 'bill-pay.list', dropDownId: 'bill-pay' }, { name: 'Contas a receber', nameRouter: 'bill-receive', dropDownId: 'bill-receive' }],
            menuDropDown: [{ id: 'bill-pay', items: [{ id: 0, name: 'Listar contas', nameRouter: 'bill-pay.list' }, { id: 1, name: 'Criar contas', nameRouter: 'bill-pay.create' }] }, { id: 'bill-receive', items: [{ id: 0, name: 'Listar contas', nameRouter: 'bill-pay.list' }, { id: 1, name: 'Criar contas', nameRouter: 'bill-pay.create' }] }]
        };
    }
});