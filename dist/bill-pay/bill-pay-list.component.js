'use strict';

window.billPayListComponent = Vue.extend({
    components: {
        'modal': modalComponent
    },
    template: '\n        <div class="container">\n            <div class="row">\n\n            <h4 class="grey-text lighten-1">Minhas contas a pagar</h4>\n\n            <table class="bordered striped highlight centered responsive-table z-depth-5">\n                    <thead>\n                        <tr>\n                            <th>#</th>\n                            <th>Data de vencimento</th>\n                            <th>Nome</th>\n                            <th>Valor</th>\n                            <th>Paga?</th>\n                            <th>A\xE7\xF5es</th>\n                            <th>Pagar</th>\n                        </tr>\n                    </thead>\n                    <tbody>\n                        <tr v-for="(index,bill) in bills">\n                            <td>{{bill.id}}</td>\n                            <td>{{bill.date_due | dateFormat}}</td>\n                            <td>{{bill.name}}</td>\n                            <td>{{bill.value | numberFormat}}</td>\n                            <td :class="{\'green-text\' : bill.done, \'red-text\' : !bill.done}">\n                                {{bill.done | status}}\n                            </td>\n                            <td>\n                                <a v-link="{name: \'bill-pay.update\', params: {id:bill.id}}">Editar</a>                                                                                                                                                                                                                                                                                                      \n                                |\n                                <a href="#" @click.prevent="openModalDelete(bill)">Deletar</a>\n                            </td>\n                            <td>\n                                <input id="checkbox_{{bill.id}}" type="checkbox" v-model="bill.done" @change="updatePay($event,bill)" />\n                                <label for="checkbox_{{bill.id}}"></label>\n                            </td>\n                        </tr>\n                    </tbody>\n            </table>\n            </div>\n        </div>\n        <modal :modal="modal">\n            <div slot="content">\n                <h4>Mensagem de confirma\xE7\xE3o</h4>\n                <p><strong>Deseja excluir esta conta</strong></p>\n            \n                <div class="divider"></div>\n                <p>Nome: <strong>{{billToDelete.name}}</strong></p>\n                <p>Valor: <strong>{{billToDelete.value | numberFormat}}</strong></p>\n                <p>Vencimento: <strong>{{billToDelete.date_due | dateFormat}}</strong></p>\n                <div class="divider"></div>\n            </div>\n            <div slot="footer">\n                <button class="btn btn-flat waves-effect waves-red modal-close modal-action">CANCELAR</button>\n                <button @click="remove($event)" class="btn btn-flat waves-effect green lighten-2 modal-close modal-action">\n                OK\n                </button>\n            </div>\n        </modal>\n    ',
    data: function data() {
        return {
            bills: {},
            billToDelete: null,
            modal: {
                id: 'modal-delete'
            }
        };
    },
    created: function created() {
        var _this = this;

        Bill.query().then(function (response) {
            _this.bills = response.json();
        });

        $(document).ready(function () {
            // the "href" attribute of the modal trigger must specify the modal ID that wants to be triggered
            $('#modal1').modal();
        });
    },

    methods: {
        remove: function remove(e) {
            var _this2 = this;

            e.preventDefault();

            Bill.delete({ id: this.billToDelete.id }).then(function (response) {

                _this2.bills.$remove(_this2.billToDelete);
                _this2.billToDelete = null;
                Materialize.toast('Conta removida com sucesso!', 4000, 'rounded');
                _this2.$dispatch('change-info');
            });
        },
        updatePay: function updatePay(e, bill) {
            var _this3 = this;

            e.preventDefault();

            Bill.update({ id: bill.id }, bill).then(function (response) {

                _this3.$dispatch('change-info');
            });
        },
        openModalDelete: function openModalDelete(bill) {

            this.billToDelete = bill;

            $('#modal-delete').modal();
            $('#modal-delete').modal('open');
        }
    }

});